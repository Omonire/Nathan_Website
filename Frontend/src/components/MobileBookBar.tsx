import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { btnGold } from '../lib/ui'

export function MobileBookBar() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const target = document.getElementById('book')
    if (!target) return
    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0.15 },
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-smoke bg-ink/95 px-3 pt-3 backdrop-blur-md transition-transform duration-300 sm:hidden ${
        hidden ? 'translate-y-full' : ''
      }`}
      style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
    >
      <Link to="/book" className={`${btnGold} w-full`}>
        Start a Project · Reply in 24h
      </Link>
    </div>
  )
}