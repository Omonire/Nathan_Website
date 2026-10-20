import { site } from '../data/site-content'
import { SectionHeading } from './SectionHeading'
import { Reveal } from './Reveal'
import { QuoteIcon, StarIcon } from './Icons'
import { useState, useEffect } from 'react'

type Review = { name: string; service: string; quote: string; rating: number }

function Stars({ count }: { count: number }) {
  return (
    <span className="flex text-gold" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <StarIcon key={i} className="size-4" />
      ))}
    </span>
  )
}

export function Reviews() {
  const [reviews, setReviews] = useState<Review[]>(site.reviews)
  
  useEffect(() => {
    const stored = localStorage.getItem('slick_cms_reviews')
    if (stored) {
      try {
        setReviews(JSON.parse(stored))
      } catch {}
    }
  }, [])

  return (
    <section id="reviews" className="scroll-mt-20 bg-ink py-24 sm:py-32">
      <div className="container-slick">
        <SectionHeading
          eyebrow="Reviews"
          title={
            <>
              Clients say it <span className="text-gold-gradient">better than I do.</span>
            </>
          }
        />

        <div className="mt-12 flex flex-col items-center justify-center gap-3 border-y border-smoke py-8 text-center lg:flex-row lg:justify-center lg:gap-8">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-6xl font-black text-bone">{site.reviewStats.average.toFixed(1)}</span>
            <div className="flex flex-col items-start gap-1">
              <span className="flex text-gold" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="size-4" />
                ))}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ashtray">
                Based on {site.reviewStats.count} reviews
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={`${r.name}-${i}`} delay={((i % 3) + 1) as 1 | 2 | 3 | 4}>
              <figure className="flex h-full flex-col border border-smoke bg-coal p-7 transition-colors duration-300 hover:border-gold/40">
                <QuoteIcon className="size-7 text-gold/50" />
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-stone-mist">
                  &ldquo;{r.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center justify-between border-t border-smoke pt-4">
                  <div>
                    <p className="font-display text-sm font-bold uppercase tracking-wide text-bone">{r.name}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ashtray">{r.service}</p>
                  </div>
                  <Stars count={r.rating} />
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}