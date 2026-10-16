import { useState } from 'react'
import type { SiteContent } from '../data/site'
import { sendContact } from '../lib/api'
import { btnGold, errCls, fieldCls, labelCls } from '../lib/ui'
import { CheckIcon, MailIcon } from './Icons'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

type ContactProps = {
  contact: SiteContent['contact']
  socials: SiteContent['socials']
}

export function Contact({ contact, socials }: ContactProps) {
  const [form, setForm] = useState({ name: '', email: '', message: '', website: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [serverError, setServerError] = useState('')

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email'
    if (form.message.trim().length < 10) next.message = 'Tell me a bit more (10+ characters)'
    setErrors(next)
    if (Object.keys(next).length) return

    setStatus('sending')
    setServerError('')
    const res = await sendContact(form)
    if (res.ok) {
      setStatus('sent')
    } else {
      setStatus('idle')
      if (res.errors && Object.keys(res.errors).length) {
        setErrors(res.errors)
      } else {
        setServerError(res.error ?? 'Something went wrong.')
      }
    }
  }

  return (
    <section id="contact" className="py-24 sm:py-32">
      <div className="container-slick grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="Contact"
            title={
              <>
                Let's <span className="text-gold-gradient">work</span>
              </>
            }
            align="left"
            sub="Tell me about the channel, the footage and the deadline — I'll come back with a plan."
          />

          <Reveal delay={3}>
            <div className="mt-8 divide-y divide-smoke border border-smoke">
              <div className="flex items-start gap-4 p-5">
                <MailIcon className="mt-0.5 size-4 shrink-0 text-gold" />
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ashtray">Email</p>
                  <a
                    href={`mailto:${contact.email}`}
                    className="cursor-pointer text-sm text-bone transition-colors hover:text-gold"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>
              <div className="p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ashtray">Based</p>
                <p className="mt-1 text-sm text-bone">{contact.location}</p>
              </div>
              <div className="p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ashtray">Availability</p>
                <p className="mt-1 inline-flex items-center gap-2 text-sm text-bone">
                  <span className="animate-pulse-dot inline-block size-1.5 rounded-full bg-gold" aria-hidden="true" />
                  {contact.availability}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={4}>
            <div className="mt-6 flex flex-wrap gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-smoke px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ashtray transition-colors duration-200 hover:border-gold/70 hover:text-gold"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={1}>
          {status === 'sent' ? (
            <div className="flex h-full flex-col items-center justify-center border border-smoke bg-coal/40 p-10 text-center">
              <span className="bg-metallic flex size-14 items-center justify-center text-ink">
                <CheckIcon className="size-6" />
              </span>
              <h3 className="mt-5 font-display text-2xl font-extrabold uppercase tracking-tight text-bone">
                Message sent
              </h3>
              <p className="mt-2 max-w-sm text-sm text-ashtray">
                Thanks {form.name.split(' ')[0]} — I'll get back to you at {form.email} shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="border border-smoke bg-coal/40 p-6 sm:p-8">
              <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={set('website')}
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelCls} htmlFor="name">
                    Name
                  </label>
                  <input
                    id="name"
                    className={fieldCls}
                    value={form.name}
                    onChange={set('name')}
                    placeholder="Your name"
                  />
                  {errors.name ? <span className={errCls}>{errors.name}</span> : null}
                </div>
                <div>
                  <label className={labelCls} htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={fieldCls}
                    value={form.email}
                    onChange={set('email')}
                    placeholder="you@channel.com"
                  />
                  {errors.email ? <span className={errCls}>{errors.email}</span> : null}
                </div>
              </div>

              <div className="mt-5">
                <label className={labelCls} htmlFor="message">
                  Project details
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className={fieldCls}
                  value={form.message}
                  onChange={set('message')}
                  placeholder="Channel, video length, deadline, what you need…"
                />
                {errors.message ? <span className={errCls}>{errors.message}</span> : null}
              </div>

              {serverError ? <p className="mt-4 text-sm text-red-400">{serverError}</p> : null}

              <button type="submit" disabled={status === 'sending'} className={`${btnGold} mt-6 w-full disabled:opacity-60`}>
                {status === 'sending' ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}
