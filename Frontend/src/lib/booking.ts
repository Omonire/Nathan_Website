export type BookingPayload = {
  serviceId: string
  serviceName?: string
  barberId: string
  barberName?: string
  date: string
  time: string
  name: string
  contact: string
  notes?: string
}

export type BookingResult = {
  reference: string
  synced: boolean
}

const STORAGE_KEY = 'slick-bookings'

function newReference() {
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase()
  return `SLK-${rand}`
}

function persistLocal(payload: BookingPayload, reference: string) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const list = raw ? (JSON.parse(raw) as unknown[]) : []
    list.push({ reference, createdAt: new Date().toISOString(), ...payload })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    /* storage unavailable — ignore */
  }
}

export async function submitBooking(
  payload: BookingPayload,
  endpoint: string,
  enabled: boolean,
): Promise<BookingResult> {
  const reference = newReference()

  if (enabled) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        const data = (await res.json().catch(() => null)) as { reference?: string } | null
        return { reference: data?.reference ?? reference, synced: true }
      }
    } catch {
      /* fall through to local */
    }
  }

  persistLocal(payload, reference)
  return { reference, synced: false }
}

export type Preselect = { serviceId?: string; barberId?: string }

export function preselectBooking(payload: Preselect) {
  window.dispatchEvent(new CustomEvent<Preselect>('slick:preselect', { detail: payload }))
  document.getElementById('book')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export type BookingRecord = {
  id: number
  reference: string
  service_id: string | null
  service_name: string | null
  barber_id: string | null
  barber_name: string | null
  booking_date: string | null
  booking_time: string | null
  client_name: string
  contact: string
  notes: string
  status: string
  created_at: string
}

export async function fetchBookings(endpoint: string): Promise<BookingRecord[]> {
  try {
    const res = await fetch(endpoint)
    if (!res.ok) return []
    return (await res.json()) as BookingRecord[]
  } catch {
    return []
  }
}