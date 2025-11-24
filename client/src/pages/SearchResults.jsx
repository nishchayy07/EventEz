import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Search, Calendar, MapPin, Ticket } from 'lucide-react';
import Loading from '../components/Loading';
import BlurCircle from '../components/BlurCircle';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();
  const { axios } = useAppContext();
  
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState({
    movies: [],
    sports: [],
    nightlife: []
  });

  useEffect(() => {
    const searchAll = async () => {
      if (!query.trim()) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const searchTerm = query.toLowerCase();
        
        // Search Movies
        const moviesRes = await axios.get('/api/show/all-shows');
        const filteredMovies = moviesRes.data.shows?.filter(show => 
          show.movie?.title?.toLowerCase().includes(searchTerm) ||
          show.movie?.original_title?.toLowerCase().includes(searchTerm)
        ) || [];

        // Search Sports
        const sportsRes = await axios.get('/api/sports/all-events', { params: { showAll: 'true' } });
        const filteredSports = sportsRes.data.events?.filter(event =>
          event.title?.toLowerCase().includes(searchTerm) ||
          event.sport?.toLowerCase().includes(searchTerm) ||
          event.venue?.toLowerCase().includes(searchTerm)
        ) || [];

        // Search Nightlife
        const nightlifeRes = await axios.get('/api/nightlife/events', { params: { showAll: 'true' } });
        const filteredNightlife = nightlifeRes.data.events?.filter(event =>
          event.title?.toLowerCase().includes(searchTerm) ||
          event.category?.toLowerCase().includes(searchTerm) ||
          event.venue?.toLowerCase().includes(searchTerm) ||
          event.artist?.toLowerCase().includes(searchTerm)
        ) || [];

        setResults({
          movies: filteredMovies,
          sports: filteredSports,
          nightlife: filteredNightlife
        });
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    searchAll();
  }, [query, axios]);

  const totalResults = results.movies.length + results.sports.length + results.nightlife.length;

  if (loading) return <Loading />;

  return (
    <div className='relative min-h-screen pt-32 px-6 md:px-16 lg:px-40 pb-20'>
      <BlurCircle top="100px" left="-100px" />
      <BlurCircle bottom="200px" right="-100px" />

      {/* Header */}
      <div className='mb-8'>
        <div className='flex items-center gap-3 mb-2'>
          <Search className='w-6 h-6 text-primary' />
          <h1 className='text-3xl font-bold'>Search Results</h1>
        </div>
        <p className='text-gray-400'>
          Found {totalResults} result{totalResults !== 1 ? 's' : ''} for "{query}"
        </p>
      </div>

      {totalResults === 0 ? (
        <div className='text-center py-20'>
          <Search className='w-16 h-16 mx-auto mb-4 text-gray-400' />
          <h2 className='text-2xl font-semibold mb-2'>No results found</h2>
          <p className='text-gray-400'>Try searching with different keywords</p>
        </div>
      ) : (
        <div className='space-y-12'>
          {/* Movies Section */}
          {results.movies.length > 0 && (
            <section>
              <h2 className='text-2xl font-semibold mb-4 flex items-center gap-2'>
                <Ticket className='w-6 h-6 text-primary' />
                Movies ({results.movies.length})
              </h2>
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
                {results.movies.map((show) => (
                  <div
                    key={show._id}
                    onClick={() => navigate(`/movie/${show.movie.id}`)}
                    className='group cursor-pointer'
                  >
                    <div className='relative overflow-hidden rounded-xl ring-1 ring-white/10 hover:ring-primary transition-all'>
                      <img
                        src={`https://image.tmdb.org/t/p/w500${show.movie.poster_path}`}
                        alt={show.movie.title}
                        className='w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300'
                      />
                    </div>
                    <h3 className='mt-2 font-semibold line-clamp-1'>{show.movie.title}</h3>
                    <p className='text-sm text-gray-400'>From ₹{show.price}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Sports Section */}
          {results.sports.length > 0 && (
            <section>
              <h2 className='text-2xl font-semibold mb-4 flex items-center gap-2'>
                <span className='text-2xl'>🏀</span>
                Sports Events ({results.sports.length})
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {results.sports.map((event) => (
                  <div
                    key={event._id}
                    onClick={() => navigate(`/sports/${event._id}`)}
                    className='group cursor-pointer overflow-hidden rounded-xl ring-1 ring-white/10 hover:ring-primary transition-all bg-card/50'
                  >
                    <div className='relative h-48'>
                      <img
                        src={event.image}
                        alt={event.title}
                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                      />
                    </div>
                    <div className='p-4'>
                      <h3 className='font-semibold text-lg mb-2 line-clamp-1'>{event.title}</h3>
                      <div className='space-y-1 text-sm text-gray-400'>
                        <div className='flex items-center gap-2'>
                          <MapPin className='w-4 h-4' />
                          <span>{event.venue}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Calendar className='w-4 h-4' />
                          <span>{new Date(event.showDateTime).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <p className='mt-3 text-primary font-semibold'>₹{event.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Nightlife Section */}
          {results.nightlife.length > 0 && (
            <section>
              <h2 className='text-2xl font-semibold mb-4 flex items-center gap-2'>
                <span className='text-2xl'>🎵</span>
                Nightlife Events ({results.nightlife.length})
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {results.nightlife.map((event) => (
                  <div
                    key={event._id}
                    onClick={() => navigate(`/nightlife/${event._id}`)}
                    className='group cursor-pointer overflow-hidden rounded-xl ring-1 ring-white/10 hover:ring-primary transition-all bg-card/50 flex'
                  >
                    <div className='relative w-2/5'>
                      <img
                        src={event.image}
                        alt={event.title}
                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                      />
                    </div>
                    <div className='p-5 w-3/5'>
                      <h3 className='font-semibold text-lg mb-2 line-clamp-1'>{event.title}</h3>
                      <p className='text-sm text-gray-400 mb-3'>{event.artist}</p>
                      <div className='space-y-1 text-sm text-gray-400'>
                        <div className='flex items-center gap-2'>
                          <MapPin className='w-4 h-4' />
                          <span className='line-clamp-1'>{event.venue}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Calendar className='w-4 h-4' />
                          <span>{new Date(event.showDateTime).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <p className='mt-3 text-primary font-semibold'>{event.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
