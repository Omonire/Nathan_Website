import { useCallback, useEffect, useState } from 'react'
import { gallery, galleryCategories, type GalleryCategory } from '../data/gallery'
import { SectionHeading } from './SectionHeading'
import { Reveal } from './Reveal'
import { BeforeAfter } from './BeforeAfter'
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from './Icons'
import { Nav } from './Nav'
import { Footer } from './Footer'

type Filter = GalleryCategory | 'all'

function Lightbox({
  index,
  onClose,
  onPrev,
  onNext,
}: {
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  const item = gallery[index]
  const total = gallery.length

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    },
    [onClose, onPrev, onNext],
  )

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onKey])

  if (!item) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Gallery image viewer"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <figure className="relative max-h-[85vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <img src={item.src} alt={item.alt} className="max-h-[80vh] w-auto object-contain" />
        <figcaption className="mt-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-ashtray">
          <span>{item.alt}</span>
          <span>
            {index + 1} / {total}
          </span>
        </figcaption>
      </figure>

      <button
        type="button"
        onClick={onPrev}
        className="absolute left-3 top-1/2 inline-flex size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-smoke-light bg-ink/70 text-bone transition-colors hover:text-gold sm:left-6"
        aria-label="Previous image"
      >
        <ChevronLeftIcon />
      </button>
      <button
        type="button"
        onClick={onNext}
        className="absolute right-3 top-1/2 inline-flex size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-smoke-light bg-ink/70 text-bone transition-colors hover:text-gold sm:right-6"
        aria-label="Next image"
      >
        <ChevronRightIcon />
      </button>
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-smoke-light bg-ink/70 text-bone transition-colors hover:text-gold"
        aria-label="Close viewer"
      >
        <CloseIcon />
      </button>
    </div>
  )
}

export function WorkPage() {
  return (
    <div className="bg-ink text-bone">
      <Nav />
      <main className="pt-20">
        <OurWork />
      </main>
      <Footer />
    </div>
  )
}

export function OurWork() {
  const [filter, setFilter] = useState<Filter>('all')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const filtered = filter === 'all' ? gallery : gallery.filter((g) => g.category === filter)
  const displayIndex = lightboxIndex !== null ? filtered[lightboxIndex] : undefined

  const openAt = (i: number) => setLightboxIndex(i)
  const close = () => setLightboxIndex(null)
  const prev = () =>
    setLightboxIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length))
  const next = () => setLightboxIndex((i) => (i === null ? null : (i + 1) % filtered.length))

  return (
    <section id="work" className="scroll-mt-20 border-y border-smoke bg-coal py-24 sm:py-32">
      <div className="container-slick">
        <SectionHeading
          eyebrow="Selected Work"
          title={
            <>
              Proof, not <span className="text-gold-gradient">promises.</span>
            </>
          }
          sub="A look at the edits, grades, and verticals going out the door — paced for retention, finished for the feed."
        />

        <Reveal delay={1}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2" role="tablist" aria-label="Filter gallery">
            {galleryCategories.map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={filter === c.id}
                onClick={() => setFilter(c.id)}
                className={`cursor-pointer border px-5 py-2 font-mono text-xs uppercase tracking-[0.2em] transition-colors duration-200 ${
                  filter === c.id
                    ? 'border-gold text-gold'
                    : 'border-smoke text-ashtray hover:border-smoke-light hover:text-bone'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {filtered.map((g, i) => (
            <Reveal key={`${filter}-${i}`} delay={((i % 3) + 1) as 1 | 2 | 3 | 4}>
              <button
                type="button"
                onClick={() => openAt(i)}
                className="group relative block w-full cursor-pointer overflow-hidden border border-smoke bg-ink"
                aria-label={`Open ${g.alt}`}
              >
                <img
                  src={g.src}
                  alt={g.alt}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] sm:aspect-[4/5]"
                />
                <span className="absolute inset-0 bg-linear-to-t from-ink/70 via-transparent to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90" />
                <span className="absolute bottom-3 left-3 border border-bone/20 bg-ink/70 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-stone-mist opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {g.category}
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-20 grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <span className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-gold">
                <span className="inline-block h-px w-6 bg-gold/60" aria-hidden="true" />
                The Difference
              </span>
              <h3 className="mt-4 font-display text-3xl font-extrabold uppercase leading-tight tracking-tight text-bone sm:text-4xl">
                Raw vs. graded —
                <br />
                <span className="text-gold-gradient">no middle ground.</span>
              </h3>
              <p className="mt-4 max-w-md text-base leading-relaxed text-ashtray">
                Drag the handle to see the grade up close. Clean color, controlled contrast, and a finish that holds up
                across every thumbnail and screen.
              </p>
            </div>
            <BeforeAfter />
          </div>
        </Reveal>
      </div>

      {lightboxIndex !== null && displayIndex ? (
        <Lightbox index={lightboxIndex} onClose={close} onPrev={prev} onNext={next} />
      ) : null}
    </section>
  )
}