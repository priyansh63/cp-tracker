import { Router } from 'express';
import { getDashboardData, getLeaderboard, forceSync } from '../controllers/cfController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/dashboard', authMiddleware, getDashboardData);
router.get('/leaderboard', authMiddleware, getLeaderboard);
router.post('/sync', authMiddleware, forceSync);

export default router;
