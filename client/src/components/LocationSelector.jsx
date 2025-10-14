import React, { useState } from 'react';
import { MapPin, X, Target } from 'lucide-react';
import { popularCities, allCities } from '../assets/cities';
import toast from 'react-hot-toast';

const LocationSelector = ({ isOpen, onClose, selectedCity, onSelectCity }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);

  const handleUseCurrentLocation = async () => {
    setIsDetecting(true);
    
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      setIsDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Use OpenStreetMap Nominatim API for reverse geocoding (free)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          
          const data = await response.json();
          
          // Extract city name from the response
          const city = data.address.city || 
                      data.address.town || 
                      data.address.village || 
                      data.address.state_district ||
                      data.address.state ||
                      'Unknown Location';
          
          // Save to localStorage
          localStorage.setItem('userLocation', JSON.stringify({
            city,
            latitude,
            longitude,
            timestamp: new Date().toISOString()
          }));
          
          onSelectCity(city);
          toast.success(`Location set to ${city}`);
          onClose();
        } catch (error) {
          console.error('Error getting location:', error);
          toast.error('Failed to get location details');
        } finally {
          setIsDetecting(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        if (error.code === error.PERMISSION_DENIED) {
          toast.error('Location permission denied. Please enable location access in your browser.');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          toast.error('Location information is unavailable.');
        } else if (error.code === error.TIMEOUT) {
          toast.error('Location request timed out.');
        } else {
          toast.error('Failed to get your location');
        }
        setIsDetecting(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const filteredCities = allCities.filter(city =>
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupCitiesByLetter = () => {
    const grouped = {};
    filteredCities.forEach(city => {
      const firstLetter = city[0].toUpperCase();
      if (!grouped[firstLetter]) {
        grouped[firstLetter] = [];
      }
      grouped[firstLetter].push(city);
    });
    return grouped;
  };

  const groupedCities = groupCitiesByLetter();
  const alphabet = Object.keys(groupedCities).sort();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]'
        onClick={onClose}
      />

      {/* Modal */}
      <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] bg-gray-900 rounded-2xl shadow-2xl z-[70] overflow-hidden'>
        {/* Header */}
        <div className='p-6 border-b border-gray-800'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-2xl font-semibold text-white'>Select Location</h2>
            <button
              onClick={onClose}
              className='p-2 hover:bg-gray-800 rounded-full transition'
            >
              <X className='w-6 h-6 text-gray-400' />
            </button>
          </div>

          {/* Search Input */}
          <input
            type='text'
            placeholder='Search city, area or locality'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-primary transition'
          />

          {/* Use Current Location */}
          <button 
            onClick={handleUseCurrentLocation}
            disabled={isDetecting}
            className='flex items-center gap-2 mt-4 text-primary hover:text-primary-dull transition disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <Target className={`w-5 h-5 ${isDetecting ? 'animate-pulse' : ''}`} />
            <span className='font-medium'>
              {isDetecting ? 'Detecting location...' : 'Use Current Location'}
            </span>
          </button>
        </div>

        {/* Content */}
        <div className='overflow-y-auto max-h-[calc(90vh-200px)] p-6'>
          {!searchTerm && (
            <>
              {/* Popular Cities */}
              <div className='mb-8'>
                <h3 className='text-lg font-semibold text-white mb-4'>Popular Cities</h3>
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3'>
                  {popularCities.map((city, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        onSelectCity(city.name);
                        onClose();
                      }}
                      className='flex flex-col items-center gap-2 p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition group'
                    >
                      <div className='text-4xl group-hover:scale-110 transition'>
                        {city.icon}
                      </div>
                      <span className='text-sm text-gray-300 text-center'>{city.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* All Cities */}
          <div>
            <h3 className='text-lg font-semibold text-white mb-4'>
              {searchTerm ? 'Search Results' : 'All Cities'}
            </h3>

            {/* Alphabet Filter */}
            {!searchTerm && (
              <div className='flex flex-wrap gap-2 mb-4 pb-4 border-b border-gray-800'>
                {alphabet.map(letter => (
                  <a
                    key={letter}
                    href={`#letter-${letter}`}
                    className='text-sm text-gray-400 hover:text-primary transition'
                  >
                    {letter}
                  </a>
                ))}
              </div>
            )}

            {/* City List */}
            <div className='space-y-6'>
              {alphabet.map(letter => (
                <div key={letter} id={`letter-${letter}`}>
                  <h4 className='text-sm font-semibold text-gray-500 mb-3'>{letter}</h4>
                  <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2'>
                    {groupedCities[letter].map((city, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          onSelectCity(city);
                          onClose();
                        }}
                        className='text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition'
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {filteredCities.length === 0 && searchTerm && (
              <div className='text-center py-8 text-gray-500'>
                No cities found matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LocationSelector;
