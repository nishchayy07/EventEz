import React, { useMemo, useState, useEffect } from 'react'
import { Calendar, MapPin, Music, Search, Filter, Trophy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Loading from './Loading';
import PopularNightlife from './PopularNightlife';
import { NIGHTLIFE_CATEGORIES } from './NightlifeCategories';
import { useAppContext } from '../context/AppContext';

const NightlifeShine = () => {
  const navigate = useNavigate();
  const { axios, selectedLocation } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [nightlifeCategories, setNightlifeCategories] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const eventsRef = React.useRef(null);

  // Hero images for the carousel (nightlife-themed)
   const heroImages = [
    'https://images.mid-day.com/images/images/2024/dec/dilmusic-16_d.jpg',
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1920&h=1080&fit=crop',
    'https://www.franco-media.com/wp-content/uploads/2024/10/Maya-Beach-Club-Phuket-22.jpg',
  ];

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [heroImages.length]);

  useEffect(() => {
    const fetchNightlifeData = async () => {
      setLoading(true);
      try {
        // Fetch categories
        const defaultCategories = NIGHTLIFE_CATEGORIES;
        setNightlifeCategories(defaultCategories);

        // Fetch all events from API
        const { data } = await axios.get('/api/nightlife/events', { 
          params: { showAll: 'true' } 
        });
        console.log('🎉 Nightlife API Response:', data);
        console.log('🎉 Number of events:', data.events?.length);
        console.log('🎉 Selected Location:', selectedLocation);
        
        if (data.success && data.events) {
          // Map API data to match frontend format
          let mappedEvents = data.events.map(event => ({
            id: event._id,
            title: event.title,
            venue: event.venue,
            location: event.location,
            date: event.showDateTime,
            price: event.price,
            image: event.image,
            landscapeImage: event.landscapeImage,
            category: event.category,
            description: event.description,
            artist: event.artist,
            artistImage: event.artistImage,
            duration: event.duration,
            ageRestriction: event.ageRestriction
          }));
          
          // Smart sorting: events matching selected location come first
          if (selectedLocation) {
            mappedEvents.sort((a, b) => {
              const aMatches = a.location?.toLowerCase().includes(selectedLocation.toLowerCase()) ||
                              a.venue?.toLowerCase().includes(selectedLocation.toLowerCase());
              const bMatches = b.location?.toLowerCase().includes(selectedLocation.toLowerCase()) ||
                              b.venue?.toLowerCase().includes(selectedLocation.toLowerCase());
              
              if (aMatches && !bMatches) return -1;
              if (!aMatches && bMatches) return 1;
              return 0;
            });
          }
          
          setUpcomingEvents(mappedEvents);
        } else {
          console.error('Failed to fetch events:', data.message);
          setUpcomingEvents([]);
        }
      } catch (error) {
        console.error('Error fetching nightlife data:', error);
        setUpcomingEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNightlifeData();
  }, [axios, selectedLocation]);

  const filteredEvents = useMemo(() => {
    if (!Array.isArray(upcomingEvents)) return [];
    const q = searchQuery.toLowerCase();
    return upcomingEvents.filter((e) => {
      const name = (e.name || e.title || '').toString().toLowerCase();
      const venueName = (e.venue?.name || e.venue || '').toString().toLowerCase();
      const place = (e.venue?.location || e.location || '').toString().toLowerCase();
      const category = (e.category || '').toString().toLowerCase();
      const matchesQuery = name.includes(q) || venueName.includes(q) || place.includes(q);
      const matchesCategory = selectedCategory === 'all' || (selectedCategory && (category.includes(selectedCategory.toLowerCase()) || (e.venue?.name || '').toString().toLowerCase().includes(selectedCategory.toLowerCase()) || selectedCategory.toLowerCase() === 'all'));
      return matchesQuery && matchesCategory;
    });
  }, [searchQuery, upcomingEvents, selectedCategory]);

  if (loading) return <Loading />;

  return (
    <div className='mt-16'>
      <section className='relative h-[48vh] md:h-[56vh] flex items-center justify-center overflow-hidden rounded-2xl ring-1 ring-white/10'>
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundImage: `url('${image}')` }}
          />
        ))}

        <div className='absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background' />

        <div className='relative z-10 text-center px-4 max-w-3xl mx-auto'>
          <div className='inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-primary/20 text-primary ring-1 ring-primary/30'>
            <Music className='w-4 h-4' />
            <span className='text-xs font-medium'>Live Nightlife Experience</span>
          </div>
          <h1 className='text-4xl md:text-6xl font-bold mb-4'>Experience Nightlife Live</h1>
          <p className='text-base md:text-lg text-gray-300 mb-6'>Book tickets for concerts, club nights, and live shows happening near you.</p>
          <button 
            className='px-5 py-2 rounded-full bg-primary hover:bg-primary-dull transition'
            onClick={() => {
              eventsRef.current?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Browse Events
          </button>
        </div>

        <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20'>
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? 'bg-primary w-8' : 'bg-white/50 hover:bg-white/70'}`}
            />
          ))}
        </div>
      </section>

  <PopularNightlife categories={nightlifeCategories} onCategorySelect={setSelectedCategory} />

      <section ref={eventsRef} className='py-8'>
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
          </div>
          <div className='flex gap-2 overflow-x-auto'>
            <button onClick={() => setSelectedCategory('all')} className={`px-3 py-1.5 rounded-full text-sm ring-1 ring-white/10 ${selectedCategory==='all' ? 'bg-primary text-white' : 'bg-white/5 text-gray-200'}`}>All</button>
            {nightlifeCategories.map((c) => (
              <button key={c.id || c._id || c.name} onClick={() => setSelectedCategory(c.name || c.category)} className={`px-3 py-1.5 rounded-full text-sm ring-1 ring-white/10 ${selectedCategory===(c.name||c.category) ? 'bg-primary text-white' : 'bg-white/5 text-gray-200'}`}>{c.name || c.category}</button>
            ))}
          </div>
        </div>

        {filteredEvents.length > 0 ? (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {filteredEvents.map((event) => {
              const id = event.id || event._id;
              const title = event.name || event.title || 'Untitled Event';
              const venue = event.venue?.name || event.venue || 'Venue TBA';
              const location = event.venue?.location || event.location || 'Delhi/NCR';
              const date = new Date(event.date || event.startTime || Date.now());
              const price = event.price || event.ticketPrice || '₹99 onwards';
              const img = event.image || event.banner || event.posterUrl || 'https://via.placeholder.com/400x400?text=No+Image';

              return (
                <div key={id} className='group overflow-hidden rounded-xl ring-1 ring-white/10 bg-card/50 hover:ring-primary transition-all h-[300px]'>
                  <div className='flex flex-col sm:flex-row h-full'>
                    <div className='relative sm:w-2/5 h-full overflow-hidden'>
                      <img src={img} alt={title} className='absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' />
                      <div className='absolute inset-0 bg-gradient-to-t from-card/80 to-transparent sm:bg-gradient-to-r' />
                      <div className='absolute top-3 left-3 right-3 flex justify-between items-start'>
                        <span className='px-2 py-0.5 rounded bg-black/50 text-xs'>{event.category}</span>
                      </div>
                    </div>
                    <div className='p-5 sm:w-3/5 flex flex-col h-full'>
                      <h3 className='text-lg font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors'>{title}</h3>
                      <div className='space-y-2 mb-4 flex-grow text-gray-300'>
                        <div className='flex items-start text-sm'>
                          <MapPin className='w-4 h-4 mr-2 text-primary flex-shrink-0 mt-0.5' />
                          <span className='line-clamp-2'>{venue}, {location}</span>
                        </div>
                        <div className='flex items-center text-sm'>
                          <Calendar className='w-4 h-4 mr-2 text-primary flex-shrink-0' />
                          {date.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short' })} at {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </div>
                      </div>
                      <div className='flex items-center justify-between pt-4 border-t border-white/10'>
                        <div>
                          <p className='text-xs text-gray-400'>Price</p>
                          <p className='text-lg font-bold text-primary'>{price}</p>
                        </div>
                        <button
                          className='px-3 py-1.5 rounded-md bg-primary hover:bg-primary-dull transition'
                          onClick={() => { navigate(`/nightlife/${id}`) }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className='p-10 text-center rounded-xl ring-1 ring-white/10 bg-card/50'>
            <Trophy className='w-12 h-12 mx-auto mb-3 text-gray-400' />
            <h3 className='text-xl font-semibold mb-1'>No events found</h3>
            <p className='text-gray-400 mb-4'>Try adjusting your search or filter criteria</p>
            <button onClick={() => { setSelectedCategory('all'); setSearchQuery('') }} className='px-4 py-2 rounded-md ring-1 ring-white/10 hover:bg-white/10 transition'>Clear Filters</button>
          </div>
        )}
      </section>
    </div>
  )
}

export default NightlifeShine
