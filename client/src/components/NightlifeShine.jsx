import React, { useMemo, useState, useEffect } from 'react'
import { Calendar, MapPin, Music, Search, Filter, Trophy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Loading from './Loading';
import PopularNightlife from './PopularNightlife';
import { NIGHTLIFE_CATEGORIES } from './NightlifeCategories';

const NightlifeShine = () => {
  const navigate = useNavigate();
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
    // No external API calls: use hard-coded categories and dummy events.
    setLoading(true);
    const defaultCategories = NIGHTLIFE_CATEGORIES;

    const dummyEvents = [
      {
            id: '1',
            title: 'Saturday Night Live',
            venue: 'Ophelia Lounge',
            location: 'Delhi/NCR',
            date: '2025-11-09T20:00:00',
            price: '₹2999',
            image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
            category: 'Concerts'
          },
          {
            id: '2',
            title: 'Bas Kar Bassi',
            venue: 'The Laugh Club',
            location: 'Delhi/NCR',
            date: '2025-11-10T21:00:00',
            price: '₹1299',
            image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U3VuLCAxNiBOb3Y%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00355125-zfdunhwukb-portrait.jpg',
            category: 'Comedy Shows'
          },
          {
            id: '3',
            title: 'Samay Raina-Still Alive and Unfiltered',
            venue: 'Indira Gandhi Indoor Stadium',
            location: 'New Delhi',
            date: '2025-11-09T20:00:00',
            price: '₹4499',
            image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-TW9uLCAxNyBOb3Ygb253YXJkcw%3D%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end:l-text,ie-UFJPTU9URUQ%3D,co-FFFFFF,bg-DC354B,ff-Roboto,fs-20,lx-N16,ly-12,lfo-top_right,pa-12_14_12_14,r-6,l-end/et00454335-hqmbkqumjp-portrait.jpg',
            category: 'Comedy Shows'
          },
          {
            id: '4',
            title: 'Kuch Bhi Ho Sakta Hai - Delhi Theatre Festival',
            venue: 'Nehru Stadium',
            location: 'Delhi',
            date: '2025-11-10T20:00:00',
            price: '₹499',
            image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U3VuLCAxNiBOb3Y%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end:l-text,ie-UFJPTU9URUQ%3D,co-FFFFFF,bg-DC354B,ff-Roboto,fs-20,lx-N16,ly-12,lfo-top_right,pa-12_14_12_14,r-6,l-end/et00462375-uruhvkracx-portrait.jpg',
            category: 'Theatre Shows'
          },
          {
            id: '5',
            title: 'Einstein 15th Nov - Delhi Theatre Festival',
            venue: 'Nehru Stadium',
            location: 'Delhi',
            date: '2025-11-15T22:00:00',
            price: '₹999',
            image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCAxNSBOb3Y%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00462380-nxjnvwzxep-portrait.jpg',
            category: 'Theatre Shows'
          },
          {
            id: '6',
            title: 'AP Dhillon: One Of One Tour - Mumbai',
            venue: 'Jio World Convention Centre: Mumbai',
            location: 'Mumbai',
            date: '2025-12-26T19:00:00',
            price: '₹1299',
            image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-RnJpLCAyNiBEZWM%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00458408-csskcxnekn-portrait.jpg',
            category: 'Concerts'
          },
          {
            id: '7',
            title: 'Satrangi Re by Sonu Nigam',
            venue: 'Nehru Stadium',
            location: 'Delhi',
            date: '2025-12-26T19:00:00',
            price: '₹1299',
            image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCAyOCBNYXI%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00455992-cskuwbmxvk-portrait.jpg',
            category: 'Concerts'
          }
          ,
          {
            id: '8',
            title: 'Kal ki Chinta Nahi Karta ft. Ravi Gupta',
            venue: 'CP67 Mall:Mohali',
            location: 'Chandigarh',
            date: '2025-12-26T19:00:00',
            price: '₹499',
            image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCAxNSBOb3Y%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00329412-wqddascxcw-portrait.jpg',
            category: 'Comedy Shows'
          },
          {
            id: '9',
            title: 'Daily ka Kaam hai by Aakash Gupta',
            venue: 'CP67 Mall:Mohali',
            location: 'Chandigarh',
            date: '2025-12-26T19:00:00',
            price: '₹499',
            image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U3VuLCAxNiBOb3Y%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00419828-rtfdvqpztg-portrait.jpg',
            category: 'Comedy Shows'
          },
          {
            id: '10',
            title: 'Gaurav Kapoor Live',
            venue: 'CP67 Mall:Mohali',
            location: 'Chandigarh',
            date: '2025-12-26T20:00:00',
            price: '₹499',
            image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U3VuLCAyMSBEZWM%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00331714-blzqtszsvj-portrait.jpg',
            category: 'Comedy Shows'
          },
          {
            id: '11',
            title: 'Sufi Night',
            venue: 'CP67 Mall:Mohali',
            location: 'Chandigarh',
            date: '2025-12-26T20:00:00',
            price: '₹999',
            image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U3VuLCAyMyBOb3Y%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00468484-exlkezngpn-portrait.jpg',
            category: 'Qawali Night'
          },
          {
            id: '12',
            title: 'The Night Before Tomorrow: A The Weeknd Fan Event',
            venue: 'CP67 Mall:Mohali',
            location: 'Chandigarh',
            date: '2025-11-15T20:00:00',
            price: '₹4999',
            image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCAyOSBOb3Y%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00468465-uhkdaplggf-portrait.jpg',
            category: 'Concerts'
          }
          ,
          {
            id: '13',
            title: 'HUMARE RAM Ft Ashutosh Rana and Rahull R Bhuchar',
            venue: 'Kedarnath Sahni Auditorium: Delhi',
            location: 'Delhi',
            date: '2025-11-17T22:00:00',
            price: '₹899',
            image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-RnJpLCAxNCBOb3Ygb253YXJkcw%3D%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00376688-nansgzqfxr-portrait.jpg',
            category: 'Theatre Shows'
          },
          {
            id: '14',
            title: 'Sir Sir Sarla - Delhi Theatre Festival',
            venue: 'Kedarnath Sahni Auditorium: Delhi',
            location: 'Delhi',
            date: '2025-11-17T22:00:00',
            price: '₹899',
            image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCAxNSBOb3Y%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00462378-ggbwsjvfbe-portrait.jpg',
            category: 'Theatre Shows'
          },
          {
            id: '15',
            title: 'Sufi Night at Noida',
            venue: 'Kedarnath Sahni Auditorium',
            location: 'Noida',
            date: '2025-11-17T22:00:00',
            price: '₹899',
            image: 'https://media.insider.in/image/upload/c_crop,g_custom/v1753852044/uhx3uuehlydr0hcmgxk3.jpg',
            category: 'Qawali Night'
          },
          {
            id: '16',
            title: 'Rehmat e Nusrat by Amarrass',
            venue: 'The Piano Man New Delhi',
            location: 'Delhi',
            date: '2025-11-28T20:30:00',
            price: '₹899',
            image: 'https://media.insider.in/image/upload/c_crop,g_custom/v1760787674/vb5m7kz70ltp5jybrcxx.png',
            category: 'Qawali Night'
          },
          {
            id: '17',
            title: 'Qawaali Night',
            venue: 'Cosy Box',
            location: 'Gurugram',
            date: '2025-11-28T20:30:00',
            price: '₹899',
            image: 'https://media.insider.in/image/upload/c_crop,g_custom/v1757936057/uh6bl4mpnxluzwht6k0c.png',
            category: 'Qawali Night'
          }


    ];

    setNightlifeCategories(defaultCategories);
    setUpcomingEvents(dummyEvents);
    setLoading(false);
  }, []);

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
            <button className='px-4 py-2 rounded-md ring-1 ring-white/10 hover:bg-white/10 transition'><Filter className='w-4 h-4 inline-block mr-2' />More Filters</button>
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
