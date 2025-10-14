import React from 'react'

const ArtistCard = ({ artist }) => {
	return (
		<div className="flex flex-col items-center gap-3 cursor-pointer group">
			<div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-gray-800 group-hover:border-primary transition">
				<img src={artist.image} alt={artist.name} className="w-full h-full object-cover group-hover:scale-110 transition" />
			</div>
			<h3 className="text-white text-sm md:text-base font-semibold text-center">{artist.name}</h3>
		</div>
	)
}

export default ArtistCard
