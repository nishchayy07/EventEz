import React, { useMemo, useRef, useState, useEffect } from 'react'
import { MessageCircle, SendHorizonal, X, ExternalLink } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

// Parse clickable links and images from message content
const parseMessage = (content) => {
	const linkRegex = /\[CLICKABLE_LINK:([^\|]+)\|([^\]]+)\]/g;
	const imageRegex = /\[EVENT_IMAGE:([^\]]+)\]/g;
	const parts = [];
	let lastIndex = 0;
	let match;
	const allMatches = [];

	// Find all link matches
	while ((match = linkRegex.exec(content)) !== null) {
		allMatches.push({ type: 'link', index: match.index, length: match[0].length, path: match[1], text: match[2] });
	}

	// Find all image matches
	while ((match = imageRegex.exec(content)) !== null) {
		allMatches.push({ type: 'image', index: match.index, length: match[0].length, url: match[1] });
	}

	// Sort matches by index
	allMatches.sort((a, b) => a.index - b.index);

	// Build parts array
	for (const match of allMatches) {
		// Add text before the match
		if (match.index > lastIndex) {
			parts.push({ type: 'text', content: content.substring(lastIndex, match.index) });
		}
		// Add the match
		if (match.type === 'link') {
			parts.push({ type: 'link', path: match.path, text: match.text });
		} else if (match.type === 'image') {
			parts.push({ type: 'image', url: match.url });
		}
		lastIndex = match.index + match.length;
	}

	// Add remaining text
	if (lastIndex < content.length) {
		parts.push({ type: 'text', content: content.substring(lastIndex) });
	}

	return parts.length > 0 ? parts : [{ type: 'text', content }];
};

const Chatbot = () => {
	const { axios, user, shows, favoriteMovies, selectedLocation } = useAppContext()
	const navigate = useNavigate()
	const [isOpen, setIsOpen] = useState(false)
	const [messages, setMessages] = useState([
		{ role: 'assistant', content: `Hi! I'm your EventEz assistant. I can help you find events in ${selectedLocation || 'your city'}. How can I help today?` }
	])
	const [input, setInput] = useState('')
	const [isSending, setIsSending] = useState(false)
	const location = useLocation()
	const listRef = useRef(null)
	const hasInitialized = useRef(false)

	const { image_base_url } = useAppContext()
	
	const context = useMemo(() => ({
		pathname: location.pathname,
		showsCount: shows?.length || 0,
		favoritesCount: favoriteMovies?.length || 0,
		userName: user?.fullName || user?.username || null,
		location: selectedLocation || 'Chandigarh',
		imageBaseUrl: image_base_url,
	}), [location.pathname, shows, favoriteMovies, user, selectedLocation, image_base_url])

	// Update initial message when location changes
	useEffect(() => {
		if (selectedLocation) {
			setMessages([
				{ role: 'assistant', content: `Hi! I'm your EventEz assistant. I can help you find events in ${selectedLocation}. How can I help today?` }
			]);
		}
	}, [selectedLocation]);

	// Auto-scroll to bottom when messages change
	useEffect(() => {
		if (listRef.current) {
			listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
		}
	}, [messages]);

	const send = async () => {
		if (!input.trim() || isSending) return
		const next = [...messages, { role: 'user', content: input.trim() }]
		setMessages(next)
		setInput('')
		setIsSending(true)
		try {
			// Send conversation history to avoid repetitive responses
			const conversationHistory = messages.slice(-10).map(m => ({
				role: m.role,
				content: m.content
			}));
			const { data } = await axios.post('/api/chat', { 
				message: input.trim(), 
				context,
				conversationHistory 
			})
			if (!data?.success) {
				const msg = data?.message || 'Chat failed.'
				setMessages(curr => [...curr, { role: 'assistant', content: msg }])
			} else {
				const reply = data?.reply || 'Sorry, something went wrong.'
				setMessages(curr => [...curr, { role: 'assistant', content: reply }])
			}
		} catch (err) {
			const serverMsg = err?.response?.data?.message
			const msg = serverMsg || 'Sorry, I had trouble responding.'
			setMessages(curr => [...curr, { role: 'assistant', content: msg }])
		} finally {
			setIsSending(false)
		}
	}

	return (
		<>
			{/* Toggle Button */}
			<button
				onClick={() => setIsOpen(v => !v)}
				className="fixed bottom-5 right-5 z-40 rounded-full bg-primary p-3 shadow-lg hover:bg-primary-dull transition-colors"
				aria-label={isOpen ? 'Close chat' : 'Open chat'}
			>
				{isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
			</button>

			{/* Panel */}
			{isOpen && (
				<div className="fixed bottom-20 right-5 z-40 w-80 sm:w-96 h-[28rem] bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl flex flex-col">
					<div className="p-3 border-b border-zinc-800 text-sm font-semibold">EventEz Assistant</div>
					<div ref={listRef} className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-hide">
						{messages.map((m, idx) => {
							const parsedContent = parseMessage(m.content);
							return (
								<div key={idx} className={m.role === 'assistant' ? 'text-zinc-200' : 'text-zinc-100'}>
									<div className={
										`inline-block max-w-[85%] px-3 py-2 rounded-lg ${m.role === 'assistant' ? 'bg-zinc-800' : 'bg-primary text-white'}`
									}>
									{parsedContent.map((part, partIdx) => {
										if (part.type === 'link') {
											return (
												<button
													key={partIdx}
													onClick={() => {
														setIsOpen(false);
														navigate(part.path);
													}}
													className="mt-2 mb-1 inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-md transition-colors cursor-pointer"
												>
													{part.text}
													<ExternalLink className="w-3.5 h-3.5" />
												</button>
											);
										}
										if (part.type === 'image') {
											return (
												<div key={partIdx} className="my-2 rounded-lg overflow-hidden border border-zinc-700/50 shadow-lg">
													<img 
														src={part.url} 
														alt="Event" 
														className="w-full max-w-[240px] h-[160px] rounded-lg object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
														onClick={() => {
															// Find the next link in the message and navigate to it
															const nextLink = parsedContent.slice(partIdx + 1).find(p => p.type === 'link');
															if (nextLink) {
																setIsOpen(false);
																navigate(nextLink.path);
															}
														}}
														onError={(e) => {
															e.target.style.display = 'none';
														}}
													/>
												</div>
											);
										}
										return <span key={partIdx} className="whitespace-pre-wrap">{part.content}</span>;
									})}
									</div>
								</div>
							);
						})}
					</div>
					<div className="p-3 border-t border-zinc-800">
						<div className="flex items-center gap-2">
							<input
								value={input}
								onChange={e => setInput(e.target.value)}
								onKeyDown={e => { if (e.key === 'Enter') send() }}
								placeholder="Ask about movies, shows, bookings..."
								className="flex-1 bg-zinc-800 rounded-md px-3 py-2 text-sm outline-none focus:bg-zinc-700"
							/>
							<button
								onClick={send}
								disabled={isSending}
								className="bg-primary hover:bg-primary-dull disabled:opacity-60 rounded-md px-3 py-2 text-sm flex items-center gap-1"
							>
								<SendHorizonal className="w-4 h-4" />
								Send
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	)
}

export default Chatbot


