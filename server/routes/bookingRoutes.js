import express from 'express';
import { createBooking, getOccupiedSeats, verifyQrToken, cancelBooking } from '../controllers/bookingController.js';

const bookingRouter = express.Router();


bookingRouter.post('/create', createBooking);
bookingRouter.get('/seats/:showId', getOccupiedSeats);
bookingRouter.post('/verify/:token', verifyQrToken);
bookingRouter.post('/cancel/:bookingId', cancelBooking);

export default bookingRouter;