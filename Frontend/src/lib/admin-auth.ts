const API_BASE = (import.meta.env.VITE_BOOKINGS_API_URL || 'https://nathan-portfolio-backend-api.onrender.com/api/bookings').replace(
  /\/bookings\/?$/,
  '',
)

const TOKEN_KEY = 'slick_admin_token'

export function getAdminToken(): string {
  return sessionStorage.getItem(TOKEN_KEY) || ''
}

function setAdminToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token)
}

export function clearAdminAuth() {
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem('slick_admin_auth')
}

export function isAdminAuthed(): boolean {
  return sessionStorage.getItem('slick_admin_auth') === 'true' && Boolean(getAdminToken())
}

export async function adminLogin(username: string, password: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    if (!res.ok) return false
    const data = (await res.json()) as { token?: string }
    if (!data.token) return false
    setAdminToken(data.token)
    sessionStorage.setItem('slick_admin_auth', 'true')
    return true
  } catch {
    return false
  }
}

export async function adminLogout(): Promise<void> {
  const token = getAdminToken()
  if (token) {
    try {
      await fetch(`${API_BASE}/admin/logout`, {
        method: 'POST',
        headers: { 'X-Admin-Token': token },
      })
    } catch {
      /* ignore */
    }
  }
  clearAdminAuth()
}

export function adminHeaders(): HeadersInit {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const token = getAdminToken()
  if (token) headers['X-Admin-Token'] = token
  return headers
}

export { API_BASE }
