import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { Scanner } from '@yudiel/react-qr-scanner'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const formatDateTime = (dateString) => {
  if (!dateString) return '—'
  try {
    const date = new Date(dateString)
    return date.toLocaleString()
  } catch {
    return dateString
  }
}

const extractToken = (rawValue) => {
  if (!rawValue) return null
  const cleaned = rawValue.trim()
  const match = cleaned.match(/verify\/([a-f0-9]+)/i)
  if (match) {
    return match[1]
  }
  if (/^[a-f0-9]{20,}$/i.test(cleaned)) {
    return cleaned
  }
  return null
}

const StaffScanner = () => {
  const currency = import.meta.env.VITE_CURRENCY || '₹'
  const { axios } = useAppContext()
  const [isProcessing, setIsProcessing] = useState(false)
  const [manualToken, setManualToken] = useState('')
  const [verification, setVerification] = useState(null)
  const [cameraError, setCameraError] = useState(null)
  const [hasPermission, setHasPermission] = useState(null)
  const [isHTTPS, setIsHTTPS] = useState(true)

  // Check if HTTPS is required
  useEffect(() => {
    const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost'
    setIsHTTPS(isSecure)
    if (!isSecure) {
      setCameraError('Camera requires HTTPS connection. Please use https:// or localhost.')
    }
  }, [])

  // Request camera permission
  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        setHasPermission(true)
        // Stop the stream immediately, we just needed to check permission
        stream.getTracks().forEach(track => track.stop())
      } catch (err) {
        setHasPermission(false)
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setCameraError('Camera permission denied. Please allow camera access in your browser settings.')
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setCameraError('No camera found on this device.')
        } else {
          setCameraError(`Camera error: ${err.message}`)
        }
      }
    }

    if (isHTTPS && hasPermission === null) {
      checkCameraPermission()
    }
  }, [isHTTPS, hasPermission])

  const verifyToken = useCallback(async (token) => {
    if (!token || isProcessing) return
    setIsProcessing(true)
    try {
      const { data } = await axios.post(`/api/booking/verify/${token}`)
      setVerification({
        status: 'success',
        message: 'Ticket valid. Entry granted.',
        payload: data.data
      })
      setManualToken('')
      toast.success('Ticket validated')
    } catch (error) {
      const response = error.response?.data
      setVerification({
        status: 'error',
        message: response?.message || 'Verification failed',
        payload: response?.data || null
      })
      toast.error(response?.message || 'Verification failed')
    } finally {
      setIsProcessing(false)
    }
  }, [axios, isProcessing])

  const onScan = useCallback((scanResult) => {
    if (!scanResult || isProcessing) return
    const value = Array.isArray(scanResult) ? scanResult[0]?.rawValue : scanResult?.rawValue || scanResult
    const token = extractToken(value)
    if (!token) {
      toast.error('Unrecognized QR format')
      return
    }
    verifyToken(token)
  }, [verifyToken, isProcessing])

  const handleCameraError = useCallback((err) => {
    console.error('Camera error:', err)
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      setCameraError('Camera permission denied. Please allow camera access and refresh the page.')
      setHasPermission(false)
    } else if (err.name === 'NotFoundError') {
      setCameraError('No camera found on this device.')
    } else if (err.name === 'NotReadableError') {
      setCameraError('Camera is already in use by another application.')
    } else {
      setCameraError(`Camera error: ${err.message || 'Unable to access camera'}`)
    }
    toast.error('Camera access failed. Use manual entry instead.')
  }, [])

  const bookingDetails = useMemo(() => verification?.payload?.booking, [verification])
  const attendee = useMemo(() => verification?.payload?.attendee, [verification])

  const handleManualSubmit = (e) => {
    e.preventDefault()
    const token = manualToken.trim()
    if (!token) return
    verifyToken(token)
  }

  return (
    <div className='min-h-[70vh] flex flex-col gap-8 px-6 py-12'>
      <div className='max-w-4xl w-full mx-auto'>
        <h1 className='text-3xl font-semibold mb-2'>Staff QR Scanner</h1>
        <p className='text-gray-400 mb-6'>Point the camera at the attendee's ticket QR. Each code is valid for a single entry.</p>
        
        {/* Camera Error Message */}
        {cameraError && (
          <div className='mb-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl'>
            <p className='text-yellow-400 text-sm font-medium mb-2'>⚠️ Camera Issue</p>
            <p className='text-yellow-300 text-sm'>{cameraError}</p>
            {!isHTTPS && (
              <p className='text-yellow-300 text-xs mt-2'>
                <strong>Solution:</strong> Access this page via HTTPS or use localhost for development.
              </p>
            )}
            {hasPermission === false && (
              <button
                onClick={() => {
                  setCameraError(null)
                  setHasPermission(null)
                }}
                className='mt-3 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg text-sm text-yellow-300 transition-colors'
              >
                Retry Camera Access
              </button>
            )}
          </div>
        )}

        <div className='bg-white/5 border border-white/10 rounded-2xl overflow-hidden'>
          <div className='w-full aspect-video relative bg-black/20'>
            {hasPermission !== false && !cameraError && (
              <Scanner
                components={{
                  tracker: true,
                  audio: false
                }}
                onScan={onScan}
                onError={handleCameraError}
                constraints={{ 
                  facingMode: 'environment',
                  width: { ideal: 1280 },
                  height: { ideal: 720 }
                }}
                paused={isProcessing}
                className='w-full h-full object-cover'
              />
            )}
            {(hasPermission === false || cameraError) && (
              <div className='absolute inset-0 flex items-center justify-center flex-col gap-4 p-6 text-center'>
                <div className='text-6xl mb-4'>📷</div>
                <p className='text-gray-300 font-medium'>Camera Unavailable</p>
                <p className='text-gray-400 text-sm'>Please use the manual entry below to verify tickets</p>
              </div>
            )}
          </div>
        </div>
        <div className='mt-6'>
          <p className='text-sm text-gray-400 mb-3'>
            {cameraError ? 'Camera unavailable - use manual entry:' : 'Or enter token manually:'}
          </p>
          <form onSubmit={handleManualSubmit} className='flex flex-col sm:flex-row gap-3'>
            <input
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              placeholder='Paste token or full URL (e.g., /verify/abc123...)'
              className='flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none text-white placeholder-gray-500'
            />
            <button
              type='submit'
              disabled={isProcessing || !manualToken.trim()}
              className='px-6 py-3 rounded-xl bg-primary text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors'
            >
              {isProcessing ? 'Verifying...' : 'Verify Token'}
            </button>
          </form>
          <p className='text-xs text-gray-500 mt-2'>
            Tip: You can paste the full verification URL or just the token from the QR code
          </p>
        </div>

        {verification && (
          <div className={`mt-8 border rounded-2xl p-6 ${verification.status === 'success' ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
            <p className='text-lg font-semibold mb-2'>{verification.message}</p>
            {bookingDetails && (
              <div className='grid sm:grid-cols-2 gap-4 text-sm text-gray-200'>
                <div>
                  <p className='text-gray-400 uppercase tracking-wide text-xs'>Event</p>
                  <p className='font-medium'>{bookingDetails.title || '—'}</p>
                </div>
                <div>
                  <p className='text-gray-400 uppercase tracking-wide text-xs'>Type</p>
                  <p className='font-medium capitalize'>{bookingDetails.type}</p>
                </div>
                <div>
                  <p className='text-gray-400 uppercase tracking-wide text-xs'>Seats</p>
                  <p className='font-medium'>{bookingDetails.seats?.join(', ')}</p>
                </div>
                <div>
                  <p className='text-gray-400 uppercase tracking-wide text-xs'>Date & Time</p>
                  <p className='font-medium'>{formatDateTime(bookingDetails.date)}</p>
                </div>
                <div>
                  <p className='text-gray-400 uppercase tracking-wide text-xs'>Amount</p>
                  <p className='font-medium'>{currency}{bookingDetails.amount}</p>
                </div>
                <div>
                  <p className='text-gray-400 uppercase tracking-wide text-xs'>Used At</p>
                  <p className='font-medium'>{bookingDetails.qrUsedAt ? formatDateTime(bookingDetails.qrUsedAt) : 'Not used'}</p>
                </div>
              </div>
            )}
            {attendee && (
              <div className='mt-4 text-sm text-gray-200'>
                <p className='text-gray-400 uppercase tracking-wide text-xs mb-1'>Attendee</p>
                <p className='font-medium'>{attendee.name}</p>
                <p className='text-gray-400 text-xs'>{attendee.email}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default StaffScanner

