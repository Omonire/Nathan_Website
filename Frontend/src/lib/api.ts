import { projects as fallbackProjects, site as fallbackSite, type Project, type SiteContent } from '../data/site'

const TIMEOUT_MS = 4000

// In dev the Vite proxy forwards /api to the local Flask server.
// In production the API lives on a separate origin (set VITE_API_URL at build time).
const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '')

async function getJson<T>(path: string): Promise<T> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(`${API_BASE}${path}`, { signal: ctrl.signal, headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error(`${path} -> ${res.status}`)
    return (await res.json()) as T
  } finally {
    clearTimeout(timer)
  }
}

export async function fetchSite(): Promise<SiteContent> {
  try {
    return await getJson<SiteContent>('/api/site')
  } catch {
    return fallbackSite
  }
}

export async function fetchProjects(): Promise<Project[]> {
  try {
    const data = await getJson<Project[]>('/api/projects')
    return Array.isArray(data) && data.length ? data : fallbackProjects
  } catch {
    return fallbackProjects
  }
}

export async function fetchProject(slug: string): Promise<Project | undefined> {
  try {
    return await getJson<Project>(`/api/projects/${encodeURIComponent(slug)}`)
  } catch {
    return fallbackProjects.find((p) => p.slug === slug)
  }
}

export type ContactPayload = {
  name: string
  email: string
  message: string
  website?: string
}

export type ContactResult = {
  ok: boolean
  error?: string
  errors?: Record<string, string>
}

export async function sendContact(payload: ContactPayload): Promise<ContactResult> {
  try {
    const res = await fetch(`${API_BASE}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = (await res.json().catch(() => null)) as
      | { ok?: boolean; errors?: Record<string, string>; error?: string }
      | null
    if (!res.ok) {
      return { ok: false, errors: data?.errors, error: data?.error ?? `Request failed (${res.status})` }
    }
    return { ok: true }
  } catch {
    return { ok: false, error: 'Could not reach the server. Try email instead.' }
  }
}
