import { useState } from 'react'
import { generateBlogDraft, suggestBlogTopics, type BlogDraft } from '../../lib/ai'

type Props = {
  existingTitles: string[]
  onDraft: (draft: BlogDraft) => void
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong. Try again.'
}

export function AiBlogAssistant({ existingTitles, onDraft }: Props) {
  const [topic, setTopic] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [busy, setBusy] = useState<'topics' | 'draft' | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSuggest() {
    setBusy('topics')
    setError(null)
    try {
      setSuggestions(await suggestBlogTopics(existingTitles))
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(null)
    }
  }

  async function handleWrite() {
    const value = topic.trim()
    if (!value) {
      setError('Pick a suggested topic or write your own first.')
      return
    }
    setBusy('draft')
    setError(null)
    try {
      const draft = await generateBlogDraft(value)
      setSuggestions([])
      onDraft(draft)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="rounded-xl border border-gold/30 bg-coal p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-mono text-xs uppercase tracking-wider text-gold">AI Draft</h3>
          <p className="mt-1 font-mono text-[11px] text-ashtray/70">
            Suggest a topic or write your own, then let AI draft it. First use may ask you to sign in to Puter.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSuggest}
          disabled={busy !== null}
          className="rounded-lg border border-smoke px-3 py-1.5 font-mono text-xs text-ashtray transition hover:border-gold hover:text-gold disabled:opacity-50"
        >
          {busy === 'topics' ? 'Thinking…' : 'Suggest topics'}
        </button>
      </div>

      <div className="mt-5">
        <label className="mb-1 block font-mono text-xs text-ashtray">Topic</label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleWrite()
            }}
            placeholder="e.g. Why your first 30 seconds lose viewers"
            className="w-full rounded-lg border border-smoke bg-ink px-3 py-2 text-bone font-mono text-sm outline-none focus:border-gold"
          />
          <button
            type="button"
            onClick={handleWrite}
            disabled={busy !== null}
            className="shrink-0 rounded-lg bg-gold px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-ink transition hover:bg-gold/80 disabled:opacity-50"
          >
            {busy === 'draft' ? 'Writing…' : 'Write blog'}
          </button>
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setTopic(suggestion)}
              className={`rounded-full border px-3 py-1.5 text-left font-mono text-xs transition ${
                topic === suggestion
                  ? 'border-gold bg-gold/10 text-gold'
                  : 'border-smoke text-ashtray hover:border-gold hover:text-gold'
              }`}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 font-mono text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
