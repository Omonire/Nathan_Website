import { btnGhost, btnGold } from '../lib/ui'
import { ArrowRightIcon, PlayIcon } from './Icons'
import { Reveal } from './Reveal'

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
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

      <div className="container-slick relative z-10 pb-14 pt-32 sm:pb-16 sm:pt-36">
        <Reveal>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-smoke pb-5">
            <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-gold sm:text-xs">
              <span className="animate-pulse-dot inline-block size-1.5 rounded-full bg-gold" aria-hidden="true" />
              Available for freelance · YouTube &amp; long-form
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ashtray sm:text-xs">
              Benin City, NG — Working worldwide
            </p>
          </div>
        </Reveal>

        {/* Kinetic stacked headline — wits-style alternating solid / stroke / gradient lines */}
        <h1 className="font-display font-black uppercase leading-[0.82] tracking-tight">
          <Reveal as="span" className="block">
            <span className="block text-[clamp(3rem,12vw,9.5rem)] text-bone">Cuts that</span>
          </Reveal>
          <Reveal as="span" delay={1} className="block">
            <span className="block text-[clamp(3rem,12vw,9.5rem)] text-stroke">keep them</span>
          </Reveal>
          <Reveal as="span" delay={2} className="block">
            <span className="text-gold-gradient block text-[clamp(3rem,12vw,9.5rem)]">watching.</span>
          </Reveal>
        </h1>

        <div className="mt-10 grid gap-8 border-t border-smoke pt-7 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-12">
          <Reveal delay={2}>
            <div>
              <p className="max-w-xl text-base leading-relaxed text-stone-mist sm:text-lg">
                Video editor &amp; post-production for YouTube creators — pacing, color, sound and motion cut to hold
                attention from the first frame.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a href="#reel" className={btnGold}>
                  <PlayIcon className="size-4" />
                  Watch Showreel
                </a>
                <a href="#work" className={btnGhost}>
                  View Work
                  <ArrowRightIcon className="size-4" />
                </a>
              </div>
            </div>
          </Reveal>

          {/* wits-style "letter to most important" contact block */}
          <Reveal delay={3}>
            <div className="border-l-2 border-gold/70 pl-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ashtray">
                Send footage to:
              </p>
              <a
                href="mailto:hello@nathanno.com"
                className="mt-1 block cursor-pointer font-display text-lg font-bold uppercase tracking-tight text-bone transition-colors duration-200 hover:text-gold sm:text-xl"
              >
                hello@nathanno.com
              </a>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-ashtray">
                Reel <span className="text-gold">01:20</span> · Reply within 24h
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={4}>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
            <span className="font-mono text-xs uppercase tracking-widest text-ashtray">Edit · Color · Sound · Motion</span>
            <span className="font-mono text-xs uppercase tracking-widest text-ashtray">YouTube long-form &amp; shorts</span>
            <span className="font-mono text-xs uppercase tracking-widest text-ashtray">Fast turnaround</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
