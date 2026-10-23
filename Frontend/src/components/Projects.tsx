import { images } from '../data/images'
import { preselectBooking } from '../lib/booking'
import { useSite } from '../lib/site-context'
import { btnSm } from '../lib/ui'
import { SectionHeading } from './SectionHeading'
import { Reveal } from './Reveal'

export function Projects() {
  const { projects } = useSite()
  return (
    <section id="projects" className="scroll-mt-20 bg-ink py-24 sm:py-32">
      <div className="container-slick">
        <SectionHeading
          eyebrow="Featured Projects"
          title={
            <>
              The work behind <span className="text-gold-gradient">the number.</span>
            </>
          }
          sub="Each project is a case study — pick one to talk through, and start a project of your own."
        />

        <p className="mt-8 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ashtray/60 sm:hidden">
          Swipe to explore <span aria-hidden="true">→</span>
        </p>

        <div className="no-scrollbar -mx-5 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:mt-14 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal
              key={p.id}
              delay={((i % 3) + 1) as 1 | 2 | 3 | 4}
              className="w-[82vw] max-w-[340px] shrink-0 snap-start sm:w-auto sm:max-w-none"
            >
              <article className="group flex h-full flex-col border border-smoke bg-coal transition-colors duration-300 hover:border-gold/50">
                <div className="relative overflow-hidden">
                  <img
                    src={p.image ?? images.projects[i] ?? images.projects[0]}
                    alt={`${p.name} — ${p.specialty}`}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover grayscale transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0 sm:aspect-[4/5]"
                  />
                  <span className="absolute left-3 top-3 border border-bone/20 bg-ink/70 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-bone">{p.name}</h3>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-gold">{p.specialty}</p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-ashtray">{p.bio}</p>
                  <button
                    type="button"
                    onClick={() => preselectBooking({ barberId: p.id })}
                    className={`${btnSm} mt-6 w-full`}
                  >
                    Start a project like this
                  </button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
