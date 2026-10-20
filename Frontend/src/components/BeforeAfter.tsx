import { useRef, useState } from 'react'
import { beforeAfter } from '../data/gallery'

export function BeforeAfter() {
  const [pos, setPos] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const setFromClientX = (clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.min(94, Math.max(6, pct)))
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-[16/10] w-full cursor-ew-resize overflow-hidden select-none border border-smoke bg-coal sm:aspect-[16/9]"
      onPointerDown={(e) => {
        dragging.current = true
        containerRef.current?.setPointerCapture(e.pointerId)
        setFromClientX(e.clientX)
      }}
      onPointerMove={(e) => {
        if (dragging.current) setFromClientX(e.clientX)
      }}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <img
        src={beforeAfter.after}
        alt="Graded — finished color result"
        className="absolute inset-0 size-full object-cover"
        loading="lazy"
        draggable={false}
      />
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        aria-hidden="true"
      >
        <img
          src={beforeAfter.before}
          alt=""
          className="absolute inset-0 size-full object-cover brightness-[0.85] saturate-50 blur-[2px]"
          loading="lazy"
          draggable={false}
        />
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-12" aria-hidden="true">
        <div
          className="absolute inset-y-0"
          style={{ left: `${pos}%` }}
        >
          <span className="absolute inset-y-0 -left-px w-0.5 bg-gold" />
        </div>
        <div
          className="absolute top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-gold bg-ink/90 text-gold shadow-lg"
          style={{ left: `calc(${pos}%)` }}
          role="slider"
          tabIndex={0}
          aria-label="Comparison slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') setPos((p) => Math.max(6, p - 5))
            if (e.key === 'ArrowRight') setPos((p) => Math.min(94, p + 5))
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-5" aria-hidden="true">
            <path d="m9 8-4 4 4 4M15 8l4 4-4 4" />
          </svg>
        </div>
      </div>

      <span className="pointer-events-none absolute left-3 top-3 bg-ink/80 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-stone-mist">
        Raw
      </span>
      <span className="pointer-events-none absolute right-3 top-3 bg-gold px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink">
        Graded
      </span>
    </div>
  )
}