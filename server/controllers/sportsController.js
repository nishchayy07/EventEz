import SportEvent from '../models/SportEvent.js'
import Booking from '../models/Booking.js'
import stripe from 'stripe'

// Mock sports events for admin to select from
const mockSportEvents = [
  { id: '1', title: 'India vs Australia - Cricket World Cup Final', sport: 'Cricket', venue: 'Narendra Modi Stadium, Ahmedabad, India', image: '/indvsaust20.jpg', price: 5000 },
  { id: '2', title: 'Mumbai Indians vs Chennai Super Kings', sport: 'Cricket', venue: 'Wankhede Stadium, Mumbai, India', image: '/mivscsk.jpg', price: 2500 },
  { id: '3', title: 'Royal Challengers Bangalore vs Kolkata Knight Riders', sport: 'Cricket', venue: 'M. Chinnaswamy Stadium, Bangalore, India', image: '/kkr-vs-rcb-2025.jpg', price: 2000 },
  { id: '4', title: 'India vs England - Test Match', sport: 'Cricket', venue: 'Eden Gardens, Kolkata, India', image: '/indvsengtest.png', price: 1500 },
  { id: '5', title: 'Delhi Capitals vs Punjab Kings', sport: 'Cricket', venue: 'Arun Jaitley Stadium, New Delhi, India', image: '/dcvspbks.jpg', price: 1800 },
  { id: '6', title: 'India vs South Africa - T20 International', sport: 'Cricket', venue: 'MA Chidambaram Stadium, Chennai, India', image: '/indvssa.jpg', price: 2200 },
  { id: '7', title: 'Sunrisers Hyderabad vs Rajasthan Royals', sport: 'Cricket', venue: 'Rajiv Gandhi International Stadium, Hyderabad, India', image: '/rrvsrh.jpg', price: 1600 },
  { id: '8', title: 'India vs New Zealand - ODI Match', sport: 'Cricket', venue: 'Punjab Cricket Association Stadium, Mohali, India', image: '/indvsnz.jpg', price: 1200 },
  { id: '9', title: 'India vs West Indies - T20 Match', sport: 'Cricket', venue: 'Sawai Mansingh Stadium, Jaipur, India', image: '/indvswi.png', price: 1000 },
  { id: '10', title: 'Gujarat Titans vs Lucknow Super Giants', sport: 'Cricket', venue: 'Narendra Modi Stadium, Ahmedabad, India', image: '/gtvslsg.jpg', price: 1900 },
  { id: '11', title: 'Bengaluru FC vs Mumbai City FC', sport: 'Football', venue: 'Sree Kanteerava Stadium, Bangalore, India', image: '/mumbaifcvsbengulufc.jpg', price: 500 },
  { id: '12', title: 'Kerala Blasters vs ATK Mohun Bagan', sport: 'Football', venue: 'Jawaharlal Nehru Stadium, Kochi, India', image: '/keralablasters.jpg', price: 400 },
  { id: '13', title: 'Pro Basketball League - Delhi vs Mumbai', sport: 'Basketball', venue: 'Indira Gandhi Indoor Stadium, New Delhi, India', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800', price: 300 },
  { id: '14', title: 'Davis Cup - India vs Australia', sport: 'Tennis', venue: 'R.K. Khanna Tennis Stadium, New Delhi, India', image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800', price: 800 },
  { id: '15', title: 'Delhi Champion Half Marathon', sport: 'Running', venue: 'Jawaharlal Nehru Stadium, New Delhi, India', image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800', price: 599 },
  { id: '16', title: 'Push Harder Day Run Challenge', sport: 'Running', venue: 'Your Place and Your Time, Virtual Event, India', image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800', price: 530 },
  { id: '17', title: 'Checkmate Your Date - Chess Tournament', sport: 'Chess', venue: 'Conscious Coffee Cravings, Various Cities, India', image: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800', price: 1199 },
  { id: '18', title: 'Chess Club Weekly Tournament', sport: 'Chess', venue: 'Conscious Coffee Cravings, Various Cities, India', image: 'https://images.unsplash.com/photo-1560174038-da43ac74f01b?w=800', price: 299 },
  { id: '19', title: 'Mumbai Cycling Championship', sport: 'Cycling', venue: 'Marine Drive Circuit, Mumbai, India', image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800', price: 799 },
  { id: '20', title: 'HS Prannoy vs Lakshya Sen - India Open', sport: 'Badminton', venue: 'KD Jadhav Indoor Hall, New Delhi, India', image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800', price: 1200 },
];

export const getMockSportEvents = async (req, res) => {
    try {
        res.json({ success: true, events: mockSportEvents });
    } catch (error) {
        console.error('Error fetching mock sport events:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch mock sport events.' });
    }
};

// Get a specific sport event (seatable instance)
export const getSportEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await SportEvent.findById(id);
        if (!event) return res.json({ success: false, message: 'Event not found' });
        res.json({ success: true, event });
    } catch (error) {
        console.error('Error fetching sport event:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Occupied seats for a sport event
export const getOccupiedSeatsForEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const event = await SportEvent.findById(eventId);
        if (!event) return res.json({ success: false, message: 'Event not found' });
        res.json({ success: true, occupiedSeats: event.occupiedSeats || {} });
    } catch (error) {
        console.error('Error fetching occupied seats:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Create booking for sport event with Stripe
export const createSportBooking = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { eventId, selectedSeats } = req.body;
        const { origin } = req.headers;

        const event = await SportEvent.findById(eventId);
        if (!event) return res.json({ success: false, message: 'Event not found' });

        // availability
        const isTaken = selectedSeats.some(seat => event.occupiedSeats?.[seat]);
        if (isTaken) return res.json({ success: false, message: 'Selected Seats are not available.' });

        const amount = event.price * selectedSeats.length;

        const booking = await Booking.create({
            user: userId,
            sportEvent: eventId,
            type: 'sport',
            amount,
            bookedSeats: selectedSeats
        });

        selectedSeats.forEach(seat => { event.occupiedSeats[seat] = userId; });
        event.markModified('occupiedSeats');
        await event.save();

        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
        const line_items = [{
            price_data: {
                currency: 'usd',
                product_data: { name: event.title },
                unit_amount: Math.floor(amount) * 100
            },
            quantity: 1
        }];

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-bookings`,
            cancel_url: `${origin}/my-bookings`,
            line_items,
            mode: 'payment',
            metadata: { bookingId: booking._id.toString() },
            expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
        });

        booking.paymentLink = session.url;
        await booking.save();

        res.json({ success: true, url: session.url });
    } catch (error) {
        console.error('Error creating sport booking:', error);
        res.json({ success: false, message: error.message });
    }
};

// Simple admin-less creator to materialize a seatable event from team card
export const createSportEvent = async (req, res) => {
    try {
        const { title, sport, venue, image, price } = req.body;
        const event = await SportEvent.create({
            title,
            sport,
            venue,
            image,
            price: price || 20,
            showDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
            occupiedSeats: {}
        });
        res.json({ success: true, event });
    } catch (error) {
        console.error('Error creating sport event:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

// Get all sport events from database
export const getAllSportEvents = async (req, res) => {
    try {
        const events = await SportEvent.find({ showDateTime: { $gte: new Date() } })
            .sort({ showDateTime: 1 })
            .limit(20);
        
        res.json({ success: true, events });
    } catch (error) {
        console.error('Error fetching sport events:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch sport events.' });
    }
};

// Add sport event (admin)
export const addSportEvent = async (req, res) => {
    try {
        const { title, sport, venue, image, showDateTime, price } = req.body;

        if (!title || !sport || !venue || !showDateTime || !price) {
            return res.json({ success: false, message: 'Missing required fields' });
        }

        const event = await SportEvent.create({
            title,
            sport,
            venue,
            image,
            showDateTime: new Date(showDateTime),
            price,
            occupiedSeats: {}
        });

        res.json({ success: true, message: 'Sport event added successfully', event });
    } catch (error) {
        console.error('Error adding sport event:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}
