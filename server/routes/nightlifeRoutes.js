import express from 'express';
import { 
    getNightlifeCategories, 
    getMockNightlifeEvents,
    getAllNightlifeEvents, 
    getNightlifeEventsByCategory,
    getNightlifeEvent,
    addNightlifeEvent,
    updateNightlifeEvent,
    deleteNightlifeEvent,
    getOccupiedSeatsForNightlife,
    syncEventsWithMockData,
    createNightlifeBooking,
    createNightlifeTicketBooking
} from '../controllers/nightlifeController.js';
import { protectAdmin } from '../middleware/auth.js';

const nightlifeRouter = express.Router();

// Public routes (no auth required)
nightlifeRouter.get('/categories', getNightlifeCategories);
nightlifeRouter.get('/mock-events', getMockNightlifeEvents);
nightlifeRouter.get('/events', getAllNightlifeEvents);
nightlifeRouter.get('/events/:category', getNightlifeEventsByCategory);
nightlifeRouter.get('/event/:id', getNightlifeEvent);
nightlifeRouter.get('/seats/:eventId', getOccupiedSeatsForNightlife);

// Booking route (requires auth)
nightlifeRouter.post('/booking/create', createNightlifeBooking);
nightlifeRouter.post('/ticket/booking/create', createNightlifeTicketBooking);

// Admin routes (auth required)
nightlifeRouter.post('/add', protectAdmin, addNightlifeEvent);
nightlifeRouter.put('/update/:id', protectAdmin, updateNightlifeEvent);
nightlifeRouter.delete('/delete/:id', protectAdmin, deleteNightlifeEvent);
nightlifeRouter.post('/sync-mock-data', protectAdmin, syncEventsWithMockData);

export default nightlifeRouter;
