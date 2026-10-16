import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

const steps = [
  {
    n: '1',
    title: 'Send the footage',
    body: 'Drop the raw files, refs and the brief. Tell me the platform, the length and the deadline.',
    meta: 'Day 0',
  },
  {
    n: '2',
    title: 'First cut lands',
    body: 'Structure, pacing and hooks locked in a rough cut so we align on the story before the polish.',
    meta: '48–72h',
  },
  {
    n: '3',
    title: 'Polish pass',
    body: 'Color, sound design, motion and thumbnails — every layer tuned until it feels like a production.',
    meta: '+2–4 days',
  },
  {
    n: '4',
    title: 'Ready to upload',
    body: 'Master file, platform exports and revision rounds closed out. You publish, they keep watching.',
    meta: 'Delivery',
  },
]

export function Process() {
  return (
    <section id="process" className="border-b border-smoke bg-ink py-24 sm:py-32">
      <div className="container-slick">
        <SectionHeading
          eyebrow="How it goes"
          title={
            <>
              From footage to <span className="text-gold-gradient">final cut</span>
            </>
          }
          sub="Four steps, no chaos. You always know what lands next and when."
          align="left"
        />

        <div className="mt-14 grid gap-px border border-smoke bg-smoke sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <div className="group flex h-full flex-col bg-coal p-6 transition-colors duration-300 hover:bg-coal-soft sm:p-7">
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-7xl font-black leading-none tracking-tighter text-stroke transition-all duration-300 group-hover:text-stroke-gold sm:text-8xl">
                    {s.n}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold">{s.meta}</span>
                </div>
                <h3 className="mt-7 font-display text-lg font-extrabold uppercase leading-tight tracking-tight text-bone">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ashtray">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
