import React, { useEffect, useState, useRef } from 'react'



import { useParams } from 'react-router-dom'

import Loading from '../components/Loading'

import { ArrowRightIcon } from 'lucide-react'

import BlurCircle from '../components/BlurCircle'

import toast from 'react-hot-toast'

import { useAppContext } from '../context/AppContext'

import { motion } from 'framer-motion'

const SportsSeatLayout = () => {

  // Stadium stands with correct directions and upper/lower tiers

  const stands = [

    // North Stands

    {

      id: 'north-upper',

      name: 'North Stand - Upper',

      shortName: 'North Upper',

      direction: 'North',

      level: 'Upper',

      startAngle: -45,

      endAngle: 45,

      innerRadius: 36,

      outerRadius: 48,

      rows: ['A', 'B', 'C', 'D'],

      seatsPerRow: 32,

      color: '#FF6B8A',

      lightColor: '#F84565',

      tier: 'Premium'

    },

    {

      id: 'north-lower',

      name: 'North Stand - Lower',

      shortName: 'North Lower',

      direction: 'North',

      level: 'Lower',

      startAngle: -45,

      endAngle: 45,

      innerRadius: 25,

      outerRadius: 35,

      rows: ['A', 'B', 'C', 'D', 'E'],

      seatsPerRow: 32,

      color: '#FF6B8A',

      lightColor: '#F84565',

      tier: 'Premium'

    },

    // South Stands

    {

      id: 'south-upper',

      name: 'South Stand - Upper',

      shortName: 'South Upper',

      direction: 'South',

      level: 'Upper',

      startAngle: 135,

      endAngle: 225,

      innerRadius: 36,

      outerRadius: 48,

      rows: ['A', 'B', 'C', 'D'],

      seatsPerRow: 32,

      color: '#FF6B8A',

      lightColor: '#F84565',

      tier: 'Premium'

    },

    {

      id: 'south-lower',

      name: 'South Stand - Lower',

      shortName: 'South Lower',

      direction: 'South',

      level: 'Lower',

      startAngle: 135,

      endAngle: 225,

      innerRadius: 25,

      outerRadius: 35,

      rows: ['A', 'B', 'C', 'D', 'E'],

      seatsPerRow: 32,

      color: '#FF6B8A',

      lightColor: '#F84565',

      tier: 'Premium'

    },

    // East Stands

    {

      id: 'east-upper',

      name: 'East Stand - Upper',

      shortName: 'East Upper',

      direction: 'East',

      level: 'Upper',

      startAngle: 45,

      endAngle: 135,

      innerRadius: 36,

      outerRadius: 48,

      rows: ['A', 'B', 'C', 'D'],

      seatsPerRow: 30,

      color: '#8B5CF6',

      lightColor: '#A78BFA',

      tier: 'Standard'

    },

    {

      id: 'east-lower',

      name: 'East Stand - Lower',

      shortName: 'East Lower',

      direction: 'East',

      level: 'Lower',

      startAngle: 45,

      endAngle: 135,

      innerRadius: 25,

      outerRadius: 35,

      rows: ['A', 'B', 'C', 'D', 'E'],

      seatsPerRow: 30,

      color: '#8B5CF6',

      lightColor: '#A78BFA',

      tier: 'Standard'

    },

    // West Stands

    {

      id: 'west-upper',

      name: 'West Stand - Upper',

      shortName: 'West Upper',

      direction: 'West',

      level: 'Upper',

      startAngle: 225,

      endAngle: 315,

      innerRadius: 36,

      outerRadius: 48,

      rows: ['A', 'B', 'C', 'D'],

      seatsPerRow: 30,

      color: '#8B5CF6',

      lightColor: '#A78BFA',

      tier: 'Standard'

    },

    {

      id: 'west-lower',

      name: 'West Stand - Lower',

      shortName: 'West Lower',

      direction: 'West',

      level: 'Lower',

      startAngle: 225,

      endAngle: 315,

      innerRadius: 25,

      outerRadius: 35,

      rows: ['A', 'B', 'C', 'D', 'E'],

      seatsPerRow: 30,

      color: '#8B5CF6',

      lightColor: '#A78BFA',

      tier: 'Standard'

    }

  ]

  

  // Convert angles to radians

  const standsWithRadians = stands.map(stand => ({

    ...stand,

    startAngleRad: (stand.startAngle - 90) * (Math.PI / 180),

    endAngleRad: (stand.endAngle - 90) * (Math.PI / 180)

  }))

  const { id } = useParams()

  const [selectedSeats, setSelectedSeats] = useState([])

  const [event, setEvent] = useState(null)

  const [occupiedSeats, setOccupiedSeats] = useState([])

  const [hoveredSeat, setHoveredSeat] = useState(null)

  const [selectedStand, setSelectedStand] = useState(null)

  const [showSeats, setShowSeats] = useState(false)

  const seatsSectionRef = useRef(null)

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

  const handleStandClick = (stand) => {

    setSelectedStand(stand)

    setShowSeats(true)

    // Scroll to seats section after a small delay to ensure DOM has updated

    setTimeout(() => {

      seatsSectionRef.current?.scrollIntoView({ 

        behavior: 'smooth', 

        block: 'start' 

      })

    }, 100)

  }

  const getSeatStatus = (seatId) => {

    if (occupiedSeats.includes(seatId)) return 'occupied'

    if (selectedSeats.includes(seatId)) return 'selected'

    return 'available'

  }

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

  // Helper function to create arc path for stands

  const createArcPath = (cx, cy, innerRadius, outerRadius, startAngle, endAngle) => {

    const x1 = cx + innerRadius * Math.cos(startAngle)

    const y1 = cy + innerRadius * Math.sin(startAngle)

    const x2 = cx + outerRadius * Math.cos(startAngle)

    const y2 = cy + outerRadius * Math.sin(startAngle)

    const x3 = cx + outerRadius * Math.cos(endAngle)

    const y3 = cy + outerRadius * Math.sin(endAngle)

    const x4 = cx + innerRadius * Math.cos(endAngle)

    const y4 = cy + innerRadius * Math.sin(endAngle)

    

    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0

    

    return `M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x1} ${y1} Z`

  }

  const renderStadiumSVG = () => {

    const centerX = 50

    const centerY = 50

    

    return (

      <svg viewBox="0 0 100 100" className="w-full h-full max-w-4xl mx-auto">

        <defs>

          {/* Cricket stadium ground image pattern */}

          <pattern id="stadiumGroundImage" x="0" y="0" width="1" height="1" patternContentUnits="objectBoundingBox">

            <image 

              href="/stadium-ground.png"

              x="-0.05" 

              y="-0.05" 

              width="1.1" 

              height="1.1" 

              preserveAspectRatio="xMidYMid slice"

            />

          </pattern>

          {/* Pitch shadow filter */}

          <filter id="pitchShadow">

            <feGaussianBlur in="SourceAlpha" stdDeviation="0.3"/>

            <feOffset dx="0" dy="0.2" result="offsetblur"/>

            <feComponentTransfer>

              <feFuncA type="linear" slope="0.5"/>

            </feComponentTransfer>

            <feMerge>

              <feMergeNode/>

              <feMergeNode in="SourceGraphic"/>

            </feMerge>

          </filter>

          {/* Stand gradients with enhanced color scheme */}

          {standsWithRadians.map((stand) => {

            const isSelected = selectedStand?.id === stand.id

            return (

              <linearGradient key={`grad-${stand.id}`} id={`gradient-${stand.id}`} x1="0%" y1="0%" x2="100%" y2="100%">

                <stop offset="0%" stopColor={stand.lightColor} stopOpacity={isSelected ? 0.6 : 0.4} />

                <stop offset="50%" stopColor={stand.color} stopOpacity={isSelected ? 0.5 : 0.35} />

                <stop offset="100%" stopColor={stand.color} stopOpacity={isSelected ? 0.45 : 0.3} />

              </linearGradient>

            )

          })}

        </defs>

        {/* Black background */}

        <rect x="0" y="0" width="100" height="100" fill="#000000"/>

        

        {/* Lower stands rendered first (behind) */}

        {standsWithRadians.filter(s => s.level === 'Lower').map((stand) => {

          const isSelected = selectedStand?.id === stand.id

          const path = createArcPath(centerX, centerY, stand.innerRadius, stand.outerRadius, stand.startAngleRad, stand.endAngleRad)

          const midAngle = (stand.startAngleRad + stand.endAngleRad) / 2

          const labelRadius = (stand.innerRadius + stand.outerRadius) / 2

          const labelX = centerX + labelRadius * Math.cos(midAngle)

          const labelY = centerY + labelRadius * Math.sin(midAngle)

          

          return (

            <g key={stand.id}>

              {/* Main stand path with website colors */}

              <path

                d={path}

                fill={`url(#gradient-${stand.id})`}

                stroke={isSelected ? stand.color : '#FFFFFF'}

                strokeWidth={isSelected ? 0.8 : 0.5}

                strokeOpacity={isSelected ? 1 : 0.5}

                className="cursor-pointer transition-all"

                onClick={() => handleStandClick(stand)}

                style={{

                  filter: isSelected ? `drop-shadow(0 0 12px ${stand.color}) drop-shadow(0 0 20px ${stand.color}80)` : 'drop-shadow(0 2px 6px rgba(0,0,0,0.6))',

                  opacity: isSelected ? 1 : 0.92

                }}

              />

              

              {/* Enhanced border separator lines */}

              <line

                x1={centerX + stand.innerRadius * Math.cos(stand.startAngleRad)}

                y1={centerY + stand.innerRadius * Math.sin(stand.startAngleRad)}

                x2={centerX + stand.outerRadius * Math.cos(stand.startAngleRad)}

                y2={centerY + stand.outerRadius * Math.sin(stand.startAngleRad)}

                stroke={isSelected ? stand.color : '#FFFFFF'}

                strokeWidth={isSelected ? 0.5 : 0.4}

                strokeOpacity={isSelected ? 1 : 0.6}

              />

              <line

                x1={centerX + stand.innerRadius * Math.cos(stand.endAngleRad)}

                y1={centerY + stand.innerRadius * Math.sin(stand.endAngleRad)}

                x2={centerX + stand.outerRadius * Math.cos(stand.endAngleRad)}

                y2={centerY + stand.outerRadius * Math.sin(stand.endAngleRad)}

                stroke={isSelected ? stand.color : '#FFFFFF'}

                strokeWidth={isSelected ? 0.5 : 0.4}

                strokeOpacity={isSelected ? 1 : 0.6}

              />

              

              {/* Stand name label with full readable names */}

              <g transform={`translate(${labelX}, ${labelY}) rotate(${(midAngle * 180 / Math.PI) + 90})`}>

                <text

                  x="0"

                  y="-1"

                  textAnchor="middle"

                  dominantBaseline="middle"

                  fill={isSelected ? stand.lightColor : 'rgba(255, 255, 255, 0.95)'}

                  fontSize="2"

                  fontWeight="700"

                  className="pointer-events-none"

                  style={{ 

                    textShadow: isSelected 

                      ? `0 0 10px ${stand.color}, 0 0 15px rgba(0,0,0,1)` 

                      : '0 0 8px rgba(0,0,0,1), 0 0 12px rgba(0,0,0,0.9)',

                    filter: isSelected ? `drop-shadow(0 0 6px ${stand.color})` : 'none'

                  }}

                >

                  {stand.direction}

                </text>

                <text

                  x="0"

                  y="2.5"

                  textAnchor="middle"

                  dominantBaseline="middle"

                  fill={isSelected ? stand.lightColor : 'rgba(255, 255, 255, 0.85)'}

                  fontSize="1.5"

                  fontWeight="600"

                  className="pointer-events-none"

                  style={{ 

                    textShadow: '0 0 6px rgba(0,0,0,1)'

                  }}

                >

                  {stand.level}

                </text>

              </g>

            </g>

          )

        })}

        

        {/* Separator ring between upper and lower stands */}

        <circle cx={centerX} cy={centerY} r="35.5" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.3" strokeDasharray="2,1"/>

        

        {/* Upper stands rendered second (in front of lower) */}

        {standsWithRadians.filter(s => s.level === 'Upper').map((stand) => {

          const isSelected = selectedStand?.id === stand.id

          const path = createArcPath(centerX, centerY, stand.innerRadius, stand.outerRadius, stand.startAngleRad, stand.endAngleRad)

          const midAngle = (stand.startAngleRad + stand.endAngleRad) / 2

          const labelRadius = (stand.innerRadius + stand.outerRadius) / 2

          const labelX = centerX + labelRadius * Math.cos(midAngle)

          const labelY = centerY + labelRadius * Math.sin(midAngle)

          

          return (

            <g key={stand.id}>

              {/* Main stand path with website colors */}

              <path

                d={path}

                fill={`url(#gradient-${stand.id})`}

                stroke={isSelected ? stand.color : '#FFFFFF'}

                strokeWidth={isSelected ? 0.8 : 0.5}

                strokeOpacity={isSelected ? 1 : 0.5}

                className="cursor-pointer transition-all"

                onClick={() => handleStandClick(stand)}

                style={{

                  filter: isSelected ? `drop-shadow(0 0 12px ${stand.color}) drop-shadow(0 0 20px ${stand.color}80)` : 'drop-shadow(0 2px 6px rgba(0,0,0,0.6))',

                  opacity: isSelected ? 1 : 0.92

                }}

              />

              

              {/* Enhanced border separator lines */}

              <line

                x1={centerX + stand.innerRadius * Math.cos(stand.startAngleRad)}

                y1={centerY + stand.innerRadius * Math.sin(stand.startAngleRad)}

                x2={centerX + stand.outerRadius * Math.cos(stand.startAngleRad)}

                y2={centerY + stand.outerRadius * Math.sin(stand.startAngleRad)}

                stroke={isSelected ? stand.color : '#FFFFFF'}

                strokeWidth={isSelected ? 0.5 : 0.4}

                strokeOpacity={isSelected ? 1 : 0.6}

              />

              <line

                x1={centerX + stand.innerRadius * Math.cos(stand.endAngleRad)}

                y1={centerY + stand.innerRadius * Math.sin(stand.endAngleRad)}

                x2={centerX + stand.outerRadius * Math.cos(stand.endAngleRad)}

                y2={centerY + stand.outerRadius * Math.sin(stand.endAngleRad)}

                stroke={isSelected ? stand.color : '#FFFFFF'}

                strokeWidth={isSelected ? 0.5 : 0.4}

                strokeOpacity={isSelected ? 1 : 0.6}

              />

              

              {/* Stand name label with full readable names */}

              <g transform={`translate(${labelX}, ${labelY}) rotate(${(midAngle * 180 / Math.PI) + 90})`}>

                <text

                  x="0"

                  y="-1"

                  textAnchor="middle"

                  dominantBaseline="middle"

                  fill={isSelected ? stand.lightColor : 'rgba(255, 255, 255, 0.95)'}

                  fontSize="2"

                  fontWeight="700"

                  className="pointer-events-none"

                  style={{ 

                    textShadow: isSelected 

                      ? `0 0 10px ${stand.color}, 0 0 15px rgba(0,0,0,1)` 

                      : '0 0 8px rgba(0,0,0,1), 0 0 12px rgba(0,0,0,0.9)',

                    filter: isSelected ? `drop-shadow(0 0 6px ${stand.color})` : 'none'

                  }}

                >

                  {stand.direction}

                </text>

                <text

                  x="0"

                  y="2.5"

                  textAnchor="middle"

                  dominantBaseline="middle"

                  fill={isSelected ? stand.lightColor : 'rgba(255, 255, 255, 0.85)'}

                  fontSize="1.5"

                  fontWeight="600"

                  className="pointer-events-none"

                  style={{ 

                    textShadow: '0 0 6px rgba(0,0,0,1)'

                  }}

                >

                  {stand.level}

                </text>

              </g>

            </g>

          )

        })}

        

        {/* Field rendered on top of all stands */}

        {/* Stadium ground with image pattern */}

        <ellipse 

          cx={centerX} 

          cy={centerY} 

          rx="24" 

          ry="24" 

          fill="url(#stadiumGroundImage)"

          opacity="1"

        />

      </svg>

    )

  }

  const renderSeatsForStand = (stand) => {

    if (!stand) return null

    return (

      <motion.div

        initial={{ opacity: 0, y: 20 }}

        animate={{ opacity: 1, y: 0 }}

        className="w-full max-w-5xl mt-8 p-6 bg-gray-900/60 rounded-xl border-2 border-primary/30 backdrop-blur-sm"

        style={{ boxShadow: `0 0 30px ${stand.color}40` }}

      >

        {/* Header with organized structure */}

        <div className="flex items-center justify-between mb-6 pb-4 border-b border-primary/30">

          <div className="flex-1">

            <div className="flex items-center gap-3 mb-2">

              <h3 className="text-2xl font-bold text-white" style={{ color: stand.lightColor }}>

                {stand.direction} Stand

              </h3>

              <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${

                stand.tier === 'Premium' 

                  ? 'bg-primary/20 text-primary border border-primary/50 shadow-sm' 

                  : 'bg-purple-500/20 text-purple-400 border border-purple-500/50 shadow-sm'

              }`}>

                {stand.tier}

              </span>

              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-700/50 text-gray-300 border border-gray-600/50">

                {stand.level}

              </span>

            </div>

            <p className="text-sm text-gray-400 mb-2">{stand.direction} Direction • {stand.level} Level</p>

            <div className="flex items-center gap-4 text-xs text-gray-500">

              <span>{stand.rows.length} rows</span>

              <span>•</span>

              <span>{stand.seatsPerRow} seats/row</span>

              <span>•</span>

              <span className="font-semibold text-gray-400">{stand.rows.length * stand.seatsPerRow} total seats</span>

            </div>

          </div>

          <button

            onClick={() => { setShowSeats(false); setSelectedStand(null); }}

            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary/20 rounded-full transition-all ml-4"

          >

            ✕

          </button>

        </div>

        {/* Seat layout organized by rows with better structure */}

        <div className="space-y-4">

          {stand.rows.map((row, rowIdx) => {

            // Generate unique seat IDs: Row + Direction + Level + Seat number

            const directionPrefix = stand.direction.charAt(0).toUpperCase();

            const levelPrefix = stand.level.charAt(0).toUpperCase();

            const standPrefix = `${directionPrefix}${levelPrefix}`;

            

            return (

              <div key={row} className="bg-gray-800/40 rounded-xl p-5 border border-gray-700/60 hover:border-primary/30 transition-all">

                <div className="flex items-center gap-4 mb-4">

                  <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-primary/50 rounded-lg text-base font-bold shadow-lg" style={{ 

                    color: stand.lightColor,

                    boxShadow: `0 0 20px ${stand.color}30`

                  }}>

                    {row}

                  </div>

                  <div className="flex-1">

                    <p className="text-sm font-semibold text-gray-300">Row {row}</p>

                    <p className="text-xs text-gray-500">{stand.seatsPerRow} seats available</p>

                  </div>

                </div>

                <div className="flex gap-2 flex-wrap justify-center">

                  {Array.from({ length: stand.seatsPerRow }, (_, i) => {

                    const seatId = `${row}${standPrefix}${i + 1}`;

                    const status = getSeatStatus(seatId);

                    const isHovered = hoveredSeat === seatId;

                    

                    return (

                      <motion.button

                        key={seatId}

                        onClick={() => handleSeatClick(seatId)}

                        onMouseEnter={() => setHoveredSeat(seatId)}

                        onMouseLeave={() => setHoveredSeat(null)}

                        whileHover={{ scale: 1.15, zIndex: 10 }}

                        whileTap={{ scale: 0.95 }}

                        className={`

                          relative h-10 w-10 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center

                          ${status === 'occupied' 

                            ? 'bg-gray-700/60 border-2 border-gray-600/60 cursor-not-allowed opacity-30' 

                            : status === 'selected'

                            ? 'border-2 text-white shadow-xl'

                            : `bg-gray-800/80 border-2 border-gray-600/50 hover:border-primary/80 hover:bg-gray-700/90 cursor-pointer backdrop-blur-sm`

                          }

                          ${isHovered && status !== 'occupied' ? 'ring-2 ring-primary/70 shadow-2xl' : ''}

                        `}

                        disabled={status === 'occupied'}

                        style={{ 

                          backgroundColor: status === 'selected' ? stand.color : undefined,

                          borderColor: status === 'selected' ? stand.color : undefined,

                          boxShadow: status === 'selected' ? `0 0 20px ${stand.color}50` : undefined

                        }}

                        title={`Seat ${seatId}`}

                      >

                        {i + 1}

                        {status === 'selected' && (

                          <motion.div

                            initial={{ scale: 0 }}

                            animate={{ scale: 1 }}

                            className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-white shadow-lg"

                          />

                        )}

                      </motion.button>

                    );

                  })}

                </div>

              </div>

            );

          })}

        </div>

      </motion.div>

    )

  }

  return event ? (

    <div className='px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh] flex flex-col lg:flex-row gap-6'>

      <div className='w-full lg:w-60 bg-primary/10 border border-primary/20 rounded-lg py-6 h-max lg:sticky lg:top-30'>

        <div className='px-6'>

          <p className='text-lg font-semibold'>{event.title}</p>

          <p className='text-gray-400 text-sm mt-1'>{new Date(event.showDateTime).toLocaleString()}</p>

          <p className='text-primary font-semibold mt-2'>${event.price}</p>

          

          {selectedSeats.length > 0 && (

            <div className='mt-6 pt-6 border-t border-primary/20'>

              <p className='text-sm font-medium mb-3'>Selected Seats ({selectedSeats.length})</p>

              <div className='flex flex-wrap gap-2'>

                {selectedSeats.map(seat => (

                  <span key={seat} className='px-2 py-1 bg-primary/20 border border-primary/40 rounded text-xs'>

                    {seat}

                  </span>

                ))}

              </div>

              <p className='text-sm font-semibold mt-4 text-primary'>

                Total: ${(event.price * selectedSeats.length).toFixed(2)}

              </p>

            </div>

          )}

          <div className='mt-6 pt-6 border-t border-primary/20'>

            <p className='text-xs font-semibold mb-4 text-gray-300 uppercase tracking-wider'>Stadium Stands</p>

            <div className='space-y-3 text-xs'>

              <div>

                <p className='text-[10px] font-semibold text-primary mb-2 uppercase tracking-wide'>Premium Stands</p>

                <div className='space-y-2'>

                  {stands.filter(s => s.tier === 'Premium').map(stand => (

                    <div key={stand.id} className='flex items-center gap-2 p-2 rounded-lg hover:bg-primary/10 transition-all cursor-pointer' onClick={() => handleStandClick(stand)}>

                      <div 

                        className='w-3 h-3 rounded border-2' 

                        style={{ 

                          backgroundColor: stand.color + '30',

                          borderColor: stand.color

                        }}

                      ></div>

                      <div className='flex-1'>

                        <span className='font-medium text-gray-300 text-xs'>{stand.direction}</span>

                        <span className='text-[10px] text-gray-500 ml-1'>{stand.level}</span>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

              <div className='pt-2 border-t border-gray-700/50'>

                <p className='text-[10px] font-semibold text-purple-400 mb-2 uppercase tracking-wide'>Standard Stands</p>

                <div className='space-y-2'>

                  {stands.filter(s => s.tier === 'Standard').map(stand => (

                    <div key={stand.id} className='flex items-center gap-2 p-2 rounded-lg hover:bg-purple-500/10 transition-all cursor-pointer' onClick={() => handleStandClick(stand)}>

                      <div 

                        className='w-3 h-3 rounded border-2' 

                        style={{ 

                          backgroundColor: stand.color + '30',

                          borderColor: stand.color

                        }}

                      ></div>

                      <div className='flex-1'>

                        <span className='font-medium text-gray-300 text-xs'>{stand.direction}</span>

                        <span className='text-[10px] text-gray-500 ml-1'>{stand.level}</span>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          </div>

          <div className='mt-6 pt-6 border-t border-primary/20'>

            <p className='text-xs font-medium mb-3 text-gray-400'>Legend</p>

            <div className='space-y-2 text-xs'>

              <div className='flex items-center gap-2'>

                <div className='w-4 h-4 rounded bg-primary border border-primary'></div>

                <span>Selected</span>

              </div>

              <div className='flex items-center gap-2'>

                <div className='w-4 h-4 rounded bg-gray-800/60 border border-gray-600/40'></div>

                <span>Available</span>

              </div>

              <div className='flex items-center gap-2'>

                <div className='w-4 h-4 rounded bg-gray-700/50 border border-gray-600/50 opacity-40'></div>

                <span>Occupied</span>

              </div>

            </div>

          </div>

        </div>

      </div>

      

      <div className='relative flex-1 flex flex-col items-center'>

        <BlurCircle top="-100px" left="-100px"/>

        <BlurCircle bottom="0" right="0"/>

        

        <div className='text-center mb-8'>

          <h1 className='text-3xl font-bold mb-2 bg-gradient-to-r from-primary via-pink-400 to-purple-500 bg-clip-text text-transparent'>

            Select Your Seats

          </h1>

        </div>

        {/* Stadium SVG Map with organized structure */}

        <div className='w-full max-w-4xl mb-8 relative bg-gradient-to-br from-gray-900/60 via-gray-800/50 to-gray-900/60 rounded-3xl p-8 border-2 border-primary/30 shadow-2xl backdrop-blur-sm' style={{ boxShadow: '0 0 80px rgba(248, 69, 101, 0.2), inset 0 0 40px rgba(248, 69, 101, 0.05)' }}>

          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">

            <div className="flex items-center gap-3">

              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>

              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Interactive Stadium Map</span>

            </div>

            <div className="flex items-center gap-4 text-[10px] text-gray-500">

              <div className="flex items-center gap-1.5">

                <div className="w-2.5 h-2.5 rounded bg-primary shadow-sm" style={{ boxShadow: `0 0 6px ${'#F84565'}60` }}></div>

                <span className="font-medium">Premium</span>

              </div>

              <div className="flex items-center gap-1.5">

                <div className="w-2.5 h-2.5 rounded bg-purple-500 shadow-sm" style={{ boxShadow: `0 0 6px ${'#8B5CF6'}60` }}></div>

                <span className="font-medium">Standard</span>

              </div>

              <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-gray-700">

                <div className="w-2 h-2 rounded-full bg-white/40"></div>

                <span className="text-[9px]">Upper</span>

              </div>

              <div className="flex items-center gap-1.5">

                <div className="w-2 h-2 rounded-full bg-white/20"></div>

                <span className="text-[9px]">Lower</span>

              </div>

            </div>

          </div>

          <div className="aspect-square w-full relative mt-8">

            {renderStadiumSVG()}

          </div>

        </div>

        {/* Seat Selection Area */}

        <div ref={seatsSectionRef}>

          {showSeats && selectedStand && renderSeatsForStand(selectedStand)}

        </div>

        <motion.button 

          onClick={bookTickets} 

          disabled={selectedSeats.length === 0}

          whileHover={{ scale: selectedSeats.length > 0 ? 1.05 : 1 }}

          whileTap={{ scale: selectedSeats.length > 0 ? 0.95 : 1 }}

          className={`

            flex items-center gap-2 mt-8 px-12 py-4 text-sm font-semibold rounded-full transition-all duration-200

            ${selectedSeats.length > 0 

              ? 'bg-primary hover:bg-primary-dull text-white shadow-lg shadow-primary/30 cursor-pointer' 

              : 'bg-gray-800/50 text-gray-500 cursor-not-allowed border border-gray-700/50'

            }

          `}

        >

          {selectedSeats.length > 0 ? (

            <>

              Proceed to Checkout ({selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'})

              <ArrowRightIcon strokeWidth={3} className="w-4 h-4"/>

            </>

          ) : (

            'Select seats to continue'

          )}

        </motion.button>

      </div>

    </div>

  ) : (

    <Loading />

  )

}

export default SportsSeatLayout
