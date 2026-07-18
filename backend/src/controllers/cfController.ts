import { Response } from 'express';
import User from '../models/User';
import { CodeforcesService } from '../services/cfService';
import { AuthRequest } from '../middleware/authMiddleware';

export const getDashboardData = async (req: AuthRequest, res: Response) => {
  try {
    const handle = req.user?.cfHandle;
    if (!handle) {
      return res.status(400).json({ message: 'Codeforces handle not associated with session.' });
    }

    // 1. Sync data (uses cache internally)
    const syncedData = await CodeforcesService.syncUserData(handle, false);

    // 2. Process Analytics
    const analytics = CodeforcesService.getAnalytics(syncedData);

    res.status(200).json({
      profile: syncedData.profileData,
      ratingHistory: syncedData.ratingHistory,
      analytics,
      lastSynced: syncedData.lastSynced,
      fromCache: syncedData.fromCache
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard metrics. Please check Codeforces handle or try again later.' });
  }
};

export const getLeaderboard = async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find({})
      .select('cfHandle cfRating cfRank cfAvatar email')
      .sort({ cfRating: -1 });
    
    res.status(200).json(users);
  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch leaderboard.' });
  }
};

export const forceSync = async (req: AuthRequest, res: Response) => {
  try {
    const handle = req.user?.cfHandle;
    if (!handle) {
      return res.status(400).json({ message: 'Codeforces handle not associated with session.' });
    }

    const syncedData = await CodeforcesService.syncUserData(handle, true);
    const analytics = CodeforcesService.getAnalytics(syncedData);

    res.status(200).json({
      profile: syncedData.profileData,
      ratingHistory: syncedData.ratingHistory,
      analytics,
      lastSynced: syncedData.lastSynced,
      fromCache: false
    });
  } catch (error) {
    console.error('Force sync error:', error);
    res.status(500).json({ message: 'Failed to perform live Codeforces sync. Codeforces API might be throttling requests, please try again in a few seconds.' });
  }
};
