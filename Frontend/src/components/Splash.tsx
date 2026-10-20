import { useEffect, useRef, useState } from 'react'
import { site } from '../data/site-content'
import { FilmIcon } from './Icons'

const SESSION_KEY = 'nathan_splash_seen'
const MIN_DURATION = 1600
const MAX_DURATION = 3200

function alreadySeen() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

export function Splash() {
  const [visible, setVisible] = useState(!alreadySeen())
  const [progress, setProgress] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const doneRef = useRef(false)

  useEffect(() => {
    if (!visible) return

    document.body.style.overflow = 'hidden'
    const start = performance.now()
    let raf = 0

    const finish = () => {
      if (doneRef.current) return
      doneRef.current = true
      setProgress(100)
      setLeaving(true)
      try {
        sessionStorage.setItem(SESSION_KEY, '1')
      } catch {
        /* ignore */
      }
      window.setTimeout(() => {
        setVisible(false)
        document.body.style.overflow = ''
      }, 500)
    }

    const tick = (now: number) => {
      const elapsed = now - start
      const t = Math.min(elapsed / MIN_DURATION, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setProgress(Math.min(eased * 92, 92))

      const ready = document.readyState === 'complete'
      if ((elapsed >= MIN_DURATION && ready) || elapsed >= MAX_DURATION) {
        finish()
        return
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      document.body.style.overflow = ''
    }
  }, [visible])

  function skip() {
    doneRef.current = true
    setProgress(100)
    setLeaving(true)
    try {
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      /* ignore */
    }
    window.setTimeout(() => {
      setVisible(false)
      document.body.style.overflow = ''
    }, 350)
  }

  if (!visible) return null

  const services = site.services.map((s) => s.name)

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink px-6 transition-opacity duration-500 ${
        leaving ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-bone) 1px, transparent 1px), linear-gradient(90deg, var(--color-bone) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink via-transparent to-ink" aria-hidden="true" />

      <div className="relative flex w-full max-w-md flex-col items-center text-center">
        <div className="animate-fade-in">
          <span className="mx-auto mb-6 grid size-14 place-items-center bg-metallic text-ink">
            <FilmIcon className="size-7" />
          </span>
        </div>

        <h2 className="animate-fade-in font-display text-3xl font-extrabold uppercase tracking-tight text-bone sm:text-4xl">
          {site.brand.name}
        </h2>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.4em] text-gold">
          {site.brand.studio}
        </p>

        <p className="mt-6 max-w-xs text-sm leading-relaxed text-stone-mist">{site.brand.tagline}</p>

        <div className="mt-9 w-full max-w-xs">
          <div className="h-[3px] w-full overflow-hidden rounded-full bg-smoke">
            <div
              className="h-full bg-metallic transition-[width] duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-ashtray">
            <span>{leaving ? 'Ready' : 'Loading reel'}</span>
            <span className="tabular-nums text-gold">{Math.round(progress)}%</span>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {services.map((name) => (
            <span
              key={name}
              className="rounded-full border border-smoke px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-ashtray"
            >
              {name}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={skip}
          className="mt-10 font-mono text-[10px] uppercase tracking-[0.3em] text-ashtray transition-colors hover:text-gold"
        >
          Skip intro
        </button>
      </div>
    </div>
  )
}
