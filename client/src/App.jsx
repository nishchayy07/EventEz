import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Movies from './pages/Movies'
import MovieDetails from './pages/MovieDetails'
import SeatLayout from './pages/SeatLayout'
import MyBookings from './pages/MyBookings'
import Favorite from './pages/Favorite'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import Layout from './pages/admin/Layout'
import Dashboard from './pages/admin/Dashboard'
import AddShows from './pages/admin/AddShows'
import ListShows from './pages/admin/ListShows'
import { useAppContext } from './context/AppContext'
import { SignIn } from '@clerk/clerk-react'
import Loading from './components/Loading'
import Sports from './pages/Sports'
import SportsSeatLayout from './pages/SportsSeatLayout'
import ChessBooking from './pages/ChessBooking'
import RunningBooking from './pages/RunningBooking'
import Nightlife from './pages/Nightlife'
import NowShowing from './pages/NowShowing'
import Chatbot from './components/Chatbot'
import VerifyTicket from './pages/VerifyTicket'
import EventDetails from './pages/EventDetails'
import NightlifeTicketSelection from './pages/NightlifeTicketSelection'
import NightlifeSeatLayout from './pages/NightlifeSeatLayout'
import AdminReleaseSeats from './pages/admin/AdminReleaseSeats'
import NotFound from './pages/NotFound'
import SearchResults from './pages/SearchResults'

const App = () => {

  const isAdminRoute = useLocation().pathname.startsWith('/admin')

  const { user } = useAppContext()

  return (
    <>
      <Toaster />
      {!isAdminRoute && <Navbar/>}
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/search' element={<SearchResults/>} />
        <Route path='/sports' element={<Sports />} />
        <Route path='/sports/seat/:id' element={<SportsSeatLayout />} />
        <Route path='/sports/chess/:id' element={<ChessBooking />} />
        <Route path='/sports/running/:id' element={<RunningBooking />} />
        <Route path='/nightlife' element={<Nightlife />} />
        <Route path='/nightlife/:id' element={<EventDetails />} />
        <Route path='/nightlife/:id/tickets' element={<NightlifeTicketSelection />} />
        <Route path='/nightlife/:id/seats' element={<NightlifeSeatLayout />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/now-showing' element={<NowShowing />} />
        <Route path='/movies/:id' element={<MovieDetails/>} />
        <Route path='/movies/:id/:date' element={<SeatLayout/>} />
        <Route path='/my-bookings' element={<MyBookings/>} />
        <Route path='/loading/:nextUrl' element={<Loading/>} />
        <Route path='/verify/:token' element={<VerifyTicket/>} />

        <Route path='/favorite' element={<Favorite/>} />
        <Route path='/admin/*' element={user ? <Layout/> : (
          <div className='min-h-screen flex justify-center items-center'>
            <SignIn fallbackRedirectUrl={'/admin'} />
          </div>
        )}>
          <Route index element={<Dashboard/>}/>
          <Route path="add-shows" element={<AddShows/>}/>
          <Route path="list-shows" element={<ListShows/>}/>
          <Route path="release-seats" element={<AdminReleaseSeats />} />
        </Route>
        <Route path='*' element={<NotFound/>} />
      </Routes>
       {!isAdminRoute && <Footer />}
       {!isAdminRoute && <Chatbot />}
    </>
  )
}

export default App
