import type { Service } from '../data/site'

const FALLBACK_ITEMS = ['Video Editing', 'Color Grading', 'Sound Design', 'Motion Graphics']

type MarqueeProps = {
  services?: Service[]
}

export function Marquee({ services }: MarqueeProps) {
  const items = services && services.length ? services.map((s) => s.name) : FALLBACK_ITEMS
  const row = [...items, ...items]
  return (
    <div className="overflow-hidden border-y border-smoke bg-coal py-5 sm:py-7" aria-hidden="true">
      <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap sm:gap-14">
        {row.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-10 sm:gap-14">
            <span
              className={`font-display text-3xl font-black uppercase tracking-tight sm:text-5xl ${
                items.indexOf(item) % 2 === 0 ? 'text-bone' : 'text-stroke-gold'
              }`}
            >
              {item}
            </span>
            <span className="text-gold text-xl sm:text-2xl">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
