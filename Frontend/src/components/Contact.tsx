import { API_BASE } from '../lib/admin-auth'
import { useSite } from '../lib/site-context'
import { SectionHeading } from './SectionHeading'
import { Reveal } from './Reveal'
import { ClockIcon, PhoneIcon, PinIcon, TikTokIcon, YouTubeIcon } from './Icons'
import { Nav } from './Nav'
import { Footer } from './Footer'
import type { JSX } from 'react'
import { useState } from 'react'

const socialIcons: Record<string, (props: { className?: string }) => JSX.Element> = {
  YouTube: YouTubeIcon,
  TikTok: TikTokIcon,
}

export function ContactPage() {
  return (
    <div className="bg-ink text-bone">
      <Nav />
      <main className="pt-20">
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export function Contact() {
  const { content } = useSite()
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [reference, setReference] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        }),
      })
      const data = res.ok ? ((await res.json()) as { reference?: string }) : null
      if (!res.ok || !data) {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 4000)
        return
      }
      setReference(data.reference ?? '')
      setStatus('sent')
      setFormData({ name: '', email: '', phone: '', message: '' })
      setTimeout(() => setStatus('idle'), 6000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  return (
    <section id="location" className="scroll-mt-20 bg-ink py-24 sm:py-32">
      <div className="container-slick">
        <SectionHeading
          eyebrow="Contact"
          title={
            <>
              Based in <span className="text-gold-gradient">Benin City.</span>
            </>
          }
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          {/* Contact Info */}
          <Reveal>
            <div className="flex flex-col gap-px bg-smoke border border-smoke">
              <div className="flex items-start gap-4 bg-coal p-6">
                <PinIcon className="mt-0.5 shrink-0 text-gold" />
                <div>
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-ashtray">Based in</h3>
                  <p className="mt-2 font-display text-lg font-bold text-bone">{content.brand.name} · {content.brand.studio}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ashtray">
                    {content.contact.address}
                    <br />
                    {content.contact.addressLine2}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-coal p-6">
                <ClockIcon className="mt-0.5 shrink-0 text-gold" />
                <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-ashtray">Availability</h3>
                    <p className="mt-2 text-sm text-bone">
                      {content.hours.days}
                    </p>
                    <p className="text-sm text-ashtray">
                      {content.hours.open} – {content.hours.close}
                    </p>
                  </div>
                  <div className="sm:text-left">
                    <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-ashtray">Status</h3>
                    <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-gold">{content.hours.note}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-coal p-6">
                <PhoneIcon className="mt-0.5 shrink-0 text-gold" />
                <div>
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-ashtray">Reach out</h3>
                  <a href={`tel:${content.contact.phone.replace(/[^+\d]/g, '')}`} className="mt-2 block cursor-pointer text-sm text-bone underline-offset-4 transition-colors hover:text-gold">
                    {content.contact.phone}
                  </a>
                  <a href={`mailto:${content.contact.email}`} className="mt-1 block cursor-pointer text-sm text-ashtray underline-offset-4 transition-colors hover:text-gold">
                    {content.contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-coal p-6">
                <div>
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-ashtray">Follow the work</h3>
                  <div className="mt-3 flex gap-3">
                    {content.socials.map((s) => {
                      const Icon = socialIcons[s.label] ?? YouTubeIcon
                      return (
                        <a
                          key={s.label}
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={s.label}
                          className="inline-flex size-10 cursor-pointer items-center justify-center border border-smoke-light text-ashtray transition-colors duration-200 hover:border-gold hover:text-gold"
                        >
                          <Icon />
                        </a>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Contact Form */}
          <Reveal delay={1}>
            <div className="h-full">
              <form onSubmit={handleSubmit} className="flex h-full flex-col gap-4 rounded-xl border border-smoke bg-coal p-6">
                <h3 className="font-display text-xl font-bold uppercase tracking-tight text-bone">
                  Send a Message
                </h3>
                <p className="text-sm text-ashtray">Questions? Project brief? Drop me a line.</p>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-ashtray">Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-lg border border-smoke bg-ink px-3 py-2 text-bone font-mono text-sm outline-none transition focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-ashtray">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-lg border border-smoke bg-ink px-3 py-2 text-bone font-mono text-sm outline-none transition focus:border-gold"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-ashtray">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-smoke bg-ink px-3 py-2 text-bone font-mono text-sm outline-none transition focus:border-gold"
                  />
                </div>
                <div>
                  <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-ashtray">Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full resize-none rounded-lg border border-smoke bg-ink px-3 py-2 text-bone font-mono text-sm outline-none transition focus:border-gold"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full rounded-lg bg-gold px-4 py-3 font-mono text-sm font-bold uppercase tracking-wider text-ink transition hover:bg-gold/80 disabled:opacity-50"
                >
                  {status === 'sending' ? 'Sending...' : status === 'sent' ? '✓ Sent!' : 'Send Message'}
                </button>
                {status === 'sent' && (
                  <p className="text-center text-sm text-green-400">
                    Message sent! I'll get back to you soon.
                    {reference && (
                      <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-ashtray">
                        Reference: {reference}
                      </span>
                    )}
                  </p>
                )}
                {status === 'error' && (
                  <p className="text-center text-sm text-red-400">
                    Couldn't send right now — email {content.contact.email} instead.
                  </p>
                )}
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
