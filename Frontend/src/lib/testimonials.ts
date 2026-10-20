export type Testimonial = {
  id: number
  quote: string
  name: string
  role: string
  rating: number
}

export type TestimonialInput = {
  quote: string
  name: string
  role: string
}

const API_BASE = (import.meta.env.VITE_BOOKINGS_API_URL || 'https://nathan-portfolio-backend-api.onrender.com/api/bookings').replace(
  /\/bookings\/?$/,
  '',
)
const ADMIN_TOKEN = (import.meta.env.VITE_ADMIN_TOKEN as string | undefined) || ''

function adminHeaders(): HeadersInit {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (ADMIN_TOKEN) headers['X-Admin-Token'] = ADMIN_TOKEN
  return headers
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  try {
    const res = await fetch(`${API_BASE}/admin/testimonials`, { headers: adminHeaders() })
    if (!res.ok) return []
    return (await res.json()) as Testimonial[]
  } catch {
    return []
  }
}

export async function createTestimonial(input: TestimonialInput): Promise<Testimonial | null> {
  try {
    const res = await fetch(`${API_BASE}/admin/testimonials`, {
      method: 'POST',
      headers: adminHeaders(),
      body: JSON.stringify(input),
    })
    if (!res.ok) return null
    const data = (await res.json()) as { id: number }
    return { id: data.id, rating: 5, ...input }
  } catch {
    return null
  }
}

export async function updateTestimonial(id: number, input: TestimonialInput): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/admin/testimonials/${id}`, {
      method: 'PUT',
      headers: adminHeaders(),
      body: JSON.stringify(input),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function deleteTestimonial(id: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/admin/testimonials/${id}`, {
      method: 'DELETE',
      headers: adminHeaders(),
    })
    return res.ok
  } catch {
    return false
  }
}

export const testimonialsAdminEnabled = Boolean(ADMIN_TOKEN)
