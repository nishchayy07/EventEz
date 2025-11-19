import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import Loading from '../components/Loading'
import { ArrowRightIcon, ClockIcon } from 'lucide-react'
import isoTimeFormat from '../lib/isoTimeFormat'
import BlurCircle from '../components/BlurCircle'
import toast from 'react-hot-toast'
import { useAppContext } from '../context/AppContext'

const NightlifeSeatLayout = () => {

  const groupRows = [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"]]

  const { id } = useParams()
  const [selectedSeats, setSelectedSeats] = useState([])
  const [event, setEvent] = useState(null)
  const [occupiedSeats, setOccupiedSeats] = useState([])

  const navigate = useNavigate()

  const { axios, getToken, user } = useAppContext();

  const getEvent = async () => {
    try {
      const { data } = await axios.get(`/api/nightlife/event/${id}`)
      if (data.success) {
        setEvent(data.event)
        // Set occupied seats from the event - ensure it's always an array
        if (data.event.occupiedSeats && Array.isArray(data.event.occupiedSeats)) {
          setOccupiedSeats(data.event.occupiedSeats)
        } else {
          setOccupiedSeats([])
        }
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to load event')
    }
  }

  const handleSeatClick = (seatId) => {
    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5) {
      return toast("You can only select 5 seats")
    }
    if (Array.isArray(occupiedSeats) && occupiedSeats.includes(seatId)) {
      return toast('This seat is already booked')
    }
    setSelectedSeats(prev => prev.includes(seatId) ? prev.filter(seat => seat !== seatId) : [...prev, seatId])
  }

  const renderSeats = (row, count = 9) => (
    <div key={row} className="flex gap-2 mt-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          const isOccupied = Array.isArray(occupiedSeats) && occupiedSeats.includes(seatId);
          return (
            <button 
              key={seatId} 
              onClick={() => handleSeatClick(seatId)} 
              className={`h-8 w-8 rounded border border-primary/60 cursor-pointer
                ${selectedSeats.includes(seatId) && "bg-primary text-white"} 
                ${isOccupied && "opacity-50 cursor-not-allowed"}`}
            >
              {seatId}
            </button>
          );
        })}
      </div>
    </div>
  )

  const bookTickets = async () => {
    try {
      if (!user) return toast.error('Please login to proceed')

      if (!selectedSeats.length) return toast.error('Please select seats');

      // Create booking for nightlife event
      const { data } = await axios.post('/api/nightlife/booking/create', {
        eventId: id,
        selectedSeats
      }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getEvent()
  }, [])

  return event ? (
    <div className='flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50'>
      {/* Event Info */}
      <div className='w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-30'>
        <p className='text-lg font-semibold px-6'>{event.title}</p>
        <div className='mt-5 space-y-3 px-6'>
          <div>
            <p className='text-xs text-gray-400'>Category</p>
            <p className='text-sm text-primary'>{event.category}</p>
          </div>
          <div>
            <p className='text-xs text-gray-400'>Venue</p>
            <p className='text-sm'>{event.venue}</p>
          </div>
          <div>
            <p className='text-xs text-gray-400'>Location</p>
            <p className='text-sm'>{event.location}</p>
          </div>
          <div>
            <p className='text-xs text-gray-400'>Date & Time</p>
            <p className='text-sm'>{new Date(event.showDateTime).toLocaleString()}</p>
          </div>
          <div>
            <p className='text-xs text-gray-400'>Price per seat</p>
            <p className='text-sm font-semibold text-primary'>{event.price}</p>
          </div>
        </div>
      </div>

      {/* Seats Layout */}
      <div className='relative flex-1 flex flex-col items-center max-md:mt-16'>
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle bottom="0" right="0" />
        <h1 className='text-2xl font-semibold mb-4'>Select your seat</h1>
        <img src={assets.screenImage} alt="screen" />
        <p className='text-gray-400 text-sm mb-6'>STAGE SIDE</p>

        <div className='flex flex-col items-center mt-10 text-xs text-gray-300'>
          <div className='grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6'>
            {groupRows[0].map(row => renderSeats(row))}
          </div>

          <div className='grid grid-cols-2 gap-11'>
            {groupRows.slice(1).map((group, idx) => (
              <div key={idx}>
                {group.map(row => renderSeats(row))}
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={bookTickets} 
          className='flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95'
        >
          Proceed to Checkout
          <ArrowRightIcon strokeWidth={3} className="w-4 h-4" />
        </button>
      </div>
    </div>
  ) : (
    <Loading />
  )
}

export default NightlifeSeatLayout
