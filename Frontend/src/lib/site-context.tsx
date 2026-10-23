import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { API_BASE } from './admin-auth'
import { site } from '../data/site-content'
import { getServices as getCmsServices } from './cms'

export type SiteService = {
  id: string
  name: string
  description: string
  price: string
  duration: string
  category?: string
  tag?: string
  hotDeal?: boolean
  active?: boolean
}

export type SiteProject = {
  id: string
  name: string
  specialty: string
  bio: string
  image?: string
}

export type SiteContent = {
  brand: typeof site.brand
  hours: typeof site.hours
  contact: typeof site.contact
  socials: { label: string; href: string }[]
}

type ApiService = {
  id: string
  name: string
  description: string
  price: string
  duration: string
  category: string
  hotDeal: boolean
  active: boolean
}

type ApiSite = {
  brand?: Record<string, string>
  hours?: Record<string, string>
  contact?: Record<string, string>
  socials?: { label: string; href: string }[]
  services?: ApiService[]
}

type ApiProject = {
  slug: string
  title: string
  client: string
  year: string
  tag: string
  role: string
  thumb: string
  description: string
  result: string
}

// Static fallbacks — the same data the site shipped with, used when the API is
// unreachable so the page never renders empty.
const fallbackServices: SiteService[] = getCmsServices().filter((s) => s.active)
const fallbackProjects: SiteProject[] = site.projects
const fallbackContent: SiteContent = {
  brand: site.brand,
  hours: site.hours,
  contact: site.contact,
  socials: site.socials,
}

type SiteContextValue = {
  services: SiteService[]
  projects: SiteProject[]
  content: SiteContent
  online: boolean
}

const SiteContext = createContext<SiteContextValue>({
  services: fallbackServices,
  projects: fallbackProjects,
  content: fallbackContent,
  online: false,
})

export function SiteProvider({ children }: { children: ReactNode }) {
  const [api, setApi] = useState<{ site: ApiSite | null; projects: ApiProject[] | null }>({
    site: null,
    projects: null,
  })

  useEffect(() => {
    let active = true
    Promise.all([
      fetch(`${API_BASE}/site`).then((r) => (r.ok ? (r.json() as Promise<ApiSite>) : null)).catch(() => null),
      fetch(`${API_BASE}/projects`).then((r) => (r.ok ? (r.json() as Promise<ApiProject[]>) : null)).catch(() => null),
    ]).then(([siteData, projects]) => {
      if (active) setApi({ site: siteData, projects })
    })
    return () => {
      active = false
    }
  }, [])

  const value = useMemo<SiteContextValue>(() => {
    const s = api.site
    const content: SiteContent = {
      brand: { ...fallbackContent.brand, ...(s?.brand ?? {}) },
      hours: { ...fallbackContent.hours, ...(s?.hours ?? {}) },
      contact: { ...fallbackContent.contact, ...(s?.contact ?? {}) },
      socials: s?.socials?.length ? s.socials : fallbackContent.socials,
    }
    const services: SiteService[] =
      s?.services && s.services.length
        ? s.services.filter((x) => x.active).map((x) => ({ ...x }))
        : fallbackServices
    const projects: SiteProject[] =
      api.projects && api.projects.length
        ? api.projects.map((p) => ({
            id: p.slug,
            name: p.title,
            specialty: [p.tag, p.role].filter(Boolean).join(' · '),
            bio: p.result ? `${p.description} ${p.result}.` : p.description,
            image: p.thumb || undefined,
          }))
        : fallbackProjects
    return { services, projects, content, online: Boolean(s) }
  }, [api])

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export function useSite(): SiteContextValue {
  return useContext(SiteContext)
}
