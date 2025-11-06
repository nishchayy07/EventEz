import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const VerifyTicket = () => {
  const { token } = useParams()
  const { axios } = useAppContext()
  const [status, setStatus] = useState('verifying')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await axios.post(`/api/booking/verify/${token}`)
        if (data.success) {
          setStatus('success')
          setMessage('Ticket valid. Entry granted.')
        } else {
          setStatus('error')
          setMessage(data.message || 'Verification failed')
        }
      } catch (e) {
        setStatus('error')
        setMessage(e.response?.data?.message || e.message)
      }
    }
    if (token) verify()
  }, [axios, token])

  return (
    <div className='min-h-[60vh] flex items-center justify-center px-6'>
      <div className={`max-w-md w-full rounded-xl p-8 text-center ${status==='success' ? 'bg-green-500/10 border border-green-500/30' : status==='error' ? 'bg-red-500/10 border border-red-500/30' : 'bg-white/5 border border-white/10' }`}>
        <h1 className='text-2xl font-semibold mb-2'>Ticket Verification</h1>
        <p className='text-gray-300'>{status==='verifying' ? 'Verifying your ticket...' : message}</p>
      </div>
    </div>
  )
}

export default VerifyTicket


