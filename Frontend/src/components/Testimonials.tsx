import type { Testimonial } from '../data/site'
import { StarIcon } from './Icons'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

type TestimonialsProps = {
  testimonials: Testimonial[]
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section id="testimonials" className="bg-coal py-24 sm:py-32">
      <div className="container-slick">
        <SectionHeading
          eyebrow="Testimonials"
          title={
            <>
              Creators <span className="text-gold-gradient">say it better</span>
            </>
          }
        />

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <figure className="flex h-full flex-col border border-smoke bg-ink p-6">
                <span className="flex text-gold" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <StarIcon key={s} className="size-3.5" />
                  ))}
                </span>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-stone-mist">"{t.quote}"</blockquote>
                <figcaption className="mt-5 border-t border-smoke pt-4">
                  <p className="font-display text-sm font-bold uppercase tracking-wide text-bone">{t.name}</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ashtray">{t.role}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
