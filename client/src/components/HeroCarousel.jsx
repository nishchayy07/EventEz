import React, { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const HeroCarousel = ({ slides = [], onSlideClick }) => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!slides || slides.length === 0) return
    const t = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000)
    return () => clearInterval(t)
  }, [slides])

  if (!slides || slides.length === 0) return null

  const slide = slides[current]

  const handleBookClick = () => {
    if (onSlideClick) {
      onSlideClick(slide);
    }
  }

  return (
    <div className="relative w-full h-[520px] md:h-[600px] rounded-3xl overflow-hidden group cursor-pointer">
      <img 
        src={slide.image} 
        alt={slide.title} 
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ imageRendering: 'crisp-edges' }}
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

      <div className="relative z-10 h-full flex items-center px-6 md:px-20 lg:px-32">
        <div className="max-w-2xl text-white">
          {slide.badge && <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-primary mb-3">{slide.badge}</div>}
          <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-3">{slide.title}</h2>
          <p className="text-gray-300 mb-4">{slide.subtitle}</p>
          {slide.price && <div className="text-xl font-semibold mb-6">{slide.price}</div>}
          <button 
            onClick={handleBookClick}
            className="bg-black hover:bg-primary text-white px-6 py-3 rounded-xl font-medium transition-colors duration-300"
          >
            Book tickets
          </button>
        </div>

        {/* Right side preview card */}
        <div className="ml-auto hidden md:block w-[300px] rounded-xl overflow-hidden shadow-xl">
          <img src={slide.image} alt="preview" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Arrows */}
      <button onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 text-white p-3 rounded-full">
        <ChevronLeft size={18} />
      </button>
      <button onClick={() => setCurrent((c) => (c + 1) % slides.length)} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 text-white p-3 rounded-full">
        <ChevronRight size={18} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`w-3 h-3 rounded-full ${i === current ? 'bg-white' : 'bg-white/40'}`} />
        ))}
      </div>
    </div>
  )
}

export default HeroCarousel
