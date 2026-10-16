import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Project } from '../data/site'
import { ArrowRightIcon, CloseIcon, PlayIcon } from './Icons'
import { Poster } from './Poster'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

type WorkProps = {
  projects: Project[]
}

export function Work({ projects }: WorkProps) {
  const [tag, setTag] = useState('All')
  const [active, setActive] = useState<Project | null>(null)

  const tags = useMemo(() => {
    const unique = Array.from(new Set(projects.map((p) => p.tag).filter(Boolean)))
    return ['All', ...unique]
  }, [projects])

  const activeTag = tags.includes(tag) ? tag : 'All'
  const shown = activeTag === 'All' ? projects : projects.filter((p) => p.tag === activeTag)

  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [active])

  return (
    <section id="work" className="py-24 sm:py-32">
      <div className="container-slick">
        <SectionHeading
          eyebrow="Selected Work"
          title={
            <>
              Edits that <span className="text-gold-gradient">hold attention</span>
            </>
          }
          sub="A slice of recent projects across long-form, brand and short-form. Tap any piece to preview."
        />

        <Reveal>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {tags.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTag(t)}
                className={`cursor-pointer rounded-none border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors duration-200 ${
                  activeTag === t
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-smoke text-ashtray hover:border-smoke-light hover:text-bone'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p, i) => (
            <Reveal key={p.slug} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <div className="group h-full border border-smoke bg-coal/40 transition-colors duration-300 hover:border-gold/40">
                <button
                  type="button"
                  onClick={() => setActive(p)}
                  className="block w-full cursor-pointer text-left"
                  aria-label={`Preview ${p.title}`}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <Poster label={p.tag} sub={p.client} className="size-full transition-transform duration-500 group-hover:scale-[1.04]" />
                    <span className="absolute right-3 top-3 inline-flex size-9 items-center justify-center border border-smoke-light bg-ink/70 text-gold opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                      <PlayIcon className="size-3.5" />
                    </span>
                  </div>
                  <div className="border-t border-smoke p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-display text-lg font-bold uppercase tracking-tight text-bone">{p.title}</h3>
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ashtray">{p.year}</span>
                    </div>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-gold">{p.role}</p>
                  </div>
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {active ? <WorkModal project={active} onClose={() => setActive(null)} /> : null}
    </section>
  )
}

function WorkModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/80 p-4 backdrop-blur-md sm:p-6"
      onClick={onClose}
    >
      <div
        className="animate-fade-in max-h-[90vh] w-full max-w-3xl overflow-y-auto border border-smoke bg-coal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-video">
          <Poster label={project.tag} sub={project.client} className="size-full" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 inline-flex size-9 cursor-pointer items-center justify-center border border-smoke-light bg-ink/70 text-bone backdrop-blur-sm transition-colors hover:text-gold"
            aria-label="Close"
          >
            <CloseIcon className="size-4" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ashtray">
            <span className="text-gold">{project.tag}</span>
            <span>{project.client}</span>
            <span>{project.year}</span>
            <span>{project.role}</span>
          </div>
          <h3 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight text-bone sm:text-4xl">
            {project.title}
          </h3>
          <p className="mt-4 text-base leading-relaxed text-stone-mist">{project.description}</p>
          {project.result ? (
            <p className="mt-4 inline-block border border-gold/40 bg-gold/5 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-gold">
              {project.result}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to={`/work/${project.slug}`}
              className="inline-flex cursor-pointer items-center gap-2 rounded-none bg-metallic px-5 py-3 font-display text-xs font-bold uppercase tracking-[0.15em] text-ink transition-all duration-200 hover:brightness-110"
            >
              Full Case Study
              <ArrowRightIcon className="size-3.5" />
            </Link>
            {project.videoUrl ? (
              <a
                href={project.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex cursor-pointer items-center gap-2 rounded-none border border-smoke-light px-5 py-3 font-display text-xs font-bold uppercase tracking-[0.15em] text-bone transition-colors duration-200 hover:border-gold/70 hover:text-gold"
              >
                Watch Video
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
