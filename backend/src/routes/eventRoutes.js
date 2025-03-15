import { Router } from 'express';
import { getEvents, getEventById, createEvent, updateEvent } from '../controllers/eventController';
import { auth } from '../utils/authMiddleware';

const router = Router();
router.get('/', getEvents);
router.get('/:id', getEventById);

// Admin routes
router.post('/', auth, createEvent);
router.put('/:id', auth, updateEvent);

export default router;