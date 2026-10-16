import { btnGhost, btnGold } from '../lib/ui'
import { ArrowRightIcon, PlayIcon } from './Icons'
import { Reveal } from './Reveal'

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] items-end overflow-hidden">
      {/* Showreel background — swap for <video> once an asset exists */}
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(120%_90%_at_70%_10%,#232120_0%,#0c0a09_60%)]"
        aria-hidden="true"
      />
      <div className="bg-grain absolute inset-0 pointer-events-none opacity-60" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-linear-to-t from-ink via-ink/60 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      <div className="container-slick relative z-10 pb-24 pt-36 sm:pb-28">
        <Reveal>
          <p className="mb-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-gold sm:text-xs">
            <span className="animate-pulse-dot inline-block size-1.5 rounded-full bg-gold" aria-hidden="true" />
            Available for freelance · YouTube &amp; long-form
          </p>
        </Reveal>

        <Reveal delay={1}>
          <h1 className="max-w-4xl font-display text-5xl font-black uppercase leading-[0.92] tracking-tight text-bone sm:text-7xl lg:text-8xl">
            Cuts that
            <br />
            <span className="text-gold-gradient">keep them watching.</span>
          </h1>
        </Reveal>

        <Reveal delay={2}>
          <p className="mt-6 max-w-md text-base leading-relaxed text-stone-mist sm:text-lg">
            Video editor &amp; post-production for YouTube creators — pacing, color, sound and motion cut to hold
            attention from the first frame.
          </p>
        </Reveal>

        <Reveal delay={3}>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href="#reel" className={btnGold}>
              <PlayIcon className="size-4" />
              Watch Showreel
            </a>
            <a href="#work" className={btnGhost}>
              View Work
              <ArrowRightIcon className="size-4" />
            </a>
          </div>
        </Reveal>

        <Reveal delay={4}>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-smoke pt-6">
            <span className="font-mono text-xs uppercase tracking-widest text-ashtray">Edit · Color · Sound · Motion</span>
            <span className="font-mono text-xs uppercase tracking-widest text-ashtray">YouTube long-form &amp; shorts</span>
            <span className="font-mono text-xs uppercase tracking-widest text-ashtray">Fast turnaround</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
