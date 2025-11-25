import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const formatDateTime = (value) => {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleString()
  } catch {
    return value
  }
}

const VerifyTicket = () => {
  const currency = import.meta.env.VITE_CURRENCY || '₹'
  const { token } = useParams()
  const { axios } = useAppContext()
  const [status, setStatus] = useState('verifying')
  const [message, setMessage] = useState('')
  const [details, setDetails] = useState(null)

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await axios.post(`/api/booking/verify/${token}`)
        if (data.success) {
          setStatus('success')
          setMessage('Ticket valid. Entry granted.')
          setDetails(data.data)
        } else {
          setStatus('error')
          setMessage(data.message || 'Verification failed')
          setDetails(data.data || null)
        }
      } catch (e) {
        setStatus('error')
        setMessage(e.response?.data?.message || e.message)
        setDetails(e.response?.data?.data || null)
      }
    }
    if (token) verify()
  }, [axios, token])

  return (
    <div className='min-h-[60vh] flex items-center justify-center px-6'>
      <div className={`max-w-xl w-full rounded-xl p-8 ${status==='success' ? 'bg-green-500/10 border border-green-500/30' : status==='error' ? 'bg-red-500/10 border border-red-500/30' : 'bg-white/5 border border-white/10' }`}>
        <h1 className='text-2xl font-semibold mb-2 text-center'>Ticket Verification</h1>
        <p className='text-gray-300 text-center mb-6'>{status==='verifying' ? 'Verifying your ticket...' : message}</p>

        {details?.booking && (
          <div className='grid sm:grid-cols-2 gap-4 text-sm text-gray-200'>
            <div>
              <p className='text-gray-400 uppercase tracking-wide text-xs'>Event</p>
              <p className='font-medium'>{details.booking.title}</p>
            </div>
            <div>
              <p className='text-gray-400 uppercase tracking-wide text-xs'>Type</p>
              <p className='font-medium capitalize'>{details.booking.type}</p>
            </div>
            <div>
              <p className='text-gray-400 uppercase tracking-wide text-xs'>Seats</p>
              <p className='font-medium'>{details.booking.seats?.join(', ')}</p>
            </div>
            <div>
              <p className='text-gray-400 uppercase tracking-wide text-xs'>Date & Time</p>
              <p className='font-medium'>{formatDateTime(details.booking.date)}</p>
            </div>
            <div>
              <p className='text-gray-400 uppercase tracking-wide text-xs'>Amount</p>
              <p className='font-medium'>{currency}{details.booking.amount}</p>
            </div>
            <div>
              <p className='text-gray-400 uppercase tracking-wide text-xs'>Status</p>
              <p className='font-medium'>{details.booking.qrUsed ? `Used at ${formatDateTime(details.booking.qrUsedAt)}` : 'Not used yet'}</p>
            </div>
          </div>
        )}

        {details?.attendee && (
          <div className='mt-6 text-sm text-gray-200 text-center'>
            <p className='text-gray-400 uppercase tracking-wide text-xs mb-1'>Attendee</p>
            <p className='font-medium'>{details.attendee.name}</p>
            <p className='text-gray-400 text-xs'>{details.attendee.email}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default VerifyTicket
