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

// Mock nightlife events (like TMDB for movies)
const mockNightlifeEvents = [
    {
        id: '1',
        title: 'Saturday Night Live',
        venue: 'Ophelia Lounge',
        location: 'Delhi/NCR',
        category: 'Concerts',
        date: '2025-11-09T20:00:00',
        price: '₹2999',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
    },
    {
        id: '2',
        title: 'Kisi ko Batana Mat ft. Anubhav Singh Bassi',
        venue: 'The Laugh Club',
        location: 'Delhi/NCR',
        category: 'Comedy Shows',
        date: '2025-11-10T21:00:00',
        price: '₹1299',
        image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U3VuLCAxNiBOb3Y%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00355125-zfdunhwukb-portrait.jpg',
        artist: 'Anubhav Singh Bassi',
        artistImage: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U3VuLCAxNiBOb3Y%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00355125-zfdunhwukb-portrait.jpg',
    },
    {
        id: '3',
        title: 'Samay Raina-Still Alive and Unfiltered',
        venue: 'Indira Gandhi Indoor Stadium',
        location: 'New Delhi',
        category: 'Comedy Shows',
        date: '2025-11-09T20:00:00',
        price: '₹4499',
        image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-TW9uLCAxNyBOb3Ygb253YXJkcw%3D%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end:l-text,ie-UFJPTU9URUQ%3D,co-FFFFFF,bg-DC354B,ff-Roboto,fs-20,lx-N16,ly-12,lfo-top_right,pa-12_14_12_14,r-6,l-end/et00454335-hqmbkqumjp-portrait.jpg',
    },
    {
        id: '4',
        title: 'Kuch Bhi Ho Sakta Hai - Delhi Theatre Festival',
        venue: 'Nehru Stadium',
        location: 'Delhi',
        category: 'Theatre Shows',
        date: '2025-11-10T20:00:00',
        price: '₹499',
        image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U3VuLCAxNiBOb3Y%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end:l-text,ie-UFJPTU9URUQ%3D,co-FFFFFF,bg-DC354B,ff-Roboto,fs-20,lx-N16,ly-12,lfo-top_right,pa-12_14_12_14,r-6,l-end/et00462375-uruhvkracx-portrait.jpg',
    },
    {
        id: '5',
        title: 'Einstein 15th Nov - Delhi Theatre Festival',
        venue: 'Nehru Stadium',
        location: 'Delhi',
        category: 'Theatre Shows',
        date: '2025-11-15T22:00:00',
        price: '₹999',
        image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCAxNSBOb3Y%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00462380-nxjnvwzxep-portrait.jpg',
    },
    {
        id: '6',
        title: 'AP Dhillon: One Of One Tour - Mumbai',
        venue: 'Jio World Convention Centre: Mumbai',
        location: 'Mumbai',
        category: 'Concerts',
        date: '2025-12-26T19:00:00',
        price: '₹1299',
        image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-RnJpLCAyNiBEZWM%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00458408-csskcxnekn-portrait.jpg',
    },
    {
        id: '7',
        title: 'Satrangi Re by Sonu Nigam',
        venue: 'Nehru Stadium',
        location: 'Delhi',
        category: 'Concerts',
        date: '2025-12-26T19:00:00',
        price: '₹1299',
        image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCAyOCBNYXI%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00455992-cskuwbmxvk-portrait.jpg',
    },
    {
        id: '8',
        title: 'Kal ki Chinta Nahi Karta ft. Ravi Gupta',
        venue: 'CP67 Mall:Mohali',
        location: 'Chandigarh',
        category: 'Comedy Shows',
        date: '2025-12-26T19:00:00',
        price: '₹499',
        image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCAxNSBOb3Y%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00329412-wqddascxcw-portrait.jpg',
    },
    {
        id: '9',
        title: 'Daily ka Kaam hai by Aakash Gupta',
        venue: 'CP67 Mall:Mohali',
        location: 'Chandigarh',
        category: 'Comedy Shows',
        date: '2025-12-26T19:00:00',
        price: '₹499',
        image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U3VuLCAxNiBOb3Y%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00419828-rtfdvqpztg-portrait.jpg',
    },
    {
        id: '10',
        title: 'Gaurav Kapoor Live',
        venue: 'CP67 Mall:Mohali',
        location: 'Chandigarh',
        category: 'Comedy Shows',
        date: '2025-12-26T20:00:00',
        price: '₹499',
        image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U3VuLCAyMSBEZWM%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00331714-blzqtszsvj-portrait.jpg',
    },
    {
        id: '11',
        title: 'Sufi Night',
        venue: 'CP67 Mall:Mohali',
        location: 'Chandigarh',
        category: 'Qawali Night',
        date: '2025-12-26T20:00:00',
        price: '₹999',
        image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U3VuLCAyMyBOb3Y%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00468484-exlkezngpn-portrait.jpg',
    },
    {
        id: '12',
        title: 'The Night Before Tomorrow: A The Weeknd Fan Event',
        venue: 'CP67 Mall:Mohali',
        location: 'Chandigarh',
        category: 'Concerts',
        date: '2025-11-15T20:00:00',
        price: '₹4999',
        image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCAyOSBOb3Y%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00468465-uhkdaplggf-portrait.jpg',
    },
    {
        id: '13',
        title: 'HUMARE RAM Ft Ashutosh Rana and Rahull R Bhuchar',
        venue: 'Kedarnath Sahni Auditorium: Delhi',
        location: 'Delhi',
        category: 'Theatre Shows',
        date: '2025-11-17T22:00:00',
        price: '₹899',
        image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-RnJpLCAxNCBOb3Ygb253YXJkcw%3D%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00376688-nansgzqfxr-portrait.jpg',
    },
    {
        id: '14',
        title: 'Sir Sir Sarla - Delhi Theatre Festival',
        venue: 'Kedarnath Sahni Auditorium: Delhi',
        location: 'Delhi',
        category: 'Theatre Shows',
        date: '2025-11-17T22:00:00',
        price: '₹899',
        image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCAxNSBOb3Y%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00462378-ggbwsjvfbe-portrait.jpg',
    },
    {
        id: '15',
        title: 'Sufi Night at Noida',
        venue: 'Kedarnath Sahni Auditorium',
        location: 'Noida',
        category: 'Qawali Night',
        date: '2025-11-17T22:00:00',
        price: '₹899',
        image: 'https://media.insider.in/image/upload/c_crop,g_custom/v1753852044/uhx3uuehlydr0hcmgxk3.jpg',
    },
    {
        id: '16',
        title: 'Rehmat e Nusrat by Amarrass',
        venue: 'The Piano Man New Delhi',
        location: 'Delhi',
        category: 'Qawali Night',
        date: '2025-11-28T20:30:00',
        price: '₹899',
        image: 'https://media.insider.in/image/upload/c_crop,g_custom/v1760787674/vb5m7kz70ltp5jybrcxx.png',
    },
    {
        id: '17',
        title: 'Qawaali Night',
        venue: 'Cosy Box',
        location: 'Gurugram',
        category: 'Qawali Night',
        date: '2025-11-28T20:30:00',
        price: '₹899',
        image: 'https://media.insider.in/image/upload/c_crop,g_custom/v1757936057/uh6bl4mpnxluzwht6k0c.png',
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
        const events = await NightlifeEvent.find({ showDateTime: { $gte: new Date() } }).sort({ showDateTime: 1 });
        
        // If no events in database, return empty array (frontend should handle gracefully)
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
