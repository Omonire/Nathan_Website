import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Marquee } from './components/Marquee'
import { Services } from './components/Services'

import { Projects } from './components/Projects'
import { About } from './components/About'
import { WhySlicks } from './components/WhySlicks'
import { Reviews } from './components/Reviews'
import { Booking } from './components/Booking'
import { Footer } from './components/Footer'
import { MobileBookBar } from './components/MobileBookBar'
import { Splash } from './components/Splash'
function App() {
  return (
    <div className="bg-ink text-bone">
      <Splash />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Projects />
        <About />
        <WhySlicks />
        <Reviews />
        <Booking />
      </main>
      <Footer />
      <MobileBookBar />
      <div className="h-16 sm:hidden" aria-hidden="true" />
    </div>
  )
}

export default App