import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../components/Loading'
import { Check, Ticket } from 'lucide-react'
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

  if (loading) return <Loading />

  if (!event) return null

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

export default NightlifeTicketSelection
