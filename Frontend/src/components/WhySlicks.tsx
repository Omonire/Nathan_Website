import { SectionHeading } from './SectionHeading'
import { Reveal } from './Reveal'
import { CalendarIcon, DiamondIcon, FilmIcon, ShieldIcon } from './Icons'

const pillars = [
  {
    icon: FilmIcon,
    title: 'Retention-First Editing',
    body: 'Every edit, transition and beat of sound design is there to keep a viewer watching — then to make them subscribe.',
  },
  {
    icon: DiamondIcon,
    title: 'Cinematic Finish',
    body: 'Color grading, motion graphics and clean sound that make footage feel like a production, not a talking head.',
  },
  {
    icon: ShieldIcon,
    title: 'Reliable Turnaround',
    body: 'Clear deadlines, organized revisions and a workflow that keeps your upload schedule on track.',
  },
  {
    icon: CalendarIcon,
    title: 'Easy To Start',
    body: 'Send your footage, pick your deliverables, and get a first edit back. Simple, remote, worldwide.',
  },
]

export function WhySlicks() {
  return (
    <section id="why" className="scroll-mt-20 border-y border-smoke bg-coal py-24 sm:py-32">
      <div className="container-slick">
        <SectionHeading
          eyebrow="Why Work With Me"
          title={
            <>
              Built different, <span className="text-gold-gradient">on purpose.</span>
            </>
          }
        />

        <div className="mt-14 grid gap-px border border-smoke bg-smoke sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={((i % 4) + 1) as 1 | 2 | 3 | 4} className="h-full">
              <div className="flex h-full flex-col bg-coal p-7 transition-colors duration-300 hover:bg-ink">
                <span className="font-mono text-xs text-ashtray/50" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p.icon className="mt-6 text-gold" />
                <h3 className="mt-5 font-display text-xl font-bold uppercase tracking-tight text-bone">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ashtray">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}