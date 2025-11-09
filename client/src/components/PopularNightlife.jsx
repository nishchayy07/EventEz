import React from 'react'
import { useAppContext } from '../context/AppContext'

const PopularNightlife = ({ categories = [], onCategorySelect }) => {
  return (
    <section className='py-10'>
      <div className='mb-6'>
        <h2 className='text-2xl md:text-3xl font-semibold mb-1'>Popular Nightlife</h2>
        <p className='text-gray-400'>Choose a category and explore upcoming nightlife events</p>
      </div>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
        {categories.map((c) => (
          <div key={c.id || c.name} className='group relative overflow-hidden rounded-xl ring-1 ring-white/10 bg-card/50 hover:ring-primary transition-all cursor-pointer'
            onClick={() => onCategorySelect && onCategorySelect(c.name || c.id)}>
            <div className='relative h-36'>
              <img src={c.image} alt={c.name} className='absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' />
              <div className='absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent' />
              <div className='absolute bottom-2 left-2 right-2'>
                <h3 className='text-base font-semibold'>{c.name}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default PopularNightlife
