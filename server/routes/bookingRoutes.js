import express from 'express';
import { createBooking, getOccupiedSeats, verifyQrToken } from '../controllers/bookingController.js';

const bookingRouter = express.Router();


bookingRouter.post('/create', createBooking);
bookingRouter.get('/seats/:showId', getOccupiedSeats);
bookingRouter.post('/verify/:token', verifyQrToken);

export default bookingRouter;