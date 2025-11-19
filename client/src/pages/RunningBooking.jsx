import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import Loading from '../components/Loading'
import BlurCircle from '../components/BlurCircle'
import { Calendar, MapPin, Users, Trophy, Clock, CheckCircle2, Sparkles, Crown, Zap, Star, Activity, Target } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

const RunningBooking = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { axios, getToken, user } = useAppContext()
  
  const [event, setEvent] = useState(null)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [ticketCount, setTicketCount] = useState(1)
  const [loading, setLoading] = useState(true)
  const [hoveredTicket, setHoveredTicket] = useState(null)
  const [priceAnimation, setPriceAnimation] = useState(false)

  // Professional running event ticket types with enhanced styling
  const ticketTypes = [
    {
      id: 'spectator',
      name: 'Spectator Pass',
      description: 'General admission to watch the race',
      price: 40,
      features: [
        'Access to race viewing areas',
        'Live race coverage',
        'Race commentary',
        'Refreshments available'
      ],
      color: '#4B5563',
      lightColor: '#6B7280',
      icon: Users,
      gradient: 'from-gray-500 to-gray-600',
      badge: 'Popular'
    },
    {
      id: 'premium',
      name: 'Premium Viewing',
      description: 'Enhanced viewing experience at prime locations',
      price: 80,
      features: [
        'Priority viewing positions',
        'Access to premium areas',
        'Professional race analysis',
        'Complimentary refreshments',
        'Race program included'
      ],
      color: '#DC2626',
      lightColor: '#EF4444',
      icon: Star,
      gradient: 'from-red-600 to-orange-600',
      badge: 'Recommended'
    },
    {
      id: 'vip',
      name: 'VIP Experience',
      description: 'Exclusive access with special privileges',
      price: 200,
      features: [
        'Best viewing locations',
        'Meet & greet with runners',
        'Behind-the-scenes access',
        'Gourmet refreshments',
        'Signed race memorabilia',
        'Exclusive VIP lounge access',
        'Professional race analysis'
      ],
      color: '#EA580C',
      lightColor: '#F97316',
      icon: Crown,
      gradient: 'from-orange-500 to-red-500',
      badge: 'Premium'
    },
    {
      id: 'runner',
      name: 'Runner Registration',
      description: 'For participating in the race',
      price: 120,
      features: [
        'Race entry',
        'Official race bib & timing chip',
        'All amenities included',
        'Finisher certificate',
        'Prize eligibility',
        'Race timing updates',
        'Medical support'
      ],
      color: '#059669',
      lightColor: '#10B981',
      icon: Activity,
      gradient: 'from-green-500 to-emerald-600',
      badge: 'Runner'
    }
  ]

  useEffect(() => {
    if (selectedTicket) {
      setPriceAnimation(true)
      setTimeout(() => setPriceAnimation(false), 500)
    }
  }, [ticketCount, selectedTicket?.price])

  const getEvent = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`/api/sports/event/${id}`)
      if (data.success) {
        setEvent(data.event)
        // Auto-select spectator ticket by default
        const spectatorTicket = ticketTypes.find(t => t.id === 'spectator')
        setSelectedTicket(spectatorTicket)
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to load event')
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = async () => {
    if (!user) {
      toast.error('Please login to proceed')
      return
    }

    if (!selectedTicket) {
      toast.error('Please select a ticket type')
      return
    }

    try {
      // Create booking for running event
      // Use ticket type and count as seat identifiers for the booking system
      const seatIdentifiers = Array.from({ length: ticketCount }, (_, i) => 
        `${selectedTicket.id}-${i + 1}`
      )
      
      const totalAmount = selectedTicket.price * ticketCount

      const { data } = await axios.post('/api/sports/booking/create', {
        eventId: id,
        selectedSeats: seatIdentifiers,
        customAmount: totalAmount  // Pass custom amount for running ticket pricing
      }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })

      if (data.success) {
        window.location.href = data.url
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking')
    }
  }

  useEffect(() => {
    getEvent()
  }, [id])

  if (loading || !event) {
    return <Loading />
  }

  const isRunning = event.sport?.toLowerCase() === 'running'

  return (
    <div className="min-h-screen px-6 md:px-16 lg:px-40 pt-30 md:pt-40 pb-20 relative overflow-hidden">
      <BlurCircle top="-100px" left="-100px" />
      <BlurCircle bottom="0" right="0" />
      
      {/* Animated background running track pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 80px),
                            repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 80px)`,
          backgroundSize: '80px 80px'
        }}></div>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 border border-red-500/50 rounded-full mb-6 backdrop-blur-sm shadow-lg shadow-red-500/20"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Activity className="w-5 h-5 text-red-400" />
            </motion.div>
            <span className="text-sm font-semibold text-red-400 uppercase tracking-wider">Running Event</span>
            <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-red-400 via-orange-400 via-red-500 to-orange-500 bg-clip-text text-transparent leading-tight"
            style={{
              backgroundSize: '200% 200%',
              animation: 'gradient-shift 3s ease infinite'
            }}
          >
            {event.title}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-gray-300 text-xl max-w-2xl mx-auto font-medium"
          >
            Professional Running Event - Reserve your tickets now
          </motion.p>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-8 mt-12"
          >
            <div className="flex items-center gap-2 text-red-400">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>
              <span className="text-sm font-semibold">Live Registration</span>
            </div>
            <div className="flex items-center gap-2 text-orange-400">
              <Users className="w-4 h-4" />
              <span className="text-sm font-semibold">Limited Spots Available</span>
            </div>
            <div className="flex items-center gap-2 text-yellow-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-semibold">Secure Your Spot Now</span>
            </div>
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Event Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-800/50 sticky top-32 shadow-2xl shadow-red-500/10 hover:shadow-red-500/20 transition-all duration-500"
            >
              {/* Event Image */}
              {event.image && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-full h-56 rounded-2xl overflow-hidden mb-6 relative group"
                >
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                    <p className="text-white font-semibold text-sm">Professional Running Event</p>
                  </div>
                </motion.div>
              )}

              {/* Event Details */}
              <div className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-all duration-300 group"
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    className="p-2 rounded-lg bg-red-500/20 group-hover:bg-red-500/30 transition-colors"
                  >
                    <Calendar className="w-5 h-5 text-red-400" />
                  </motion.div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Date & Time</p>
                    <p className="text-white font-semibold leading-relaxed">
                      {new Date(event.showDateTime).toLocaleString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-all duration-300 group"
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    className="p-2 rounded-lg bg-orange-500/20 group-hover:bg-orange-500/30 transition-colors"
                  >
                    <MapPin className="w-5 h-5 text-orange-400" />
                  </motion.div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Venue</p>
                    <p className="text-white font-semibold">{event.venue || 'TBA'}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-all duration-300 group"
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    className="p-2 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors"
                  >
                    <Clock className="w-5 h-5 text-blue-400" />
                  </motion.div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Duration</p>
                    <p className="text-white font-semibold">Full Day Event</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-all duration-300 group"
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    className="p-2 rounded-lg bg-yellow-500/20 group-hover:bg-yellow-500/30 transition-colors"
                  >
                    <Target className="w-5 h-5 text-yellow-400" />
                  </motion.div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Format</p>
                    <p className="text-white font-semibold">Professional Race</p>
                  </div>
                </motion.div>
              </div>

              {/* Price Summary */}
              <AnimatePresence mode="wait">
                {selectedTicket && (
                  <motion.div
                    key={selectedTicket.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mt-8 pt-6 border-t border-gray-800"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-800/30">
                        <span className="text-sm text-gray-400 uppercase tracking-wider">Ticket Type</span>
                        <span className="text-white font-bold text-sm" style={{ color: selectedTicket.lightColor }}>
                          {selectedTicket.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-800/30">
                        <span className="text-sm text-gray-400 uppercase tracking-wider">Quantity</span>
                        <span className="text-white font-bold">{ticketCount}</span>
                      </div>
                      <motion.div
                        animate={{ scale: priceAnimation ? [1, 1.05, 1] : 1 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-between pt-4 pb-2 border-t-2 border-red-500/30 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-xl p-4"
                      >
                        <span className="text-lg font-bold text-gray-300">Total</span>
                        <motion.span
                          key={`${selectedTicket.price}-${ticketCount}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-3xl font-extrabold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent"
                        >
                          ${(selectedTicket.price * ticketCount).toFixed(2)}
                        </motion.span>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right Side - Ticket Selection */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  Select Your Ticket Type
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {ticketTypes.map((ticket, index) => {
                  const Icon = ticket.icon || Activity
                  const isSelected = selectedTicket?.id === ticket.id
                  const isHovered = hoveredTicket === ticket.id
                  
                  return (
                    <motion.div
                      key={ticket.id}
                      initial={{ opacity: 0, y: 30, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.2 + index * 0.1, duration: 0.5, type: "spring", stiffness: 100 }}
                      whileHover={{ 
                        scale: 1.03,
                        y: -5,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.97 }}
                      onHoverStart={() => setHoveredTicket(ticket.id)}
                      onHoverEnd={() => setHoveredTicket(null)}
                      onClick={() => {
                        setSelectedTicket(ticket)
                        if (ticketCount > 1 && ticket.price !== selectedTicket?.price) {
                          setTicketCount(1)
                        }
                      }}
                      className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 overflow-hidden group ${
                        isSelected
                          ? 'shadow-2xl'
                          : 'border-gray-800 bg-gradient-to-br from-gray-900/60 via-gray-900/40 to-gray-900/60 hover:border-gray-700'
                      }`}
                      style={{
                        boxShadow: isSelected
                          ? `0 20px 40px ${ticket.color}40, 0 0 60px ${ticket.color}20, inset 0 0 40px ${ticket.color}10`
                          : isHovered
                          ? `0 10px 30px ${ticket.color}20`
                          : '0 4px 12px rgba(0,0,0,0.3)',
                        borderColor: isSelected ? ticket.lightColor : undefined,
                        background: isSelected
                          ? `linear-gradient(to bottom right, ${ticket.color}33, ${ticket.color}1a, transparent)`
                          : undefined
                      }}
                    >
                      {/* Animated background gradient */}
                      <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: `radial-gradient(circle at ${isHovered ? '50% 50%' : '20% 20%'}, ${ticket.color}15, transparent 70%)`
                        }}
                        animate={{
                          background: isHovered 
                            ? `radial-gradient(circle at 50% 50%, ${ticket.color}20, transparent 70%)`
                            : `radial-gradient(circle at 20% 20%, ${ticket.color}10, transparent 70%)`
                        }}
                      />

                      {/* Badge */}
                      {ticket.badge && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                          className="absolute top-4 right-4 z-10"
                        >
                          <span
                            className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm"
                            style={{
                              backgroundColor: ticket.color + '30',
                              color: ticket.lightColor,
                              borderColor: ticket.color,
                              borderWidth: '1px',
                              boxShadow: `0 0 10px ${ticket.color}40`
                            }}
                          >
                            {ticket.badge}
                          </span>
                        </motion.div>
                      )}

                      {/* Selected indicator */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="absolute top-4 right-4 z-10"
                          >
                            <div className="relative">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0"
                              >
                                <div
                                  className="w-8 h-8 rounded-full border-2 animate-ping"
                                  style={{ borderColor: ticket.lightColor }}
                                />
                              </motion.div>
                              <CheckCircle2 
                                className="w-8 h-8 relative z-10"
                                style={{ color: ticket.lightColor }}
                                fill={ticket.lightColor}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Icon with animation */}
                      <motion.div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 relative overflow-hidden ${
                          isSelected ? 'shadow-lg' : ''
                        }`}
                        style={{
                          backgroundColor: isSelected ? ticket.color + '30' : ticket.color + '20',
                          borderColor: ticket.lightColor,
                          borderWidth: '2px',
                          boxShadow: isSelected ? `0 0 20px ${ticket.color}50` : 'none'
                        }}
                        animate={{
                          scale: isHovered ? 1.1 : isSelected ? 1.05 : 1,
                          rotate: isHovered ? [0, -5, 5, 0] : 0
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <Icon
                          className="w-8 h-8 relative z-10"
                          style={{ color: ticket.lightColor }}
                        />
                        {isSelected && (
                          <motion.div
                            className="absolute inset-0"
                            style={{
                              background: `radial-gradient(circle, ${ticket.color}40, transparent)`
                            }}
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.5, 0, 0.5]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                      </motion.div>

                      {/* Title */}
                      <motion.h3
                        className={`text-2xl font-bold mb-2 ${isSelected ? '' : ''}`}
                        style={{ color: ticket.lightColor }}
                        animate={{
                          scale: isHovered ? 1.05 : 1
                        }}
                      >
                        {ticket.name}
                      </motion.h3>

                      <p className="text-gray-300 text-sm mb-5 leading-relaxed">{ticket.description}</p>

                      {/* Price */}
                      <motion.div
                        className="mb-5 pb-5 border-b border-gray-800"
                        animate={{
                          scale: isSelected ? 1.02 : 1
                        }}
                      >
                        <div className="flex items-baseline gap-2">
                          <motion.span
                            className="text-4xl font-extrabold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                            animate={{
                              scale: isHovered ? 1.1 : 1
                            }}
                          >
                            ${ticket.price}
                          </motion.span>
                          <span className="text-gray-400 text-sm font-medium">per ticket</span>
                        </div>
                      </motion.div>

                      {/* Features */}
                      <ul className="space-y-3">
                        {ticket.features.map((feature, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 + idx * 0.05 }}
                            className="flex items-start gap-3 text-sm"
                          >
                            <motion.div
                              animate={{
                                scale: isSelected && idx < 3 ? [1, 1.2, 1] : 1,
                                rotate: isSelected && idx < 3 ? [0, 10, -10, 0] : 0
                              }}
                              transition={{ delay: idx * 0.1, duration: 0.5 }}
                              className="mt-0.5 flex-shrink-0"
                            >
                              <CheckCircle2
                                className="w-5 h-5"
                                style={{
                                  color: ticket.lightColor,
                                  filter: isSelected ? `drop-shadow(0 0 6px ${ticket.color})` : 'none'
                                }}
                                fill={isSelected ? ticket.lightColor : 'none'}
                              />
                            </motion.div>
                            <span className="text-gray-300 leading-relaxed">{feature}</span>
                          </motion.li>
                        ))}
                      </ul>

                      {/* Hover overlay effect */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none"
                        style={{
                          background: `linear-gradient(135deg, ${ticket.color}10, transparent)`,
                          transition: 'opacity 0.3s'
                        }}
                      />
                    </motion.div>
                  )
                })}
              </div>

              {/* Ticket Quantity Selector */}
              <AnimatePresence>
                {selectedTicket && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -20, height: 0 }}
                    transition={{ duration: 0.4, type: "spring" }}
                    className="bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border-2 border-red-500/30 mb-8 shadow-2xl shadow-red-500/10 overflow-hidden relative"
                  >
                    {/* Animated background */}
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        background: `radial-gradient(circle at 50% 50%, ${selectedTicket.color}40, transparent 70%)`,
                        animation: 'pulse 3s ease-in-out infinite'
                      }}
                    />

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-white">Select Quantity</h3>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/50">
                          <Users className="w-4 h-4 text-red-400" />
                          <span className="text-xs text-red-400 font-semibold">Max 10</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <motion.button
                          whileHover={{ scale: 1.1, backgroundColor: selectedTicket.color + '20' }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                          disabled={ticketCount <= 1}
                          className={`w-14 h-14 rounded-xl border-2 transition-all flex items-center justify-center ${
                            ticketCount <= 1
                              ? 'border-gray-700 bg-gray-800/50 text-gray-600 cursor-not-allowed'
                              : 'bg-gray-800/50 text-white'
                          }`}
                          style={{
                            borderColor: ticketCount > 1 ? selectedTicket.lightColor : undefined,
                            backgroundColor: ticketCount > 1 ? 'transparent' : undefined
                          }}
                          onMouseEnter={(e) => {
                            if (ticketCount > 1) {
                              e.currentTarget.style.borderColor = selectedTicket.lightColor
                              e.currentTarget.style.backgroundColor = selectedTicket.color + '33'
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (ticketCount > 1) {
                              e.currentTarget.style.borderColor = selectedTicket.lightColor
                              e.currentTarget.style.backgroundColor = 'transparent'
                            }
                          }}
                        >
                          <span className="text-2xl font-bold">−</span>
                        </motion.button>

                        <motion.div
                          key={ticketCount}
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="relative"
                        >
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={ticketCount}
                            onChange={(e) => setTicketCount(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                            className="w-24 h-14 text-center text-3xl font-extrabold bg-gradient-to-br from-gray-800 to-gray-900 border-2 rounded-xl py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
                            style={{
                              borderColor: selectedTicket.lightColor
                            }}
                          />
                          <motion.div
                            animate={{ scale: priceAnimation ? [1, 1.2, 1] : 1 }}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{
                              backgroundColor: selectedTicket.lightColor,
                              color: 'white'
                            }}
                          >
                            {ticketCount}
                          </motion.div>
                        </motion.div>

                        <motion.button
                          whileHover={{ scale: 1.1, backgroundColor: selectedTicket.color + '20' }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setTicketCount(Math.min(10, ticketCount + 1))}
                          disabled={ticketCount >= 10}
                          className={`w-14 h-14 rounded-xl border-2 transition-all flex items-center justify-center ${
                            ticketCount >= 10
                              ? 'border-gray-700 bg-gray-800/50 text-gray-600 cursor-not-allowed'
                              : 'bg-gray-800/50 text-white'
                          }`}
                          style={{
                            borderColor: ticketCount < 10 ? selectedTicket.lightColor : undefined,
                            backgroundColor: ticketCount < 10 ? 'transparent' : undefined
                          }}
                          onMouseEnter={(e) => {
                            if (ticketCount < 10) {
                              e.currentTarget.style.borderColor = selectedTicket.lightColor
                              e.currentTarget.style.backgroundColor = selectedTicket.color + '33'
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (ticketCount < 10) {
                              e.currentTarget.style.borderColor = selectedTicket.lightColor
                              e.currentTarget.style.backgroundColor = 'transparent'
                            }
                          }}
                        >
                          <span className="text-2xl font-bold">+</span>
                        </motion.button>

                        <div className="flex-1 ml-4">
                          <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="w-4 h-4 text-red-400" />
                            <span className="text-sm text-gray-400 font-medium">Tickets Selected</span>
                          </div>
                          <motion.p
                            key={ticketCount}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-xl font-bold"
                            style={{ color: selectedTicket.lightColor }}
                          >
                            {ticketCount} {ticketCount === 1 ? 'ticket' : 'tickets'}
                          </motion.p>
                        </div>
                      </div>

                      {/* Progress indicator */}
                      <div className="mt-6">
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background: `linear-gradient(90deg, ${selectedTicket.color}, ${selectedTicket.lightColor})`
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${(ticketCount / 10) * 100}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          {10 - ticketCount} tickets remaining
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Book Button */}
              <AnimatePresence mode="wait">
                {selectedTicket ? (
                  <motion.button
                    key="enabled"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: `0 20px 40px ${selectedTicket.color}50`
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBooking}
                    className="relative w-full py-5 px-8 rounded-2xl font-bold text-lg text-white shadow-2xl overflow-hidden group"
                    style={{
                      background: `linear-gradient(135deg, ${selectedTicket.color}, ${selectedTicket.lightColor})`,
                      boxShadow: `0 10px 30px ${selectedTicket.color}40`
                    }}
                  >
                    {/* Animated background */}
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(135deg, ${selectedTicket.lightColor}, ${selectedTicket.color})`
                      }}
                      animate={{
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />

                    {/* Button content */}
                    <div className="relative z-10 flex items-center justify-center gap-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-5 h-5" />
                      </motion.div>
                      <span className="text-lg font-extrabold">Proceed to Checkout</span>
                      <motion.span
                        key={`${selectedTicket.price}-${ticketCount}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="bg-white/20 px-4 py-1 rounded-full font-bold backdrop-blur-sm border border-white/30"
                      >
                        ${(selectedTicket.price * ticketCount).toFixed(2)}
                      </motion.span>
                    </div>

                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{
                        x: ['-100%', '200%']
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1,
                        ease: "linear"
                      }}
                    />
                  </motion.button>
                ) : (
                  <motion.button
                    key="disabled"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    disabled
                    className="w-full py-5 px-8 rounded-2xl font-bold text-lg bg-gray-800 text-gray-500 cursor-not-allowed border-2 border-gray-700"
                  >
                    Select a ticket type to continue
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Add CSS animation for gradient */}
      <style>{`
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  )
}

export default RunningBooking

