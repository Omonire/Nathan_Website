import { useEffect, useState } from 'react'
import {
  fetchAdminPosts,
  createPost,
  updatePost,
  deletePost,
  type Post,
  type PostInput,
} from '../../lib/posts'
import type { BlogDraft } from '../../lib/ai'
import { AiBlogAssistant } from './AiBlogAssistant'

const emptyForm: PostInput = {
  title: '',
  excerpt: '',
  body: '',
  cover: '',
  tag: '',
  status: 'draft',
}

export function PostManager() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Post | null>(null)
  const [form, setForm] = useState<PostInput>(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    async function init() {
      const data = await fetchAdminPosts()
      if (active) {
        setPosts(data)
        setLoading(false)
      }
    }
    init()
    return () => {
      active = false
    }
  }, [])

  async function reload() {
    setPosts(await fetchAdminPosts())
  }

  function openNew() {
    setEditing(null)
    setForm(emptyForm)
    setError(null)
    setShowForm(true)
  }

  function applyDraft(draft: BlogDraft) {
    setEditing(null)
    setForm({
      title: draft.title,
      excerpt: draft.excerpt,
      body: draft.body,
      cover: '',
      tag: draft.tag,
      status: 'draft',
    })
    setError(null)
    setShowForm(true)
  }

  function openEdit(post: Post) {
    setEditing(post)
    setForm({
      title: post.title,
      excerpt: post.excerpt,
      body: post.body,
      cover: post.cover,
      tag: post.tag,
      status: post.status,
    })
    setError(null)
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.title.trim() || !form.body.trim()) {
      setError('Title and body are required.')
      return
    }
    setSaving(true)
    setError(null)
    const ok = editing ? await updatePost(editing.id, form) : Boolean(await createPost(form))
    setSaving(false)
    if (!ok) {
      setError('Save failed. Your admin session may have expired — sign in again.')
      return
    }
    setShowForm(false)
    setEditing(null)
    setForm(emptyForm)
    reload()
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this post?')) return
    const ok = await deletePost(id)
    if (ok) setPosts((prev) => prev.filter((p) => p.id !== id))
    else setError('Delete failed. Your admin session may have expired.')
  }

  async function toggleStatus(post: Post) {
    const next: PostInput = {
      title: post.title,
      excerpt: post.excerpt,
      body: post.body,
      cover: post.cover,
      tag: post.tag,
      status: post.status === 'published' ? 'draft' : 'published',
    }
    const ok = await updatePost(post.id, next)
    if (ok) setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, status: next.status } : p)))
    else setError('Update failed.')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-mono text-sm uppercase tracking-wider text-ashtray">Blog Posts</h2>
          <p className="mt-1 font-mono text-[11px] text-ashtray/70">
            Published posts appear at /blog on the public site.
          </p>
        </div>
        <button
          onClick={openNew}
          className="rounded-lg bg-gold px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-ink transition hover:bg-gold/80"
        >
          + New Post
        </button>
      </div>

      <AiBlogAssistant existingTitles={posts.map((post) => post.title)} onDraft={applyDraft} />

      {error && (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 font-mono text-xs text-red-400">
          {error}
        </p>
      )}

      {showForm && (
        <div className="rounded-xl border border-gold/30 bg-coal p-6 animate-fade-in">
          <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-gold">
            {editing ? 'Edit Post' : 'New Post'}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block font-mono text-xs text-ashtray">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. How to keep viewers past 30 seconds"
                className="w-full rounded-lg border border-smoke bg-ink px-3 py-2 text-bone font-mono text-sm outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="mb-1 block font-mono text-xs text-ashtray">Tag</label>
              <input
                type="text"
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
                placeholder="e.g. Editing"
                className="w-full rounded-lg border border-smoke bg-ink px-3 py-2 text-bone font-mono text-sm outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="mb-1 block font-mono text-xs text-ashtray">Cover image URL</label>
              <input
                type="text"
                value={form.cover}
                onChange={(e) => setForm({ ...form, cover: e.target.value })}
                placeholder="/images/work-1.jpg"
                className="w-full rounded-lg border border-smoke bg-ink px-3 py-2 text-bone font-mono text-sm outline-none focus:border-gold"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block font-mono text-xs text-ashtray">Excerpt</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                rows={2}
                placeholder="One-line summary shown in the list"
                className="w-full rounded-lg border border-smoke bg-ink px-3 py-2 text-bone font-mono text-sm outline-none focus:border-gold"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block font-mono text-xs text-ashtray">Body * (blank line = new paragraph)</label>
              <textarea
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                rows={10}
                placeholder="Write your post…"
                className="w-full rounded-lg border border-smoke bg-ink px-3 py-2 text-bone font-mono text-sm outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="mb-1 block font-mono text-xs text-ashtray">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as PostInput['status'] })}
                className="w-full rounded-lg border border-smoke bg-ink px-3 py-2 text-bone font-mono text-sm outline-none focus:border-gold"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-gold px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-ink transition hover:bg-gold/80 disabled:opacity-50"
            >
              {saving ? 'Saving…' : editing ? 'Update' : 'Save'}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditing(null) }}
              className="rounded-lg border border-smoke px-4 py-2 font-mono text-xs uppercase tracking-wider text-ashtray transition hover:border-gold hover:text-gold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="font-mono text-xs text-ashtray">Loading…</p>
      ) : posts.length === 0 ? (
        <p className="font-mono text-xs text-ashtray">No posts yet. Write the first one.</p>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-start justify-between gap-4 rounded-xl border border-smoke bg-coal p-4 transition hover:border-gold/30"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-base font-bold uppercase tracking-wide text-bone">
                    {post.title}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                      post.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-ashtray/20 text-ashtray'
                    }`}
                  >
                    {post.status}
                  </span>
                  {post.tag && (
                    <span className="font-mono text-[10px] uppercase tracking-wider text-gold">{post.tag}</span>
                  )}
                </div>
                <p className="mt-1 font-mono text-xs text-ashtray">/blog/{post.slug}</p>
                {post.excerpt && <p className="mt-1 text-sm leading-relaxed text-stone-mist">{post.excerpt}</p>}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => toggleStatus(post)}
                  className={`rounded-lg border px-3 py-1.5 font-mono text-xs transition ${
                    post.status === 'published'
                      ? 'border-smoke text-ashtray hover:border-gold hover:text-gold'
                      : 'border-green-500/40 text-green-400 hover:bg-green-500/10'
                  }`}
                >
                  {post.status === 'published' ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => openEdit(post)}
                  className="rounded-lg border border-smoke px-3 py-1.5 font-mono text-xs text-ashtray transition hover:border-gold hover:text-gold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="rounded-lg border border-smoke px-3 py-1.5 font-mono text-xs text-red-400 transition hover:border-red-500 hover:bg-red-500/10"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
