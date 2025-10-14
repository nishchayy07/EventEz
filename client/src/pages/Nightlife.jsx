import React from 'react';
import BlurCircle from '../components/BlurCircle';
import NightlifeCard from '../components/NightlifeCard';
import { nightlifeData } from '../assets/nightlife';

const Nightlife = () => {
  return (
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>
      <BlurCircle top="150px" left="0px" />
      <BlurCircle bottom="50px" right="50px" />
      <h1 className='text-lg font-medium my-4'>Nightlife</h1>
      <div className='flex flex-wrap max-sm:justify-center gap-8'>
        {nightlifeData.map((item, index) => (
          <NightlifeCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Nightlife;
