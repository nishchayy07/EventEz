import React, { useEffect, useMemo, useState } from 'react'
import Loading from '../components/Loading'
import BlurCircle from '../components/BlurCircle'
import timeFormat from '../lib/timeFormat'
import { dateFormat } from '../lib/dateFormat'
import { useAppContext } from '../context/AppContext'
import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import toast from 'react-hot-toast'

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY || '₹'

  const { axios, getToken, user, image_base_url} = useAppContext()

  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState(null)

  const getMyBookings = async () =>{
    try {
      const {data} = await axios.get('/api/user/bookings', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
        if (data.success) {
          setBookings(data.bookings)
        }

    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  useEffect(()=>{
    if(user){
      getMyBookings()
    }
    
  },[user])

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? You will receive a 50% refund.')) {
      return
    }

    setCancellingId(bookingId)
    try {
      const { data } = await axios.post(`/api/booking/cancel/${bookingId}`, {}, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })

      if (data.success) {
        toast.success(`Booking cancelled! Refund: ${currency}${data.data.refundAmount}`)
        // Refresh bookings list
        await getMyBookings()
      } else {
        toast.error(data.message || 'Failed to cancel booking')
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to cancel booking'
      toast.error(message)
    } finally {
      setCancellingId(null)
    }
  }

  const verifyBaseUrl = useMemo(() => {
    if (typeof window === 'undefined') return ''
    return window.location.origin
  }, [])

  return !isLoading ? (
    <div className='relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]'>
      <BlurCircle top="100px" left="100px"/>
      <div>
        <BlurCircle bottom="0px" left="600px"/>
      </div>
      <h1 className='text-lg font-semibold mb-4'>My Bookings</h1>

      {bookings.map((item,index)=>{
        const isSport = item.type === 'sport';
        const isNightlife = item.type === 'nightlife';
        const isMovie = item.type === 'movie';
        
        // Get event details based on type
        const eventTitle = isSport ? item.sportEvent?.title : 
                         isNightlife ? item.nightlifeEvent?.title : 
                         item.show?.movie?.title || 'Event';
        const eventImage = isSport ? item.sportEvent?.image : 
                          isNightlife ? item.nightlifeEvent?.image || item.nightlifeEvent?.landscapeImage : 
                          image_base_url + (item.show?.movie?.poster_path || '');
        const eventSubtitle = isSport ? item.sportEvent?.venue : 
                             isNightlife ? item.nightlifeEvent?.venue : 
                             timeFormat(item.show?.movie?.runtime || 0);
        const eventDate = isSport ? item.sportEvent?.showDateTime : 
                         isNightlife ? item.nightlifeEvent?.showDateTime : 
                         item.show?.showDateTime;
        
        return (
          <div key={index} className='flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl'>
            <div className='flex flex-col md:flex-row'>
              <img src={eventImage || ''} alt="" className='md:max-w-45 aspect-video h-auto object-cover object-bottom rounded'/>
              <div className='flex flex-col p-4'>
                <p className='text-lg font-semibold'>{eventTitle}</p>
                <p className='text-gray-400 text-sm'>{eventSubtitle}</p>
                <p className='text-gray-400 text-sm mt-auto'>{eventDate ? dateFormat(eventDate) : '—'}</p>
              </div>
            </div>

            <div className='flex flex-col md:items-end md:text-right justify-between p-4'>
              <div className='flex items-center gap-4'>
                <div className='text-right'>
                  {item.isCancelled ? (
                    <>
                      <p className='text-lg text-gray-500 line-through mb-1'>{currency}{item.amount}</p>
                      <p className='text-2xl font-semibold text-red-400'>Cancelled</p>
                      {item.refundAmount && (
                        <p className='text-sm text-green-400 mt-1'>Refund: {currency}{item.refundAmount}</p>
                      )}
                    </>
                  ) : (
                    <p className='text-2xl font-semibold mb-3'>{currency}{item.amount}</p>
                  )}
                </div>
                {!item.isPaid && !item.isCancelled && (
                  <Link to={item.paymentLink} className='bg-primary px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer'>
                    Pay Now
                  </Link>
                )}
              </div>
              <div className='text-sm'>
                <p><span className='text-gray-400'>Total Tickets:</span> {item.bookedSeats.length}</p>
                <p><span className='text-gray-400'>Seat Number:</span> {item.bookedSeats.join(", ")}</p>
              </div>
              
              {/* Cancel Button */}
              {item.isPaid && !item.isCancelled && !item.qrUsed && (
                <div className='mt-4 flex flex-col items-end gap-2'>
                  <button
                    onClick={() => handleCancelBooking(item._id)}
                    disabled={cancellingId === item._id}
                    className='px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 text-sm rounded-lg font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                  >
                    {cancellingId === item._id ? 'Cancelling...' : 'Cancel Ticket'}
                  </button>
                  <p className='text-xs text-gray-500'>
                    Refund: {currency}{(item.amount * 0.5).toFixed(2)} (50% deduction)
                  </p>
                </div>
              )}

              {/* Cancelled Status */}
              {item.isCancelled && (
                <div className='mt-4 flex flex-col items-end'>
                  <p className='text-sm text-red-400 font-medium'>Booking Cancelled</p>
                  {item.cancelledAt && (
                    <p className='text-xs text-gray-500 mt-1'>
                      {new Date(item.cancelledAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}

              {/* QR Code */}
              {item.isPaid && item.qrToken && !item.isCancelled && (
                <div className='mt-4 flex flex-col items-end'>
                  <p className='text-sm text-gray-400 mb-2'>
                    {item.qrUsed ? 'QR already validated' : 'Show this QR at entry'}
                  </p>
                  <div className='bg-white rounded-xl p-3 shadow-2xl'>
                    <QRCodeSVG
                      value={`${verifyBaseUrl}/verify/${item.qrToken}`}
                      size={160}
                      bgColor='#ffffff'
                      fgColor='#000000'
                      includeMargin
                      level='M'
                    />
                  </div>
                  <p className='text-[11px] text-gray-500 mt-2 break-all'>
                    {verifyBaseUrl}/verify/{item.qrToken}
                  </p>
                </div>
              )}

              {/* Cannot Cancel Message */}
              {item.isPaid && item.qrUsed && !item.isCancelled && (
                <div className='mt-4 flex flex-col items-end'>
                  <p className='text-xs text-gray-500 italic'>Ticket already used - Cannot cancel</p>
                </div>
              )}
            </div>

          </div>
        )
      })}

    </div>
  ) : <Loading />
}

export default MyBookings
