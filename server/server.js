import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import showRouter from './routes/showRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import userRouter from './routes/userRoutes.js';
import chatRouter from './routes/chatRoutes.js';
import { stripeWebhooks } from './controllers/stripeWebhooks.js';

const app = express();
const port = 3000;

await connectDB()

// Stripe Webhooks Route
app.use('/api/stripe', express.raw({type: 'application/json'}), stripeWebhooks)

// Middleware
app.use(express.json())
app.use(cors())

// Public Route (chat) - before auth
app.use('/api/chat', chatRouter)

// Authenticated routes (attach Clerk only where keys are present)
const useClerk = process.env.CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY;
const authMw = useClerk ? clerkMiddleware() : (req, res, next) => next();


// API Routes
app.get('/', (req, res)=> res.send('Server is Live!'))
app.use('/api/inngest', serve({ client: inngest, functions }))
app.use('/api/show', showRouter)
app.use('/api/booking', authMw, bookingRouter)
app.use('/api/admin', authMw, adminRouter)
app.use('/api/user', authMw, userRouter)


app.listen(port, ()=> console.log(`Server listening at http://localhost:${port}`));

