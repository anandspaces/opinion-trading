import { Router } from 'express';
import { getAllUsers, settleEvent } from '../controllers/adminController.js';
import { auth, adminAuth } from '../utils/authMiddleware.js';

const router = Router();
router.get('/users', auth, adminAuth, getAllUsers);
router.post('/settle-event/:id', auth, adminAuth, settleEvent);

export default router;