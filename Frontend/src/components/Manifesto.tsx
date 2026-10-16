import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

const losers = [
  'Hook buried after the intro',
  'Dead air, drift, no rhythm',
  'Flat color, audio fighting the voice',
  'Built for the upload, not the viewer',
]

const winners = [
  'Hook set inside the first 3 seconds',
  'Cut on the beat — zero dead air',
  'Graded, mixed, locked to a look',
  'Built around retention and rewatch',
]

const stats = [
  { value: '38%', label: 'Avg. watch-time lift on a recent long-form edit' },
  { value: '3s', label: 'Where viewers decide to stay or scroll' },
  { value: '9:16', label: 'One long video, nine shorts per week' },
]

export function Manifesto() {
  return (
    <section id="manifesto" className="border-b border-smoke bg-ink py-24 sm:py-32">
      <div className="container-slick">
        <SectionHeading
          eyebrow="The split"
          title={
            <>
              Time divides videos <span className="text-gold-gradient">into two types</span>
            </>
          }
          sub="Every upload picks a side before the viewer ever sees the end card."
          align="left"
        />

        <div className="mt-14 grid gap-px border border-smoke bg-smoke md:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col bg-coal p-6 sm:p-9">
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ashtray">Type 01</p>
                <span className="font-display text-5xl font-black text-stroke sm:text-6xl" aria-hidden="true">
                  ↓
                </span>
              </div>
              <h3 className="mt-4 font-display text-2xl font-extrabold uppercase leading-tight tracking-tight text-ashtray sm:text-3xl">
                Videos that lose them
              </h3>
              <ul className="mt-7 flex-1 space-y-4 border-t border-smoke pt-6">
                {losers.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-ashtray sm:text-base">
                    <span className="mt-2 inline-block h-px w-4 shrink-0 bg-ashtray/50" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="flex h-full flex-col bg-coal-soft p-6 sm:p-9">
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold">Type 02</p>
                <span className="text-gold-gradient font-display text-5xl font-black sm:text-6xl" aria-hidden="true">
                  ↑
                </span>
              </div>
              <h3 className="text-gold-gradient mt-4 font-display text-2xl font-extrabold uppercase leading-tight tracking-tight sm:text-3xl">
                Videos that keep them
              </h3>
              <ul className="mt-7 flex-1 space-y-4 border-t border-smoke pt-6">
                {winners.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-bone sm:text-base">
                    <span className="mt-2 inline-block h-px w-4 shrink-0 bg-gold" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* wits-style big stat callouts */}
        <div className="mt-16 grid gap-10 border-t border-smoke pt-12 sm:grid-cols-3 sm:gap-6">
          {stats.map((s, i) => (
            <Reveal key={s.value} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <div className="text-center sm:text-left">
                <p className="font-display text-6xl font-black leading-none tracking-tight text-bone sm:text-7xl lg:text-8xl">
                  {s.value}
                </p>
                <p className="mx-auto mt-4 max-w-[15rem] font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-ashtray sm:mx-0">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
