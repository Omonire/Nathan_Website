const items = ['Video Editing', 'Color Grading', 'Sound Design', 'Motion Graphics', 'Thumbnails', 'YouTube Long-Form', 'Shorts & Reels']

export function Marquee() {
  const row = [...items, ...items]
  return (
    <div className="border-y border-smoke bg-coal" aria-hidden="true">
      <div className="overflow-hidden py-3.5">
        <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap">
          {row.map((item, i) => (
            <span key={`${item}-${i}`} className="flex items-center gap-8">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-ashtray">{item}</span>
              <span className="text-gold">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
