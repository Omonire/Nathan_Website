import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { adminLogin } from '../lib/admin-auth'

export function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const ok = await adminLogin(username, password)
    setBusy(false)
    if (ok) {
      navigate('/admin/dashboard')
    } else {
      setError('Invalid username or password')
      setPassword('')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm rounded-2xl border border-smoke bg-coal p-8 animate-fade-in">
        <h1 className="mb-2 text-center font-display text-2xl font-bold uppercase tracking-tight text-bone">
          Nathan N.O <span className="text-gold">Admin</span>
        </h1>
        <p className="mb-6 text-center font-mono text-xs text-ashtray">Sign in to manage bookings</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-ashtray">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError('') }}
              className="w-full rounded-lg border border-smoke bg-ink px-3 py-2 text-bone font-mono text-sm outline-none transition focus:border-gold"
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-ashtray">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
              className="w-full rounded-lg border border-smoke bg-ink px-3 py-2 text-bone font-mono text-sm outline-none transition focus:border-gold"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-center font-mono text-xs text-red-400 animate-shake">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-gold px-4 py-2.5 font-mono text-sm font-bold uppercase tracking-wider text-ink transition hover:bg-gold/80 disabled:opacity-50"
          >
            {busy ? 'Signing In…' : 'Sign In'}
          </button>
        </form>

        <Link
          to="/"
          className="mt-4 block text-center font-mono text-xs text-ashtray transition hover:text-gold"
        >
          ← Back to site
        </Link>
      </div>
    </div>
  )
}
