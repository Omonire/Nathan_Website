import { useState } from 'react'
import type { SiteContent } from '../data/site'
import { PlayIcon } from './Icons'
import { Poster } from './Poster'
import { Reveal } from './Reveal'

type ShowreelProps = {
  showreel: SiteContent['showreel']
}

export function Showreel({ showreel }: ShowreelProps) {
  const [playing, setPlaying] = useState(false)

  return (
    <section id="reel" className="py-24 sm:py-32">
      <div className="container-slick">
        <Reveal>
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-gold">
              <span className="animate-pulse-dot inline-block size-1.5 rounded-full bg-gold" aria-hidden="true" />
              Showreel · {showreel.length}
            </span>
            <h2 className="max-w-3xl font-display text-5xl font-black uppercase leading-[0.9] tracking-tight text-bone sm:text-6xl lg:text-7xl">
              See the <span className="text-gold-gradient">cut</span>
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-ashtray">{showreel.caption}</p>
          </div>
        </Reveal>

        <Reveal delay={1}>
          <div className="group relative mt-12 aspect-video w-full overflow-hidden border border-smoke">
            {playing && showreel.url ? (
              <iframe
                src={showreel.url}
                title="Showreel"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="size-full"
              />
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                disabled={!showreel.url}
                className="block size-full cursor-pointer disabled:cursor-default"
                aria-label="Play showreel"
              >
                <Poster label="Showreel" sub={`Nathan N.O · ${showreel.length}`} className="size-full" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-metallic flex size-16 items-center justify-center text-ink transition-transform duration-300 group-hover:scale-105 sm:size-20">
                    <PlayIcon className="size-6 sm:size-7" />
                  </span>
                </span>
                {!showreel.url ? (
                  <span className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-ashtray">
                    Reel link coming soon
                  </span>
                ) : null}
              </button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
