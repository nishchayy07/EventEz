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
    process.env.CLIENT_URL, // Production frontend URL
    'https://eventez.vercel.app', // Explicit production URL
    /\.vercel\.app$/ // Allow all Vercel preview deployments
].filter(Boolean); // Remove undefined values

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        // Check if origin is allowed
        const isAllowed = allowedOrigins.some(allowed => {
            if (allowed instanceof RegExp) {
                return allowed.test(origin);
            }
            return allowed === origin;
        });
        
        if (isAllowed) {
            callback(null, true);
        } else {
            console.log('❌ Blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
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

