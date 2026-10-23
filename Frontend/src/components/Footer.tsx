import { useSite } from '../lib/site-context'
import { btnGold } from '../lib/ui'
import { Link } from 'react-router-dom'
import { Brand } from './brand'
import { Reveal } from './Reveal'
import { TikTokIcon, YouTubeIcon } from './Icons'
import type { JSX } from 'react'

const socialIcons: Record<string, (props: { className?: string }) => JSX.Element> = {
  YouTube: YouTubeIcon,
  TikTok: TikTokIcon,
}

const navLinks = [
  { href: '/services', label: 'Services' },
  { href: '/work', label: 'Selected Work' },
  { href: '/projects', label: 'Projects' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

export function Footer() {
  const { content } = useSite()
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-smoke bg-coal">
      <Reveal>
        <div className="container-slick flex flex-col items-center gap-6 py-16 text-center sm:py-20">
          <h2 className="font-display text-4xl font-black uppercase leading-[0.95] tracking-tight text-bone sm:text-6xl">
            Let's make it <span className="text-gold-gradient">convert.</span>
          </h2>
          <Link to="/book" className={btnGold}>
            Start a Project
          </Link>
        </div>
      </Reveal>

      <div className="border-y border-smoke">
        <div className="container-slick grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Brand />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ashtray">
              Edits that hold, stories that convert. {content.brand.name} — video editing and post-production for YouTube
              creators, based in {content.contact.city}.
            </p>
          </div>

          <nav aria-label="Footer">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-ashtray">Explore</h3>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="cursor-pointer text-sm text-stone-mist transition-colors hover:text-gold">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-ashtray">Availability</h3>
            <p className="mt-4 text-sm text-bone">{content.hours.days}</p>
            <p className="mt-1 text-sm text-ashtray">
              {content.hours.open} – {content.hours.close}
            </p>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-gold">{content.hours.note}</p>
          </div>

          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-ashtray">Contact</h3>
            <p className="mt-4 text-sm text-stone-mist">{content.contact.address}</p>
            <p className="mt-1 text-sm text-ashtray">{content.contact.addressLine2}</p>
            <p className="mt-3 text-sm text-stone-mist">{content.contact.phone}</p>
            <a
              href={`mailto:${content.contact.email}`}
              className="mt-1 inline-block cursor-pointer text-sm text-bone transition-colors hover:text-gold"
            >
              {content.contact.email}
            </a>
          </div>
        </div>
      </div>

      <div className="container-slick flex flex-col items-center justify-between gap-4 py-7 sm:flex-row">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ashtray">
          © {year} {content.brand.name} · {content.brand.studio}
        </p>
        <div className="flex items-center gap-3">              {content.socials.map((s) => {
            const Icon = socialIcons[s.label] ?? YouTubeIcon
            return (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="inline-flex size-9 cursor-pointer items-center justify-center border border-smoke-light text-ashtray transition-colors duration-200 hover:border-gold hover:text-gold"
              >
                <Icon className="size-4" />
              </a>
            )
          })}
          <a
            href="/admin/login"
            className="ml-2 rounded-lg border border-smoke-light px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-ashtray transition-colors duration-200 hover:border-gold hover:text-gold"
          >
            Admin
          </a>
        </div>
      </div>
    </footer>
  )
}