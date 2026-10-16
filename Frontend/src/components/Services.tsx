import type { Service } from '../data/site'
import { ArrowRightIcon } from './Icons'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

type ServicesProps = {
  services: Service[]
}

export function Services({ services }: ServicesProps) {
  return (
    <section id="services" className="bg-coal py-24 sm:py-32">
      <div className="container-slick">
        <SectionHeading
          eyebrow="Services"
          title={
            <>
              What I <span className="text-gold-gradient">handle</span>
            </>
          }
          sub="Edit, color, sound and motion — pick the full package or a single stage of post."
        />

        <div className="mx-auto mt-12 max-w-4xl border-t border-smoke">
          {services.map((s, i) => (
            <Reveal key={s.name} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <div className="group flex items-center gap-4 border-b border-smoke px-1 py-6 transition-colors duration-200 hover:bg-ink/50 sm:gap-6 sm:px-4">
                <span className="font-mono text-xs tracking-[0.2em] text-gold">{s.index}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-2xl font-black uppercase tracking-tight text-bone transition-colors duration-200 group-hover:text-gold sm:text-3xl">
                    {s.name}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-ashtray">{s.description}</p>
                </div>
                <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-ashtray sm:block">
                  {s.detail}
                </span>
                <ArrowRightIcon className="size-4 shrink-0 text-ashtray transition-all duration-200 group-hover:translate-x-1 group-hover:text-gold" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
