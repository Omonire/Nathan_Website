import { site } from '../data/site-content'
import { images } from '../data/images'
import { btnGhost, btnGold } from '../lib/ui'
import { Reveal } from './Reveal'
import { ArrowRightIcon, StarIcon } from './Icons'
import { useRef, useState } from 'react'

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoError, setVideoError] = useState(false)

  return (
    <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden border-b border-smoke bg-ink">
      {/* Soft ambient backdrop — blurred clip, fills the wide frame behind everything */}
      {!videoError && (
        <>
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            className="absolute inset-0 size-full scale-125 object-cover opacity-40 blur-3xl pointer-events-none"
          >
            <source src="/videos/showreel.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/70 to-ink/40 pointer-events-none" aria-hidden="true" />
        </>
      )}

      <div className="container-slick relative z-10 grid w-full items-center gap-12 pb-20 pt-32 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:pb-24 lg:pt-28">
        <div>
          <Reveal>
            <p className="mb-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-gold sm:text-xs">
              <span className="inline-block size-1.5 rounded-full bg-gold" aria-hidden="true" />
              {site.contact.city} · {site.hours.note}
            </p>
          </Reveal>

          <Reveal delay={1}>
            <h1 className="max-w-2xl font-display text-5xl font-black uppercase leading-[0.92] tracking-tight text-bone sm:text-6xl lg:text-7xl">
              Edits that hold.
              <br />
              <span className="text-gold-gradient">Stories that convert.</span>
            </h1>
          </Reveal>

          <Reveal delay={2}>
            <p className="mt-6 max-w-md text-base leading-relaxed text-stone-mist sm:text-lg">
              I edit video for YouTube creators who live or die by retention — the edit, color, sound and motion that
              keep a viewer watching, then send them to subscribe.
            </p>
          </Reveal>

          <Reveal delay={3}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href="#book" className={btnGold}>
                Start a Project
                <ArrowRightIcon className="size-4" />
              </a>
              <a href="#services" className={btnGhost}>
                View Services
              </a>
            </div>
          </Reveal>

          <Reveal delay={4}>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-smoke pt-6">
              <span className="flex items-center gap-2">
                <span className="flex text-gold" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} className="size-3.5" />
                  ))}
                </span>
                <span className="font-mono text-xs uppercase tracking-widest text-ashtray">
                  {site.reviewStats.average.toFixed(1)} rated
                </span>
              </span>
              <span className="font-mono text-xs uppercase tracking-widest text-ashtray">Remote · Worldwide</span>
              <span className="font-mono text-xs uppercase tracking-widest text-ashtray">Edit, color, sound &amp; motion</span>
            </div>
          </Reveal>
        </div>

        {/* Showreel card — plays at native 9:16 so it never upscales/blurs */}
        <Reveal delay={2} className="order-first lg:order-none">
          <figure className="relative mx-auto w-full max-w-[260px] sm:max-w-[300px] lg:max-w-[340px]">
            <div className="relative overflow-hidden rounded-2xl border border-smoke bg-coal shadow-2xl">
              <div className="relative aspect-[9/16]">
                {!videoError ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    poster={images.hero}
                    onError={() => setVideoError(true)}
                    className="absolute inset-0 size-full object-cover"
                  >
                    <source src="/videos/showreel.mp4" type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={images.hero}
                    alt="Showreel preview"
                    fetchPriority="high"
                    className="absolute inset-0 size-full object-cover"
                  />
                )}
                <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-gold backdrop-blur-sm">
                  <span className="inline-block size-1.5 animate-pulse rounded-full bg-gold" aria-hidden="true" />
                  Showreel
                </span>
              </div>
            </div>
            <figcaption className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-ashtray">
              Recent edit · vertical
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}
