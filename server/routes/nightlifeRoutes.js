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
    getOccupiedSeatsForNightlife
} from '../controllers/nightlifeController.js';
import { protectAdmin } from '../middleware/auth.js';

const nightlifeRouter = express.Router();

// Public routes (no auth required)
nightlifeRouter.get('/categories', getNightlifeCategories);
nightlifeRouter.get('/mock-events', getMockNightlifeEvents);
nightlifeRouter.get('/events', getAllNightlifeEvents);
nightlifeRouter.get('/event/:id', getNightlifeEvent);
nightlifeRouter.get('/events/:category', getNightlifeEventsByCategory);
nightlifeRouter.get('/seats/:eventId', getOccupiedSeatsForNightlife);

// Admin routes (auth required)
nightlifeRouter.post('/add', protectAdmin, addNightlifeEvent);
nightlifeRouter.put('/update/:id', protectAdmin, updateNightlifeEvent);
nightlifeRouter.delete('/delete/:id', protectAdmin, deleteNightlifeEvent);

export default nightlifeRouter;
