import type { SiteContent } from '../data/site'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

type AboutProps = {
  about: SiteContent['about']
  brand: SiteContent['brand']
}

export function About({ about, brand }: AboutProps) {
  const stats = [
    { value: about.years, label: 'Years editing' },
    { value: about.tools.length, label: 'Tools mastered' },
    { value: about.clients.length, label: 'Client types' },
  ]

  return (
    <section id="about" className="py-24 sm:py-32">
      <div className="container-slick grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="About"
            title={
              <>
                The editor behind <span className="text-gold-gradient">the cut</span>
              </>
            }
            align="left"
          />
          <Reveal delay={2}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-stone-mist">{about.bio}</p>
          </Reveal>

          <Reveal delay={3}>
            <div className="mt-8 flex flex-wrap gap-2">
              {about.tools.map((t) => (
                <span
                  key={t}
                  className="border border-smoke px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-stone-mist"
                >
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={1}>
          <div className="grid gap-px bg-smoke sm:grid-cols-1">
            <div className="bg-ink p-6 sm:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold">Positioning</p>
              <p className="mt-3 font-display text-2xl font-extrabold uppercase leading-tight tracking-tight text-bone">
                {brand.positioning}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-px bg-smoke">
              {stats.map((s) => (
                <div key={s.label} className="bg-ink p-4 text-center sm:p-6">
                  <p className="font-display text-3xl font-black tracking-tight text-bone sm:text-4xl">{s.value}</p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-ashtray">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="bg-ink p-6 sm:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold">Works with</p>
              <ul className="mt-4 space-y-2">
                {about.clients.map((c) => (
                  <li key={c} className="flex items-center gap-3 text-sm text-stone-mist">
                    <span className="inline-block h-px w-4 bg-gold/60" aria-hidden="true" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
