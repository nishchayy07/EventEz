import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Simple AI chat endpoint
// Expects: { message: string, context?: object }
export const chatWithAI = async (req, res) => {
	try {
		console.log('[chat] incoming request')
		const authObj = typeof req.auth === 'function' ? req.auth() : req.auth;
		const userId = authObj?.userId;
		const { message, context } = req.body || {};
		if (!message || typeof message !== 'string') {
			return res.status(400).json({ success: false, message: 'Invalid message' });
		}

		// Personalization signal
		const personalization = {
			userId: userId || 'guest',
			app: 'EventEz',
			context: context || {},
		};

		const systemPrompt = `You are EventEz's helpful concierge. Personalize replies when possible, but do not expose private data. Keep answers concise and friendly.`;

		// Gemini API integration
		if (process.env.GEMINI_API_KEY) {
			try {
				const fullMessage = JSON.stringify({ personalization, message });
				
				const apiURL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

				const reqBody = {
					contents: [
						{
							role: "user",
							parts: [{ text: systemPrompt }]
						},
						{
							role: "model",
							parts: [{ text: "Understood. I am EventEz's helpful concierge." }]
						},
						{
							role: "user",
							parts: [{ text: fullMessage }]
						}
					],
					generationConfig: {
						temperature: 0.7,
						maxOutputTokens: 200,
					}
				};

				const { data } = await axios.post(apiURL, reqBody, {
					headers: { 'Content-Type': 'application/json' }
				});

				const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I had trouble understanding.';
				return res.json({ success: true, reply: text });

			} catch (error) {
				const providerData = error?.response?.data;
				console.error("Gemini API Error:", providerData || error.message);
				const msg = providerData?.error?.message || 'Gemini chat failed';
				return res.status(500).json({ success: false, message: msg });
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


