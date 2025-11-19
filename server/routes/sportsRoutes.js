import express from 'express';
import { getAllSports, getAllSportEvents, getSportEvents, getSportEvent, getOccupiedSeatsForEvent, createSportBooking, createSportEvent, addSportEvent } from '../controllers/sportsController.js';
import { clerkMiddleware } from '@clerk/express'
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllSports);
router.get('/all-events', getAllSportEvents);
router.get('/events/:sportName', getSportEvents);
router.get('/event/:id', getSportEvent);
router.get('/seats/:eventId', getOccupiedSeatsForEvent);
router.post('/booking/create', clerkMiddleware(), createSportBooking);
router.post('/event', createSportEvent);
router.post('/add', protectAdmin, addSportEvent);

export default router;
