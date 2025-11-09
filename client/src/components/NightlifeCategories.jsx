import React from 'react'

// Centralized nightlife categories data
export const NIGHTLIFE_CATEGORIES = [
  {
    id: 'rooftop',
    name: 'Rooftop Bars',
    description: 'Enjoy stunning city views with crafted cocktails',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop',
  },
  {
    id: 'Concerts',
    name: 'Concerts',
    description: 'Discover amazing artists and bands live',
    image: 'https://images.unsplash.com/photo-1501612780327-45045538702b?w=800&h=600&fit=crop',
  },
  {
    id: 'clubs',
    name: 'Dance Clubs',
    description: 'Dance the night away with top DJs',
    image: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&h=600&fit=crop',
  },
  {
    id: 'Comedy Shows',
    name: 'Comedy Shows',
    description: 'Laugh out loud with stand-up comedians',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnhoCCe-rJ3n1ziNkIE12WiJT8dnQsAyQYxw&s',
  },
  {
    id: 'Qawali',
    name: 'Qawali Night',
    description: 'Sing your heart out with friends',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&h=600&fit=crop',
  },
  {
    id: 'Theatre Shows',
    name: 'Theatre Shows',
    description: 'Hidden gems with craft cocktails',
    image: 'https://www.visitlondon.com/-/media/images/london/visit/whats-on/theatre/the-great-gatsby/the-great-gatsby-2-1920x1080.jpg?mw=640&rev=505245a6c621418f9e002831d29cde87&hash=F8609864CEBF8F43372D05DD5166A1A0',
  }
]

// Optional component to expose categories if someone prefers a component import
const NightlifeCategories = ({ children }) => {
  return <>{children}</>
}

export default NightlifeCategories
