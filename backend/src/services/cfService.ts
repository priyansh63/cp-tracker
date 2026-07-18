import axios from 'axios';
import CodeforcesCache from '../models/CodeforcesCache';
import User from '../models/User';

const CF_API_BASE = 'https://codeforces.com/api';

export class CodeforcesService {
  /**
   * Verifies if a handle exists on Codeforces
   */
  static async verifyHandle(handle: string): Promise<boolean> {
    try {
      const response = await axios.get(`${CF_API_BASE}/user.info?handles=${handle}`, { timeout: 8000 });
      if (response.data.status === 'OK') {
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error verifying handle ${handle}:`, (error as Error).message);
      return false;
    }
  }

  /**
   * Synchronizes Codeforces data with MongoDB caching.
   * If cache is fresh (less than 5 mins old) and forceSync = false, uses cached data.
   */
  static async syncUserData(handle: string, forceSync: boolean = false): Promise<any> {
    try {
      const cache = await CodeforcesCache.findOne({ cfHandle: handle.toLowerCase() });
      const now = new Date();
      const cacheExpirationMs = 5 * 60 * 1000; // 5 minutes

      if (cache && !forceSync && now.getTime() - cache.lastSynced.getTime() < cacheExpirationMs) {
        console.log(`Using cached data for handle: ${handle}`);
        return {
          profileData: cache.profileData,
          ratingHistory: cache.ratingHistory,
          submissionHistory: cache.submissionHistory,
          lastSynced: cache.lastSynced,
          fromCache: true
        };
      }

      console.log(`Fetching live data from Codeforces API for: ${handle}`);
      
      // We will perform API calls concurrently but handle errors gracefully
      let profileData = cache?.profileData || null;
      let ratingHistory = cache?.ratingHistory || [];
      let submissionHistory = cache?.submissionHistory || [];

      try {
        const userInfoRes = await axios.get(`${CF_API_BASE}/user.info?handles=${handle}`, { timeout: 10000 });
        if (userInfoRes.data.status === 'OK') {
          profileData = userInfoRes.data.result[0];
        }
      } catch (err) {
        console.warn(`Failed to fetch user.info for ${handle}, using cache if available.`);
      }

      try {
        const userRatingRes = await axios.get(`${CF_API_BASE}/user.rating?handle=${handle}`, { timeout: 10000 });
        if (userRatingRes.data.status === 'OK') {
          ratingHistory = userRatingRes.data.result;
        }
      } catch (err) {
        console.warn(`Failed to fetch user.rating for ${handle}, using cache if available.`);
      }

      try {
        const userSubmissionsRes = await axios.get(`${CF_API_BASE}/user.status?handle=${handle}&from=1&count=2000`, { timeout: 15000 });
        if (userSubmissionsRes.data.status === 'OK') {
          submissionHistory = userSubmissionsRes.data.result;
        }
      } catch (err) {
        console.warn(`Failed to fetch user.status for ${handle}, using cache if available.`);
      }

      if (!profileData) {
        throw new Error('Could not retrieve user info from Codeforces API and no cache available.');
      }

      // Save/Update Cache in DB
      const updatedCache = await CodeforcesCache.findOneAndUpdate(
        { cfHandle: handle.toLowerCase() },
        {
          cfHandle: handle.toLowerCase(),
          profileData,
          ratingHistory,
          submissionHistory,
          lastSynced: now
        },
        { upsert: true, new: true }
      );

      // Update User collection cached rating & rank
      await User.findOneAndUpdate(
        { cfHandle: new RegExp(`^${handle}$`, 'i') },
        {
          cfRating: profileData.rating || 0,
          cfRank: profileData.rank || 'unrated',
          cfAvatar: profileData.titlePhoto || ''
        }
      );

      return {
        profileData,
        ratingHistory,
        submissionHistory,
        lastSynced: now,
        fromCache: false
      };
    } catch (error) {
      console.error(`Sync failed for ${handle}:`, (error as Error).message);
      // fallback to cache if available
      const cache = await CodeforcesCache.findOne({ cfHandle: handle.toLowerCase() });
      if (cache) {
        console.log(`Fallback to stale cached data for: ${handle}`);
        return {
          profileData: cache.profileData,
          ratingHistory: cache.ratingHistory,
          submissionHistory: cache.submissionHistory,
          lastSynced: cache.lastSynced,
          fromCache: true,
          error: (error as Error).message
        };
      }
      throw error;
    }
  }

  /**
   * Processes cached data to return analytics:
   * 1. Daily Progress (problems solved over last 30 days)
   * 2. Topic-wise solved counts
   * 3. Failed Topics in recent contests
   */
  static getAnalytics(cacheData: any) {
    const submissions = cacheData.submissionHistory || [];
    
    // 1. Daily Progress (Last 30 Days)
    const dailyProgressMap: { [key: string]: Set<string> } = {}; // Use Set to avoid counting multiple submissions for same problem in a day
    const solvedSet = new Set<string>(); // global solved set to track unique problems
    
    // Sort submissions by creation time ascending to process them chronologically
    const sortedSubs = [...submissions].sort((a: any, b: any) => a.creationTimeSeconds - b.creationTimeSeconds);

    const nowSeconds = Math.floor(Date.now() / 1000);
    const thirtyDaysAgoSeconds = nowSeconds - 30 * 24 * 60 * 60;

    sortedSubs.forEach((sub: any) => {
      const isOK = sub.verdict === 'OK';
      const problemId = `${sub.problem.contestId || ''}-${sub.problem.index}`;
      
      if (isOK) {
        solvedSet.add(problemId);
        
        // Check if this submission is within the last 30 days
        if (sub.creationTimeSeconds >= thirtyDaysAgoSeconds) {
          const dateStr = new Date(sub.creationTimeSeconds * 1000).toISOString().split('T')[0];
          if (!dailyProgressMap[dateStr]) {
            dailyProgressMap[dateStr] = new Set<string>();
          }
          dailyProgressMap[dateStr].add(problemId);
        }
      }
    });

    // Populate past 30 days list with 0 values if no solved problems
    const dailyProgressList = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      dailyProgressList.push({
        date: dateStr,
        solvedCount: dailyProgressMap[dateStr]?.size || 0
      });
    }

    // 2. Topic-wise Distribution (Solved count for each tag)
    const topicMap: { [key: string]: number } = {};
    const processedUniqueProblems = new Set<string>();

    sortedSubs.forEach((sub: any) => {
      if (sub.verdict === 'OK') {
        const problemId = `${sub.problem.contestId || ''}-${sub.problem.index}`;
        if (!processedUniqueProblems.has(problemId)) {
          processedUniqueProblems.add(problemId);
          const tags = sub.problem.tags || [];
          tags.forEach((tag: string) => {
            topicMap[tag] = (topicMap[tag] || 0) + 1;
          });
        }
      }
    });

    // Format topic distribution for chart (top 12 topics)
    const topicDistribution = Object.keys(topicMap)
      .map(tag => ({ topic: tag, count: topicMap[tag] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);

    // 3. Failed Topics in Recent Contests
    // We group submissions by contestId to identify the contests the user actually participated in
    const contestIds = Array.from(
      new Set(
        submissions
          .filter((sub: any) => sub.contestId)
          .map((sub: any) => sub.contestId as number)
      )
    ).slice(0, 8) as number[]; // Look at last 8 contests

    const failedTopicMap: { [key: string]: number } = {};
    const failedProblemMap: { [key: string]: any } = {};

    contestIds.forEach((cId: number) => {
      const contestSubs = submissions.filter((sub: any) => sub.contestId === cId);
      
      // Find all problems attempted in this contest
      const attemptedProblems = Array.from(
        new Set(contestSubs.map((sub: any) => sub.problem.index as string))
      ) as string[];

      attemptedProblems.forEach((pIdx: string) => {
        const problemSubs = contestSubs.filter((sub: any) => sub.problem.index === pIdx);
        const hasSolved = problemSubs.some((sub: any) => sub.verdict === 'OK');
        
        if (!hasSolved) {
          const problemObj = problemSubs[0].problem;
          const pId = `${cId}-${pIdx}`;
          failedProblemMap[pId] = {
            contestId: cId,
            index: pIdx,
            name: problemObj.name,
            tags: problemObj.tags || [],
            rating: problemObj.rating
          };
        }
      });
    });

    // Count tag failures from failed problems
    Object.values(failedProblemMap).forEach((p: any) => {
      p.tags.forEach((tag: string) => {
        failedTopicMap[tag] = (failedTopicMap[tag] || 0) + 1;
      });
    });

    const failedTopics = Object.keys(failedTopicMap)
      .map(tag => ({ topic: tag, failureCount: failedTopicMap[tag] }))
      .sort((a, b) => b.failureCount - a.failureCount);

    return {
      dailyProgress: dailyProgressList,
      topicDistribution,
      failedTopics,
      recentFailedProblems: Object.values(failedProblemMap).slice(0, 6) // last 6 failed problems
    };
  }
}
