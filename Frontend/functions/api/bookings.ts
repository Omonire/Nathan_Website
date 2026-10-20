import postgres from 'postgres'

interface Env {
  DATABASE_URL?: string
}

interface Ctx {
  request: Request
  env: Env
}

interface BookingRecordRow {
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

interface BookingRecord {
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
}

function newReference(): string {
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase()
  return `SLK-${rand}`
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

type SlidingEntry = { count: number; resetAt: number }

const hitStore = new Map<string, SlidingEntry>()
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 6

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = hitStore.get(ip)
  if (!entry || now > entry.resetAt) {
    hitStore.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  entry.count += 1
  return entry.count > MAX_PER_WINDOW
}

function isValidDateTime(date: unknown, time: unknown): boolean {
  if (typeof date !== 'string' || typeof time !== 'string') return false
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false
  if (!/^\d{2}:\d{2}$/.test(time)) return false
  return true
}

async function storeBooking(env: Env, record: BookingRecord): Promise<boolean> {
  if (!env.DATABASE_URL) return false
  let sql: ReturnType<typeof postgres> | undefined
  try {
    sql = postgres(env.DATABASE_URL, { max: 1, connect_timeout: 8 })
    const rows = await sql`
      insert into public.bookings
        (reference, service_id, service_name, barber_id, barber_name, booking_date, booking_time, client_name, contact, notes, status)
      values
        (${record.reference}, ${record.service_id}, ${record.service_name}, ${record.barber_id}, ${record.barber_name}, ${record.booking_date}, ${record.booking_time}, ${record.client_name}, ${record.contact}, ${record.notes}, ${record.status})
      returning reference
    `
    await sql.end()
    return rows.length > 0
  } catch (err) {
    console.error('bookings: insert failed', err)
    if (sql) {
      await sql.end().catch(() => undefined)
    }
    return false
  }
}

export async function onRequestPost(ctx: Ctx): Promise<Response> {
  if (ctx.request.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const ip = ctx.request.headers.get('cf-connecting-ip') ?? 'unknown'
  if (rateLimited(ip)) return json({ error: 'Too many requests' }, 429)

  let body: Record<string, unknown>
  try {
    body = (await ctx.request.json()) as Record<string, unknown>
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  if (body.website) {
    return json({ ok: true, reference: newReference(), stored: false })
  }

  const serviceId = typeof body.serviceId === 'string' ? body.serviceId : ''
  const barberId = typeof body.barberId === 'string' ? body.barberId : ''
  const serviceName = typeof body.serviceName === 'string' ? body.serviceName : null
  const barberName = typeof body.barberName === 'string' ? body.barberName : null
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const contact = typeof body.contact === 'string' ? body.contact.trim() : ''
  const notes = typeof body.notes === 'string' ? body.notes.trim().slice(0, 1000) : ''

  if (!serviceId || !isValidDateTime(body.date, body.time) || name.length < 2 || !contact) {
    return json({ error: 'Missing or invalid required fields' }, 400)
  }
  if (!contact.includes('@') && !/\d{7,}/.test(contact)) {
    return json({ error: 'Invalid contact — provide a phone number or email' }, 400)
  }

  const reference = newReference()
  const record: BookingRecord = {
    reference,
    service_id: serviceId,
    service_name: serviceName,
    barber_id: barberId || null,
    barber_name: barberName,
    booking_date: body.date as string,
    booking_time: body.time as string,
    client_name: name,
    contact,
    notes,
    status: 'pending',
  }

  const stored = await storeBooking(ctx.env, record)

  return json({ ok: true, reference, stored })
}

export async function onRequestGet(ctx: Ctx): Promise<Response> {
  if (!ctx.env.DATABASE_URL) return json({ error: 'Database not configured' }, 500)

  let sql: ReturnType<typeof postgres> | undefined
  try {
    sql = postgres(ctx.env.DATABASE_URL, { max: 1, connect_timeout: 8 })
    const rows = await sql<BookingRecordRow[]>`
      SELECT id, reference, service_id, service_name, barber_id, barber_name,
             booking_date, booking_time, client_name, contact, notes, status, created_at
      FROM public.bookings
      ORDER BY created_at DESC
      LIMIT 100
    `
    await sql.end()
    return json(rows)
  } catch (err) {
    console.error('bookings: list failed', err)
    if (sql) await sql.end().catch(() => undefined)
    return json({ error: 'Failed to fetch bookings' }, 500)
  }
}