import React, { useMemo, useState, useEffect } from 'react'
import { Calendar, MapPin, Trophy, Search, Filter, Star, Ticket } from 'lucide-react'
import { useAppContext } from '../context/AppContext';
import Loading from './Loading';

// Hardcoded sports categories
const sportCategories = [
  { id: "1", name: "Cricket", image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500" },
  { id: "2", name: "Football", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500" },
  { id: "3", name: "Basketball", image: "https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?w=500" },
  { id: "4", name: "Tennis", image: "https://images.unsplash.com/photo-1595435742656-5272d0b3fa82?w=500" },
  { id: "5", name: "Badminton", image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500" },
  { id: "6", name: "Chess", image: "https://images.unsplash.com/photo-1560174038-da43ac74f01b?w=500" },
  { id: "7", name: "Running", image: "https://images.unsplash.com/photo-1483721310020-03333e577078?w=500" },
  { id: "8", name: "Cycling", image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500" },
];

const SportShine = () => {
  const { axios, selectedLocation } = useAppContext();
  const [selectedSport, setSelectedSport] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero images for the carousel
  const heroImages = [
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1920&h=1080&fit=crop'
  ];

  // Auto-slide effect
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(slideInterval);
  }, [heroImages.length]);

  // Fetch events from database
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('/api/sports/all-events', { 
          params: { showAll: 'true' } 
        });
        console.log('🏀 Sports API Response:', data);
        console.log('🏀 Number of events:', data.events?.length);
        if (data.success && data.events) {
          // Convert database events to match the expected format
          const formattedEvents = data.events.map(event => ({
            idTeam: event._id,
            strTeam: event.title,
            strSport: event.sport,
            strStadium: event.venue,
            strCountry: event.venue,
            strLeague: event.sport,
            intFormedYear: new Date(event.showDateTime).getFullYear().toString(),
            strBadge: event.image,
            price: event.price,
            showDateTime: event.showDateTime
          }));
          
          // Filter by selected sport
          if (selectedSport === 'all') {
            setUpcomingEvents(formattedEvents);
          } else {
            const filtered = formattedEvents.filter(event => 
              event.strSport.toLowerCase() === selectedSport.toLowerCase()
            );
            setUpcomingEvents(filtered);
          }
        }
      } catch (error) {
        console.error('Error fetching sport events:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [selectedSport, selectedLocation, axios]);

  const filteredEvents = useMemo(() => {
    if (!Array.isArray(upcomingEvents)) {
      return [];
    }
    if (!searchQuery) return upcomingEvents;
    
    return upcomingEvents.filter((e) => {
      const s = searchQuery.toLowerCase()
      return e.strTeam?.toLowerCase().includes(s) || 
             e.strStadium?.toLowerCase().includes(s) || 
             e.strLeague?.toLowerCase().includes(s) || 
             e.strCountry?.toLowerCase().includes(s)
    });
  }, [searchQuery, upcomingEvents])

  if (loading) {
    return <Loading />;
  }
  
  return (
    <div className='mt-16'>
      <section className='relative h-[48vh] md:h-[56vh] flex items-center justify-center overflow-hidden rounded-2xl ring-1 ring-white/10'>
        {/* Carousel Images */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url('${image}')` }}
          />
        ))}
        
        {/* Gradient Overlay */}
        <div className='absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background' />
        
        {/* Content */}
        <div className='relative z-10 text-center px-4 max-w-3xl mx-auto'>
          <div className='inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-primary/20 text-primary ring-1 ring-primary/30'>
            <Trophy className='w-4 h-4' />
            <span className='text-xs font-medium'>Live Sports Experience</span>
          </div>
          <h1 className='text-4xl md:text-6xl font-bold mb-4'>Experience Sports Live</h1>
          <p className='text-base md:text-lg text-gray-300 mb-6'>Book tickets for the biggest sporting events. From cricket to football, witness the action live!</p>
          <button className='px-5 py-2 rounded-full bg-primary hover:bg-primary-dull transition'>Browse Events</button>
        </div>

        {/* Slide Indicators */}
        <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20'>
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? 'bg-primary w-8' : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </section>

      <section className='py-10'>
        <div className='mb-6'>
          <h2 className='text-2xl md:text-3xl font-semibold mb-1'>Popular Sports</h2>
          <p className='text-gray-400'>Choose your favorite sport and explore upcoming events</p>
        </div>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
          {sportCategories.map((c) => (
            <div key={c.id} className='group relative overflow-hidden rounded-xl ring-1 ring-white/10 bg-card/50 hover:ring-primary transition-all cursor-pointer'
              onClick={() => setSelectedSport(c.name)}>
              <div className='relative h-36'>
                <img src={c.image} alt={c.name} className='absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' />
                <div className='absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent' />
                <div className='absolute bottom-2 left-2 right-2'>
                  <h3 className='text-base font-semibold'>{c.name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className='py-8'>
        <div className='mb-6 space-y-4'>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
              <input
                type='text'
                placeholder='Search events, venues, or locations...'
                className='w-full pl-10 pr-3 py-2 rounded-md bg-white/5 ring-1 ring-white/10 focus:ring-primary outline-none'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className='px-4 py-2 rounded-md ring-1 ring-white/10 hover:bg-white/10 transition'><Filter className='w-4 h-4 inline-block mr-2' />More Filters</button>
          </div>
          <div className='flex gap-2 overflow-x-auto'>
            <button onClick={() => setSelectedSport('all')} className={`px-3 py-1.5 rounded-full text-sm ring-1 ring-white/10 ${selectedSport==='all' ? 'bg-primary text-white' : 'bg-white/5 text-gray-200'}`}>All Sports</button>
            {sportCategories.map((c) => (
              <button key={c.id} onClick={() => setSelectedSport(c.name)} className={`px-3 py-1.5 rounded-full text-sm ring-1 ring-white/10 ${selectedSport===c.name ? 'bg-primary text-white' : 'bg-white/5 text-gray-200'}`}>{c.name}</button>
            ))}
          </div>
        </div>

        {filteredEvents.length > 0 ? (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {filteredEvents.map((team) => (
              <div key={team.idTeam} className='group overflow-hidden rounded-xl ring-1 ring-white/10 bg-card/50 hover:ring-primary transition-all'>
                <div className='flex flex-col sm:flex-row'>
                  <div className='relative sm:w-2/5 h-56 sm:h-64 overflow-hidden bg-white/5'>
                    <img src={team.strBadge || team.strLogo || 'https://via.placeholder.com/400x400?text=No+Image'} alt={team.strTeam} className='absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' />
                    <div className='absolute inset-0 bg-gradient-to-t from-card/80 to-transparent sm:bg-gradient-to-r' />
                    <div className='absolute top-3 left-3 right-3 flex justify-between items-start'>
                      <span className='px-2 py-0.5 rounded bg-black/50 text-xs'>{team.strSport}</span>
                    </div>
                  </div>
                  <div className='p-5 sm:w-3/5 flex flex-col'>
                    <h3 className='text-lg font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors'>{team.strTeam}</h3>
                    <div className='space-y-2 mb-4 flex-grow text-gray-300'>
                      <div className='flex items-start text-sm'>
                        <MapPin className='w-4 h-4 mr-2 text-primary flex-shrink-0 mt-0.5' />
                        <span className='line-clamp-2'>{team.strStadium || 'Stadium info not available'}, {team.strCountry}</span>
                      </div>
                      {team.intFormedYear && (
                        <div className='flex items-center text-sm'>
                          <Calendar className='w-4 h-4 mr-2 text-primary flex-shrink-0' />
                          Founded in {team.intFormedYear}
                        </div>
                      )}
                      <div className='flex items-center text-sm'>
                        <Trophy className='w-4 h-4 mr-2 text-primary flex-shrink-0' />
                        {team.strLeague || 'League info not available'}
                      </div>
                    </div>
                    <div className='flex items-center justify-between pt-4 border-t border-white/10'>
                      <div>
                        <p className='text-xs text-gray-400'>Ticket Price</p>
                        <p className='text-lg font-bold text-primary'>₹{team.price}</p>
                      </div>
                      <button
                        className='px-3 py-1.5 rounded-md bg-primary hover:bg-primary-dull transition'
                        onClick={async () => {
                          try {
                            const sport = team.strSport?.toLowerCase()
                            const isChess = sport === 'chess'
                            const isRunning = sport === 'running'
                            
                            // If event has showDateTime, it's from database - navigate to appropriate booking page
                            if (team.showDateTime && team.idTeam) {
                              if (isChess) {
                                window.location.href = `/sports/chess/${team.idTeam}`;
                              } else if (isRunning) {
                                window.location.href = `/sports/running/${team.idTeam}`;
                              } else {
                                window.location.href = `/sports/seat/${team.idTeam}`;
                              }
                            } else {
                              // Fallback: create a new event instance for hardcoded data
                              const payload = {
                                title: team.strTeam,
                                sport: team.strSport || 'Sport',
                                venue: team.strStadium || '',
                                image: team.strBadge || team.strLogo || '',
                                price: team.price || 20,
                              };
                              const { data } = await axios.post('/api/sports/event', payload);
                              if (data.success) {
                                if (isChess) {
                                  window.location.href = `/sports/chess/${data.event._id}`
                                } else if (isRunning) {
                                  window.location.href = `/sports/running/${data.event._id}`
                                } else {
                                  window.location.href = `/sports/seat/${data.event._id}`
                                }
                              }
                            }
                          } catch (e) {
                            console.error(e)
                          }
                        }}
                      >
                        Book Tickets
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='p-10 text-center rounded-xl ring-1 ring-white/10 bg-card/50'>
            <Trophy className='w-12 h-12 mx-auto mb-3 text-gray-400' />
            <h3 className='text-xl font-semibold mb-1'>No teams found</h3>
            <p className='text-gray-400 mb-4'>Try adjusting your search or filter criteria</p>
            <button onClick={() => { setSelectedSport('all'); setSearchQuery('') }} className='px-4 py-2 rounded-md ring-1 ring-white/10 hover:bg-white/10 transition'>Clear Filters</button>
          </div>
        )}
      </section>
    </div>
  )
}

export default SportShine


