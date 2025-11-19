import NightlifeEvent from "../models/NightlifeEvent.js";

// Categories for nightlife
export const nightlifeCategories = [
    { id: "rooftop-bar", name: "Rooftop Bar", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2874&auto=format&fit=crop" },
    { id: "live-music", name: "Live Music Venue", image: "https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=2940&auto=format&fit=crop" },
    { id: "dance-club", name: "Dance Club", image: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=2940&auto=format&fit=crop" },
    { id: "speakeasy", name: "Speakeasy", image: "https://images.unsplash.com/photo-1543007821-59339c618272?q=80&w=2940&auto=format&fit=crop" },
    { id: "karaoke", name: "Karaoke Bar", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2940&auto=format&fit=crop" },
    { id: "comedy-club", name: "Comedy Club", image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?q=80&w=2940&auto=format&fit=crop" },
];

// Hardcoded nightlife events as fallback
const hardcodedNightlifeEvents = [
    {
        _id: '1',
        title: 'Saturday Night Live',
        venue: 'Ophelia Lounge',
        category: 'Concerts',
        showDateTime: new Date('2025-11-30T20:00:00'),
        price: 2999,
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
    },
    {
        _id: '2',
        title: 'Bas Kar Bassi',
        venue: 'The Laugh Club',
        category: 'Comedy Shows',
        showDateTime: new Date('2025-11-25T21:00:00'),
        price: 1299,
        image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U3VuLCAxNiBOb3Y%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00355125-zfdunhwukb-portrait.jpg',
    },
    {
        _id: '3',
        title: 'Samay Raina - Still Alive and Unfiltered',
        venue: 'Indira Gandhi Indoor Stadium',
        category: 'Comedy Shows',
        showDateTime: new Date('2025-11-28T20:00:00'),
        price: 4499,
        image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-TW9uLCAxNyBOb3Ygb253YXJkcw%3D%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end:l-text,ie-UFJPTU9URUQ%3D,co-FFFFFF,bg-DC354B,ff-Roboto,fs-20,lx-N16,ly-12,lfo-top_right,pa-12_14_12_14,r-6,l-end/et00454335-hqmbkqumjp-portrait.jpg',
    },
    {
        _id: '4',
        title: 'Kuch Bhi Ho Sakta Hai - Theatre Festival',
        venue: 'Nehru Stadium',
        category: 'Theatre Shows',
        showDateTime: new Date('2025-11-26T20:00:00'),
        price: 499,
        image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U3VuLCAxNiBOb3Y%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end:l-text,ie-UFJPTU9URUQ%3D,co-FFFFFF,bg-DC354B,ff-Roboto,fs-20,lx-N16,ly-12,lfo-top_right,pa-12_14_12_14,r-6,l-end/et00462375-uruhvkracx-portrait.jpg',
    },
    {
        _id: '5',
        title: 'AP Dhillon: One Of One Tour - Mumbai',
        venue: 'Jio World Convention Centre',
        category: 'Concerts',
        showDateTime: new Date('2025-12-26T19:00:00'),
        price: 1299,
        image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-RnJpLCAyNiBEZWM%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00458408-csskcxnekn-portrait.jpg',
    },
    {
        _id: '6',
        title: 'Satrangi Re by Sonu Nigam',
        venue: 'Nehru Stadium',
        category: 'Concerts',
        showDateTime: new Date('2025-12-20T19:00:00'),
        price: 1299,
        image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCAyOCBNYXI%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00455992-cskuwbmxvk-portrait.jpg',
    },
    {
        _id: '7',
        title: 'Kal ki Chinta Nahi Karta ft. Ravi Gupta',
        venue: 'CP67 Mall, Mohali',
        category: 'Comedy Shows',
        showDateTime: new Date('2025-11-22T19:00:00'),
        price: 499,
        image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCAxNSBOb3Y%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00329412-wqddascxcw-portrait.jpg',
    },
    {
        _id: '8',
        title: 'Gaurav Kapoor Live',
        venue: 'CP67 Mall, Mohali',
        category: 'Comedy Shows',
        showDateTime: new Date('2025-12-21T20:00:00'),
        price: 499,
        image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U3VuLCAyMSBEZWM%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00331714-blzqtszsvj-portrait.jpg',
    },
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

// Get all nightlife events
export const getAllNightlifeEvents = async (req, res) => {
    try {
        const events = await NightlifeEvent.find({ showDateTime: { $gte: new Date() } }).sort({ showDateTime: 1 });
        
        // If no events in database, return hardcoded events
        if (events.length === 0) {
            return res.json({ success: true, events: hardcodedNightlifeEvents });
        }
        
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
        const { title, category, venue, description, showDateTime, price, image } = req.body;

        if (!title || !category || !venue || !showDateTime || !price) {
            return res.json({ success: false, message: 'Missing required fields' });
        }

        const event = await NightlifeEvent.create({
            title,
            category,
            venue,
            description,
            showDateTime: new Date(showDateTime),
            price,
            image,
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
