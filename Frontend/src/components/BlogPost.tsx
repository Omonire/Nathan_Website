import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchPost, type Post } from '../lib/posts'
import { images } from '../data/images'
import { Reveal } from './Reveal'
import { Nav } from './Nav'
import { Footer } from './Footer'

const fallbackCover = images.projects[0]

function formatDate(value: string): string {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function paragraphs(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    window.scrollTo(0, 0)
    if (!slug) {
      setPost(null)
      setLoading(false)
      return
    }
    fetchPost(slug).then((data) => {
      if (active) {
        setPost(data)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [slug])

  return (
    <div className="bg-ink text-bone">
      <Nav />
      <main className="min-h-screen pb-24 pt-32 sm:pt-40">
        <div className="container-slick">
          {loading ? (
            <p className="font-mono text-xs uppercase tracking-widest text-ashtray">Loading…</p>
          ) : !post ? (
            <div className="py-16 text-center">
              <p className="font-display text-3xl font-bold uppercase tracking-tight text-bone">
                Post not found
              </p>
              <p className="mt-3 text-sm text-ashtray">
                It may still be a draft or has been removed.
              </p>
              <Link
                to="/blog"
                className="mt-6 inline-block font-mono text-xs uppercase tracking-widest text-gold hover:text-bone"
              >
                ← Back to the journal
              </Link>
            </div>
          ) : (
            <Reveal className="mx-auto max-w-3xl">
              <Link
                to="/blog"
                className="font-mono text-xs uppercase tracking-widest text-ashtray transition-colors hover:text-gold"
              >
                ← Journal
              </Link>

              {post.tag && (
                <span className="mt-6 inline-block border border-smoke px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
                  {post.tag}
                </span>
              )}
              <h1 className="mt-4 font-display text-3xl font-black uppercase leading-[1.05] tracking-tight text-bone sm:text-5xl">
                {post.title}
              </h1>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ashtray">
                {post.author} · {formatDate(post.publishedAt)}
              </p>

              {Boolean(post.cover || fallbackCover) && (
                <img
                  src={post.cover || fallbackCover}
                  alt={post.title}
                  className="mt-8 aspect-[16/9] w-full border border-smoke object-cover grayscale"
                />
              )}

              <article className="mt-10 space-y-6">
                {paragraphs(post.body).map((p, i) => (
                  <p key={i} className="text-base leading-relaxed text-stone-mist">
                    {p}
                  </p>
                ))}
              </article>

              <div className="mt-14 border-t border-smoke pt-8 text-center">
                <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-bone">
                  Want edits like these?
                </h3>
                <p className="mt-2 text-sm text-ashtray">
                  Retention-first editing for YouTube creators, brands and podcasts.
                </p>
                <Link
                  to="/book"
                  className="mt-5 inline-block rounded-lg bg-gold px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-ink transition hover:bg-gold/80"
                >
                  Start a Project
                </Link>
              </div>
            </Reveal>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
