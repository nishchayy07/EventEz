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
import sportsRouter from './routes/sportsRoutes.js';
import nightlifeRouter from './routes/nightlifeRoutes.js';
import { stripeWebhooks } from './controllers/stripeWebhooks.js';

const app = express();
const port = 3000;

await connectDB()

// Stripe Webhooks Route
app.use('/api/stripe', express.raw({type: 'application/json'}), stripeWebhooks)

// Middleware
app.use(express.json())

// CORS Configuration
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    process.env.CLIENT_URL, // Production frontend URL from env
    'https://eventez.vercel.app', // Your main production URL
    'https://eventez-frontend.vercel.app', // Alternative production URL
].filter(Boolean); // Remove undefined values

console.log('✅ Allowed CORS origins:', allowedOrigins);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        // Allow any Vercel deployment
        if (origin.includes('.vercel.app')) {
            return callback(null, true);
        }
        
        // Check if origin is in allowed list
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        
        console.log('❌ Blocked origin:', origin);
        console.log('Allowed origins:', allowedOrigins);
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'clerk-api-version'],
    exposedHeaders: ['Content-Range', 'X-Content-Range']
}))

// Request logger (only in development)
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        console.log(`📨 ${req.method} ${req.path}`);
        next();
    })
}

// Public Route (chat) - before auth
app.use('/api/chat', chatRouter)

// Authenticated routes (attach Clerk only where keys are present)
const useClerk = process.env.CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY;
const authMw = useClerk ? clerkMiddleware() : (req, res, next) => next();


// API Routes
app.get('/', (req, res)=> res.send('Server is Live!'))
app.use('/api/inngest', serve({ client: inngest, functions }))
app.use('/api/show', authMw, showRouter)
app.use('/api/booking', authMw, bookingRouter)
app.use('/api/admin', authMw, adminRouter)
app.use('/api/user', authMw, userRouter)
app.use('/api/sports', authMw, sportsRouter)
app.use('/api/nightlife', authMw, nightlifeRouter)


app.listen(port, ()=> console.log(`Server listening at http://localhost:${port}`));

