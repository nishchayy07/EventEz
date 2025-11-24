import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import SportEvent from "../models/SportEvent.js";
import NightlifeEvent from "../models/NightlifeEvent.js";

// Simple AI chat endpoint
// Expects: { message: string, context?: object }
export const chatWithAI = async (req, res) => {
	try {
		const authObj = typeof req.auth === 'function' ? req.auth() : req.auth;
		const userId = authObj?.userId;
		const { message, context } = req.body || {};
		if (!message || typeof message !== 'string') {
			return res.status(400).json({ success: false, message: 'Invalid message' });
		}

		// Fetch actual event data from database
		const location = context?.location || 'Chandigarh';
		const now = new Date();

		// Get movies with shows
		const shows = await Show.find({ showDateTime: { $gte: now } })
			.populate('movie')
			.limit(20)
			.sort({ showDateTime: 1 });
		
		const movies = shows.map(show => ({
			title: show.movie?.title,
			genres: show.movie?.genres?.join(', '),
			showTime: show.showDateTime,
			price: show.showPrice
		})).filter(m => m.title);

		// Get sports events
		const sportsEvents = await SportEvent.find({ showDateTime: { $gte: now } })
			.limit(10)
			.sort({ showDateTime: 1 })
			.select('title sport venue showDateTime price');

		// Get nightlife events
		const nightlifeEvents = await NightlifeEvent.find({ 
			showDateTime: { $gte: now },
			location: new RegExp(location, 'i')
		})
			.limit(10)
			.sort({ showDateTime: 1 })
			.select('title category venue artist showDateTime price');

		// Prepare event data summary
		const eventData = {
			location,
			movies: movies.slice(0, 5),
			sports: sportsEvents.map(e => ({
				title: e.title,
				sport: e.sport,
				venue: e.venue,
				date: e.showDateTime,
				price: e.price
			})),
			nightlife: nightlifeEvents.map(e => ({
				title: e.title,
				category: e.category,
				artist: e.artist,
				venue: e.venue,
				date: e.showDateTime,
				price: e.price
			})),
			counts: {
				movies: movies.length,
				sports: sportsEvents.length,
				nightlife: nightlifeEvents.length
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

		const systemPrompt = `You are EventEz assistant for ${eventData.location}. Use ONLY this real data:

Movies (${eventData.counts.movies}): ${movieList}
Sports (${eventData.counts.sports}): ${sportsList}
Nightlife (${eventData.counts.nightlife}): ${nightlifeList}

Rules: Only recommend listed events. Be concise (2-3 sentences). Suggest browsing EventEz sections.`;

		// Gemini API integration
		if (process.env.GEMINI_API_KEY) {
			try {
				const apiURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY.trim()}`;

				// Combine system prompt and user message
				const fullPrompt = `${systemPrompt}\n\nUser question: ${message}\n\nAssistant:`;

				const reqBody = {
					contents: [
						{
							parts: [{ text: fullPrompt }]
						}
					],
					generationConfig: {
						temperature: 0.7,
						maxOutputTokens: 250,
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
				const query = message.toLowerCase();
				let reply = '';
				
				if (query.includes('movie') || query.includes('film')) {
					if (eventData.counts.movies > 0) {
						const topMovies = eventData.movies.slice(0, 2).map(m => `${m.title} (₹${m.price})`).join(' and ');
						reply = `We have ${eventData.counts.movies} movies showing in ${location}! Check out ${topMovies}. Browse the Movies section for showtimes.`;
					} else {
						reply = `No movies are currently available in ${location}. Check back soon or explore our Sports and Nightlife sections!`;
					}
				} else if (query.includes('sport') || query.includes('game') || query.includes('match')) {
					if (eventData.counts.sports > 0) {
						const topSports = eventData.sports.slice(0, 2).map(s => `${s.title} (${s.sport})`).join(' and ');
						reply = `We have ${eventData.counts.sports} sports events in ${location}! Including ${topSports}. Check the Sports section for details.`;
					} else {
						reply = `No sports events are currently scheduled in ${location}. Explore our Movies and Nightlife sections instead!`;
					}
				} else if (query.includes('nightlife') || query.includes('concert') || query.includes('party') || query.includes('comedy')) {
					if (eventData.counts.nightlife > 0) {
						const topNightlife = eventData.nightlife.slice(0, 2).map(n => `${n.title} (${n.category})`).join(' and ');
						reply = `We have ${eventData.counts.nightlife} nightlife events in ${location}! Including ${topNightlife}. Visit the Nightlife section for more.`;
					} else {
						reply = `No nightlife events are currently available in ${location}. Check our Movies and Sports sections!`;
					}
				} else {
					// General response
					const eventSummary = [];
					if (eventData.counts.movies > 0) eventSummary.push(`${eventData.counts.movies} movies`);
					if (eventData.counts.sports > 0) eventSummary.push(`${eventData.counts.sports} sports events`);
					if (eventData.counts.nightlife > 0) eventSummary.push(`${eventData.counts.nightlife} nightlife events`);
					
					if (eventSummary.length > 0) {
						reply = `We have ${eventSummary.join(', ')} in ${location}! Browse our Movies, Sports, or Nightlife sections to explore.`;
					} else {
						reply = `No events are currently available in ${location}. Check back soon for new listings!`;
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

		const payload = {
			model: modelName,
			messages: [
				{ role: 'system', content: systemPrompt },
				{ role: 'user', content: JSON.stringify({ personalization, message }) },
			],
			temperature: 0.7,
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


