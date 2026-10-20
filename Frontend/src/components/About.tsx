import { site } from '../data/site-content'
import { images } from '../data/images'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

export function About() {
  const { about, brand, contact } = site

  return (
    <section id="about" className="scroll-mt-20 py-24 sm:py-32">
      <div className="container-slick">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-16">
          <Reveal>
            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-smoke">
                <img
                  src={images.interior}
                  alt={`${brand.name} — video editing workstation`}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -right-3 rounded-xl border border-gold/40 bg-coal px-6 py-4 shadow-xl sm:-right-6">
                <p className="font-display text-3xl font-extrabold text-gold-gradient">{about.years}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ashtray">Years Editing</p>
              </div>
            </div>
          </Reveal>

          <div>
            <SectionHeading
              align="left"
              eyebrow="About Nathan"
              title={
                <>
                  The editor behind <span className="text-gold-gradient">the retention.</span>
                </>
              }
            />
            <Reveal delay={2}>
              <p className="mt-6 text-base leading-relaxed text-stone-mist">{about.bio}</p>
            </Reveal>

            <Reveal delay={3}>
              <div className="mt-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ashtray">Toolkit</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {about.tools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-full border border-smoke px-3.5 py-1.5 font-mono text-xs text-stone-mist transition-colors hover:border-gold/50 hover:text-gold"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={4}>
              <div className="mt-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ashtray">Works With</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {about.clients.map((client) => (
                    <span
                      key={client}
                      className="rounded-full border border-smoke px-3.5 py-1.5 font-mono text-xs text-stone-mist"
                    >
                      {client}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={4}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href={`mailto:${contact.email}`}
                  className="rounded-lg bg-gold px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-ink transition hover:bg-gold/80"
                >
                  Work With Me
                </a>
                <a
                  href="#work"
                  className="rounded-lg border border-smoke px-6 py-3 font-mono text-xs uppercase tracking-wider text-ashtray transition hover:border-gold hover:text-gold"
                >
                  See The Work
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
