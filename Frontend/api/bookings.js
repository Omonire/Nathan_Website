import postgres from 'postgres'

function newReference() {
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase()
  return `SLK-${rand}`
}

function isValidDateTime(date, time) {
  if (typeof date !== 'string' || typeof time !== 'string') return false
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false
  if (!/^\d{2}:\d{2}$/.test(time)) return false
  return true
}

export default async function handler(req, res) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value)
  })

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const DATABASE_URL = process.env.DATABASE_URL

  if (req.method === 'GET') {
    if (!DATABASE_URL) {
      return res.status(500).json({ error: 'Database not configured' })
    }
    let sql
    try {
      sql = postgres(DATABASE_URL, { max: 1, connect_timeout: 10 })
      const rows = await sql`
        SELECT id, reference, service_id, service_name, barber_id, barber_name,
               booking_date, booking_time, client_name, contact, notes, status, created_at
        FROM public.bookings
        ORDER BY created_at DESC
        LIMIT 100
      `
      await sql.end()
      return res.status(200).json(rows)
    } catch (err) {
      console.error('GET /api/bookings error:', err)
      if (sql) await sql.end().catch(() => undefined)
      return res.status(500).json({ error: 'Failed to fetch bookings' })
    }
  }

  if (req.method === 'POST') {
    const body = req.body

    if (body.website) {
      return res.status(200).json({ ok: true, reference: newReference(), stored: false })
    }

    const serviceId = typeof body.serviceId === 'string' ? body.serviceId : ''
    const barberId = typeof body.barberId === 'string' ? body.barberId : ''
    const serviceName = typeof body.serviceName === 'string' ? body.serviceName : null
    const barberName = typeof body.barberName === 'string' ? body.barberName : null
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const contact = typeof body.contact === 'string' ? body.contact.trim() : ''
    const notes = typeof body.notes === 'string' ? body.notes.trim().slice(0, 1000) : ''

    if (!serviceId || !isValidDateTime(body.date, body.time) || name.length < 2 || !contact) {
      return res.status(400).json({ error: 'Missing or invalid required fields' })
    }
    if (!contact.includes('@') && !/\d{7,}/.test(contact)) {
      return res.status(400).json({ error: 'Invalid contact — provide a phone number or email' })
    }

    if (!DATABASE_URL) {
      return res.status(500).json({ error: 'Database not configured' })
    }

    let sql
    try {
      sql = postgres(DATABASE_URL, { max: 1, connect_timeout: 10 })
      const reference = newReference()
      await sql`
        INSERT INTO public.bookings
          (reference, service_id, service_name, barber_id, barber_name, booking_date, booking_time, client_name, contact, notes, status)
        VALUES
          (${reference}, ${serviceId}, ${serviceName}, ${barberId || null}, ${barberName}, ${body.date}, ${body.time}, ${name}, ${contact}, ${notes}, ${'pending'})
      `
      await sql.end()
      return res.status(200).json({ ok: true, reference, stored: true })
    } catch (err) {
      console.error('POST /api/bookings error:', err)
      if (sql) await sql.end().catch(() => undefined)
      return res.status(500).json({ error: 'Failed to store booking' })
    }
  }

  return res.status(404).json({ error: 'Not Found' })
}
