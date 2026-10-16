import { useState } from 'react'
import type { SiteContent } from '../data/site'
import { btnGold } from '../lib/ui'
import { Brand } from './Brand'
import { ArrowRightIcon } from './Icons'

type FooterProps = {
  brand: SiteContent['brand']
  socials: SiteContent['socials']
}

export function Footer({ brand, socials }: FooterProps) {
  const [year] = useState(() => new Date().getFullYear())

  return (
    <footer className="bg-ink">
      <div className="container-slick border-t border-smoke py-16">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-3xl font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-bone sm:text-5xl lg:text-6xl">
            Ready to <span className="text-gold-gradient">cut it</span>?
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-ashtray">
            Get cleaner pacing, sharper color and sound that keeps them watching.
          </p>
          <a href="#contact" className={btnGold}>
            Hire Me
            <ArrowRightIcon className="size-4" />
          </a>
        </div>

        <div className="mt-16 grid gap-10 border-t border-smoke pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-3">
            <Brand />
            <p className="mt-2 text-sm text-ashtray">{brand.positioning}</p>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold">Explore</p>
            <nav className="mt-4 flex flex-col gap-3">
              <a href="#work" className="cursor-pointer text-sm text-stone-mist hover:text-gold">
                Work
              </a>
              <a href="#services" className="cursor-pointer text-sm text-stone-mist hover:text-gold">
                Services
              </a>
              <a href="#about" className="cursor-pointer text-sm text-stone-mist hover:text-gold">
                About
              </a>
              <a href="#reel" className="cursor-pointer text-sm text-stone-mist hover:text-gold">
                Showreel
              </a>
              <a href="#contact" className="cursor-pointer text-sm text-stone-mist hover:text-gold">
                Contact
              </a>
            </nav>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold">Contact</p>
            <ul className="mt-4 space-y-2 text-sm text-stone-mist">
              <li>Remote · Worldwide</li>
              <li>Booking new projects</li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold">Social</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-smoke px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ashtray transition-colors duration-200 hover:border-gold/70 hover:text-gold"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-smoke pt-6 sm:flex-row">
          <p className="text-xs text-ashtray">© {year} {brand.name}. All rights reserved.</p>
          <p className="text-xs text-ashtray">Made with precision — edit, color, sound.</p>
        </div>
      </div>
    </footer>
  )
}
