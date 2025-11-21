import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import Title from '../../components/admin/Title';
import Loading from '../../components/Loading';
import toast from 'react-hot-toast';

const AdminReleaseSeats = () => {
  const { axios, getToken, user } = useAppContext();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [releasing, setReleasing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/admin/all-events-with-seats', {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      setEvents(data.events || []);
    } catch (error) {
      toast.error('Failed to fetch events');
    }
    setLoading(false);
  };

  const fetchOccupiedSeats = (event) => {
    // occupiedSeats is an object (seatId: userId), convert to array of seatIds
    if (event && event.occupiedSeats) {
      setOccupiedSeats(Object.keys(event.occupiedSeats));
    } else {
      setOccupiedSeats([]);
    }
  };

  const handleEventChange = (e) => {
    const eventId = e.target.value;
    const event = events.find(ev => ev._id === eventId);
    setSelectedEvent(event);
    fetchOccupiedSeats(event);
  };

  const handleReleaseSeat = async (seatId) => {
    if (!window.confirm(`Release seat ${seatId}?`)) return;
    setReleasing(true);
    try {
      const { data } = await axios.post(
        '/api/admin/release-seat',
        { showId: selectedEvent._id, seatId },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      if (data.success) {
        toast.success('Seat released');
        fetchOccupiedSeats({ ...selectedEvent, occupiedSeats: { ...selectedEvent.occupiedSeats, [seatId]: undefined } });
        // Also update in-memory event list
        setEvents(prev => prev.map(ev => ev._id === selectedEvent._id ? { ...ev, occupiedSeats: { ...ev.occupiedSeats, [seatId]: undefined } } : ev));
      } else {
        toast.error(data.message || 'Failed to release seat');
      }
    } catch (error) {
      toast.error('Failed to release seat');
    }
    setReleasing(false);
  };

  return (
    <div>
      <Title text1="Release" text2="Seats" />
      {loading && <Loading />}
      <div className="my-6">
        <label className="block mb-2 font-semibold text-gray-200">Select Event:</label>
        <select
          className="p-2 border rounded bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          value={selectedEvent?._id || ''}
          onChange={handleEventChange}
        >
          <option value="" disabled className="bg-gray-800 text-gray-400">Select an event</option>
          {events.map((event) => (
            <option key={event._id} value={event._id} className="bg-gray-800 text-gray-100">
              [{event.type.toUpperCase()}] {event.title} - {new Date(event.showDateTime).toLocaleString()}
            </option>
          ))}
        </select>
      </div>
      {selectedEvent && (
        <div>
          <h2 className="font-semibold mb-2">Occupied Seats</h2>
          <div className="flex flex-wrap gap-2">
            {occupiedSeats.length === 0 && <span className="text-gray-400">No occupied seats</span>}
            {occupiedSeats.map((seat) => (
              <button
                key={seat}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                onClick={() => handleReleaseSeat(seat)}
                disabled={releasing}
              >
                {seat} &times;
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReleaseSeats;
