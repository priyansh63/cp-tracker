import { Response } from 'express';
import Problem from '../models/Problem';
import CodeforcesCache from '../models/CodeforcesCache';
import { AuthRequest } from '../middleware/authMiddleware';

export const getLadderProblems = async (req: AuthRequest, res: Response) => {
  try {
    const handle = req.user?.cfHandle;
    const ratingQuery = req.query.rating;
    
    if (!handle) {
      return res.status(400).json({ message: 'User not authenticated or Codeforces handle missing.' });
    }

    let targetRating = 1200; // default
    if (ratingQuery) {
      targetRating = parseInt(ratingQuery as string, 10);
    }

    // Find problems within targetRating range (e.g. targetRating to targetRating + 199)
    const problems = await Problem.find({
      rating: { $gte: targetRating, $lt: targetRating + 200 }
    });

    // Fetch user submissions from cache
    const cache = await CodeforcesCache.findOne({ cfHandle: handle.toLowerCase() });
    const submissions = cache?.submissionHistory || [];

    // Create a set of solved problem keys: "contestId-index"
    const solvedSet = new Set<string>();
    submissions.forEach((sub: any) => {
      if (sub.verdict === 'OK') {
        const key = `${sub.problem.contestId}-${sub.problem.index}`;
        solvedSet.add(key);
      }
    });

    // Map problems to check if solved
    const problemsWithSolvedStatus = problems.map((problem) => {
      const key = `${problem.contestId}-${problem.index}`;
      return {
        _id: problem._id,
        contestId: problem.contestId,
        index: problem.index,
        name: problem.name,
        rating: problem.rating,
        tags: problem.tags,
        solved: solvedSet.has(key)
      };
    });

    res.status(200).json({
      rating: targetRating,
      problems: problemsWithSolvedStatus
    });

  } catch (error) {
    console.error('Error fetching ladder problems:', error);
    res.status(500).json({ message: 'Failed to fetch ladder problems.' });
  }
};
