import express from 'express';
import { 
    getNightlifeCategories, 
    getAllNightlifeEvents, 
    getNightlifeEventsByCategory,
    getNightlifeEvent,
    addNightlifeEvent,
    getOccupiedSeatsForNightlife
} from '../controllers/nightlifeController.js';
import { protectAdmin } from '../middleware/auth.js';

const nightlifeRouter = express.Router();

nightlifeRouter.get('/categories', getNightlifeCategories);
nightlifeRouter.get('/events', getAllNightlifeEvents);
nightlifeRouter.get('/events/:category', getNightlifeEventsByCategory);
nightlifeRouter.get('/event/:id', getNightlifeEvent);
nightlifeRouter.post('/add', protectAdmin, addNightlifeEvent);
nightlifeRouter.get('/seats/:eventId', getOccupiedSeatsForNightlife);

export default nightlifeRouter;
