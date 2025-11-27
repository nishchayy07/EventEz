import NightlifeEvent from '../models/NightlifeEvent.js';
import Booking from '../models/Booking.js';
import stripe from 'stripe';
import { inngest } from '../inngest/index.js';

// Categories for nightlife
export const nightlifeCategories = [
    { id: "rooftop-bar", name: "Rooftop Bar", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2874&auto=format&fit=crop" },
    { id: "live-music", name: "Live Music Venue", image: "https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=2940&auto=format&fit=crop" },
    { id: "dance-club", name: "Dance Club", image: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=2940&auto=format&fit=crop" },
    { id: "speakeasy", name: "Speakeasy", image: "https://images.unsplash.com/photo-1543007821-59339c618272?q=80&w=2940&auto=format&fit=crop" },
    { id: "karaoke", name: "Karaoke Bar", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2940&auto=format&fit=crop" },
    { id: "comedy-club", name: "Comedy Club", image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?q=80&w=2940&auto=format&fit=crop" },
];

// Mock nightlife events (like TMDB for movies)
const mockNightlifeEvents = [
    {
        id: '1',
        title: 'Saturday Night Live',
        venue: 'Ophelia Lounge',
        location: 'Delhi/NCR',
        category: 'Concerts',
        price: '₹2999',
        image: "/land_img/photo-1.jpeg",
        landscapeImage: "/land_img/photo-1.jpeg",
        artist: 'Alan Walker',
        artistImage: "/art_img/First.jpeg",
        duration: '3 hours',
        ageRestriction: '18+',
        description: 'Join us for an unforgettable Saturday Night Live experience with amazing music, drinks, and vibes at the stunning Ophelia Lounge.'
    },
    {
        id: '2',
        title: 'Kisi ko Batana Mat ft. Anubhav Singh Bassi',
        venue: 'The Laugh Club',
        location: 'Delhi/NCR',
        category: 'Comedy Shows',
        price: '₹1299',
        image: '/img_short/id2.jpg',
        landscapeImage: '/land_img/photo-2.jpg',
        artist: 'Anubhav Singh Bassi',
        artistImage: '/art_img/2.jpg',
        duration: '90 minutes',
        ageRestriction: '18+',
        description: 'Watch Anubhav Singh Bassi perform his hilarious stand-up routine "Kisi ko Batana Mat" live!'
    },
    {
        id: '3',
        title: 'Samay Raina-Still Alive and Unfiltered',
        venue: 'Indira Gandhi Indoor Stadium',
        location: 'New Delhi',
        category: 'Comedy Shows',
        price: '₹4499',
        image: '/img_short/id3.jpg',
        landscapeImage: '/land_img/photo-3.jpg',
        artist: 'Samay Raina',
        artistImage: '/art_img/3.jpg',
        duration: '2 hours',
        ageRestriction: '18+',
        description: 'Samay Raina brings his unfiltered comedy to Delhi in this special live show.'
    },
    {
        id: '4',
        title: 'Kuch Bhi Ho Sakta Hai - Delhi Theatre Festival',
        venue: 'Nehru Stadium',
        location: 'Delhi',
        category: 'Theatre Shows',
        price: '₹499',
        image: '/img_short/id4.jpg',
        landscapeImage: '/land_img/photo-4.jpg',
        artist: 'Anupam Kher',
        artistImage: '/art_img/4.jpg',
        duration: '2 hours 30 minutes',
        ageRestriction: 'All Ages',
        description: 'A thought-provoking theatrical performance as part of the prestigious Delhi Theatre Festival.'
    },
    {
        id: '5',
        title: 'Einstein 15th Nov - Delhi Theatre Festival',
        venue: 'Nehru Stadium',
        location: 'Delhi',
        category: 'Theatre Shows',
        price: '₹999',
        image: '/img_short/id5.jpg',
        landscapeImage: '/land_img/photo-5.jpg',
        artist: 'Naseeruddin Shah',
        artistImage: '/art_img/5.jpg',
        duration: '2 hours',
        ageRestriction: '12+',
        description: 'A fascinating theatrical journey into the life and mind of Albert Einstein.'
    },
    {
        id: '6',
        title: 'AP Dhillon: One Of One Tour - Mumbai',
        venue: 'Jio World Convention Centre: Mumbai',
        location: 'Mumbai',
        category: 'Concerts',
        price: '₹1299',
        image: '/img_short/id6.jpg',
        landscapeImage: '/land_img/photo-6.jpg',
        artist: 'AP Dhillon',
        artistImage: '/art_img/6.jpg',
        duration: '3 hours',
        ageRestriction: '18+',
        description: 'AP Dhillon brings his electrifying "One Of One Tour" to Mumbai!'
    },
    {
        id: '7',
        title: 'Satrangi Re by Sonu Nigam',
        venue: 'Nehru Stadium',
        location: 'Delhi',
        category: 'Concerts',
        price: '₹1299',
        image: '/img_short/id7.jpg',
        landscapeImage: '/land_img/photo-7.jpg',
        artist: 'Sonu Nigam',
        artistImage: '/art_img/7.jpg',
        duration: '3 hours 30 minutes',
        ageRestriction: 'All Ages',
        description: 'The legendary Sonu Nigam performs "Satrangi Re" - a musical extravaganza.'
    },
    {
        id: '8',
        title: 'Kal ki Chinta Nahi Karta ft. Ravi Gupta',
        venue: 'CP67 Mall:Mohali',
        location: 'Chandigarh',
        category: 'Comedy Shows',
        price: '₹499',
        image: '/img_short/id8.jpg',
        landscapeImage: '/land_img/photo-8.jpg',
        artist: 'Ravi Gupta',
        artistImage: '/art_img/8.jpg',
        duration: '90 minutes',
        ageRestriction: '16+',
        description: 'Ravi Gupta presents his hilarious stand-up show about living in the moment.'
    },
    {
        id: '9',
        title: 'Daily ka Kaam hai by Aakash Gupta',
        venue: 'CP67 Mall:Mohali',
        location: 'Chandigarh',
        category: 'Comedy Shows',
        price: '₹499',
        image: '/img_short/id9.jpg',
        landscapeImage: '/land_img/photo-9.jpg',
        artist: 'Aakash Gupta',
        artistImage: '/art_img/9.jpg',
        duration: '75 minutes',
        ageRestriction: '18+',
        description: 'Aakash Gupta brings his witty observations about everyday life.'
    },
    {
        id: '10',
        title: 'Gaurav Kapoor Live',
        venue: 'CP67 Mall:Mohali',
        location: 'Chandigarh',
        category: 'Comedy Shows',
        price: '₹499',
        image: '/img_short/id10.jpg',
        landscapeImage: '/land_img/photo-10.jpg',
        artist: 'Gaurav Kapoor',
        artistImage: '/art_img/10.jpg',
        duration: '90 minutes',
        ageRestriction: '18+',
        description: 'Gaurav Kapoor Live is back with his signature comedy style!'
    },
    {
        id: '11',
        title: 'Sufi Night',
        venue: 'CP67 Mall:Mohali',
        location: 'Chandigarh',
        category: 'Qawali Night',
        price: '₹999',
        image: '/img_short/id11.jpg',
        landscapeImage: '/land_img/photo-11.jpg',
        artist: 'Sufi Ensemble',
        artistImage: '/art_img/11.jpg',
        duration: '3 hours',
        ageRestriction: 'All Ages',
        description: 'Immerse yourself in the spiritual melodies of Sufi music.'
    },
    {
        id: '12',
        title: 'The Night Before Tomorrow: A The Weeknd Fan Event',
        venue: 'CP67 Mall:Mohali',
        location: 'Chandigarh',
        category: 'Concerts',
        price: '₹4999',
        image: '/img_short/id12.jpg',
        landscapeImage: '/land_img/photo-12.jpg',
        artist: 'The Weeknd',
        artistImage: '/art_img/12.jpg',
        duration: '4 hours',
        ageRestriction: '18+',
        description: 'A spectacular fan event celebrating The Weeknd!'
    },
    {
        id: '13',
        title: 'HUMARE RAM Ft Ashutosh Rana and Rahull R Bhuchar',
        venue: 'Kedarnath Sahni Auditorium: Delhi',
        location: 'Delhi',
        category: 'Theatre Shows',
        price: '₹899',
        image: '/img_short/id13.jpg',
        landscapeImage: '/land_img/photo-13.jpg',
        artist: 'Ashutosh Rana',
        artistImage: '/art_img/13.jpg',
        duration: '2 hours 15 minutes',
        ageRestriction: 'All Ages',
        description: 'A powerful theatrical production featuring renowned actor Ashutosh Rana.'
    },
    {
        id: '14',
        title: 'Sir Sir Sarla - Delhi Theatre Festival',
        venue: 'Kedarnath Sahni Auditorium: Delhi',
        location: 'Delhi',
        category: 'Theatre Shows',
        price: '₹899',
        image: '/img_short/id14.jpg',
        landscapeImage: '/land_img/photo-14.jpg',
        artist: 'Theatre Artists Collective',
        artistImage: '/art_img/14.jpg',
        duration: '2 hours',
        ageRestriction: '12+',
        description: 'Part of the Delhi Theatre Festival, a captivating drama exploring contemporary social issues.'
    },
    {
        id: '15',
        title: 'Sufi Night at Noida',
        venue: 'Kedarnath Sahni Auditorium',
        location: 'Noida',
        category: 'Qawali Night',
        price: '₹899',
        image: 'https://media.insider.in/image/upload/c_crop,g_custom/v1753852044/uhx3uuehlydr0hcmgxk3.jpg',
        landscapeImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2940&auto=format&fit=crop',
        artist: 'Qawwali Masters',
        artistImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2787&auto=format&fit=crop',
        duration: '3 hours',
        ageRestriction: 'All Ages',
        description: 'Experience the divine art of Sufi music in Noida.'
    },
    {
        id: '16',
        title: 'Rehmat e Nusrat by Amarrass',
        venue: 'The Piano Man New Delhi',
        location: 'Delhi',
        category: 'Qawali Night',
        price: '₹899',
        image: 'https://media.insider.in/image/upload/c_crop,g_custom/v1760787674/vb5m7kz70ltp5jybrcxx.png',
        landscapeImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2940&auto=format&fit=crop',
        artist: 'Amarrass Ensemble',
        artistImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2787&auto=format&fit=crop',
        duration: '2 hours 30 minutes',
        ageRestriction: 'All Ages',
        description: 'A tribute to the legendary Nusrat Fateh Ali Khan.'
    },
    {
        id: '17',
        title: 'Qawaali Night',
        venue: 'Cosy Box',
        location: 'Gurugram',
        category: 'Qawali Night',
        price: '₹899',
        image: 'https://media.insider.in/image/upload/c_crop,g_custom/v1757936057/uh6bl4mpnxluzwht6k0c.png',
        landscapeImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2940&auto=format&fit=crop',
        artist: 'Qawwali Group',
        artistImage: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=2787&auto=format&fit=crop',
        duration: '3 hours',
        ageRestriction: 'All Ages',
        description: 'An intimate qawwali night at Cosy Box in Gurugram.'
    }
];

// Get all nightlife categories
export const getNightlifeCategories = async (req, res) => {
    try {
        res.json({ success: true, categories: nightlifeCategories });
    } catch (error) {
        console.error('Error fetching nightlife categories:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch nightlife categories.' });
    }
};

// Get mock nightlife events (like TMDB for movies)
export const getMockNightlifeEvents = async (req, res) => {
    try {
        res.json({ success: true, events: mockNightlifeEvents });
    } catch (error) {
        console.error('Error fetching mock nightlife events:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch mock nightlife events.' });
    }
};

// Get all nightlife events
export const getAllNightlifeEvents = async (req, res) => {
    try {
        const { location, showAll } = req.query; // Get location and showAll from query params
        
        let query = {};
        
        // Only filter by date if showAll is not 'true'
        if (showAll !== 'true') {
            query.showDateTime = { $gte: new Date() };
        }
        
        // If location is provided, filter by location field (exact match or contains)
        if (location) {
            // Case-insensitive search - try exact match first, then partial match
            query.location = { $regex: location, $options: 'i' };
        }
        
        console.log('🎉 Nightlife Query:', JSON.stringify(query));
        console.log('🎉 showAll parameter:', showAll);
        
        const events = await NightlifeEvent.find(query).sort({ showDateTime: 1 });
        
        console.log('🎉 Found events count:', events.length);
        console.log('🎉 Events from DB:', JSON.stringify(events.map(e => ({ id: e._id, title: e.title }))));
        
        // ONLY return database events - NO fallback to mock data
        res.json({ success: true, events });
    } catch (error) {
        console.error('Error fetching nightlife events:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch nightlife events.' });
    }
};

// Get nightlife events by category
export const getNightlifeEventsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const events = await NightlifeEvent.find({ 
            category,
            showDateTime: { $gte: new Date() }
        }).sort({ showDateTime: 1 });
        res.json({ success: true, events });
    } catch (error) {
        console.error('Error fetching nightlife events by category:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch nightlife events.' });
    }
};

