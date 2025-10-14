import React from 'react';

const NightlifeCard = ({ item }) => {
  return (
    <div className='group relative w-64 rounded-lg overflow-hidden shadow-lg bg-gray-800/50 backdrop-blur-sm transition-transform duration-300 ease-in-out hover:scale-105'>
      <img className='w-full h-40 object-cover' src={item.imageUrl} alt={item.name} />
      <div className='p-4'>
        <h3 className='text-xl font-semibold text-white mb-2'>{item.name}</h3>
        <p className='text-gray-300 text-sm'>{item.description}</p>
      </div>
    </div>
  );
};

export default NightlifeCard;
