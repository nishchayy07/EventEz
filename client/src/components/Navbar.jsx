import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { MenuIcon, SearchIcon, TicketPlus, XIcon, MapPin } from 'lucide-react'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { useAppContext } from '../context/AppContext'
import LocationSelector from './LocationSelector'
import { useEffect } from 'react'

const Navbar = () => {

 const [isOpen, setIsOpen] = useState(false)
 const [isLocationOpen, setIsLocationOpen] = useState(false)
 const [isSearchOpen, setIsSearchOpen] = useState(false)
 const [searchQuery, setSearchQuery] = useState('')
 const [suggestions, setSuggestions] = useState([])
 const [loading, setLoading] = useState(false)
 const {user} = useUser()
 const {openSignIn} = useClerk()

 const navigate = useNavigate()

 const {favoriteMovies, selectedLocation, updateLocation, axios} = useAppContext()

 const handleSearch = (e) => {
   e.preventDefault()
   if (searchQuery.trim()) {
     // Navigate to a search results page or filter current page
     navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
     setIsSearchOpen(false)
     setSearchQuery('')
     setSuggestions([])
   }
 }

 // Fetch suggestions as user types
 useEffect(() => {
   const fetchSuggestions = async () => {
     if (searchQuery.trim().length < 2) {
       setSuggestions([])
       return
     }

     setLoading(true)
     try {
       const searchTerm = searchQuery.toLowerCase()
       
       // Fetch data from all categories
       const [moviesRes, sportsRes, nightlifeRes] = await Promise.all([
         axios.get('/api/show/all').catch(() => ({ data: { shows: [] } })),
         axios.get('/api/sports/all-events', { params: { showAll: 'true' } }).catch(() => ({ data: { events: [] } })),
         axios.get('/api/nightlife/events', { params: { showAll: 'true' } }).catch(() => ({ data: { events: [] } }))
       ])

       const results = []

       // Filter movies
       console.log('Movies response:', moviesRes.data);
       console.log('Total shows:', moviesRes.data.shows?.length);
       
       const seenMovieIds = new Set();
       moviesRes.data.shows?.forEach(show => {
         console.log('Checking movie:', show.movie?.title, 'against search term:', searchTerm);
         const matchesSearch = show.movie?.title?.toLowerCase().includes(searchTerm) || 
                              show.movie?.original_title?.toLowerCase().includes(searchTerm);
         
         if (matchesSearch && !seenMovieIds.has(show.movie.id)) {
           seenMovieIds.add(show.movie.id);
           console.log('✅ Match found:', show.movie.title);
           results.push({
             type: 'movie',
             title: show.movie.title,
             id: show.movie.id,
             image: `https://image.tmdb.org/t/p/w92${show.movie.poster_path}`
           })
         }
       })

       // Filter sports
       sportsRes.data.events?.forEach(event => {
         if (event.title?.toLowerCase().includes(searchTerm) || 
             event.sport?.toLowerCase().includes(searchTerm)) {
           results.push({
             type: 'sport',
             title: event.title,
             id: event._id,
             subtitle: event.sport,
             image: event.image,
             sportType: event.sport?.toLowerCase() // Add sport type for routing
           })
         }
       })

       // Filter nightlife
       nightlifeRes.data.events?.forEach(event => {
         if (event.title?.toLowerCase().includes(searchTerm) || 
             event.artist?.toLowerCase().includes(searchTerm) ||
             event.category?.toLowerCase().includes(searchTerm)) {
           results.push({
             type: 'nightlife',
             title: event.title,
             id: event._id,
             subtitle: event.artist || event.category,
             image: event.image
           })
         }
       })

       setSuggestions(results.slice(0, 8)) // Limit to 8 suggestions
     } catch (error) {
       console.error('Error fetching suggestions:', error)
     } finally {
       setLoading(false)
     }
   }

   const debounce = setTimeout(() => {
     fetchSuggestions()
   }, 300)

   return () => clearTimeout(debounce)
 }, [searchQuery, axios])

 // Handle ESC key to close search
 useEffect(() => {
   const handleEscape = (e) => {
     if (e.key === 'Escape' && isSearchOpen) {
       setIsSearchOpen(false)
       setSearchQuery('')
       setSuggestions([])
     }
   }
   
   document.addEventListener('keydown', handleEscape)
   return () => document.removeEventListener('keydown', handleEscape)
 }, [isSearchOpen])

  return (
    <>
    <div className='fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5'>
      {/* Left Section - Logo and Location */}
      <div className='flex items-center gap-4 flex-1'>
        <Link to='/'>
          <img src={assets.logo} alt="" className='w-36 h-auto'/>
        </Link>

        {/* Location Button */}
        <button 
          onClick={() => setIsLocationOpen(true)}
          className='hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition border border-gray-300/20'
        >
          <MapPin className='w-4 h-4 text-primary' />
          <div className='text-left'>
            <p className='text-white text-sm font-semibold'>{selectedLocation}</p>
          </div>
        </button>
      </div>

      {/* Center Section - Navigation Links */}
      <div className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20 overflow-hidden transition-[width] duration-300 ${isOpen ? 'max-md:w-full' : 'max-md:w-0'}`}>

        <XIcon className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer' onClick={()=> setIsOpen(!isOpen)}/>

        <Link onClick={()=> {scrollTo(0,0); setIsOpen(false)}} to='/'>Home</Link>
        <Link onClick={()=> {scrollTo(0,0); setIsOpen(false)}} to='/movies'>Movies</Link>
        <Link onClick={()=> {scrollTo(0,0); setIsOpen(false)}} to='/sports'>Sports</Link>
        <Link onClick={()=> {scrollTo(0,0); setIsOpen(false)}} to='/nightlife'>Nightlife</Link>
        {/* <Link onClick={()=> {scrollTo(0,0); setIsOpen(false)}} to='/admin'>Admin</Link> */}
       {favoriteMovies.length > 0 && <Link onClick={()=> {scrollTo(0,0); setIsOpen(false)}} to='/favorite'>Favorites</Link>}
      </div>

    {/* Right Section - Search, Login, Menu */}
    <div className='flex items-center gap-4 flex-1 justify-end'>
        {/* Search Icon - Opens Search Bar */}
        <button 
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className='max-md:hidden p-2 rounded-full hover:bg-white/10 transition-all'
          aria-label='Search'
        >
          <SearchIcon className='w-5 h-5'/>
        </button>
        
        {
            !user ? (
                <button onClick={openSignIn} className='px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>Login</button>
            ) : (
                <UserButton>
                    <UserButton.MenuItems>
                        <UserButton.Action label="My Bookings" labelIcon={<TicketPlus width={15}/>} onClick={()=> navigate('/my-bookings')}/>
                    </UserButton.MenuItems>
                </UserButton>
            )
        }
        
    </div>

    <MenuIcon className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer' onClick={()=> setIsOpen(!isOpen)}/>

    </div>

    {/* Search Bar Overlay */}
    {isSearchOpen && (
      <div className='fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-24 px-4'>
        <div className='w-full max-w-2xl'>
          <div className='bg-card/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden'>
            <form onSubmit={handleSearch} className='relative'>
              <SearchIcon className='absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400' />
              <input
                type='text'
                placeholder='Search for movies, sports events, nightlife, venues...'
                className='w-full pl-16 pr-16 py-5 bg-transparent text-lg outline-none text-white placeholder:text-gray-400'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button
                type='button'
                onClick={() => {
                  setIsSearchOpen(false)
                  setSearchQuery('')
                }}
                className='absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full transition'
              >
                <XIcon className='w-5 h-5' />
              </button>
            </form>
            
            {/* Search Suggestions */}
            <div className='border-t border-white/10'>
              {searchQuery.trim() === '' ? (
                <div className='p-4'>
                  <p className='text-sm text-gray-400 mb-3'>Popular searches</p>
                  <div className='flex flex-wrap gap-2'>
                    {['Comedy Shows', 'Concerts', 'Sports Events', 'Theatre'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          setSearchQuery(tag)
                          handleSearch({ preventDefault: () => {} })
                        }}
                        className='px-3 py-1.5 text-sm bg-white/5 hover:bg-white/10 rounded-full transition border border-white/10'
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className='max-h-96 overflow-y-auto'>
                  {loading ? (
                    <div className='p-8 text-center text-gray-400'>
                      <div className='animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto'></div>
                    </div>
                  ) : suggestions.length > 0 ? (
                    <div className='p-2'>
                      {suggestions.map((item, index) => (
                        <button
                          key={`${item.type}-${item.id}-${index}`}
                          onClick={() => {
                            if (item.type === 'movie') {
                              navigate(`/movies/${item.id}`)
                            } else if (item.type === 'sport') {
                              // Route based on sport type
                              const sportType = item.sportType || '';
                              if (sportType === 'chess') {
                                navigate(`/sports/chess/${item.id}`)
                              } else if (sportType === 'running') {
                                navigate(`/sports/running/${item.id}`)
                              } else {
                                navigate(`/sports/seat/${item.id}`)
                              }
                            } else if (item.type === 'nightlife') {
                              navigate(`/nightlife/${item.id}`)
                            }
                            setIsSearchOpen(false)
                            setSearchQuery('')
                            setSuggestions([])
                          }}
                          className='w-full flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg transition text-left'
                        >
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className='w-12 h-12 object-cover rounded'
                          />
                          <div className='flex-1 min-w-0'>
                            <p className='font-medium truncate'>{item.title}</p>
                            {item.subtitle && (
                              <p className='text-sm text-gray-400 truncate'>{item.subtitle}</p>
                            )}
                          </div>
                          <span className='text-xs px-2 py-1 rounded-full bg-primary/20 text-primary capitalize'>
                            {item.type}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className='p-8 text-center text-gray-400'>
                      <p className='text-sm mb-3'>No suggestions found for "{searchQuery}"</p>
                      <button
                        onClick={() => {
                          handleSearch({ preventDefault: () => {} })
                        }}
                        className='px-4 py-2 bg-primary hover:bg-primary-dull rounded-lg text-sm transition text-white'
                      >
                        See all results for "{searchQuery}"
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Click outside to close */}
          <button 
            onClick={() => {
              setIsSearchOpen(false)
              setSearchQuery('')
            }}
            className='mt-4 text-gray-400 hover:text-white transition text-sm'
          >
            Press ESC or click here to close
          </button>
        </div>
      </div>
    )}

    {/* Location Selector Modal */}
    <LocationSelector 
      isOpen={isLocationOpen}
      onClose={() => setIsLocationOpen(false)}
      selectedCity={selectedLocation}
      onSelectCity={(city) => {
        updateLocation(city);
        setIsLocationOpen(false);
      }}
    />
    </>
  )
}

export default Navbar