// Get a specific nightlife event
export const getNightlifeEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await NightlifeEvent.findById(id);
        if (!event) return res.json({ success: false, message: 'Event not found' });
        res.json({ success: true, event });
    } catch (error) {
        console.error('Error fetching nightlife event:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Add nightlife event (admin)
export const addNightlifeEvent = async (req, res) => {
    try {
        const { 
            title, 
            category, 
            venue, 
            location,
            description, 
            showDateTime, 
            price, 
            image,
            landscapeImage,
            artist,
            artistImage,
            duration,
            ageRestriction
        } = req.body;

        if (!title || !category || !venue || !location || !showDateTime || !price) {
            return res.json({ success: false, message: 'Missing required fields' });
        }

        const event = await NightlifeEvent.create({
            title,
            category,
            venue,
            location,
            description,
            showDateTime: new Date(showDateTime),
            price,
            image,
            landscapeImage,
            artist,
            artistImage,
            duration,
            ageRestriction,
            occupiedSeats: {}
        });

        res.json({ success: true, message: 'Nightlife event added successfully', event });
    } catch (error) {
        console.error('Error adding nightlife event:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get occupied seats for nightlife event
export const getOccupiedSeatsForNightlife = async (req, res) => {
    try {
        const { eventId } = req.params;
        const event = await NightlifeEvent.findById(eventId);
        if (!event) return res.json({ success: false, message: 'Event not found' });
        res.json({ success: true, occupiedSeats: event.occupiedSeats || {} });
    } catch (error) {
        console.error('Error fetching occupied seats:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update nightlife event (admin)
export const updateNightlifeEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const event = await NightlifeEvent.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!event) {
            return res.json({ success: false, message: 'Event not found' });
        }

        res.json({ success: true, message: 'Event updated successfully', event });
    } catch (error) {
        console.error('Error updating nightlife event:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete nightlife event (admin)
export const deleteNightlifeEvent = async (req, res) => {
    try {
        const { id } = req.params;
        
        const event = await NightlifeEvent.findByIdAndDelete(id);
        
        if (!event) {
            return res.json({ success: false, message: 'Event not found' });
        }

        res.json({ success: true, message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting nightlife event:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Sync database events with mock data (admin utility)
export const syncEventsWithMockData = async (req, res) => {
    try {
        // Get all events from database
        const dbEvents = await NightlifeEvent.find({});
        
        let updatedCount = 0;
        
        // For each database event, find matching mock event by title
        for (const dbEvent of dbEvents) {
            const mockEvent = mockNightlifeEvents.find(mock => mock.title === dbEvent.title);
            
            if (mockEvent) {
                // Update with missing fields from mock data
                await NightlifeEvent.findByIdAndUpdate(dbEvent._id, {
                    landscapeImage: dummyEvents.landscapeImage || '',
                    artistImage: mockEvent.artistImage || '',
                    artist: mockEvent.artist || '',
                    duration: mockEvent.duration || '',
                    ageRestriction: mockEvent.ageRestriction || '',
                    description: mockEvent.description || ''
                });
                updatedCount++;
            }
        }
        
        res.json({ 
            success: true, 
            message: `Successfully updated ${updatedCount} events with complete data from mock events.`,
            updatedCount 
        });
    } catch (error) {
        console.error('Error syncing events:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create nightlife booking with Stripe payment
export const createNightlifeBooking = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { eventId, selectedSeats } = req.body;
        const { origin } = req.headers;

        // Get the event details
        const event = await NightlifeEvent.findById(eventId);
        if (!event) {
            return res.json({ success: false, message: "Event not found" });
        }

        // Check if seats are available - ensure occupiedSeats is an array
        const occupiedSeats = Array.isArray(event.occupiedSeats) ? event.occupiedSeats : [];
        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats.includes(seat));

        if (isAnySeatTaken) {
            return res.json({ success: false, message: "Selected seats are not available." });
        }

        // Calculate amount
        const basePrice = parseInt(event.price.replace(/[^0-9]/g, ''));
        const amount = basePrice * selectedSeats.length;

        // Create a new booking
        const booking = await Booking.create({
            user: userId,
            nightlifeEvent: eventId,
            type: 'nightlife',
            amount: amount,
            bookedSeats: selectedSeats
        });

        // Update occupied seats
        event.occupiedSeats = [...occupiedSeats, ...selectedSeats];
        await event.save();

        // Stripe Gateway Initialize
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

        // Creating line items for Stripe
        const line_items = [{
            price_data: {
                currency: 'inr',
                product_data: {
                    name: event.title,
                    description: `${event.category} at ${event.venue}`
                },
                unit_amount: Math.floor(amount) * 100
            },
            quantity: 1
        }];

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/my-bookings`,
            cancel_url: `${origin}/nightlife/${eventId}/seats`,
            line_items: line_items,
            mode: 'payment',
            locale: 'auto',
            payment_method_types: ['card'],
            metadata: {
                bookingId: booking._id.toString()
            },
            expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // Expires in 30 minutes
        });

        booking.paymentLink = session.url;
        await booking.save();

        // Run Inngest Scheduler Function to check payment status after 10 minutes
        await inngest.send({
            name: "app/checkpayment",
            data: {
                bookingId: booking._id.toString()
            }
        });

        res.json({ success: true, url: session.url });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Create nightlife ticket booking (for events without seat selection)
export const createNightlifeTicketBooking = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { eventId, ticketType, price } = req.body;
        const { origin } = req.headers;

        // Get the event details
        const event = await NightlifeEvent.findById(eventId);
        if (!event) {
            return res.json({ success: false, message: "Event not found" });
        }

        // Create a new booking with ticket type (no seats)
        const booking = await Booking.create({
            user: userId,
            nightlifeEvent: eventId,
            type: 'nightlife',
            amount: price,
            bookedSeats: [ticketType], // Store ticket type instead of seat numbers
        });

        // Stripe Gateway Initialize
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

        // Creating line items for Stripe
        const line_items = [{
            price_data: {
                currency: 'inr',
                product_data: {
                    name: `${event.title} - ${ticketType.toUpperCase()} Ticket`,
                    description: `${event.category} at ${event.venue}`
                },
                unit_amount: Math.floor(price) * 100
            },
            quantity: 1
        }];

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/my-bookings`,
            cancel_url: `${origin}/nightlife/${eventId}/tickets`,
            line_items: line_items,
            mode: 'payment',
            locale: 'auto',
            payment_method_types: ['card'],
            metadata: {
                bookingId: booking._id.toString()
            },
            expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // Expires in 30 minutes
        });

        booking.paymentLink = session.url;
        await booking.save();

        // Run Inngest Scheduler Function to check payment status
        await inngest.send({
            name: "app/checkpayment",
            data: {
                bookingId: booking._id.toString()
            }
        });

        res.json({ success: true, url: session.url });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
