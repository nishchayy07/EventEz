// API to get all shows, sport events, and nightlife events for admin seat release
export const getAllEventsWithSeats = async (req, res) => {
    try {
        const shows = await Show.find({ showDateTime: { $gte: new Date() } }).populate('movie').sort({ showDateTime: 1 });
        const sportEvents = await SportEvent.find({ showDateTime: { $gte: new Date() } }).sort({ showDateTime: 1 });
        const nightlifeEvents = await NightlifeEvent.find({ showDateTime: { $gte: new Date() } }).sort({ showDateTime: 1 });

        // Normalize for frontend
        const all = [
            ...shows.map(show => ({
                _id: show._id,
                type: 'movie',
                title: show.movie?.title || '',
                showDateTime: show.showDateTime,
                occupiedSeats: show.occupiedSeats,
            })),
            ...sportEvents.map(event => ({
                _id: event._id,
                type: 'sport',
                title: event.title,
                showDateTime: event.showDateTime,
                occupiedSeats: event.occupiedSeats,
            })),
            ...nightlifeEvents.map(event => ({
                _id: event._id,
                type: 'nightlife',
                title: event.title,
                showDateTime: event.showDateTime,
                occupiedSeats: event.occupiedSeats,
            })),
        ];
        res.json({ success: true, events: all });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};
// Admin: Release (unbook) a seat for a show/event
export const releaseSeat = async (req, res) => {
    try {
        const { showId, seatId } = req.body;
        if (!showId || !seatId) return res.json({ success: false, message: 'Missing showId or seatId' });

        // Try Show (movie)
        let show = await Show.findById(showId);
        if (show) {
            if (show.occupiedSeats && show.occupiedSeats[seatId]) {
                delete show.occupiedSeats[seatId];
                show.markModified('occupiedSeats');
                await show.save();
                return res.json({ success: true });
            } else {
                return res.json({ success: false, message: 'Seat not found in occupiedSeats' });
            }
        }

        // Try NightlifeEvent
        let nightlife = await NightlifeEvent.findById(showId);
        if (nightlife) {
            if (nightlife.occupiedSeats && nightlife.occupiedSeats[seatId]) {
                delete nightlife.occupiedSeats[seatId];
                nightlife.markModified('occupiedSeats');
                await nightlife.save();
                return res.json({ success: true });
            } else {
                return res.json({ success: false, message: 'Seat not found in occupiedSeats' });
            }
        }

        // Try SportEvent
        let sport = await SportEvent.findById(showId);
        if (sport) {
            if (sport.occupiedSeats && sport.occupiedSeats[seatId]) {
                delete sport.occupiedSeats[seatId];
                sport.markModified('occupiedSeats');
                await sport.save();
                return res.json({ success: true });
            } else {
                return res.json({ success: false, message: 'Seat not found in occupiedSeats' });
            }
        }

        return res.json({ success: false, message: 'Show/Event not found' });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};
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
        
        const isAdminUser = user.privateMetadata?.role === 'admin';
        res.json({success: true, isAdmin: isAdminUser, role: user.privateMetadata?.role})
    } catch (error) {
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

// API to delete a movie show
export const deleteShow = async (req, res) => {
    try {
        const { id } = req.params;
        const show = await Show.findByIdAndDelete(id);
        if (!show) {
            return res.json({ success: false, message: 'Show not found' });
        }
        res.json({ success: true, message: 'Show deleted successfully' });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get all sport events
export const getAllSportEvents = async (req, res) => {
    try {
        // Get all sport events, not just future ones
        const sportEvents = await SportEvent.find({}).sort({ showDateTime: -1 });
        res.json({ success: true, sportEvents });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// API to delete a sport event
export const deleteSportEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await SportEvent.findByIdAndDelete(id);
        if (!event) {
            return res.json({ success: false, message: 'Sport event not found' });
        }
        res.json({ success: true, message: 'Sport event deleted successfully' });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

