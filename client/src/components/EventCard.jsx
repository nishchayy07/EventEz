import React from 'react'

const EventCard = ({ event }) => {
	return (
		<div className="group relative w-full max-w-[320px] rounded-2xl overflow-hidden cursor-pointer transition-transform hover:scale-105 bg-gray-900">
			<div className="relative aspect-[3/4] overflow-hidden">
				<img src={event.image} alt={event.title} className="w-full h-full object-cover" />

				{event.discount && (
					<div className="absolute top-3 left-3 px-3 py-1 bg-primary rounded-md text-white text-sm font-semibold flex items-center gap-1">
						<span>⚡</span>
						<span>{event.discount}</span>
					</div>
				)}
			</div>

			<div className="p-4 bg-gray-900/60 backdrop-blur-sm">
				{event.timing && <p className="text-xs text-gray-400 mb-1">{event.timing}</p>}
				<h3 className="text-white font-semibold text-base line-clamp-2 mb-1">{event.title}</h3>
				{event.location && <p className="text-xs text-gray-400">{event.location}</p>}
			</div>
		</div>
	)
}

export default EventCard
