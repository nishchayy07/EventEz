import React, { useEffect, useState } from 'react'
import { dummyShowsData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { dateFormat } from '../../lib/dateFormat';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

const ListShows = () => {

    const currency = import.meta.env.VITE_CURRENCY

    const {axios, getToken, user} = useAppContext()

    const [shows, setShows] = useState([]);
    const [nightlifeEvents, setNightlifeEvents] = useState([]);
    const [sportEvents, setSportEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('shows'); // 'shows', 'sports', or 'nightlife'

    const getAllShows = async () =>{
        try {
            const { data } = await axios.get("/api/admin/all-shows", {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            setShows(data.shows)
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    }

    const getAllNightlifeEvents = async () => {
        try {
            const { data } = await axios.get("/api/nightlife/events", {
                params: { showAll: 'true' }
            });
            if (data.success) {
                console.log('📊 Total nightlife events in database:', data.events?.length);
                console.log('📊 Nightlife events:', data.events);
                setNightlifeEvents(data.events);
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }

    const getAllSportEvents = async () => {
        try {
            const { data } = await axios.get("/api/admin/all-sport-events", {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            if (data.success) {
                setSportEvents(data.sportEvents);
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }

    const deleteShow = async (id) => {
        if (!confirm('Are you sure you want to delete this show?')) return;
        
        try {
            const { data } = await axios.delete(`/api/admin/show/${id}`, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            
            if (data.success) {
                toast.success(data.message);
                getAllShows();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete show');
        }
    }

    const deleteNightlifeEvent = async (id) => {
        if (!confirm('Are you sure you want to delete this event?')) return;
        
        try {
            const { data } = await axios.delete(`/api/nightlife/delete/${id}`, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            
            if (data.success) {
                toast.success(data.message);
                getAllNightlifeEvents();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete event');
        }
    }

    const deleteSportEvent = async (id) => {
        if (!confirm('Are you sure you want to delete this sport event?')) return;
        
        try {
            const { data } = await axios.delete(`/api/admin/sport-event/${id}`, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            
            if (data.success) {
                toast.success(data.message);
                getAllSportEvents();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete sport event');
        }
    }

    useEffect(() => {
        if(user){
            getAllShows();
            getAllNightlifeEvents();
            getAllSportEvents();
        }   
    }, [user]);

  return !loading ? (
    <>
      <Title text1="List" text2="Shows" />
      
      {/* Tabs */}
      <div className="flex gap-4 mt-6 mb-4">
        <button
          onClick={() => setActiveTab('shows')}
          className={`px-6 py-2 rounded-lg transition ${
            activeTab === 'shows' 
              ? 'bg-primary text-white' 
              : 'bg-primary/10 text-gray-400 hover:bg-primary/20'
          }`}
        >
          Movie Shows
        </button>
        <button
          onClick={() => setActiveTab('sports')}
          className={`px-6 py-2 rounded-lg transition ${
            activeTab === 'sports' 
              ? 'bg-primary text-white' 
              : 'bg-primary/10 text-gray-400 hover:bg-primary/20'
          }`}
        >
          Sports Events
        </button>
        <button
          onClick={() => setActiveTab('nightlife')}
          className={`px-6 py-2 rounded-lg transition ${
            activeTab === 'nightlife' 
              ? 'bg-primary text-white' 
              : 'bg-primary/10 text-gray-400 hover:bg-primary/20'
          }`}
        >
          Nightlife Events
        </button>
      </div>

      {/* Movie Shows Table */}
      {activeTab === 'shows' && (
        <div className="max-w-5xl overflow-x-auto">
          <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
              <thead>
                  <tr className="bg-primary/20 text-left text-white">
                      <th className="p-2 font-medium pl-5">Movie Name</th>
                      <th className="p-2 font-medium">Show Time</th>
                      <th className="p-2 font-medium">Total Bookings</th>
                      <th className="p-2 font-medium">Earnings</th>
                      <th className="p-2 font-medium">Actions</th>
                  </tr>
              </thead>
              <tbody className="text-sm font-light">
                  {shows.map((show, index) => (
                      <tr key={index} className="border-b border-primary/10 bg-primary/5 even:bg-primary/10">
                          <td className="p-2 min-w-45 pl-5">{show.movie.title}</td>
                          <td className="p-2">{dateFormat(show.showDateTime)}</td>
                          <td className="p-2">{Object.keys(show.occupiedSeats).length}</td>
                          <td className="p-2">{currency} {Object.keys(show.occupiedSeats).length * show.showPrice}</td>
                          <td className="p-2">
                            <button
                              onClick={() => deleteShow(show._id)}
                              className="p-2 hover:bg-red-500/20 rounded transition text-red-500"
                              title="Delete Show"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
        </div>
      )}

      {/* Sports Events Table */}
      {activeTab === 'sports' && (
        <div className="max-w-6xl overflow-x-auto">
          <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
              <thead>
                  <tr className="bg-primary/20 text-left text-white">
                      <th className="p-2 font-medium pl-5">Event Name</th>
                      <th className="p-2 font-medium">Sport</th>
                      <th className="p-2 font-medium">Venue</th>
                      <th className="p-2 font-medium">Show Time</th>
                      <th className="p-2 font-medium">Price</th>
                      <th className="p-2 font-medium">Actions</th>
                  </tr>
              </thead>
              <tbody className="text-sm font-light">
                  {sportEvents.length > 0 ? sportEvents.map((event, index) => (
                      <tr key={index} className="border-b border-primary/10 bg-primary/5 even:bg-primary/10">
                          <td className="p-2 min-w-45 pl-5">{event.title}</td>
                          <td className="p-2">{event.sport}</td>
                          <td className="p-2">{event.venue}</td>
                          <td className="p-2">{dateFormat(event.showDateTime)}</td>
                          <td className="p-2">{currency}{event.price}</td>
                          <td className="p-2">
                            <button
                              onClick={() => deleteSportEvent(event._id)}
                              className="p-2 hover:bg-red-500/20 rounded transition text-red-500"
                              title="Delete Event"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                      </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" className="p-4 text-center text-gray-400">
                        No sports events found
                      </td>
                    </tr>
                  )}
              </tbody>
          </table>
        </div>
      )}

      {/* Nightlife Events Table */}
      {activeTab === 'nightlife' && (
        <div className="max-w-6xl overflow-x-auto">
          <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
              <thead>
                  <tr className="bg-primary/20 text-left text-white">
                      <th className="p-2 font-medium pl-5">Event Name</th>
                      <th className="p-2 font-medium">Venue</th>
                      <th className="p-2 font-medium">Category</th>
                      <th className="p-2 font-medium">Show Time</th>
                      <th className="p-2 font-medium">Price</th>
                      <th className="p-2 font-medium">Actions</th>
                  </tr>
              </thead>
              <tbody className="text-sm font-light">
                  {nightlifeEvents.length > 0 ? nightlifeEvents.map((event, index) => (
                      <tr key={index} className="border-b border-primary/10 bg-primary/5 even:bg-primary/10">
                          <td className="p-2 min-w-45 pl-5">{event.title}</td>
                          <td className="p-2">{event.venue}</td>
                          <td className="p-2">{event.category}</td>
                          <td className="p-2">{dateFormat(event.showDateTime)}</td>
                          <td className="p-2">{event.price}</td>
                          <td className="p-2">
                            <button
                              onClick={() => deleteNightlifeEvent(event._id)}
                              className="p-2 hover:bg-red-500/20 rounded transition text-red-500"
                              title="Delete Event"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                      </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" className="p-4 text-center text-gray-400">
                        No nightlife events found
                      </td>
                    </tr>
                  )}
              </tbody>
          </table>
        </div>
      )}
    </>
  ) : <Loading />
}

export default ListShows
