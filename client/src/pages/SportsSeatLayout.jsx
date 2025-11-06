import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Loading from '../components/Loading'
import { ArrowRightIcon } from 'lucide-react'
import BlurCircle from '../components/BlurCircle'
import toast from 'react-hot-toast'
import { useAppContext } from '../context/AppContext'

const SportsSeatLayout = () => {
  const groupRows = [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"]]

  const { id } = useParams()
  const [selectedSeats, setSelectedSeats] = useState([])
  const [event, setEvent] = useState(null)
  const [occupiedSeats, setOccupiedSeats] = useState([])

  const { axios, getToken, user } = useAppContext();

  const getEvent = async () =>{
    try {
      const { data } = await axios.get(`/api/sports/event/${id}`)
      if (data.success){
        setEvent(data.event)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSeatClick = (seatId) =>{
    if(!selectedSeats.includes(seatId) && selectedSeats.length > 4){
      return toast("You can only select 5 seats")
    }
    if(occupiedSeats.includes(seatId)){
      return toast('This seat is already booked')
    }
    setSelectedSeats(prev => prev.includes(seatId) ? prev.filter(seat => seat !== seatId) : [...prev, seatId])
  }

  const renderSeats = (row, count = 9)=> (
    <div key={row} className="flex gap-2 mt-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          return (
            <button key={seatId} onClick={() => handleSeatClick(seatId)} className={`h-8 w-8 rounded border border-primary/60 cursor-pointer ${selectedSeats.includes(seatId) && "bg-primary text-white"} ${occupiedSeats.includes(seatId) && "opacity-50"}`}>
              {seatId}
            </button>
          );
        })}
      </div>
    </div>
  )

  const getOccupiedSeats = async () =>{
    try {
      const { data } = await axios.get(`/api/sports/seats/${id}`)
      if (data.success) {
        setOccupiedSeats(Object.keys(data.occupiedSeats || {}))
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const bookTickets = async () =>{
    try {
      if(!user) return toast.error('Please login to proceed')
      if(!selectedSeats.length) return toast.error('Please select seats');

      const {data} = await axios.post('/api/sports/booking/create', {eventId: id, selectedSeats}, {headers: { Authorization: `Bearer ${await getToken()}` }});
      if (data.success){
        window.location.href = data.url;
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{ getEvent(); getOccupiedSeats(); },[id])

  return event ? (
    <div className='px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh] flex gap-6'>
      <div className='w-60 bg-primary/10 border border-primary/20 rounded-lg py-6 h-max md:sticky md:top-30'>
        <div className='px-6'>
          <p className='text-lg font-semibold'>{event.title}</p>
          <p className='text-gray-400 text-sm mt-1'>{new Date(event.showDateTime).toLocaleString()}</p>
          <p className='text-primary font-semibold mt-2'>${event.price}</p>
        </div>
      </div>
      <div className='relative flex-1 flex flex-col items-center max-md:mt-16'>
        <BlurCircle top="-100px" left="-100px"/>
        <BlurCircle bottom="0" right="0"/>
        <h1 className='text-2xl font-semibold mb-4'>Select your seat</h1>
        <p className='text-gray-400 text-sm mb-6'>FIELD SIDE</p>
        <div className='flex flex-col items-center mt-10 text-xs text-gray-300'>
          <div className='grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6'>
            {groupRows[0].map(row => renderSeats(row))}
          </div>
          <div className='grid grid-cols-2 gap-11'>
            {groupRows.slice(1).map((group, idx)=> (
              <div key={idx}>
                {group.map(row => renderSeats(row))}
              </div>
            ))}
          </div>
        </div>
        <button onClick={bookTickets} className='flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95'>
          Proceed to Checkout
          <ArrowRightIcon strokeWidth={3} className="w-4 h-4"/>
        </button>
      </div>
    </div>
  ) : (
    <Loading />
  )
}

export default SportsSeatLayout



