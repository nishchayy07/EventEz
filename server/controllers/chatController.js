import axios from "axios";

// Simple AI chat endpoint using OpenAI-compatible APIs
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

		// Use OpenAI or any compatible endpoint via environment config
		const apiKey = process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY || process.env.TOGETHER_API_KEY;
		const baseURL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
		const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
		if (!apiKey) {
			return res.status(500).json({ success: false, message: 'Missing AI API key' });
		}

		const systemPrompt = `You are EventEz's helpful concierge. Personalize replies when possible, but do not expose private data. Keep answers concise and friendly.`;

		const payload = {
			model,
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

		// Standard OpenAI chat completions
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


