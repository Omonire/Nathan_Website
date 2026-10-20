import { useEffect, useState } from 'react'
import {
  fetchTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  testimonialsAdminEnabled,
  type Testimonial,
} from '../../lib/testimonials'

type Form = { quote: string; name: string; role: string }

const emptyForm: Form = { quote: '', name: '', role: '' }

export function TestimonialManager() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [form, setForm] = useState<Form>(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    async function init() {
      const data = await fetchTestimonials()
      if (active) {
        setItems(data)
        setLoading(false)
      }
    }
    init()
    return () => {
      active = false
    }
  }, [])

  async function reload() {
    const data = await fetchTestimonials()
    setItems(data)
  }

  function openNew() {
    setEditing(null)
    setForm(emptyForm)
    setError(null)
    setShowForm(true)
  }

  function openEdit(t: Testimonial) {
    setEditing(t)
    setForm({ quote: t.quote, name: t.name, role: t.role })
    setError(null)
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.quote.trim() || !form.name.trim()) {
      setError('Quote and name are required.')
      return
    }
    setSaving(true)
    setError(null)
    const ok = editing ? await updateTestimonial(editing.id, form) : Boolean(await createTestimonial(form))
    setSaving(false)
    if (!ok) {
      setError(testimonialsAdminEnabled ? 'Save failed. Check the admin token.' : 'Set VITE_ADMIN_TOKEN to enable saving.')
      return
    }
    setShowForm(false)
    setEditing(null)
    setForm(emptyForm)
    reload()
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this testimonial?')) return
    const ok = await deleteTestimonial(id)
    if (ok) setItems((prev) => prev.filter((t) => t.id !== id))
    else setError('Delete failed. Check the admin token.')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-mono text-sm uppercase tracking-wider text-ashtray">Testimonials</h2>
          <p className="mt-1 font-mono text-[11px] text-ashtray/70">
            Live on the public Reviews section.
          </p>
        </div>
        <button
          onClick={openNew}
          className="rounded-lg bg-gold px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-ink transition hover:bg-gold/80"
        >
          + Add Testimonial
        </button>
      </div>

      {!testimonialsAdminEnabled && (
        <p className="rounded-lg border border-gold/30 bg-gold/5 px-4 py-3 font-mono text-xs text-gold">
          Read-only: set <span className="text-bone">VITE_ADMIN_TOKEN</span> on Vercel (matching the API's
          ADMIN_TOKEN) to add, edit or delete.
        </p>
      )}

      {error && (
        <p className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 font-mono text-xs text-red-400">
          {error}
        </p>
      )}

      {showForm && (
        <div className="rounded-xl border border-gold/30 bg-coal p-6 animate-fade-in">
          <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-gold">
            {editing ? 'Edit Testimonial' : 'Add New Testimonial'}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-mono text-xs text-ashtray">Client name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Alex Rivera"
                className="w-full rounded-lg border border-smoke bg-ink px-3 py-2 text-bone font-mono text-sm outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="mb-1 block font-mono text-xs text-ashtray">Role / channel</label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="e.g. YouTube Creator"
                className="w-full rounded-lg border border-smoke bg-ink px-3 py-2 text-bone font-mono text-sm outline-none focus:border-gold"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block font-mono text-xs text-ashtray">Quote *</label>
              <textarea
                value={form.quote}
                onChange={(e) => setForm({ ...form, quote: e.target.value })}
                rows={3}
                placeholder="What the client said…"
                className="w-full rounded-lg border border-smoke bg-ink px-3 py-2 text-bone font-mono text-sm outline-none focus:border-gold"
              />
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
      ) : items.length === 0 ? (
        <p className="font-mono text-xs text-ashtray">No testimonials yet. Add the first one.</p>
      ) : (
        <div className="space-y-2">
          {items.map((t) => (
            <div
              key={t.id}
              className="flex items-start justify-between gap-4 rounded-xl border border-smoke bg-coal p-4 transition hover:border-gold/30"
            >
              <div className="flex-1">
                <p className="text-sm leading-relaxed text-stone-mist">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="font-display text-sm font-bold uppercase tracking-wide text-bone">{t.name}</span>
                  {t.role && <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ashtray">{t.role}</span>}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => openEdit(t)}
                  className="rounded-lg border border-smoke px-3 py-1.5 font-mono text-xs text-ashtray transition hover:border-gold hover:text-gold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
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
