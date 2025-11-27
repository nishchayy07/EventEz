import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000'

export const AppContext = createContext()

export const AppProvider = ({ children })=>{

    const [isAdmin, setIsAdmin] = useState(false)
    const [shows, setShows] = useState([])
    const [favoriteMovies, setFavoriteMovies] = useState([])
    const [selectedLocation, setSelectedLocation] = useState('Chandigarh') // Default location

    const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

    const {user} = useUser()
    const {getToken} = useAuth()
    const location = useLocation()
    const navigate = useNavigate()

    // Load saved location from localStorage on mount
    useEffect(() => {
        const savedLocation = localStorage.getItem('userLocation');
        if (savedLocation) {
            try {
                const locationData = JSON.parse(savedLocation);
                setSelectedLocation(locationData.city || 'Chandigarh');
            } catch (error) {
                console.error('Error loading saved location:', error);
            }
        }
    }, [])

    const fetchIsAdmin = async ()=>{
        try {
            const {data} = await axios.get('/api/admin/is-admin', {headers: {Authorization: `Bearer ${await getToken()}`}})
            setIsAdmin(data.isAdmin)

            if(!data.isAdmin && location.pathname.startsWith('/admin')){
                navigate('/')
                toast.error('You are not authorized to access admin dashboard')
            }
        } catch (error) {
            console.error(error)
        }
    }

    const fetchShows = async ()=>{
        try {
            const { data } = await axios.get('/api/show/all')
            if(data.success && data.shows){
                // Extract unique movies from shows
                const uniqueMovies = [];
                const seenMovieIds = new Set();
                
                data.shows.forEach(show => {
                    if (!show || !show.movie) return;
                    
                    const movie = show.movie;
                    const movieId = movie._id;
                    
                    if (movieId && !seenMovieIds.has(movieId)) {
                        seenMovieIds.add(movieId);
                        // Use movie._id for navigation (the API expects movie ID)
                        uniqueMovies.push({ ...movie, _id: movieId });
                    }
                });
                
                setShows(uniqueMovies)
            }else{
                toast.error(data.message || 'Failed to fetch shows')
            }
        } catch (error) {
            console.error('Error fetching shows:', error)
        }
    }

    const fetchFavoriteMovies = async ()=>{
        try {
            const { data } = await axios.get('/api/user/favorites', {headers: {Authorization: `Bearer ${await getToken()}`}})

            if(data.success){
                setFavoriteMovies(data.movies)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(()=>{
        fetchShows()
    },[])

    useEffect(()=>{
        if(user){
            fetchIsAdmin()
            fetchFavoriteMovies()
        }
    },[user])

    const updateLocation = (city) => {
        setSelectedLocation(city);
        // Save to localStorage
        const savedLocation = localStorage.getItem('userLocation');
        let locationData = {};
        if (savedLocation) {
            try {
                locationData = JSON.parse(savedLocation);
            } catch (error) {
                console.error('Error parsing saved location:', error);
            }
        }
        locationData.city = city;
        localStorage.setItem('userLocation', JSON.stringify(locationData));
    }

    const value = {
        axios,
        fetchIsAdmin,
        user, getToken, navigate, isAdmin, shows, 
        favoriteMovies, fetchFavoriteMovies, image_base_url,
        selectedLocation, updateLocation
    }

    return (
        <AppContext.Provider value={value}>
            { children }
        </AppContext.Provider>
    )
}

export const useAppContext = ()=> useContext(AppContext)