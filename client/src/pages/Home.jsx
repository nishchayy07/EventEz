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
  const { axios, shows, image_base_url } = useAppContext()
  const navigate = useNavigate()
  const [sportsEvents, setSportsEvents] = useState([])
  const [nightlifeEvents, setNightlifeEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [sportsRes, nightlifeRes] = await Promise.all([
          axios.get('/api/sports/all-events').catch(() => ({ data: { events: [] } })),
          axios.get('/api/nightlife/events').catch(() => ({ data: { events: [] } }))
        ])
        
        setSportsEvents(sportsRes.data?.events || [])
        setNightlifeEvents(nightlifeRes.data?.events || [])
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  if (loading) return <Loading />

  return (
    <div className="min-h-screen pb-20">
      <div className="px-6 md:px-16 lg:px-40 pt-24 pb-12">
        <HeroCarousel slides={heroSlides} />
      </div>

      <main className="px-6 md:px-16 lg:px-40 space-y-12">
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
                <div key={show._id} className="w-[220px] flex-shrink-0">
                  <div 
                    onClick={() => navigate(`/movie-details/${show._id}`)}
                    className="group relative rounded-lg overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105"
                  >
                    <img 
                      src={image_base_url + show.poster_path} 
                      alt={show.title}
                      className="w-full h-80 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                      <h4 className="text-white font-semibold text-lg line-clamp-1">{show.title}</h4>
                      <p className="text-gray-300 text-sm">{show.genres?.map(g => g.name).join(', ')}</p>
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
              <h3 className="text-2xl font-semibold text-white">Upcoming Sports Events</h3>
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
                  onClick={() => navigate(`/sports-seat-layout/${event._id}`)}
                  className="w-[280px] flex-shrink-0 cursor-pointer"
                >
                  <div className="group relative rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
                    <img 
                      className="w-full h-48 object-cover" 
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
                        ${event.price}
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
              <h3 className="text-2xl font-semibold text-white">Nightlife & Entertainment</h3>
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
                  onClick={() => navigate('/nightlife')}
                  className="w-[280px] flex-shrink-0 cursor-pointer"
                >
                  <div className="group relative rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
                    <img 
                      className="w-full h-48 object-cover" 
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
                        ${event.price}
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
