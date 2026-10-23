import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { site } from '../data/site-content'
import { useSite } from '../lib/site-context'
import { submitBooking, type BookingPayload, type Preselect } from '../lib/booking'
import { dayLabel, generateSlots, to12h, toISODate, nextDays } from '../lib/dates'
import { btnGold, errCls, fieldCls, labelCls } from '../lib/ui'
import { SectionHeading } from './SectionHeading'
import { Reveal } from './Reveal'
import { CalendarIcon, CheckIcon, ClockIcon, PhoneIcon } from './Icons'

type Status = 'idle' | 'sending' | 'done'

type FormState = {
  serviceId: string
  barberId: string
  date: string
  time: string
  name: string
  contact: string
  notes: string
  website: string
}

const emptyForm: FormState = {
  serviceId: '',
  barberId: '',
  date: '',
  time: '',
  name: '',
  contact: '',
  notes: '',
  website: '',
}

export function Booking() {
  const { services, projects, content } = useSite()
  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [reference, setReference] = useState('')
  const [synced, setSynced] = useState(false)

  const days = useMemo(() => nextDays(site.booking.daysAhead), [])
  const slots = useMemo(
    () => generateSlots(site.booking.slotStart, site.booking.slotEnd, site.booking.slotStepMinutes),
    [],
  )

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<Preselect>).detail
      setForm((f) => ({
        ...f,
        serviceId:
          detail.serviceId && services.some((s) => s.id === detail.serviceId) ? detail.serviceId : f.serviceId,
        barberId:
          detail.barberId && projects.some((b) => b.id === detail.barberId) ? detail.barberId : f.barberId,
      }))
    }
    window.addEventListener('slick:preselect', handler)
    return () => window.removeEventListener('slick:preselect', handler)
  }, [services, projects])

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const validate = () => {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!form.serviceId) next.serviceId = 'Pick a service.'
    if (!form.date) next.date = 'Pick a date.'
    if (!form.time) next.time = 'Pick a time.'
    if (form.name.trim().length < 2) next.name = 'Enter your full name.'
    const hasEmail = form.contact.includes('@')
    const hasPhone = /\d{7,}/.test(form.contact)
    if (!form.contact.trim() || (!hasEmail && !hasPhone)) next.contact = 'Enter a valid phone number or email.'
    return next
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (form.website) return
    const next = validate()
    setErrors(next)
    if (Object.values(next).some(Boolean)) return

    const payload: BookingPayload = {
      serviceId: form.serviceId,
      serviceName: serviceName,
      barberId: form.barberId,
      barberName: barberName,
      date: form.date,
      time: form.time,
      name: form.name.trim(),
      contact: form.contact.trim(),
      notes: form.notes.trim() || undefined,
    }
    setStatus('sending')
    const result = await submitBooking(payload, site.api.endpoint, site.api.enabled)
    setReference(result.reference)
    setSynced(result.synced)
    setStatus('done')
  }

  const reset = () => {
    setForm(emptyForm)
    setErrors({})
    setStatus('idle')
  }

  const serviceName = services.find((s) => s.id === form.serviceId)?.name
  const barberName = projects.find((b) => b.id === form.barberId)?.name
  const dateLabel = form.date ? dayLabel(new Date(`${form.date}T00:00:00`)) : ''
  const timeLabel = form.time ? to12h(form.time) : ''

  return (
    <section id="book" className="scroll-mt-20 border-y border-smoke bg-coal py-24 sm:py-32">
      <div className="container-slick">
        <SectionHeading
          eyebrow="Start a Project"
          title={
            <>
              Let's talk <span className="text-gold-gradient">your next edit.</span>
            </>
          }
          sub="Tell me the service, the project it relates to, and when you need it. I'll reply with availability and a quote within a day."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <aside className="flex h-full flex-col gap-px border border-smoke bg-smoke">
              <div className="flex items-start gap-4 bg-coal p-6">
                <ClockIcon className="mt-0.5 shrink-0 text-gold" />
                <div>
                  <h3 className="font-display text-lg font-bold uppercase text-bone">Availability</h3>
                  <p className="mt-1 text-sm text-ashtray">
                    {content.hours.days} · {content.hours.open} – {content.hours.close}
                  </p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">{content.hours.note}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-coal p-6">
                <CalendarIcon className="mt-0.5 shrink-0 text-gold" />
                <div>
                  <h3 className="font-display text-lg font-bold uppercase text-bone">Delivery window</h3>
                  <p className="mt-1 text-sm text-ashtray">
                    Kick off within the next {site.booking.daysAhead} days · first draft by {to12h(site.booking.slotEnd)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-coal p-6">
                <PhoneIcon className="mt-0.5 shrink-0 text-gold" />
                <div>
                  <h3 className="font-display text-lg font-bold uppercase text-bone">Prefer to talk?</h3>
                  <p className="mt-1 text-sm text-ashtray">{content.contact.phone}</p>
                </div>
              </div>
            </aside>
          </Reveal>

          <Reveal delay={1}>
            {status === 'done' ? (
              <div className="flex h-full flex-col items-center justify-center border border-gold/40 bg-ink p-10 text-center sm:p-14">
                <span className="grid size-16 place-items-center rounded-full border border-gold/50 bg-metallic text-ink">
                  <CheckIcon className="size-8" />
                </span>
                <h3 className="mt-6 font-display text-3xl font-extrabold uppercase tracking-tight text-bone">
                  Request received
                </h3>
                <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-ashtray">
                  Thanks{form.name ? `, ${form.name.split(' ')[0]}` : ''}. Your request for{' '}
                  <span className="text-bone">{serviceName}</span>
                  {barberName ? (
                    <>
                      {' '}on the <span className="text-bone">{barberName}</span> project
                    </>
                  ) : null}{' '}
                  on <span className="text-bone">{dateLabel}</span> at{' '}
                  <span className="text-bone">{timeLabel}</span> is in. I'll reply with a quote within a day.
                </p>
                <p className="mt-5 border border-smoke bg-coal px-4 py-2 font-mono text-xs tracking-[0.2em] text-gold">
                  Reference: {reference}
                </p>
                {synced ? (
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ashtray">
                    Synced with the studio
                  </p>
                ) : null}
                <button type="button" onClick={reset} className={`${btnGold} mt-8`}>
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="border border-smoke bg-ink p-6 sm:p-8">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className={labelCls} htmlFor="service">
                      Service *
                    </label>
                    <select
                      id="service"
                      className={fieldCls}
                      value={form.serviceId}
                      onChange={(e) => set('serviceId', e.target.value)}
                    >
                      <option value="">Select a service</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} — {s.duration}
                        </option>
                      ))}
                    </select>
                    {errors.serviceId ? <span className={errCls} role="alert">{errors.serviceId}</span> : null}
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelCls} htmlFor="barber">
                      Project
                    </label>
                    <select
                      id="barber"
                      className={fieldCls}
                      value={form.barberId}
                      onChange={(e) => set('barberId', e.target.value)}
                    >
                      <option value="">Not sure yet / a new project</option>
                      {projects.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} — {b.specialty}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelCls} htmlFor="date">
                      Start date *
                    </label>
                    <select
                      id="date"
                      className={fieldCls}
                      value={form.date}
                      onChange={(e) => set('date', e.target.value)}
                    >
                      <option value="">Select a date</option>
                      {days.map((d) => {
                        const iso = toISODate(d)
                        return (
                          <option key={iso} value={iso}>
                            {dayLabel(d)}
                          </option>
                        )
                      })}
                    </select>
                    {errors.date ? <span className={errCls} role="alert">{errors.date}</span> : null}
                  </div>

                  <div>
                    <label className={labelCls} htmlFor="time">
                      Call time *
                    </label>
                    <select
                      id="time"
                      className={fieldCls}
                      value={form.time}
                      onChange={(e) => set('time', e.target.value)}
                    >
                      <option value="">Select a time</option>
                      {slots.map((t) => (
                        <option key={t} value={t}>
                          {to12h(t)}
                        </option>
                      ))}
                    </select>
                    {errors.time ? <span className={errCls} role="alert">{errors.time}</span> : null}
                  </div>

                  <div>
                    <label className={labelCls} htmlFor="name">
                      Your name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      className={fieldCls}
                      placeholder="First & last name"
                      value={form.name}
                      onChange={(e) => set('name', e.target.value)}
                    />
                    {errors.name ? <span className={errCls} role="alert">{errors.name}</span> : null}
                  </div>

                  <div>
                    <label className={labelCls} htmlFor="contact">
                      Phone or email *
                    </label>
                    <input
                      id="contact"
                      type="text"
                      autoComplete="tel"
                      className={fieldCls}
                      placeholder="you@email.com or (000) 000-0000"
                      value={form.contact}
                      onChange={(e) => set('contact', e.target.value)}
                    />
                    {errors.contact ? <span className={errCls} role="alert">{errors.contact}</span> : null}
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelCls} htmlFor="notes">
                      Notes <span className="normal-case text-ashtray/60">(optional)</span>
                    </label>
                    <textarea
                      id="notes"
                      rows={3}
                      className={`${fieldCls} resize-none`}
                      placeholder="Footage, format, deadline — anything I should know?"
                      value={form.notes}
                      onChange={(e) => set('notes', e.target.value)}
                    />
                  </div>

                  <div className="sr-only" aria-hidden="true">
                    <label htmlFor="website">Leave this field empty</label>
                    <input
                      id="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.website}
                      onChange={(e) => set('website', e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className={`${btnGold} mt-8 w-full disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  {status === 'sending' ? 'Sending…' : 'Send request'}
                </button>
                <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-ashtray">
                  No commitment · Every request gets a reply within a day
                </p>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  )
}