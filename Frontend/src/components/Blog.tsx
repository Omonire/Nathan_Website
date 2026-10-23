import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchPosts, type PostSummary } from '../lib/posts'
import { images } from '../data/images'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'
import { Nav } from './Nav'
import { Footer } from './Footer'

const fallbackCover = (i: number) => images.projects[i % images.projects.length]

function formatDate(value: string): string {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function BlogPage() {
  return (
    <div className="bg-ink text-bone">
      <Nav />
      <Blog />
      <Footer />
    </div>
  )
}

export function Blog() {
  const [posts, setPosts] = useState<PostSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    fetchPosts().then((data) => {
      if (active) {
        setPosts(data)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <section id="journal" className="min-h-screen bg-ink pb-24 pt-32 sm:pt-40">
      <div className="container-slick">
        <SectionHeading
          align="left"
          eyebrow="Journal"
          title={
            <>
              Notes on <span className="text-gold-gradient">the craft.</span>
            </>
          }
          sub="Editing, color, sound and the systems behind retention-first video."
        />

        {loading ? (
          <p className="mt-14 font-mono text-xs uppercase tracking-widest text-ashtray">Loading…</p>
        ) : posts.length === 0 ? (
          <p className="mt-14 font-mono text-xs uppercase tracking-widest text-ashtray">
            No posts yet — check back soon.
          </p>
        ) : (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.id} delay={((i % 3) + 1) as 1 | 2 | 3 | 4}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="group flex h-full flex-col border border-smoke bg-coal transition-colors duration-300 hover:border-gold/50"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={post.cover || fallbackCover(i)}
                      alt={post.title}
                      loading="lazy"
                      className="aspect-[16/10] w-full object-cover grayscale transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
                    />
                    {post.tag && (
                      <span className="absolute left-3 top-3 border border-bone/20 bg-ink/70 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
                        {post.tag}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ashtray">
                      {formatDate(post.publishedAt)}
                    </p>
                    <h3 className="mt-2 font-display text-xl font-bold uppercase leading-tight tracking-tight text-bone">
                      {post.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-ashtray">{post.excerpt}</p>
                    <span className="mt-5 font-mono text-xs uppercase tracking-widest text-gold">
                      Read →
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
