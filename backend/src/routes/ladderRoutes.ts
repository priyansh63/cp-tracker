import { Router } from 'express';
import { getLadderProblems } from '../controllers/ladderController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/ladder', authMiddleware, getLadderProblems);

export default router;
