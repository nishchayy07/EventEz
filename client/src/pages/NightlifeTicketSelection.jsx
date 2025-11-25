import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../components/Loading'
import { Check, Ticket, Calendar, MapPin, Clock, Users, Sparkles, Crown } from 'lucide-react'
import BlurCircle from '../components/BlurCircle'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const NightlifeTicketSelection = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { axios, getToken, user } = useAppContext()

  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedTicketType, setSelectedTicketType] = useState(null)

  // Check if event is a music/concert event
  const isMusicEvent = useMemo(() => {
    if (!event) return false
    const category = (event.category || '').toLowerCase().trim()
    const title = (event.title || '').toLowerCase()
    
    // Check category
    const isConcertCategory = category.includes('concert') || 
                              category === 'concerts' ||
                              category.includes('live music') ||
                              category.includes('music')
    
    // Also check title for music-related keywords
    const isMusicTitle = title.includes('concert') || 
                         title.includes('music festival') ||
                         title.includes('tour')
    
    return isConcertCategory || isMusicTitle
  }, [event])

  // Fetch event details
  const fetchEventDetails = async () => {
    try {
      const { data } = await axios.get(`/api/nightlife/event/${id}`)
      if (data.success) {
        setEvent(data.event)
      } else {
        toast.error('Event not found')
        navigate('/nightlife')
      }
    } catch (error) {
      console.error('Error fetching event:', error)
      toast.error('Failed to load event details')
      navigate('/nightlife')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEventDetails()
  }, [id])

  // Calculate ticket prices
  const getTicketPrices = () => {
    if (!event) return { standard: 0, silver: 0, gold: 0 }
    
    const basePrice = parseInt(event.price.replace(/[^0-9]/g, ''))
    
    return {
      standard: basePrice,
      silver: basePrice + 200,
      gold: basePrice + 400
    }
  }

  const ticketPrices = getTicketPrices()

  const ticketTypes = [
    {
      type: 'standard',
      name: 'Standard',
      price: ticketPrices.standard,
      features: ['Standard Seating', 'General Access', 'Basic Amenities'],
      color: 'from-gray-400 to-gray-600',
      icon: '🎫'
    },
    {
      type: 'silver',
      name: 'Silver',
      price: ticketPrices.silver,
      features: ['Premium Seating', 'Priority Entry', 'Complimentary Beverage', 'Lounge Access'],
      color: 'from-gray-300 to-gray-500',
      icon: '🥈',
      popular: true
    },
    {
      type: 'gold',
      name: 'Gold',
      price: ticketPrices.gold,
      features: ['VIP Seating', 'VIP Entry', 'Welcome Drink', 'VIP Lounge Access', 'Reserved Parking'],
      color: 'from-yellow-400 to-yellow-600',
      icon: '🥇'
    }
  ]

  const handleTicketSelection = (ticketType) => {
    setSelectedTicketType(ticketType)
  }

  const handleProceed = async () => {
    if (!user) {
      toast.error('Please login to proceed')
      return
    }
    
    if (!selectedTicketType) {
      toast.error('Please select a ticket type')
      return
    }

    try {
      // Create booking for nightlife event with selected ticket type
      const { data } = await axios.post('/api/nightlife/ticket/booking/create', {
        eventId: id,
        ticketType: selectedTicketType.type,
        price: selectedTicketType.price
      }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message || 'Failed to create booking')
    }
  }

  // Render simple ticket selection (for comedy shows and non-music events)
  const renderSimpleTicketSelection = () => {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 relative overflow-hidden">
        <BlurCircle top="10%" left="5%" />
        <BlurCircle top="60%" right="10%" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Ticket className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold">Choose Your Ticket Type</h1>
            </div>
            <p className="text-gray-400 text-lg">{event.title}</p>
            <p className="text-gray-500 text-sm mt-2">
              {event.venue}, {event.location} • {new Date(event.showDateTime).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {/* Ticket Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {ticketTypes.map((ticket) => (
              <div
                key={ticket.type}
                onClick={() => handleTicketSelection(ticket)}
                className={`relative cursor-pointer rounded-2xl p-6 transition-all duration-300 border-2 ${
                  selectedTicketType?.type === ticket.type
                    ? 'border-primary bg-primary/10 scale-105 shadow-xl shadow-primary/20'
                    : 'border-white/10 bg-white/5 hover:border-primary/50 hover:scale-102'
                }`}
              >
                {/* Popular Badge */}
                {ticket.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 rounded-full text-xs font-semibold">
                    MOST POPULAR
                  </div>
                )}

                {/* Selected Indicator */}
                {selectedTicketType?.type === ticket.type && (
                  <div className="absolute top-4 right-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}

                {/* Ticket Icon */}
                <div className="text-center mb-4">
                  <div className="text-5xl mb-2">{ticket.icon}</div>
                  <h3 className="text-2xl font-bold mb-1">{ticket.name}</h3>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl font-bold text-primary">₹{ticket.price}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mt-6">
                  {ticket.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${ticket.color} opacity-5 rounded-2xl pointer-events-none`}
                />
              </div>
            ))}
          </div>

          {/* Proceed Button */}
          <div className="text-center">
            <button
              onClick={handleProceed}
              disabled={!selectedTicketType}
              className={`px-12 py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
                selectedTicketType
                  ? 'bg-primary hover:bg-primary-dull text-white shadow-lg hover:shadow-primary/50'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {selectedTicketType ? `Proceed with ${selectedTicketType.name} - ₹${selectedTicketType.price}` : 'Select a Ticket Type'}
            </button>
          </div>

          {/* Info Section */}
          <div className="mt-12 p-6 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-lg font-semibold mb-4">Ticket Information</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>• All tickets are non-refundable and non-transferable</li>
              <li>• Entry is subject to availability and venue capacity</li>
              <li>• Please carry a valid ID proof for verification</li>
              <li>• Age restriction: {event.ageRestriction || 'As per venue policy'}</li>
              <li>• Duration: {event.duration || 'As per event schedule'}</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  // Render concert-style ticket selection (for music events)
  const renderConcertTicketSelection = () => {
    try {
      const ticketPrices = getTicketPrices()
    const eventDate = new Date(event.showDateTime)
    const formattedDate = eventDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
    const formattedTime = eventDate.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })

    const ticketTypes = [
      {
        type: 'standard',
        name: 'Standard',
        price: ticketPrices.standard,
        features: ['Standard Seating', 'General Access', 'Basic Amenities'],
        gradient: 'from-gray-600 via-gray-700 to-gray-800',
        borderColor: 'border-gray-500/50',
        icon: Ticket,
        badge: null
      },
      {
        type: 'silver',
        name: 'Silver',
        price: ticketPrices.silver,
        features: ['Premium Seating', 'Priority Entry', 'Complimentary Beverage', 'Lounge Access'],
        gradient: 'from-slate-400 via-slate-500 to-slate-600',
        borderColor: 'border-slate-400/60',
        icon: Sparkles,
        badge: 'MOST POPULAR',
        popular: true
      },
      {
        type: 'gold',
        name: 'Gold',
        price: ticketPrices.gold,
        features: ['VIP Seating', 'VIP Entry', 'Welcome Drink', 'VIP Lounge Access', 'Reserved Parking'],
        gradient: 'from-yellow-500 via-amber-500 to-orange-500',
        borderColor: 'border-yellow-400/70',
        icon: Crown,
        badge: 'VIP'
      }
    ]

    return (
      <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, #000000, #111827, #000000)' }}>
        {/* Background Image with Overlay */}
        {event.landscapeImage || event.image ? (
          <div className="fixed inset-0 z-0">
            <img 
              src={event.landscapeImage || event.image} 
              alt={event.title}
              className="w-full h-full object-cover"
              style={{ opacity: 0.2 }}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.6), rgba(0,0,0,0.9))' }} />
          </div>
        ) : (
          <BlurCircle top="10%" left="5%" />
        )}
        
        <div className="relative z-10 pt-20 pb-12 px-4 md:px-8" style={{ minHeight: '100vh' }}>
          <div className="max-w-6xl mx-auto">
            
            {/* Event Header Section */}
            <div className="text-center mb-12 space-y-4">
              {event.category && (
                <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary rounded-full text-sm font-medium border border-primary/30">
                  {event.category}
                </span>
              )}
              <h1 className="text-5xl md:text-6xl font-bold text-white" style={{ 
                background: 'linear-gradient(to right, #ffffff, var(--primary), #ffffff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {event.title}
              </h1>
              {event.artist && (
                <p className="text-2xl text-gray-300 font-medium">feat. {event.artist}</p>
              )}
              
              <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-gray-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>{event.venue}, {event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>{formattedTime}</span>
                </div>
                {event.duration && (
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    <span>{event.duration}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Ticket Selection Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-3">
                <Ticket className="w-8 h-8 text-primary" />
                Choose Your Experience
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {ticketTypes.map((ticket, index) => {
                  const Icon = ticket.icon
                  const isSelected = selectedTicketType?.type === ticket.type
                  
                  return (
                    <div
                      key={ticket.type}
                      onClick={() => handleTicketSelection(ticket)}
                      className={`relative group cursor-pointer transition-all duration-500 ${
                        isSelected ? 'scale-105 z-10' : 'hover:scale-102'
                      }`}
                    >
                      {/* Popular/VIP Badge */}
                      {ticket.badge && (
                        <div className={`absolute -top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full text-xs font-bold ${
                          ticket.popular 
                            ? 'bg-primary text-white shadow-lg shadow-primary/50' 
                            : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black'
                        }`}>
                          {ticket.badge}
                        </div>
                      )}

                      {/* Ticket Card */}
                      <div 
                        className="relative h-full rounded-3xl overflow-hidden border-2 transition-all duration-500"
                        style={{
                          borderColor: ticket.type === 'standard'
                            ? isSelected ? 'rgba(107, 114, 128, 1)' : 'rgba(107, 114, 128, 0.5)'
                            : ticket.type === 'silver'
                            ? isSelected ? 'rgba(148, 163, 184, 1)' : 'rgba(148, 163, 184, 0.5)'
                            : isSelected ? 'rgba(234, 179, 8, 1)' : 'rgba(234, 179, 8, 0.5)',
                          boxShadow: isSelected ? '0 25px 50px -12px rgba(59, 130, 246, 0.3)' : 'none'
                        }}
                      >
                        {/* Gradient Background */}
                        <div 
                          className="absolute inset-0 transition-opacity duration-500"
                          style={{
                            background: ticket.type === 'standard' 
                              ? 'linear-gradient(to bottom right, #4B5563, #374151, #1F2937)'
                              : ticket.type === 'silver'
                              ? 'linear-gradient(to bottom right, #94A3B8, #64748B, #475569)'
                              : 'linear-gradient(to bottom right, #EAB308, #F59E0B, #F97316)',
                            opacity: isSelected ? 1 : 0.6
                          }}
                        />
                        
                        {/* Content Overlay */}
                        <div 
                          className="relative p-6 md:p-8"
                          style={{
                            background: 'rgba(0, 0, 0, 0.4)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)'
                          }}
                        >
                          {/* Selected Checkmark */}
                          {isSelected && (
                            <div className="absolute top-4 right-4 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg animate-pulse">
                              <Check className="w-6 h-6 text-white" />
                            </div>
                          )}

                          {/* Icon */}
                          <div className="flex justify-center mb-6">
                            <div 
                              className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-transform duration-500"
                              style={{
                                background: ticket.type === 'standard' 
                                  ? 'linear-gradient(to bottom right, #4B5563, #374151)'
                                  : ticket.type === 'silver'
                                  ? 'linear-gradient(to bottom right, #94A3B8, #64748B)'
                                  : 'linear-gradient(to bottom right, #EAB308, #F59E0B)',
                                transform: isSelected ? 'scale(1.1)' : 'scale(1)'
                              }}
                            >
                              <Icon className="w-10 h-10 text-white" />
                            </div>
                          </div>

                          {/* Ticket Name */}
                          <h3 className="text-3xl font-bold text-center mb-2 text-white">
                            {ticket.name}
                          </h3>

                          {/* Price */}
                          <div className="text-center mb-6">
                            <div className="text-5xl font-bold text-white mb-1">
                              ₹{ticket.price}
                            </div>
                            <p className="text-gray-400 text-sm">per person</p>
                          </div>

                          {/* Features List */}
                          <div className="space-y-3 mb-6">
                            {ticket.features.map((feature, idx) => (
                              <div key={idx} className="flex items-start gap-3">
                                <div className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  isSelected ? 'bg-primary' : 'bg-white/20'
                                } transition-colors`}>
                                  <Check className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-gray-200 text-sm leading-relaxed">{feature}</span>
                              </div>
                            ))}
                          </div>

                          {/* Hover Effect Overlay */}
                          <div 
                            className="absolute inset-0 transition-opacity duration-500 rounded-3xl"
                            style={{
                              background: 'linear-gradient(to top, rgba(59, 130, 246, 0.2), transparent)',
                              opacity: isSelected ? 1 : 0
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Proceed Button */}
            <div className="text-center mt-12">
              <button 
                onClick={handleProceed}
                disabled={!selectedTicketType}
                className="group relative px-12 py-5 rounded-2xl font-bold text-lg transition-all duration-300 overflow-hidden text-white"
                style={{
                  background: selectedTicketType
                    ? 'linear-gradient(to right, var(--primary), #DB2777, var(--primary))'
                    : '#1F2937',
                  boxShadow: selectedTicketType ? '0 25px 50px -12px rgba(59, 130, 246, 0.5)' : 'none',
                  cursor: selectedTicketType ? 'pointer' : 'not-allowed',
                  transform: selectedTicketType ? 'scale(1)' : 'scale(1)',
                  border: !selectedTicketType ? '1px solid #374151' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (selectedTicketType) {
                    e.currentTarget.style.transform = 'scale(1.05)'
                    e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(59, 130, 246, 0.7)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedTicketType) {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(59, 130, 246, 0.5)'
                  }
                }}
              >
                {selectedTicketType ? (
                  <>
                    <span className="relative z-10 flex items-center gap-2">
                      Continue with {selectedTicketType.name} - ₹{selectedTicketType.price}
                      <Check className="w-5 h-5" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  </>
                ) : (
                  'Select a Ticket Type to Continue'
                )}
              </button>
            </div>

            {/* Event Info Section */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event Details Card */}
              <div 
                className="p-6 rounded-2xl border"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <h3 className="text-xl font-semibold mb-4 text-white">Event Details</h3>
                <div className="space-y-3 text-gray-300">
                  {event.description && (
                    <p className="text-sm leading-relaxed">{event.description}</p>
                  )}
                  {event.ageRestriction && (
                    <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                      <span className="text-primary font-medium">Age Restriction:</span>
                      <span>{event.ageRestriction}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Important Information Card */}
              <div 
                className="p-6 rounded-2xl border"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <h3 className="text-xl font-semibold mb-4 text-white">Important Information</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>All tickets are non-refundable and non-transferable</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Entry is subject to availability and venue capacity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Please carry a valid ID proof for verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>QR code will be sent to your email after payment</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
    } catch (error) {
      console.error('Error in renderConcertTicketSelection:', error)
      return <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div>Error rendering concert style: {error.message}</div>
      </div>
    }
  }

  if (loading) return <Loading />

  if (!event) return null

  // Conditionally render based on event type
  return isMusicEvent ? renderConcertTicketSelection() : renderSimpleTicketSelection()
}

export default NightlifeTicketSelection
