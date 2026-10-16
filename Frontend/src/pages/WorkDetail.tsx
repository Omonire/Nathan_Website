import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeftIcon } from '../components/Icons'
import { Poster } from '../components/Poster'
import type { Project } from '../data/site'
import { fetchProject } from '../lib/api'

export function WorkDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [state, setState] = useState<{ slug?: string; project: Project | null }>({ project: null })

  useEffect(() => {
    let alive = true
    ;(async () => {
      if (!slug) return
      const p = await fetchProject(slug)
      if (alive) setState({ slug, project: p ?? null })
    })()
    return () => {
      alive = false
    }
  }, [slug])

  const loading = state.slug !== slug

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <div className="border border-smoke bg-coal/50 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-ashtray">
          Loading…
        </div>
      </div>
    )
  }

  const project = state.project

  if (!project) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-ink px-6 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold">404</p>
        <h1 className="font-display text-4xl font-extrabold uppercase tracking-tight text-bone sm:text-5xl">
          Project not found
        </h1>
        <p className="max-w-sm text-sm leading-relaxed text-stone-mist">
          That piece may have been moved or renamed. Head back and browse the rest of the work.
        </p>
        <Link
          to="/"
          className="inline-flex cursor-pointer items-center gap-2 rounded-none bg-metallic px-6 py-3.5 font-display text-sm font-bold uppercase tracking-[0.15em] text-ink transition-all duration-200 hover:brightness-110"
        >
          <ArrowLeftIcon className="size-3.5" />
          Back to work
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-ink text-bone">
      <div className="container-slick pt-8">
        <Link
          to="/"
          className="inline-flex cursor-pointer items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ashtray transition-colors hover:text-gold"
        >
          <ArrowLeftIcon className="size-3.5" />
          Back to work
        </Link>
      </div>

      <section className="py-8">
        <div className="container-slick">
          <div className="aspect-video overflow-hidden border border-smoke">
            <Poster label={project.tag} sub={project.client} className="size-full" />
          </div>

          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ashtray">
              <span className="text-gold">{project.tag}</span>
              <span>{project.client}</span>
              <span>{project.year}</span>
              <span>{project.role}</span>
            </div>
            <h1 className="mt-3 font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-bone sm:text-5xl lg:text-6xl">
              {project.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone-mist">{project.description}</p>
            {project.result ? (
              <p className="mt-4 inline-block border border-gold/40 bg-gold/5 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-gold">
                {project.result}
              </p>
            ) : null}
            {project.videoUrl ? (
              <a
                href={project.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-none bg-metallic px-6 py-3.5 font-display text-sm font-bold uppercase tracking-[0.15em] text-ink transition-all duration-200 hover:brightness-110"
              >
                Watch Video
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  )
}
