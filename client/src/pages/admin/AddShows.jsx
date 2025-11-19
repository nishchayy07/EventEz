import React, { useEffect, useState } from 'react'
import { dummyShowsData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { CheckIcon, DeleteIcon, StarIcon } from 'lucide-react';
import { kConverter } from '../../lib/kConverter';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AddShows = () => {

    const {axios, getToken, user, image_base_url} = useAppContext()

    const currency = import.meta.env.VITE_CURRENCY
    
    // Tab state
    const [activeTab, setActiveTab] = useState('movies'); // 'movies', 'sports', 'nightlife'
    
    // Movies state
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [dateTimeSelection, setDateTimeSelection] = useState({});
    const [dateTimeInput, setDateTimeInput] = useState("");
    const [showPrice, setShowPrice] = useState("");
    const [addingShow, setAddingShow] = useState(false)
    
    // Sports state
    const [sportsData, setSportsData] = useState([]);
    const [selectedSport, setSelectedSport] = useState(null);
    const [sportEventData, setSportEventData] = useState({
        title: '',
        venue: '',
        image: '',
        showDateTime: '',
        price: ''
    });
    
    // Nightlife state
    const [nightlifeCategories, setNightlifeCategories] = useState([]);
    const [mockNightlifeEvents, setMockNightlifeEvents] = useState([]);
    const [selectedNightlifeEvent, setSelectedNightlifeEvent] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [nightlifeEventData, setNightlifeEventData] = useState({
        title: '',
        venue: '',
        location: '',
        description: '',
        image: '',
        landscapeImage: '',
        artist: '',
        artistImage: '',
        duration: '',
        ageRestriction: '',
        showDateTime: '',
        price: ''
    });


     const fetchNowPlayingMovies = async () => {
        try {
            const { data } = await axios.get('/api/show/now-playing', {
                headers: { Authorization: `Bearer ${await getToken()}` }})
                if(data.success){
                    setNowPlayingMovies(data.movies)
                    console.log('Movies loaded:', data.movies?.length)
                } else {
                    console.error('Failed to fetch movies:', data.message)
                    // Don't show error toast if it's just a network/API issue
                    // Admin can still use sports and nightlife tabs
                }
        } catch (error) {
            console.error('Error fetching movies:', error)
            // Silently fail - admin can still access other tabs
        }
    };
    
    const fetchSportsData = async () => {
        try {
            const { data } = await axios.get('/api/sports');
            if (data.sports) {
                setSportsData(data.sports);
            }
        } catch (error) {
            console.error('Error fetching sports:', error);
        }
    };
    
    const fetchNightlifeCategories = async () => {
        try {
            const { data } = await axios.get('/api/nightlife/categories');
            if (data.success) {
                setNightlifeCategories(data.categories);
            }
        } catch (error) {
            console.error('Error fetching nightlife categories:', error);
        }
    };

    const fetchMockNightlifeEvents = async () => {
        try {
            const { data } = await axios.get('/api/nightlife/mock-events');
            if (data.success) {
                setMockNightlifeEvents(data.events);
                console.log('Mock nightlife events loaded:', data.events?.length);
            } else {
                console.error('Failed to fetch mock events:', data.message);
            }
        } catch (error) {
            console.error('Error fetching mock nightlife events:', error);
        }
    };

    const handleDateTimeAdd = () => {
        if (!dateTimeInput) return;
        const [date, time] = dateTimeInput.split("T");
        if (!date || !time) return;

        setDateTimeSelection((prev) => {
            const times = prev[date] || [];
            if (!times.includes(time)) {
                return { ...prev, [date]: [...times, time] };
            }
            return prev;
        });
    };

    const handleRemoveTime = (date, time) => {
        setDateTimeSelection((prev) => {
            const filteredTimes = prev[date].filter((t) => t !== time);
            if (filteredTimes.length === 0) {
                const { [date]: _, ...rest } = prev;
                return rest;
            }
            return {
                ...prev,
                [date]: filteredTimes,
            };
        });
    };

    const handleSubmit = async ()=>{
        try {
            setAddingShow(true)

            if (activeTab === 'movies') {
                if(!selectedMovie || Object.keys(dateTimeSelection).length === 0 || !showPrice){
                    toast.error('Missing required fields');
                    setAddingShow(false);
                    return;
                }

                const showsInput = Object.entries(dateTimeSelection).map(([date, time])=> ({date, time}));

                const payload = {
                    movieId: selectedMovie,
                    showsInput,
                    showPrice: Number(showPrice)
                }

                const { data } = await axios.post('/api/show/add', payload, {headers: { Authorization: `Bearer ${await getToken()}` }})

                if(data.success){
                    toast.success(data.message)
                    setSelectedMovie(null)
                    setDateTimeSelection({})
                    setShowPrice("")
                }else{
                    toast.error(data.message)
                }
            } else if (activeTab === 'sports') {
                if (!selectedSport || !sportEventData.title || !sportEventData.venue || !sportEventData.showDateTime || !sportEventData.price) {
                    toast.error('Missing required fields');
                    setAddingShow(false);
                    return;
                }
                
                const payload = {
                    title: sportEventData.title,
                    sport: selectedSport,
                    venue: sportEventData.venue,
                    image: sportEventData.image,
                    showDateTime: sportEventData.showDateTime,
                    price: Number(sportEventData.price)
                };
                
                const { data } = await axios.post('/api/sports/add', payload, {
                    headers: { Authorization: `Bearer ${await getToken()}` }
                });
                
                if (data.success) {
                    toast.success(data.message);
                    setSelectedSport(null);
                    setSportEventData({ title: '', venue: '', image: '', showDateTime: '', price: '' });
                } else {
                    toast.error(data.message);
                }
            } else if (activeTab === 'nightlife') {
                if (!selectedNightlifeEvent || !nightlifeEventData.showDateTime) {
                    toast.error('Please select an event and set the show date/time');
                    setAddingShow(false);
                    return;
                }
                
                const payload = {
                    title: selectedNightlifeEvent.title,
                    category: selectedNightlifeEvent.category,
                    venue: selectedNightlifeEvent.venue,
                    location: selectedNightlifeEvent.location,
                    description: selectedNightlifeEvent.description || '',
                    image: selectedNightlifeEvent.image,
                    landscapeImage: selectedNightlifeEvent.landscapeImage ,
                    artist: selectedNightlifeEvent.artist || '',
                    artistImage: selectedNightlifeEvent.artistImage || '',
                    duration: selectedNightlifeEvent.duration || '',
                    ageRestriction: selectedNightlifeEvent.ageRestriction || '',
                    showDateTime: nightlifeEventData.showDateTime,
                    price: selectedNightlifeEvent.price
                };
                
                const { data } = await axios.post('/api/nightlife/add', payload, {
                    headers: { Authorization: `Bearer ${await getToken()}` }
                });
                
                if (data.success) {
                    toast.success(data.message);
                    setSelectedNightlifeEvent(null);
                    setNightlifeEventData({ title: '', venue: '', location: '', description: '', image: '', landscapeImage: '', artist: '', artistImage: '', duration: '', ageRestriction: '', showDateTime: '', price: '' });
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error('An error occurred. Please try again.')
        }
        setAddingShow(false)
    }

    useEffect(() => {
        if(user){
            if (activeTab === 'movies') {
                fetchNowPlayingMovies();
            } else if (activeTab === 'sports') {
                fetchSportsData();
            } else if (activeTab === 'nightlife') {
                fetchNightlifeCategories();
                fetchMockNightlifeEvents();
            }
        }
    }, [user, activeTab]);

  return (
    <>
      <Title text1="Add" text2="Shows" />
      
      {/* Tabs */}
      <div className="flex gap-4 mt-10 border-b border-gray-600">
        <button 
          onClick={() => setActiveTab('movies')}
          className={`px-6 py-3 font-medium transition-colors ${activeTab === 'movies' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-gray-200'}`}
        >
          Movies
        </button>
        <button 
          onClick={() => setActiveTab('sports')}
          className={`px-6 py-3 font-medium transition-colors ${activeTab === 'sports' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-gray-200'}`}
        >
          Sports
        </button>
        <button 
          onClick={() => setActiveTab('nightlife')}
          className={`px-6 py-3 font-medium transition-colors ${activeTab === 'nightlife' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-gray-200'}`}
        >
          Nightlife
        </button>
      </div>

      {/* Movies Tab */}
      {activeTab === 'movies' && (
        <>
          {nowPlayingMovies.length > 0 ? (
            <>
              <p className="mt-10 text-lg font-medium">Now Playing Movies</p>
              <div className="overflow-x-auto pb-4">
                <div className="group flex flex-wrap gap-4 mt-4 w-max">
                    {nowPlayingMovies.map((movie) =>(
                        <div key={movie.id} className={`relative max-w-40 cursor-pointer group-hover:not-hover:opacity-40 hover:-translate-y-1 transition duration-300 `} onClick={()=> setSelectedMovie(movie.id)}>
                            <div className="relative rounded-lg overflow-hidden">
                                <img src={image_base_url + movie.poster_path} alt="" className="w-full object-cover brightness-90" />
                                <div className="text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0">
                                    <p className="flex items-center gap-1 text-gray-400">
                                        <StarIcon className="w-4 h-4 text-primary fill-primary" />
                                        {movie.vote_average.toFixed(1)}
                                    </p>
                                    <p className="text-gray-300">{kConverter(movie.vote_count)} Votes</p>
                                </div>
                    </div>
                    {selectedMovie === movie.id && (
                        <div className="absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded">
                            <CheckIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
                        </div>
                    )}
                    <p className="font-medium truncate">{movie.title}</p>
                    <p className="text-gray-400 text-sm">{movie.release_date}</p>
                </div>
            ))}
        </div>
      </div>

       {/* Show Price Input */}
       <div className="mt-8">
            <label className="block text-sm font-medium mb-2">Show Price</label>
            <div className="inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md">
                <p className="text-gray-400 text-sm">{currency}</p>
                <input min={0} type="number" value={showPrice} onChange={(e) => setShowPrice(e.target.value)} placeholder="Enter show price" className="outline-none" />
            </div>
        </div>

        {/* Date & Time Selection */}
        <div className="mt-6">
            <label className="block text-sm font-medium mb-2">Select Date and Time</label>
            <div className="inline-flex gap-5 border border-gray-600 p-1 pl-3 rounded-lg">
                <input type="datetime-local" value={dateTimeInput} onChange={(e) => setDateTimeInput(e.target.value)} className="outline-none rounded-md" />
                <button onClick={handleDateTimeAdd} className="bg-primary/80 text-white px-3 py-2 text-sm rounded-lg hover:bg-primary cursor-pointer" >
                    Add Time
                </button>
            </div>
        </div>

       {/* Display Selected Times */}
        {Object.keys(dateTimeSelection).length > 0 && (
        <div className="mt-6">
            <h2 className=" mb-2">Selected Date-Time</h2>
            <ul className="space-y-3">
                {Object.entries(dateTimeSelection).map(([date, times]) => (
                    <li key={date}>
                        <div className="font-medium">{date}</div>
                        <div className="flex flex-wrap gap-2 mt-1 text-sm">
                            {times.map((time) => (
                                <div key={time} className="border border-primary px-2 py-1 flex items-center rounded" >
                                    <span>{time}</span>
                                    <DeleteIcon onClick={() => handleRemoveTime(date, time)} width={15} className="ml-2 text-red-500 hover:text-red-700 cursor-pointer" />
                                </div>
                            ))}
                        </div>
                    </li>
                ))}
            </ul>
            </div>
       )}
       <button onClick={handleSubmit} disabled={addingShow} className="bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all cursor-pointer" >
            Add Show
        </button>
            </>
          ) : (
            <div className="mt-10 p-8 bg-gray-800/30 rounded-lg border border-gray-700 text-center">
              <p className="text-gray-400 mb-2">Unable to load movies from TMDB API</p>
              <p className="text-sm text-gray-500">Please check your network connection or TMDB API configuration.</p>
            </div>
          )}
        </>
      )}

      {/* Sports Tab */}
      {activeTab === 'sports' && (
        <>
          <p className="mt-10 text-lg font-medium">Select Sport</p>
          <div className="overflow-x-auto pb-4">
            <div className="group flex flex-wrap gap-4 mt-4">
              {sportsData.map((sport) => (
                <div 
                  key={sport.id} 
                  className={`relative max-w-40 cursor-pointer group-hover:not-hover:opacity-40 hover:-translate-y-1 transition duration-300`}
                  onClick={() => setSelectedSport(sport.name)}
                >
                  <div className="relative rounded-lg overflow-hidden">
                    <img src={sport.image} alt={sport.name} className="w-full h-48 object-cover brightness-90" />
                  </div>
                  {selectedSport === sport.name && (
                    <div className="absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded">
                      <CheckIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
                    </div>
                  )}
                  <p className="font-medium truncate mt-2">{sport.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sport Event Details */}
          <div className="mt-8 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Event Title</label>
              <input 
                type="text" 
                value={sportEventData.title}
                onChange={(e) => setSportEventData({...sportEventData, title: e.target.value})}
                placeholder="Enter event title"
                className="w-full border border-gray-600 px-3 py-2 rounded-md outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Venue</label>
              <input 
                type="text" 
                value={sportEventData.venue}
                onChange={(e) => setSportEventData({...sportEventData, venue: e.target.value})}
                placeholder="Enter venue"
                className="w-full border border-gray-600 px-3 py-2 rounded-md outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Image URL (optional)</label>
              <input 
                type="text" 
                value={sportEventData.image}
                onChange={(e) => setSportEventData({...sportEventData, image: e.target.value})}
                placeholder="Enter image URL"
                className="w-full border border-gray-600 px-3 py-2 rounded-md outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Event Date & Time</label>
              <input 
                type="datetime-local" 
                value={sportEventData.showDateTime}
                onChange={(e) => setSportEventData({...sportEventData, showDateTime: e.target.value})}
                className="w-full border border-gray-600 px-3 py-2 rounded-md outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ticket Price</label>
              <div className="inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md">
                <p className="text-gray-400 text-sm">{currency}</p>
                <input 
                  min={0} 
                  type="number" 
                  value={sportEventData.price}
                  onChange={(e) => setSportEventData({...sportEventData, price: e.target.value})}
                  placeholder="Enter price"
                  className="outline-none"
                />
              </div>
            </div>
          </div>
          
          <button onClick={handleSubmit} disabled={addingShow} className="bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all cursor-pointer">
            Add Sport Event
          </button>
        </>
      )}

      {/* Nightlife Tab */}
      {activeTab === 'nightlife' && (
        <>
          <p className="mt-10 text-lg font-medium">Available Mock Nightlife Events</p>
          <div className="overflow-x-auto pb-4">
            <div className="group flex gap-4 mt-4 w-max">
              {mockNightlifeEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => setSelectedNightlifeEvent(event)}
                  className="relative max-w-40 cursor-pointer group-hover:not-hover:opacity-40 hover:-translate-y-1 transition duration-300"
                >
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      src={event.image || 'https://via.placeholder.com/300x450'}
                      alt={event.title}
                      className="w-full object-cover brightness-90"
                    />
                  </div>
                  {selectedNightlifeEvent?.id === event.id && (
                    <div className="absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded">
                      <CheckIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
                    </div>
                  )}
                  <p className="font-medium truncate mt-2">{event.title}</p>
                  <p className="text-sm text-gray-400 truncate">{event.category}</p>
                </div>
              ))}
            </div>
          </div>

          {selectedNightlifeEvent && (
            <>
              <div className="mt-8 p-6 bg-gray-800/30 rounded-lg border border-gray-700">
                <h3 className="text-xl font-semibold mb-4">Selected Event Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Title:</span>
                    <p className="font-medium">{selectedNightlifeEvent.title}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Category:</span>
                    <p className="font-medium">{selectedNightlifeEvent.category}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Venue:</span>
                    <p className="font-medium">{selectedNightlifeEvent.venue}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Location:</span>
                    <p className="font-medium">{selectedNightlifeEvent.location}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Price:</span>
                    <p className="font-medium">{selectedNightlifeEvent.price}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Date:</span>
                    <p className="font-medium">{new Date(selectedNightlifeEvent.date).toLocaleString()}</p>
                  </div>
                  {selectedNightlifeEvent.artist && (
                    <div>
                      <span className="text-gray-400">Artist:</span>
                      <p className="font-medium">{selectedNightlifeEvent.artist}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Event Date & Time *</label>
                  <input 
                    type="datetime-local" 
                    value={nightlifeEventData.showDateTime}
                    onChange={(e) => setNightlifeEventData({...nightlifeEventData, showDateTime: e.target.value})}
                    className="w-full border border-gray-600 px-3 py-2 rounded-md outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">Set the actual show date/time for this event</p>
                </div>
              </div>

              <button 
                onClick={handleSubmit} 
                disabled={addingShow || !nightlifeEventData.showDateTime} 
                className="bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingShow ? 'Adding...' : 'Add Event to Database'}
              </button>
            </>
          )}
        </>
      )}
      
      {activeTab === 'movies' && nowPlayingMovies.length === 0 && <Loading />}
      {activeTab === 'sports' && sportsData.length === 0 && <Loading />}
      {activeTab === 'nightlife' && mockNightlifeEvents.length === 0 && <Loading />}
    </>
  )
}

export default AddShows
