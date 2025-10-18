import express from 'express';
import { getAllSports, getSportEvents } from '../controllers/sportsController.js';

const router = express.Router();

router.get('/', getAllSports);
router.get('/events/:sportName', getSportEvents);

export default router;
