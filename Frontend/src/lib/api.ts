import { projects as fallbackProjects, site as fallbackSite, type Project, type SiteContent } from '../data/site'

const TIMEOUT_MS = 4000

async function getJson<T>(path: string): Promise<T> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(path, { signal: ctrl.signal, headers: { Accept: 'application/json' } })
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
}

export async function sendContact(payload: ContactPayload): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) return { ok: false, error: `Request failed (${res.status})` }
    return { ok: true }
  } catch {
    return { ok: false, error: 'Could not reach the server. Try email instead.' }
  }
}
