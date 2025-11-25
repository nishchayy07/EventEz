import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import SportEvent from "../models/SportEvent.js";
import NightlifeEvent from "../models/NightlifeEvent.js";

// Helper function to detect and normalize city names (handles misspellings)
const detectCity = (query) => {
	const lowerQuery = query.toLowerCase();
	const cityMap = {
		'bangalore': 'Bangalore',
		'bengaluru': 'Bangalore',
		'benglaru': 'Bangalore', // Common misspelling
		'bengalor': 'Bangalore',
		'delhi': 'Delhi',
		'new delhi': 'Delhi',
		'mumbai': 'Mumbai',
		'bombay': 'Mumbai',
		'pune': 'Pune',
		'hyderabad': 'Hyderabad',
		'chennai': 'Chennai',
		'madras': 'Chennai',
		'kolkata': 'Kolkata',
		'calcutta': 'Kolkata',
		'chandigarh': 'Chandigarh',
		'gurgaon': 'Gurgaon',
		'noida': 'Noida',
		'goa': 'Goa'
	};
	
	for (const [key, city] of Object.entries(cityMap)) {
		if (lowerQuery.includes(key)) {
			return city;
		}
	}
	return null;
};

// Simple AI chat endpoint
// Expects: { message: string, context?: object, conversationHistory?: array }
export const chatWithAI = async (req, res) => {
	try {
		const authObj = typeof req.auth === 'function' ? req.auth() : req.auth;
		const userId = authObj?.userId;
		const { message, context, conversationHistory } = req.body || {};
		if (!message || typeof message !== 'string') {
			return res.status(400).json({ success: false, message: 'Invalid message' });
		}

		// Detect city from user message (overrides context location)
		const detectedCity = detectCity(message);
		const location = detectedCity || context?.location || 'Chandigarh';
		const now = new Date();
		const today = new Date(now.setHours(0, 0, 0, 0));
		const thisWeekend = new Date(today);
		thisWeekend.setDate(today.getDate() + (6 - today.getDay())); // Next Saturday
		const nextWeekend = new Date(thisWeekend);
		nextWeekend.setDate(thisWeekend.getDate() + 7);

		// Get movies with shows
		const shows = await Show.find({ showDateTime: { $gte: now } })
			.populate('movie')
			.limit(50)
			.sort({ showDateTime: 1 });
		
		// Get image base URL from context or use default
		const imageBaseUrl = context?.imageBaseUrl || process.env.TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p/w500';
		
		const movies = shows.map(show => ({
			id: show.movie?._id,
			showId: show._id,
			title: show.movie?.title,
			genres: show.movie?.genres || [],
			description: show.movie?.overview || '',
			showTime: show.showDateTime,
			price: show.showPrice,
			venue: 'Movie Auditorium',
			city: location,
			type: 'movie',
			runtime: show.movie?.runtime || 0,
			rating: show.movie?.vote_average || 0,
			link: `/movies/${show.movie?._id}`,
			image: show.movie?.poster_path ? `${imageBaseUrl}${show.movie.poster_path}` : null
		})).filter(m => m.title);

		// Get sports events
		const sportsEvents = await SportEvent.find({ showDateTime: { $gte: now } })
			.limit(50)
			.sort({ showDateTime: 1 })
			.select('title sport venue showDateTime price image');

		const sports = sportsEvents.map(e => {
			const sportLower = e.sport?.toLowerCase() || '';
			let link = `/sports/seat/${e._id}`;
			if (sportLower.includes('chess')) {
				link = `/sports/chess/${e._id}`;
			} else if (sportLower.includes('running') || sportLower.includes('marathon')) {
				link = `/sports/running/${e._id}`;
			}
			return {
				id: e._id,
				title: e.title,
				category: e.sport,
				venue: e.venue || 'Sports Venue',
				city: e.venue ? (e.venue.includes('Delhi') ? 'Delhi' : e.venue.includes('Mumbai') ? 'Mumbai' : e.venue.includes('Bangalore') ? 'Bangalore' : location) : location,
				date: e.showDateTime,
				price: e.price,
				type: 'sport',
				description: `${e.sport} event`,
				link: link,
				image: e.image || null
			};
		});

		// Get nightlife events
		const nightlifeEvents = await NightlifeEvent.find({ 
			showDateTime: { $gte: now }
		})
			.limit(50)
			.sort({ showDateTime: 1 })
			.select('title category venue location artist showDateTime price description duration ageRestriction image landscapeImage');

		const nightlife = nightlifeEvents.map(e => ({
			id: e._id,
			title: e.title,
			category: e.category,
			artist: e.artist || '',
			venue: e.venue,
			city: e.location,
			date: e.showDateTime,
			price: e.price,
			type: 'nightlife',
			description: e.description || `${e.category} event`,
			duration: e.duration || '',
			ageRestriction: e.ageRestriction || '',
			link: `/nightlife/${e._id}`,
			image: e.landscapeImage || e.image || null
		}));

		// Filter events by detected location
		let filteredMovies = movies;
		let filteredSports = sports;
		let filteredNightlife = nightlife;
		
		if (detectedCity) {
			// Filter nightlife by location field
			filteredNightlife = nightlife.filter(e => 
				e.city?.toLowerCase().includes(detectedCity.toLowerCase())
			);
			// Filter sports by venue (which often contains city name)
			filteredSports = sports.filter(e => 
				e.venue?.toLowerCase().includes(detectedCity.toLowerCase()) ||
				e.city?.toLowerCase().includes(detectedCity.toLowerCase())
			);
			// Movies are typically city-agnostic, but we can filter if needed
		}
		
		// Prepare comprehensive event data
		const allEvents = [...filteredMovies, ...filteredSports, ...filteredNightlife];

		const eventData = {
			location,
			detectedCity,
			allEvents,
			movies: filteredMovies,
			sports: filteredSports,
			nightlife: filteredNightlife,
			counts: {
				movies: filteredMovies.length,
				sports: filteredSports.length,
				nightlife: filteredNightlife.length,
				total: allEvents.length
			},
			dateRanges: {
				today,
				thisWeekend,
				nextWeekend
			}
		};

		// Personalization signal
		const personalization = {
			userId: userId || 'guest',
			app: 'EventEz',
			context: context || {},
		};

		// Build concise event lists
		const movieList = eventData.movies.length > 0 
			? eventData.movies.slice(0, 3).map(m => `${m.title} (₹${m.price})`).join(', ')
			: 'None';
		const sportsList = eventData.sports.length > 0
			? eventData.sports.slice(0, 3).map(s => `${s.title} - ${s.sport} (₹${s.price})`).join(', ')
			: 'None';
		const nightlifeList = eventData.nightlife.length > 0
			? eventData.nightlife.slice(0, 3).map(n => `${n.title} - ${n.category} (${n.price})`).join(', ')
			: 'None';

		// Format events for AI with full details, images, and clickable links
		const formatEvent = (event, index) => {
			const date = new Date(event.date || event.showTime).toLocaleString('en-IN', { 
				weekday: 'short', 
				year: 'numeric', 
				month: 'short', 
				day: 'numeric', 
				hour: '2-digit', 
				minute: '2-digit' 
			});
			const priceStr = typeof event.price === 'string' ? event.price : `₹${event.price}`;
			
			let details = `\n${index + 1}. **${event.title}**\n`;
			if (event.image) details += `   - [EVENT_IMAGE:${event.image}]\n`;
			details += `   - Type: ${event.type} (${event.category || event.genres?.join(', ') || 'Event'})\n`;
			details += `   - Date & Time: ${date}\n`;
			details += `   - Venue: ${event.venue}\n`;
			details += `   - City: ${event.city}\n`;
			details += `   - Price: ${priceStr}\n`;
			if (event.description) details += `   - Description: ${event.description.substring(0, 100)}${event.description.length > 100 ? '...' : ''}\n`;
			if (event.artist) details += `   - Artist: ${event.artist}\n`;
			if (event.duration) details += `   - Duration: ${event.duration}\n`;
			if (event.ageRestriction) details += `   - Age: ${event.ageRestriction}\n`;
			if (event.link) details += `   - [CLICKABLE_LINK:${event.link}|View Details & Book]\n`;
			return details;
		};

		// Build conversation context for AI
		const conversationContext = conversationHistory && conversationHistory.length > 0
			? conversationHistory.slice(-6).map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n')
			: '';

		const systemPrompt = `You are an Event-Booking Assistant for EventEz platform. Your role is to help users discover, explore, and book events.

**CURRENT CONTEXT:**
- User Location: ${eventData.location}${eventData.detectedCity ? ` (detected from query)` : ''}
- Total Events Available: ${eventData.counts.total} (${eventData.counts.movies} movies, ${eventData.counts.sports} sports, ${eventData.counts.nightlife} nightlife)

${conversationContext ? `**RECENT CONVERSATION:**\n${conversationContext}\n\n**IMPORTANT:** Do NOT repeat previous responses. Provide NEW information or ask clarifying questions if the user wants more details.` : ''}

**YOUR RESPONSIBILITIES:**

0. **Handle Conversational Queries Naturally:**
   - When user greets you ("hi", "hello", "how are you"), respond conversationally first
   - Example: "I'm doing great, thank you! 😊 How can I help you find events today?"
   - Then offer to help with events - don't immediately list events for greetings
   - Be friendly and natural in conversation

1. **Provide Detailed Event Information:**
   - Event name, date & time, venue, city, ticket price, description, category
   - Always format dates clearly (e.g., "Sat, Dec 7, 2024 at 8:00 PM")
   - Include all relevant details from the event data

2. **Filter Events Based on User Queries:**
   - By location: "events in Bangalore", "show me Mumbai events"
   - By category: "music events", "sports events", "comedy shows", "tech workshops"
   - By date: "events this weekend", "events next week", "events today"
   - By price range: "events under ₹500", "affordable events"
   - By popularity: "trending events", "popular events"

3. **Provide Recommendations:**
   - Based on user interests mentioned
   - Based on similar events
   - Top trending events in each city
   - Events happening soon

4. **Ask Clarifying Questions When Needed:**
   - "Which city are you interested in?"
   - "What date are you looking for?"
   - "Any specific event type or category?"
   - "What's your budget range?"

5. **Response Format:**
   - Use bullet points for lists
   - Include all event details clearly
   - Offer helpful suggestions or related events
   - Be friendly, factual, and helpful
   - If information is unknown, ask politely or estimate

**AVAILABLE EVENTS DATA:**

${eventData.allEvents.length > 0 ? eventData.allEvents.slice(0, 20).map((e, i) => formatEvent(e, i)).join('\n') : 'No events currently available.'}

${eventData.allEvents.length > 20 ? `\n(Showing first 20 of ${eventData.allEvents.length} events. Ask for more specific filters to see additional events.)` : ''}

**IMPORTANT RULES:**
- Only recommend events from the data provided above
- Never make up event details
- NEVER repeat the same response - always provide NEW information or ask different questions
- Handle conversational queries naturally (greetings, "how are you", "thank you", etc.) - respond conversationally, don't just list events
- If user asks "tell me more" or "more details", provide SPECIFIC event details (names, dates, venues, prices)
- ALWAYS include the [CLICKABLE_LINK:...] format for each event you mention - users can click to view and book
- Format: [CLICKABLE_LINK:/path/to/event|Button Text] - Example: [CLICKABLE_LINK:/nightlife/123|View & Book]
- ALWAYS include [EVENT_IMAGE:image_url] when an event has an image - this displays the event photo
- Format: [EVENT_IMAGE:https://example.com/image.jpg] - Place it right after the event title
- If user asks about a location not in the data, suggest they check other cities or ask for clarification
- Format prices with ₹ symbol
- Be concise but informative (3-5 sentences for general responses, detailed lists when requested)
- Always offer to help with booking or provide more information
- If no events match, suggest alternative filters or categories
- Vary your responses - don't use the same phrasing repeatedly
- When user asks casual questions (how are you, hello, etc.), respond conversationally first, then offer to help with events

**RESPONSE STYLE:**
- Friendly and conversational
- Clear and organized
- Use emojis sparingly (🎵 for music, ⚽ for sports, 🎭 for shows, etc.)
- Format dates and prices clearly
- Use bullet points for multiple events
- When user asks for "more" or "details", list specific events with full information`;

		// Gemini API integration
		if (process.env.GEMINI_API_KEY) {
			try {
				const apiURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY.trim()}`;

				// Combine system prompt and user message with conversation context
				const userContext = conversationContext 
					? `\n\nPrevious conversation context:\n${conversationContext}\n`
					: '';
				const fullPrompt = `${systemPrompt}${userContext}\n\nCurrent User question: ${message}\n\nAssistant (provide a unique, detailed response):`;

				const reqBody = {
					contents: [
						{
							parts: [{ text: fullPrompt }]
						}
					],
					generationConfig: {
						temperature: 0.8,
						maxOutputTokens: 500,
					},
					safetySettings: [
						{
							category: "HARM_CATEGORY_HARASSMENT",
							threshold: "BLOCK_NONE"
						},
						{
							category: "HARM_CATEGORY_HATE_SPEECH",
							threshold: "BLOCK_NONE"
						},
						{
							category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
							threshold: "BLOCK_NONE"
						},
						{
							category: "HARM_CATEGORY_DANGEROUS_CONTENT",
							threshold: "BLOCK_NONE"
						}
					]
				};

				const { data } = await axios.post(apiURL, reqBody, {
					headers: { 'Content-Type': 'application/json' }
				});

				const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
				
				if (!text) {
					return res.json({ success: true, reply: 'I apologize, but I\'m having trouble processing that right now. Could you try asking in a different way?' });
				}
				
				return res.json({ success: true, reply: text });

			} catch (error) {
				// Provide intelligent fallback with actual data based on user query
				const query = message.toLowerCase().trim();
				let reply = '';
				
				// Handle conversational/greeting queries first
				if (query.includes('how are you') || query.includes('how\'re you') || query === 'hi' || query === 'hello' || query === 'hey') {
					reply = `I'm doing great, thank you for asking! 😊 I'm here to help you discover amazing events in ${location}. What kind of events are you looking for? I can help you find movies, sports events, concerts, comedy shows, and more!`;
					return res.json({ success: true, reply });
				}
				
				if (query.includes('thank') || query.includes('thanks')) {
					reply = `You're welcome! Happy to help. Is there anything else you'd like to know about events?`;
					return res.json({ success: true, reply });
				}
				
				if (query.includes('bye') || query.includes('goodbye') || query.includes('see you')) {
					reply = `Goodbye! Have a great time at the events! 🎉 Feel free to come back anytime if you need help finding events.`;
					return res.json({ success: true, reply });
				}
				
				// Handle price queries with context
				if (query === 'price' || query.includes('how much') || query.includes('cost')) {
					if (eventData.counts.total > 0) {
						const sampleEvents = eventData.allEvents.slice(0, 3);
						reply = `Here are some event prices in ${location}:\n\n`;
						sampleEvents.forEach((event, idx) => {
							const priceStr = typeof event.price === 'string' ? event.price : `₹${event.price}`;
							reply += `${idx + 1}. **${event.title}**: ${priceStr}\n`;
							if (event.link) {
								reply += `   [CLICKABLE_LINK:${event.link}|View & Book]\n`;
							}
							reply += `\n`;
						});
						reply += `Prices vary by event type and seating. Click any event above to view details and book!`;
					} else {
						reply = `I don't have pricing information available right now. Would you like to browse our events section to see current prices?`;
					}
					return res.json({ success: true, reply });
				}
				
				let filteredEvents = [];
				
			// Location filtering (use detected city from message)
			const requestedCity = detectCity(query) || location;
			if (requestedCity && requestedCity !== location) {
				filteredEvents = eventData.allEvents.filter(e => 
					e.city?.toLowerCase().includes(requestedCity.toLowerCase()) ||
					e.venue?.toLowerCase().includes(requestedCity.toLowerCase())
				);
			} else {
				filteredEvents = eventData.allEvents;
			}
				
				// Category filtering
				if (query.includes('movie') || query.includes('film') || query.includes('cinema')) {
					filteredEvents = filteredEvents.filter(e => e.type === 'movie');
				} else if (query.includes('sport') || query.includes('game') || query.includes('match') || query.includes('football') || query.includes('cricket')) {
					filteredEvents = filteredEvents.filter(e => e.type === 'sport');
				} else if (query.includes('nightlife') || query.includes('concert') || query.includes('party') || query.includes('comedy') || query.includes('music') || query.includes('show')) {
					filteredEvents = filteredEvents.filter(e => e.type === 'nightlife');
				}
				
				// Date filtering
				if (query.includes('today') || query.includes('tonight')) {
					const todayStart = new Date();
					todayStart.setHours(0, 0, 0, 0);
					const todayEnd = new Date(todayStart);
					todayEnd.setHours(23, 59, 59, 999);
					filteredEvents = filteredEvents.filter(e => {
						const eventDate = new Date(e.date || e.showTime);
						return eventDate >= todayStart && eventDate <= todayEnd;
					});
				} else if (query.includes('weekend') || query.includes('this weekend')) {
					filteredEvents = filteredEvents.filter(e => {
						const eventDate = new Date(e.date || e.showTime);
						return eventDate >= today && eventDate <= thisWeekend;
					});
				} else if (query.includes('next week')) {
					const nextWeekStart = new Date(today);
					nextWeekStart.setDate(today.getDate() + 7);
					const nextWeekEnd = new Date(nextWeekStart);
					nextWeekEnd.setDate(nextWeekStart.getDate() + 7);
					filteredEvents = filteredEvents.filter(e => {
						const eventDate = new Date(e.date || e.showTime);
						return eventDate >= nextWeekStart && eventDate <= nextWeekEnd;
					});
				}
				
				// Price filtering
				if (query.includes('under') || query.includes('below') || query.includes('cheap') || query.includes('affordable')) {
					const priceMatch = query.match(/(\d+)/);
					const maxPrice = priceMatch ? parseInt(priceMatch[1]) : 1000;
					filteredEvents = filteredEvents.filter(e => {
						const price = typeof e.price === 'string' ? parseInt(e.price.replace(/[^0-9]/g, '')) : e.price;
						return price <= maxPrice;
					});
				}
				
				// Build response with clickable links
				if (filteredEvents.length > 0) {
					const topEvents = filteredEvents.slice(0, 5);
					reply = `I found ${filteredEvents.length} event${filteredEvents.length > 1 ? 's' : ''} matching your search:\n\n`;
					topEvents.forEach((event, idx) => {
						const date = new Date(event.date || event.showTime).toLocaleString('en-IN', { 
							weekday: 'short', 
							month: 'short', 
							day: 'numeric', 
							hour: '2-digit', 
							minute: '2-digit' 
						});
						const priceStr = typeof event.price === 'string' ? event.price : `₹${event.price}`;
						reply += `${idx + 1}. **${event.title}**\n`;
						if (event.image) {
							reply += `   [EVENT_IMAGE:${event.image}]\n`;
						}
						reply += `   📅 ${date} | 📍 ${event.venue}, ${event.city} | 💰 ${priceStr}\n`;
						if (event.link) {
							reply += `   [CLICKABLE_LINK:${event.link}|View Details & Book]\n`;
						}
						reply += `\n`;
					});
					if (filteredEvents.length > 5) {
						reply += `...and ${filteredEvents.length - 5} more! Use more specific filters to narrow down your search.\n\n`;
					}
				} else {
					reply = `I couldn't find any events matching your search. `;
					if (requestedCity !== location) {
						reply += `Try searching in ${location} or ask about different categories (movies, sports, nightlife).`;
					} else {
						reply += `Try different filters like:\n- Different date ranges (today, this weekend, next week)\n- Different categories (movies, sports, nightlife)\n- Different price ranges\n\nOr browse our Events section to see all available options!`;
					}
				}
				
				return res.json({ success: true, reply });
			}
		}

		// Fallback to OpenAI or any compatible endpoint
		const apiKey = process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY || process.env.TOGETHER_API_KEY;
		const baseURL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
		const modelName = process.env.OPENAI_MODEL || 'gpt-4o-mini';
		if (!apiKey) {
			return res.status(500).json({ success: false, message: 'Missing AI API key' });
		}

		// Build message history for OpenAI
		const messagesForAI = [
			{ role: 'system', content: systemPrompt }
		];
		
		// Add conversation history if available
		if (conversationHistory && conversationHistory.length > 0) {
			conversationHistory.slice(-8).forEach(msg => {
				messagesForAI.push({
					role: msg.role === 'assistant' ? 'assistant' : 'user',
					content: msg.content
				});
			});
		}
		
		// Add current message
		messagesForAI.push({ 
			role: 'user', 
			content: message 
		});

		const payload = {
			model: modelName,
			messages: messagesForAI,
			temperature: 0.8, // Slightly higher for more varied responses
		};

		const headers = {
			'Authorization': `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
		};

		const { data } = await axios.post(`${baseURL}/chat/completions`, payload, { headers });
		const text = data?.choices?.[0]?.message?.content?.trim() || 'Sorry, I did not catch that.';
		return res.json({ success: true, reply: text });

	} catch (error) {
		const providerData = error?.response?.data;
		console.error(providerData || error.message);
		const msg = providerData?.error?.message || providerData?.message || error.message || 'Chat failed';
		return res.status(500).json({ success: false, message: msg });
	}
};


