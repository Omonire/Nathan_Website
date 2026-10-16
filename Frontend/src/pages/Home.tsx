import { useEffect, useState } from 'react'
import { About } from '../components/About'
import { Contact } from '../components/Contact'
import { Footer } from '../components/Footer'
import { Hero } from '../components/Hero'
import { Marquee } from '../components/Marquee'
import { Manifesto } from '../components/Manifesto'
import { Nav } from '../components/Nav'
import { Process } from '../components/Process'
import { Services } from '../components/Services'
import { Showreel } from '../components/Showreel'
import { Testimonials } from '../components/Testimonials'
import { Work } from '../components/Work'
import type { Project, SiteContent } from '../data/site'
import { fetchProjects, fetchSite } from '../lib/api'

export function Home() {
  const [site, setSite] = useState<SiteContent | null>(null)
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    let alive = true
    ;(async () => {
      const [s, p] = await Promise.all([fetchSite(), fetchProjects()])
      if (alive) {
        setSite(s)
        setProjects(p)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  if (!site) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <div className="border border-smoke bg-coal/50 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-ashtray">
          Loading…
        </div>
      </div>
    )
  }

  return (
    <div className="bg-ink text-bone">
      <Nav brand={site.brand} />
      <main>
        <Hero contact={site.contact} showreel={site.showreel} />
        <Marquee services={site.services} />
        <Manifesto />
        <Work projects={projects} />
        <Showreel showreel={site.showreel} />
        <Process />
        <Services services={site.services} />
        <About about={site.about} brand={site.brand} />
        <Testimonials testimonials={site.testimonials} />
        <Contact contact={site.contact} socials={site.socials} />
      </main>
      <Footer brand={site.brand} socials={site.socials} contact={site.contact} />
    </div>
  )
}
