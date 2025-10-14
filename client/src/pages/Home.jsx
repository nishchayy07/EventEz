import React from 'react'
import HeroCarousel from '../components/HeroCarousel'
import MovieCard from '../components/MovieCard'
import EventCard from '../components/EventCard'
import ArtistCard from '../components/ArtistCard'
import { heroSlides, hitsMovies, happeningEvents, topPunjabiMovies, artists, fourDXMovies } from '../assets/homeData'

const SectionHeader = ({ title }) => (
  <div className="mb-6">
    <h3 className="text-2xl font-semibold text-white">{title}</h3>
  </div>
)

const Home = () => {
  return (
    <div className="min-h-screen pb-20">
      <div className="px-6 md:px-16 lg:px-40 pt-24 pb-12">
        <HeroCarousel slides={heroSlides} />
      </div>

      <main className="px-6 md:px-16 lg:px-40 space-y-12">
        <section>
          <SectionHeader title="Hits from previous weeks" />
          <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
            {hitsMovies.map((m) => (
              <div key={m.id} className="w-[220px] flex-shrink-0">
                <MovieCard movie={m} />
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="Happening this week" />
          <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
            {happeningEvents.map((e) => (
              <div key={e.id} className="w-[320px] flex-shrink-0">
                <EventCard event={e} />
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="Top Punjabi movies near you" />
          <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
            {topPunjabiMovies.map((m) => (
              <div key={m.id} className="w-[220px] flex-shrink-0">
                <MovieCard movie={m} />
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="Artists in your District" />
          <div className="flex gap-8 overflow-x-auto items-center scrollbar-hide py-4">
            {artists.map((a) => (
              <div key={a.id} className="flex-shrink-0">
                <ArtistCard artist={a} />
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="Experience in 4DX" />
          <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
            {fourDXMovies.map((m) => (
              <div key={m.id} className="w-[220px] flex-shrink-0">
                <MovieCard movie={m} />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home
