import { useEffect, useState } from 'react'
import type { SiteContent } from '../data/site'
import { btnGold } from '../lib/ui'
import { Brand } from './Brand'
import { CloseIcon, MenuIcon } from './Icons'

const links = [
  { href: '#work', label: 'Work' },
  { href: '#manifesto', label: 'The Split' },
  { href: '#process', label: 'Process' },
  { href: '#services', label: 'Services' },
  { href: '#about', label: 'About' },
  { href: '#reel', label: 'Showreel' },
  { href: '#contact', label: 'Contact' },
]

type NavProps = {
  brand: SiteContent['brand']
}

export function Nav({ brand }: NavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? 'border-b border-smoke bg-ink/90 backdrop-blur-md' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="container-slick flex h-16 items-center justify-between sm:h-20">
        <a href="#top" className="flex cursor-pointer items-center gap-2.5" aria-label={`${brand.name} — home`}>
          <Brand brand={brand} />
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="cursor-pointer text-sm font-medium text-stone-mist transition-colors duration-200 hover:text-gold"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href="#contact" className={`${btnGold} hidden sm:inline-flex`}>
            Hire Me
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-10 cursor-pointer items-center justify-center text-bone lg:hidden"
            style={{ touchAction: 'manipulation' }}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-smoke bg-ink lg:hidden">
          <nav className="container-slick flex flex-col py-4" aria-label="Mobile">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="cursor-pointer border-b border-smoke/60 py-3.5 font-display text-base font-semibold uppercase tracking-wide text-bone transition-colors hover:text-gold"
              >
                {l.label}
              </a>
            ))}
            <a href="#contact" onClick={() => setOpen(false)} className={`${btnGold} mt-5`}>
              Hire Me
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
