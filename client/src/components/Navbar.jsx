import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { MenuIcon, SearchIcon, TicketPlus, XIcon, MapPin } from 'lucide-react'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { useAppContext } from '../context/AppContext'
import LocationSelector from './LocationSelector'
import { useEffect } from 'react'

const Navbar = () => {

 const [isOpen, setIsOpen] = useState(false)
 const [isLocationOpen, setIsLocationOpen] = useState(false)
 const [selectedCity, setSelectedCity] = useState('Chandigarh')
 const {user} = useUser()
 const {openSignIn} = useClerk()

 const navigate = useNavigate()

 const {favoriteMovies} = useAppContext()

 // Load saved location from localStorage on component mount
 useEffect(() => {
   const savedLocation = localStorage.getItem('userLocation');
   if (savedLocation) {
     try {
       const locationData = JSON.parse(savedLocation);
       setSelectedCity(locationData.city);
     } catch (error) {
       console.error('Error loading saved location:', error);
     }
   }
 }, []);

  return (
    <>
    <div className='fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5'>
      {/* Left Section - Logo and Location */}
      <div className='flex items-center gap-4 flex-1'>
        <Link to='/'>
          <img src={assets.logo} alt="" className='w-36 h-auto'/>
        </Link>

        {/* Location Button */}
        <button 
          onClick={() => setIsLocationOpen(true)}
          className='hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition border border-gray-300/20'
        >
          <MapPin className='w-4 h-4 text-primary' />
          <div className='text-left'>
            <p className='text-white text-sm font-semibold'>{selectedCity}</p>
          </div>
        </button>
      </div>

      {/* Center Section - Navigation Links */}
      <div className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20 overflow-hidden transition-[width] duration-300 ${isOpen ? 'max-md:w-full' : 'max-md:w-0'}`}>

        <XIcon className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer' onClick={()=> setIsOpen(!isOpen)}/>

        <Link onClick={()=> {scrollTo(0,0); setIsOpen(false)}} to='/'>Home</Link>
        <Link onClick={()=> {scrollTo(0,0); setIsOpen(false)}} to='/movies'>Movies</Link>
        <Link onClick={()=> {scrollTo(0,0); setIsOpen(false)}} to='/sports'>Sports</Link>
        <Link onClick={()=> {scrollTo(0,0); setIsOpen(false)}} to='/nightlife'>Nightlife</Link>
        <Link onClick={()=> {scrollTo(0,0); setIsOpen(false)}} to='/admin'>Admin</Link>
       {favoriteMovies.length > 0 && <Link onClick={()=> {scrollTo(0,0); setIsOpen(false)}} to='/favorite'>Favorites</Link>}
      </div>

    {/* Right Section - Search, Login, Menu */}
    <div className='flex items-center gap-8 flex-1 justify-end'>
        <SearchIcon className='max-md:hidden w-6 h-6 cursor-pointer'/>
        {
            !user ? (
                <button onClick={openSignIn} className='px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>Login</button>
            ) : (
                <UserButton>
                    <UserButton.MenuItems>
                        <UserButton.Action label="My Bookings" labelIcon={<TicketPlus width={15}/>} onClick={()=> navigate('/my-bookings')}/>
                    </UserButton.MenuItems>
                </UserButton>
            )
        }
        
    </div>

    <MenuIcon className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer' onClick={()=> setIsOpen(!isOpen)}/>

    </div>

    {/* Location Selector Modal */}
    <LocationSelector 
      isOpen={isLocationOpen}
      onClose={() => setIsLocationOpen(false)}
      selectedCity={selectedCity}
      onSelectCity={setSelectedCity}
    />
    </>
  )
}

export default Navbar
