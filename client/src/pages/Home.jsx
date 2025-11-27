import React, { useEffect, useState } from 'react'
import HeroCarousel from '../components/HeroCarousel'
import Loading from '../components/Loading'
import { heroSlides } from '../assets/homeData'
import { useAppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const SectionHeader = ({ title }) => (
  <div className="mb-6">
    <h3 className="text-2xl font-semibold text-white">{title}</h3>
  </div>
)

const Home = () => {
  const { axios, shows, image_base_url, selectedLocation } = useAppContext()
  const navigate = useNavigate()
  const [sportsEvents, setSportsEvents] = useState([])
  const [nightlifeEvents, setNightlifeEvents] = useState([])
  const [heroEvents, setHeroEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [hasLocationBasedSports, setHasLocationBasedSports] = useState(false)
  const [hasLocationBasedNightlife, setHasLocationBasedNightlife] = useState(false)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch all events for hero carousel (location-independent)
        const [heroSportsRes, heroNightlifeRes] = await Promise.all([
          axios.get('/api/sports/all-events', { 
            params: { showAll: 'true' } 
          }).catch(() => ({ data: { events: [] } })),
          axios.get('/api/nightlife/events', { 
            params: { showAll: 'true' } 
          }).catch(() => ({ data: { events: [] } }))
        ]);
        
        const allSportsEvents = heroSportsRes.data?.events || [];
        const allNightlifeEvents = heroNightlifeRes.data?.events || [];
        
        // Now fetch location-based events for the sections below
        let sportsEvents = [];
        let nightlifeEvents = [];
        let foundLocationBasedSports = false;
        let foundLocationBasedNightlife = false;
        
        if (selectedLocation) {
          // Try fetching events for the selected location
          const [sportsRes, nightlifeRes] = await Promise.all([
            axios.get('/api/sports/all-events', { 
              params: { location: selectedLocation, showAll: 'true' } 
            }).catch(() => ({ data: { events: [] } })),
            axios.get('/api/nightlife/events', { 
              params: { location: selectedLocation, showAll: 'true' } 
            }).catch(() => ({ data: { events: [] } }))
          ]);
          
          sportsEvents = sportsRes.data?.events || [];
          nightlifeEvents = nightlifeRes.data?.events || [];
          
          // Check if we found location-based events
          if (sportsEvents.length > 0) foundLocationBasedSports = true;
          if (nightlifeEvents.length > 0) foundLocationBasedNightlife = true;
        }
        
        // Fallback: If no location set OR no events found, fetch all events
        if (!selectedLocation || (sportsEvents.length === 0 && nightlifeEvents.length === 0)) {
          sportsEvents = allSportsEvents;
          nightlifeEvents = allNightlifeEvents;
          foundLocationBasedSports = false;
          foundLocationBasedNightlife = false;
        }
        
        setSportsEvents(sportsEvents);
        setNightlifeEvents(nightlifeEvents);
        setHasLocationBasedSports(foundLocationBasedSports);
        setHasLocationBasedNightlife(foundLocationBasedNightlife);
        
        // Create hero slides from ALL events (location-independent for hero)
        // Only show these 3 specific events
        const indVsEngEvent = allSportsEvents.find(event => 
          event.title?.toLowerCase().includes('india') && 
          event.title?.toLowerCase().includes('england') &&
          event.title?.toLowerCase().includes('test')
        );
        
        const samayRainaEvent = allNightlifeEvents.find(event =>
          event.title?.toLowerCase().includes('samay') &&
          event.title?.toLowerCase().includes('raina')
        );
        
        const bengaluruMumbaiEvent = allSportsEvents.find(event =>
          event.title?.toLowerCase().includes('bengaluru') &&
          event.title?.toLowerCase().includes('mumbai')
        );
        
        const featuredEvents = [
          // India vs England Test as first slide
          ...(indVsEngEvent ? [{
            id: indVsEngEvent._id,
            title: indVsEngEvent.title,
            subtitle: `${indVsEngEvent.sport} • ${indVsEngEvent.venue}`,
            price: `₹${indVsEngEvent.price} onwards`,
            badge: 'Live Test Match',
            image: indVsEngEvent.image,
            type: 'sports'
          }] : []),
          // Samay Raina event as second slide
          ...(samayRainaEvent ? [{
            id: samayRainaEvent._id,
            title: samayRainaEvent.title,
            subtitle: samayRainaEvent.category,
            price: samayRainaEvent.price,
            badge: samayRainaEvent.duration || 'Comedy Special',
            image: samayRainaEvent.landscapeImage || samayRainaEvent.image,
            type: 'nightlife'
          }] : []),
          // Bengaluru vs Mumbai City FC as third slide
          ...(bengaluruMumbaiEvent ? [{
            id: bengaluruMumbaiEvent._id,
            title: bengaluruMumbaiEvent.title,
            subtitle: `${bengaluruMumbaiEvent.sport} • ${bengaluruMumbaiEvent.venue}`,
            price: `₹${bengaluruMumbaiEvent.price} onwards`,
            badge: 'Live Football Match',
            image: bengaluruMumbaiEvent.image,
            type: 'sports'
          }] : [])
        ];
        setHeroEvents(featuredEvents.length > 0 ? featuredEvents : heroSlides);
      } catch (error) {
        console.error('Error fetching events:', error)
        setHeroEvents(heroSlides);
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [selectedLocation, axios])

  if (loading) return <Loading />

  return (
    <div className="min-h-screen pb-20">
      <div className="px-6 md:px-16 lg:px-40 pt-24 pb-12">
        <HeroCarousel slides={heroEvents} onSlideClick={(slide) => {
          if (slide.type === 'nightlife') {
            navigate(`/nightlife/${slide.id}`);
          } else if (slide.type === 'sports') {
            navigate(`/sports/seat/${slide.id}`);
          }
        }} />
      </div>

      <main className="px-6 md:px-16 lg:px-40 space-y-12">
        {/* For You Header */}
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold text-white">For You</h2>
          {selectedLocation && (
            <span className="text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full">
              📍 {selectedLocation}
            </span>
          )}
        </div>
        {/* Movies Section */}
        {shows && shows.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-white">Now Showing Movies</h3>
              <button 
                onClick={() => navigate('/movies')}
                className="text-primary hover:text-primary-dull transition-colors text-sm font-medium"
              >
                View All →
              </button>
            </div>
            <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
              {shows.slice(0, 8).map((show) => (
                <div 
                  key={show._id} 
                  className="w-[220px] flex-shrink-0 cursor-pointer"
                  onClick={() => navigate(`/movies/${show.movie?.id || show._id}`)}
                >
                  <div className="group relative rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105">
                    <img 
                      src={image_base_url + (show.movie?.poster_path || show.poster_path)} 
                      alt={show.movie?.title || show.title}
                      className="w-full h-80 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                      <h4 className="text-white font-semibold text-lg line-clamp-1">{show.movie?.title || show.title}</h4>
                      <p className="text-gray-300 text-sm">{(show.movie?.genres || show.genres)?.map(g => g.name).join(', ')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Sports Events Section */}
        {sportsEvents.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-white">
                {hasLocationBasedSports ? 'Sports Events Near You' : 'Upcoming Sports Events'}
              </h3>
              <button 
                onClick={() => navigate('/sports')}
                className="text-primary hover:text-primary-dull transition-colors text-sm font-medium"
              >
                View All →
              </button>
            </div>
            <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
              {sportsEvents.slice(0, 8).map((event) => (
                <div 
                  key={event._id} 
                  className="w-[220px] flex-shrink-0 cursor-pointer"
                  onClick={() => navigate(`/sports/seat/${event._id}`)}
                >
                  <div className="group relative rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
                    <img 
                      className="w-full h-80 object-cover" 
                      src={event.image || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500'} 
                      alt={event.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-xl font-semibold text-white mb-1 line-clamp-1">
                        {event.title}
                      </h3>
                      <p className="text-gray-300 text-sm mb-1">
                        {event.sport} • {event.venue}
                      </p>
                      <p className="text-primary text-sm font-semibold">
                        ₹{event.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Nightlife Events Section */}
        {nightlifeEvents.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-white">
                {hasLocationBasedNightlife ? 'Nightlife & Entertainment Near You' : 'Nightlife & Entertainment'}
              </h3>
              <button 
                onClick={() => navigate('/nightlife')}
                className="text-primary hover:text-primary-dull transition-colors text-sm font-medium"
              >
                View All →
              </button>
            </div>
            <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
              {nightlifeEvents.slice(0, 8).map((event) => (
                <div 
                  key={event._id} 
                  onClick={() => navigate(`/nightlife/${event._id}`)}
                  className="w-[220px] flex-shrink-0 cursor-pointer"
                >
                  <div className="group relative rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
                    <img 
                      className="w-full h-80 object-cover" 
                      src={event.image || 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500'} 
                      alt={event.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-xl font-semibold text-white mb-1 line-clamp-1">
                        {event.title}
                      </h3>
                      <p className="text-gray-300 text-sm mb-1">
                        {event.category} • {event.venue}
                      </p>
                      <p className="text-primary text-sm font-semibold">
                        {event.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default Home
