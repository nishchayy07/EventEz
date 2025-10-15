import React, { useMemo, useState } from 'react'
import { Calendar, MapPin, Trophy, Search, Filter, Star, Ticket } from 'lucide-react'

const SportShine = () => {
  const [selectedSport, setSelectedSport] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const sportCategories = useMemo(() => ([
    { id: 1, name: 'Cricket', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=600&fit=crop', events: 12, trending: true },
    { id: 2, name: 'Football', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=600&fit=crop', events: 8, trending: true },
    { id: 3, name: 'Basketball', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=600&fit=crop', events: 6, trending: false },
    { id: 4, name: 'Tennis', image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&h=600&fit=crop', events: 10, trending: false },
    { id: 5, name: 'Badminton', image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&h=600&fit=crop', events: 7, trending: false },
    { id: 6, name: 'Hockey', image: 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=800&h=600&fit=crop', events: 6, trending: false },
  ]), [])

  const upcomingEvents = useMemo(() => ([
    { id: 1, title: 'IPL 2025 - Mumbai vs Chennai', sport: 'Cricket', venue: 'Wankhede Stadium', location: 'Mumbai', date: 'Mar 25, 2025', time: '7:30 PM', price: '₹1,500', available: 250, total: 300, image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&h=400&fit=crop', featured: true, status: 'selling-fast', rating: 4.8 },
    { id: 2, title: 'ISL Final - Bengaluru FC vs ATK', sport: 'Football', venue: 'Kanteerava Stadium', location: 'Bengaluru', date: 'Mar 28, 2025', time: '8:00 PM', price: '₹800', available: 180, total: 500, image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop', featured: true, status: 'available', rating: 4.9 },
    { id: 3, title: 'India Open Tennis Championship', sport: 'Tennis', venue: 'RK Khanna Stadium', location: 'Delhi', date: 'Apr 2, 2025', time: '5:00 PM', price: '₹1,200', available: 200, total: 600, image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=400&fit=crop', featured: false, status: 'available', rating: 4.6 },
  ]), [])

  const filteredEvents = useMemo(() => upcomingEvents.filter((e) => {
    const matchesSport = selectedSport === 'all' || e.sport.toLowerCase() === selectedSport.toLowerCase()
    const s = searchQuery.toLowerCase()
    const matchesSearch = e.title.toLowerCase().includes(s) || e.venue.toLowerCase().includes(s) || e.location.toLowerCase().includes(s)
    return matchesSport && matchesSearch
  }), [selectedSport, searchQuery, upcomingEvents])

  return (
    <div className='mt-16'>
      <section className='relative h-[48vh] md:h-[56vh] flex items-center justify-center overflow-hidden rounded-2xl ring-1 ring-white/10 bg-cover bg-center'
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1920&h=1080&fit=crop')" }}>
        <div className='absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background' />
        <div className='relative z-10 text-center px-4 max-w-3xl mx-auto'>
          <div className='inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-primary/20 text-primary ring-1 ring-primary/30'>
            <Trophy className='w-4 h-4' />
            <span className='text-xs font-medium'>Live Sports Experience</span>
          </div>
          <h1 className='text-4xl md:text-6xl font-bold mb-4'>Experience Sports Live</h1>
          <p className='text-base md:text-lg text-gray-300 mb-6'>Book tickets for the biggest sporting events. From cricket to football, witness the action live!</p>
          <button className='px-5 py-2 rounded-full bg-primary hover:bg-primary-dull transition'>Browse Events</button>
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
                  <p className='text-[11px] text-gray-300'>{c.events} events</p>
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
            {filteredEvents.map((event) => (
              <div key={event.id} className='group overflow-hidden rounded-xl ring-1 ring-white/10 bg-card/50 hover:ring-primary transition-all'>
                <div className='flex flex-col sm:flex-row'>
                  <div className='relative sm:w-2/5 h-56 sm:h-auto overflow-hidden'>
                    <img src={event.image} alt={event.title} className='absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' />
                    <div className='absolute inset-0 bg-gradient-to-t from-card/80 to-transparent sm:bg-gradient-to-r' />
                    <div className='absolute top-3 left-3 right-3 flex justify-between items-start'>
                      <span className='px-2 py-0.5 rounded bg-black/50 text-xs'>{event.sport}</span>
                    </div>
                    <div className='absolute bottom-3 left-3'>
                      <div className='flex items-center gap-1 bg-black/50 px-2 py-1 rounded'>
                        <Star className='w-3 h-3 text-yellow-500 fill-yellow-500' />
                        <span className='text-sm font-semibold'>{event.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className='p-5 sm:w-3/5 flex flex-col'>
                    <h3 className='text-lg font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors'>{event.title}</h3>
                    <div className='space-y-2 mb-4 flex-grow text-gray-300'>
                      <div className='flex items-start text-sm'>
                        <MapPin className='w-4 h-4 mr-2 text-primary flex-shrink-0 mt-0.5' />
                        <span className='line-clamp-2'>{event.venue}, {event.location}</span>
                      </div>
                      <div className='flex items-center text-sm'>
                        <Calendar className='w-4 h-4 mr-2 text-primary flex-shrink-0' />{event.date}
                      </div>
                      <div className='flex items-center text-sm'>
                        <Ticket className='w-4 h-4 mr-2 text-primary flex-shrink-0' />{event.available} / {event.total} tickets left
                      </div>
                    </div>
                    <div className='flex items-center justify-between pt-4 border-t border-white/10'>
                      <div>
                        <p className='text-xs text-gray-400'>From</p>
                        <p className='text-xl font-bold text-primary'>{event.price}</p>
                      </div>
                      <button className='px-3 py-1.5 rounded-md bg-primary hover:bg-primary-dull transition'>Book Now</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='p-10 text-center rounded-xl ring-1 ring-white/10 bg-card/50'>
            <Trophy className='w-12 h-12 mx-auto mb-3 text-gray-400' />
            <h3 className='text-xl font-semibold mb-1'>No events found</h3>
            <p className='text-gray-400 mb-4'>Try adjusting your search or filter criteria</p>
            <button onClick={() => { setSelectedSport('all'); setSearchQuery('') }} className='px-4 py-2 rounded-md ring-1 ring-white/10 hover:bg-white/10 transition'>Clear Filters</button>
          </div>
        )}
      </section>
    </div>
  )
}

export default SportShine


