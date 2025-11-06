import axios from 'axios';
import SportEvent from '../models/SportEvent.js'
import Booking from '../models/Booking.js'
import stripe from 'stripe'

const API_KEY = process.env.THE_SPORTS_DB_API_KEY;
const BASE_URL = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`;

// A curated list of popular sports
const popularSports = [
    { id: "201", name: "Cricket", image: "https://www.thesportsdb.com/images/sports/cricket.jpg" },
    { id: "202", name: "Football", image: "https://www.thesportsdb.com/images/sports/soccer.jpg" },
    { id: "203", name: "Basketball", image: "https://www.thesportsdb.com/images/sports/basketball.jpg" },
    { id: "204", name: "Tennis", image: "https://www.thesportsdb.com/images/sports/tennis.jpg" },
    { id: "205", name: "Baseball", image: "https://www.thesportsdb.com/images/sports/baseball.jpg" },
    { id: "207", name: "American Football", image: "https://www.thesportsdb.com/images/sports/american_football.jpg" },
    { id: "208", name: "Ice Hockey", image: "https://www.thesportsdb.com/images/sports/ice_hockey.jpg" },
    { id: "210", name: "Volleyball", image: "https://www.thesportsdb.com/images/sports/volleyball.jpg" },
];

export const getAllSports = async (req, res) => {
    try {
        res.json({ sports: popularSports });
    } catch (error) {
        console.error('Error fetching sports:', error);
        res.status(500).json({ message: 'Failed to fetch sports data.' });
    }
};

export const getSportEvents = async (req, res) => {
    const { sportName } = req.params;
    try {
        // Map frontend sport names to TheSportsDB API sport names
        const sportMapping = {
            'football': 'Soccer',
            'american football': 'American Football',
            'ice hockey': 'Ice Hockey',
            'all': 'Soccer' // Default to Soccer for 'all'
        };
        
        let querySport = sportMapping[sportName.toLowerCase()] || sportName;
        
        console.log(`Fetching data for sport: ${querySport}`);

        // Step 1: Find the leagues for the given sport.
        const leaguesResponse = await axios.get(`${BASE_URL}/search_all_leagues.php?s=${querySport}`);
        console.log(`API Response keys:`, Object.keys(leaguesResponse.data));
        
        // API returns different keys: 'leagues', 'countries', or 'countrys' depending on the sport
        const leagues = leaguesResponse.data.leagues || leaguesResponse.data.countries || leaguesResponse.data.countrys || [];
        console.log(`Leagues array length:`, leagues.length);
        
        if (!leagues || leagues.length === 0) {
            console.log(`No leagues found for sport: ${querySport}`);
            return res.json({ events: [] });
        }
        console.log(`Found ${leagues.length} leagues for ${querySport}. Using the first one: ${leagues[0].strLeague}`);


        // Step 2: Take the first league from the list.
        const firstLeagueId = leagues[0].idLeague;

        // Step 3: Fetch all teams in that league.
        const teamsResponse = await axios.get(`${BASE_URL}/lookup_all_teams.php?id=${firstLeagueId}`);
        const teams = teamsResponse.data.teams || [];
        
        console.log(`Found ${teams.length} teams. Sending to client.`);
        console.log('Full teams data:', JSON.stringify(teams, null, 2)); // Log the full data

        res.json({ events: teams });
    } catch (error) {
        console.error("Error fetching sport events:", error);
        res.status(500).json({ message: "Server error" });
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
