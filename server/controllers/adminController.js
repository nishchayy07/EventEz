import Booking from "../models/Booking.js"
import Show from "../models/Show.js";
import User from "../models/User.js";
import NightlifeEvent from "../models/NightlifeEvent.js";
import SportEvent from "../models/SportEvent.js";
import { clerkClient } from "@clerk/express";


// API to check if user is admin
export const isAdmin = async (req, res) =>{
    try {
        const { userId } = req.auth();
        const user = await clerkClient.users.getUser(userId);
        
        console.log('User metadata check:', {
            userId,
            privateMetadata: user.privateMetadata,
            role: user.privateMetadata?.role
        });
        
        const isAdminUser = user.privateMetadata?.role === 'admin';
        res.json({success: true, isAdmin: isAdminUser, role: user.privateMetadata?.role})
    } catch (error) {
        console.error('Error checking admin:', error);
        res.json({success: false, isAdmin: false})
    }
}

// API to get dashboard data
export const getDashboardData = async (req, res) =>{
    try {
        const bookings = await Booking.find({isPaid: true});
        const activeShows = await Show.find({showDateTime: {$gte: new Date()}}).populate('movie');
        const activeNightlifeEvents = await NightlifeEvent.find({showDateTime: {$gte: new Date()}});
        const activeSportEvents = await SportEvent.find({date: {$gte: new Date()}});

        const totalUser = await User.countDocuments();

        const dashboardData = {
            totalBookings: bookings.length,
            totalRevenue: bookings.reduce((acc, booking)=> acc + booking.amount, 0),
            activeShows,
            activeNightlifeEvents,
            activeSportEvents,
            totalUser
        }

        res.json({success: true, dashboardData})
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message})
    }
}

// API to get all shows
export const getAllShows = async (req, res) =>{
    try {
        const shows = await Show.find({showDateTime: { $gte: new Date() }}).populate('movie').sort({ showDateTime: 1 })
        res.json({success: true, shows})
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message})
    }
}

// API to get all bookings
export const getAllBookings = async (req, res) =>{
    try {
        const bookings = await Booking.find({}).populate('user').populate({
            path: "show",
            populate: {path: "movie"}
        }).sort({ createdAt: -1 })
        res.json({success: true, bookings })
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message})
    }
}