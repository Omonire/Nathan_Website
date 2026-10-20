import { site } from '../data/site-content'
import { SectionHeading } from './SectionHeading'
import { Reveal } from './Reveal'
import { ClockIcon, FacebookIcon, InstagramIcon, PhoneIcon, PinIcon, TikTokIcon } from './Icons'
import type { JSX } from 'react'
import { useState } from 'react'

const socialIcons: Record<string, (props: { className?: string }) => JSX.Element> = {
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
  TikTok: TikTokIcon,
}

export function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    // Simulate sending (connect to email API in production)
    await new Promise(r => setTimeout(r, 1500))
    setStatus('sent')
    setFormData({ name: '', email: '', phone: '', message: '' })
    setTimeout(() => setStatus('idle'), 3000)
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
                  <p className="mt-2 font-display text-lg font-bold text-bone">{site.brand.name} · {site.brand.studio}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ashtray">
                    {site.contact.address}
                    <br />
                    {site.contact.addressLine2}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-coal p-6">
                <ClockIcon className="mt-0.5 shrink-0 text-gold" />
                <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-ashtray">Availability</h3>
                    <p className="mt-2 text-sm text-bone">
                      {site.hours.days}
                    </p>
                    <p className="text-sm text-ashtray">
                      {site.hours.open} – {site.hours.close}
                    </p>
                  </div>
                  <div className="sm:text-left">
                    <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-ashtray">Status</h3>
                    <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-gold">{site.hours.note}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-coal p-6">
                <PhoneIcon className="mt-0.5 shrink-0 text-gold" />
                <div>
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-ashtray">Reach out</h3>
                  <a href={`tel:${site.contact.phone.replace(/[^+\d]/g, '')}`} className="mt-2 block cursor-pointer text-sm text-bone underline-offset-4 transition-colors hover:text-gold">
                    {site.contact.phone}
                  </a>
                  <a href={`mailto:${site.contact.email}`} className="mt-1 block cursor-pointer text-sm text-ashtray underline-offset-4 transition-colors hover:text-gold">
                    {site.contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-coal p-6">
                <div>
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-ashtray">Follow the work</h3>
                  <div className="mt-3 flex gap-3">
                    {site.socials.map((s) => {
                      const Icon = socialIcons[s.label] ?? InstagramIcon
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
                  <p className="text-center text-sm text-green-400">Message sent! I'll get back to you soon.</p>
                )}
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
