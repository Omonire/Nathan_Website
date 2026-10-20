import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Marquee } from './components/Marquee'
import { Services } from './components/Services'
import { OurWork } from './components/OurWork'
import { Projects } from './components/Projects'
import { WhySlicks } from './components/WhySlicks'
import { Reviews } from './components/Reviews'
import { Booking } from './components/Booking'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { MobileBookBar } from './components/MobileBookBar'
function App() {
  return (
    <div className="bg-ink text-bone">
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <OurWork />
        <Projects />
        <WhySlicks />
        <Reviews />
        <Booking />
        <Contact />
      </main>
      <Footer />
      <MobileBookBar />
      <div className="h-16 sm:hidden" aria-hidden="true" />
    </div>
  )
}

export default App