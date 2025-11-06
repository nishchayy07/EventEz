import express from 'express';
import { getAllSports, getSportEvents, getSportEvent, getOccupiedSeatsForEvent, createSportBooking, createSportEvent } from '../controllers/sportsController.js';
import { clerkMiddleware } from '@clerk/express'

const router = express.Router();

router.get('/', getAllSports);
router.get('/events/:sportName', getSportEvents);
router.get('/event/:id', getSportEvent);
router.get('/seats/:eventId', getOccupiedSeatsForEvent);
router.post('/booking/create', clerkMiddleware(), createSportBooking);
router.post('/event', createSportEvent);

export default router;
