import React, { useState } from 'react'
import { User } from 'lucide-react'

const ArtistCard = ({ artist }) => {
	const [imageError, setImageError] = useState(false)

	return (
		<div className="flex flex-col items-center gap-3 cursor-pointer group">
			<div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-gray-800 group-hover:border-primary transition bg-gray-800">
				{imageError ? (
					<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
						<User className="w-12 h-12 text-gray-600" />
					</div>
				) : (
					<img 
						src={artist.image} 
						alt={artist.name} 
						className="w-full h-full object-cover group-hover:scale-110 transition"
						onError={() => setImageError(true)}
					/>
				)}
			</div>
			<h3 className="text-white text-sm md:text-base font-semibold text-center">{artist.name}</h3>
		</div>
	)
}

export default ArtistCard
