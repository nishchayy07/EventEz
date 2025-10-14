import { StarIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import timeFormat from '../lib/timeFormat'
import { useAppContext } from '../context/AppContext'

const MovieCard = ({ movie }) => {

  const navigate = useNavigate()
  const { image_base_url } = useAppContext()

  // Defensive accessors to support both API movie objects and local sample objects
  const id = movie?._id || movie?.id || null
  const title = movie?.title || movie?.name || 'Untitled'
  const imageSrc = movie?.backdrop_path ? (image_base_url + movie.backdrop_path) : (movie?.image || movie?.poster || '')

  const releaseYear = movie?.release_date ? new Date(movie.release_date).getFullYear() : (movie?.year || '')

  let genresText = ''
  if (Array.isArray(movie?.genres)) {
    try {
      genresText = movie.genres.slice(0, 2).map(g => (g.name || g)).join(' | ')
    } catch (e) {
      genresText = ''
    }
  } else if (typeof movie?.genres === 'string') {
    genresText = movie.genres
  } else if (movie?.language) {
    genresText = movie.language
  }

  const runtimeText = movie?.runtime ? timeFormat(movie.runtime) : (movie?.duration || '')
  const ratingValue = typeof movie?.vote_average === 'number' ? movie.vote_average : (movie?.rating || 0)

  const handleNavigate = () => {
    if (id) {
      navigate(`/movies/${id}`)
      scrollTo(0, 0)
    }
  }

  return (
    <div className='flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-66'>

      <img onClick={handleNavigate}
        src={imageSrc} alt={title} className='rounded-lg h-52 w-full object-cover object-right-bottom cursor-pointer' />

      <p className='font-semibold mt-2 truncate'>{title}</p>

      <p className='text-sm text-gray-400 mt-2'>
        {releaseYear} {releaseYear && genresText ? ' • ' : ''} {genresText} {genresText && runtimeText ? ' • ' : ''} {runtimeText}
      </p>

      <div className='flex items-center justify-between mt-4 pb-3'>
        <button onClick={handleNavigate} className='px-4 py-2 text-xs bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer' disabled={!id}>
          Buy Tickets
        </button>

        <p className='flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1'>
          <StarIcon className="w-4 h-4 text-primary fill-primary" />
          {Number(ratingValue).toFixed(1)}
        </p>
      </div>

    </div>
  )
}

export default MovieCard
