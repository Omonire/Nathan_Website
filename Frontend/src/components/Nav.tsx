import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { btnGold } from '../lib/ui'
import { Brand } from './brand'
import { CloseIcon, MenuIcon } from './Icons'

const links = [
  { href: '/work', label: 'Work' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)')
    const onChange = () => {
      if (media.matches) setOpen(false)
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled || open ? 'border-b border-smoke bg-ink/90 backdrop-blur-md' : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="container-slick flex h-16 items-center justify-between sm:h-20">
          <Link to="/" className="flex cursor-pointer items-center gap-2.5" aria-label="Nathan N.O — Video Editor, home">
            <Brand />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {links.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className="cursor-pointer text-sm font-medium text-stone-mist transition-colors duration-200 hover:text-gold"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/book" className={`${btnGold} hidden sm:inline-flex`}>
              Start a Project
            </Link>
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
      </header>

      {open ? (
        <div className="fixed inset-x-0 bottom-0 top-16 z-[45] animate-fade-in overflow-y-auto overscroll-contain border-t border-smoke bg-ink/95 backdrop-blur-xl sm:top-20 lg:hidden">
          <nav className="container-slick flex min-h-full flex-col py-7" aria-label="Mobile">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold">Menu</p>
            <div className="mt-5 flex flex-col">
              {links.map((l, i) => (
                <Link
                  key={l.href}
                  to={l.href}
                  onClick={() => setOpen(false)}
                  className="group flex min-h-14 cursor-pointer items-center justify-between gap-4 border-b border-smoke/70 py-4"
                >
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono text-[10px] text-gold/60" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-display text-3xl font-bold uppercase tracking-tight text-bone transition-colors duration-200 group-hover:text-gold">
                      {l.label}
                    </span>
                  </span>
                  <span
                    className="font-mono text-sm text-gold/50 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-auto pt-10">
              <Link to="/book" onClick={() => setOpen(false)} className={`${btnGold} w-full`}>
                Start a Project
              </Link>
              <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-ashtray/60">
                Remote · Worldwide · Reply in 24h
              </p>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  )
}