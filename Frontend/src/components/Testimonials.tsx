import type { Testimonial } from '../data/site'
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
                <span className="text-gold-gradient font-display text-5xl font-black leading-none" aria-hidden="true">
                  &ldquo;
                </span>
                <blockquote className="mt-2 flex-1 text-base leading-relaxed text-stone-mist">{t.quote}</blockquote>
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
