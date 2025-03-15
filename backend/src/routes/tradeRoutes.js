import { Router } from 'express';
import { placeTrade, getUserTrades } from '../controllers/tradeController';
import { auth } from '../utils/authMiddleware';
const router = Router();

router.post('/', auth, placeTrade);
router.get('/my-trades', auth, getUserTrades);

export default router;