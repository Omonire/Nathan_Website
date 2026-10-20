import { useEffect, useState, useRef, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { fetchBookings, type BookingRecord } from '../lib/booking'
import { ServiceManager } from './admin/ServiceManager'
import { CategoryManager } from './admin/CategoryManager'
import { SiteSettings } from './admin/SiteSettings'
import { TestimonialManager } from './admin/TestimonialManager'
import { isAdminAuthed, adminLogout } from '../lib/admin-auth'
import { getHotDeals } from '../lib/cms'

const POLL_MS = 5_000

const statusColor: Record<string, string> = {
  pending: 'bg-gold/20 text-gold',
  confirmed: 'bg-green-500/20 text-green-400',
  completed: 'bg-ashtray/20 text-ashtray',
  cancelled: 'bg-red-500/20 text-red-400',
}

const statusOptions = ['pending', 'confirmed', 'completed', 'cancelled']

function to12h(t: string | null): string {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const hour = h % 12 === 0 ? 12 : h % 12
  const suffix = h >= 12 ? 'PM' : 'AM'
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`
}

function formatDate(d: string | null): string {
  if (!d) return ''
  const date = new Date(d + 'T00:00:00')
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
  return (
    <div className="rounded-xl border border-smoke bg-coal p-5 transition-all duration-300 hover:scale-105 hover:border-gold/50">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-ashtray">{label}</p>
          <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
        </div>
        <span className="text-4xl opacity-20">{icon}</span>
      </div>
    </div>
  )
}

function BookingChart({ bookings }: { bookings: BookingRecord[] }) {
  const statusCounts = bookings.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const total = bookings.length || 1
  const colors: Record<string, string> = {
    pending: 'bg-gold',
    confirmed: 'bg-green-500',
    completed: 'bg-ashtray',
    cancelled: 'bg-red-500',
  }

  return (
    <div className="rounded-xl border border-smoke bg-coal p-6">
      <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-ashtray">Booking Status</h3>
      <div className="space-y-3">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="flex items-center gap-3">
            <span className="w-24 font-mono text-xs capitalize text-stone-mist">{status}</span>
            <div className="flex-1 h-3 rounded-full bg-ink overflow-hidden">
              <div
                className={`h-full rounded-full ${colors[status] || 'bg-gold'} transition-all duration-1000 ease-out`}
                style={{ width: `${(count / total) * 100}%` }}
              />
            </div>
            <span className="font-mono text-xs text-bone">{count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function WeeklyChart({ bookings }: { bookings: BookingRecord[] }) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const dayCounts = new Array(7).fill(0)

  bookings.forEach((b) => {
    if (b.booking_date) {
      const day = new Date(b.booking_date + 'T00:00:00').getDay()
      dayCounts[day]++
    }
  })

  const maxCount = Math.max(...dayCounts, 1)

  return (
    <div className="rounded-xl border border-smoke bg-coal p-6">
      <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-ashtray">This Week</h3>
      <div className="flex items-end justify-between gap-2 h-32">
        {days.map((day, i) => (
          <div key={day} className="flex flex-col items-center gap-2 flex-1">
            <div className="w-full flex flex-col items-center justify-end h-24">
              <div
                className="w-full bg-gold rounded-t-sm transition-all duration-700 ease-out"
                style={{ height: `${(dayCounts[i] / maxCount) * 100}%`, minHeight: dayCounts[i] > 0 ? '4px' : '0' }}
              />
            </div>
            <span className="font-mono text-[10px] text-ashtray">{day}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function RevenueChart({ bookings }: { bookings: BookingRecord[] }) {
  const monthlyData = useMemo(() => {
    const data: Record<string, number> = {}
    bookings.forEach((b) => {
      if (b.booking_date && b.status !== 'cancelled') {
        const month = b.booking_date.slice(0, 7)
        data[month] = (data[month] || 0) + 1
      }
    })
    return Object.entries(data).sort((a, b) => a[0].localeCompare(b[0])).slice(-6)
  }, [bookings])

  const maxCount = Math.max(...monthlyData.map(([, c]) => c), 1)

  return (
    <div className="rounded-xl border border-smoke bg-coal p-6">
      <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-ashtray">Monthly Bookings</h3>
      <div className="flex items-end justify-between gap-2 h-32">
        {monthlyData.length === 0 ? (
          <p className="text-center w-full text-ashtray text-sm">No data yet</p>
        ) : (
          monthlyData.map(([month, count]) => (
            <div key={month} className="flex flex-col items-center gap-2 flex-1">
              <div className="w-full flex flex-col items-center justify-end h-24">
                <div
                  className="w-full bg-gold/70 rounded-t-sm transition-all duration-700 ease-out hover:bg-gold"
                  style={{ height: `${(count / maxCount) * 100}%`, minHeight: count > 0 ? '4px' : '0' }}
                />
              </div>
              <span className="font-mono text-[10px] text-ashtray">{month.slice(5)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function ServiceBreakdown({ bookings }: { bookings: BookingRecord[] }) {
  const serviceCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    bookings.forEach((b) => {
      if (b.service_name && b.status !== 'cancelled') {
        counts[b.service_name] = (counts[b.service_name] || 0) + 1
      }
    })
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5)
  }, [bookings])

  const maxCount = Math.max(...serviceCounts.map(([, c]) => c), 1)

  return (
    <div className="rounded-xl border border-smoke bg-coal p-6">
      <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-ashtray">Top Services</h3>
      <div className="space-y-3">
        {serviceCounts.length === 0 ? (
          <p className="text-center text-ashtray text-sm">No data yet</p>
        ) : (
          serviceCounts.map(([service, count]) => (
            <div key={service} className="flex items-center gap-3">
              <span className="w-32 font-mono text-xs text-stone-mist truncate">{service}</span>
              <div className="flex-1 h-3 rounded-full bg-ink overflow-hidden">
                <div
                  className="h-full rounded-full bg-gold transition-all duration-1000 ease-out"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
              <span className="font-mono text-xs text-bone">{count}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function CalendarView({ bookings }: { bookings: BookingRecord[] }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  
  const bookingsByDate = useMemo(() => {
    const map: Record<string, BookingRecord[]> = {}
    bookings.forEach((b) => {
      if (b.booking_date) {
        if (!map[b.booking_date]) map[b.booking_date] = []
        map[b.booking_date].push(b)
      }
    })
    return map
  }, [bookings])
  
  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-20 bg-ink/50" />)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const dayBookings = bookingsByDate[dateStr] || []
    const isToday = dateStr === new Date().toISOString().split('T')[0]
    
    days.push(
      <div
        key={d}
        className={`h-20 rounded-lg border p-2 transition-all hover:border-gold/50 ${
          isToday ? 'border-gold bg-gold/5' : 'border-smoke bg-ink/30'
        }`}
      >
        <span className={`font-mono text-xs ${isToday ? 'text-gold font-bold' : 'text-ashtray'}`}>{d}</span>
        {dayBookings.length > 0 && (
          <div className="mt-1 space-y-0.5">
            {dayBookings.slice(0, 2).map((b) => (
              <div key={b.id} className="truncate rounded bg-gold/20 px-1 py-0.5">
                <span className="font-mono text-[9px] text-gold">{to12h(b.booking_time)}</span>
              </div>
            ))}
            {dayBookings.length > 2 && (
              <span className="font-mono text-[9px] text-ashtray">+{dayBookings.length - 2} more</span>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-smoke bg-coal p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-mono text-xs uppercase tracking-wider text-ashtray">
          {currentDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex gap-2">
          <button onClick={() => setCurrentDate(new Date(year, month - 1))} className="rounded-lg border border-smoke px-3 py-1 font-mono text-xs text-ashtray hover:border-gold hover:text-gold">←</button>
          <button onClick={() => setCurrentDate(new Date())} className="rounded-lg border border-smoke px-3 py-1 font-mono text-xs text-ashtray hover:border-gold hover:text-gold">Today</button>
          <button onClick={() => setCurrentDate(new Date(year, month + 1))} className="rounded-lg border border-smoke px-3 py-1 font-mono text-xs text-ashtray hover:border-gold hover:text-gold">→</button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="py-2 text-center font-mono text-[10px] uppercase text-ashtray">{d}</div>
        ))}
        {days}
      </div>
    </div>
  )
}

function Notifications({ bookings }: { bookings: BookingRecord[] }) {
  const [show, setShow] = useState(false)
  const prevCountRef = useRef(bookings.length)
  const [newBookings, setNewBookings] = useState<BookingRecord[]>([])

  useEffect(() => {
    if (bookings.length > prevCountRef.current) {
      const newOnes = bookings.slice(0, bookings.length - prevCountRef.current)
      setNewBookings((prev) => [...newOnes, ...prev].slice(0, 10))
      setShow(true)
    }
    prevCountRef.current = bookings.length
  }, [bookings])

  const unread = newBookings.length

  return (
    <div className="relative">
      <button onClick={() => setShow(!show)} className="relative rounded-lg border border-smoke px-4 py-2 font-mono text-xs uppercase tracking-wider text-ashtray transition hover:border-gold hover:text-gold">
        🔔 Alerts
        {unread > 0 && <span className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-ink">{unread}</span>}
      </button>
      {show && (
        <div className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-smoke bg-coal p-4 shadow-xl animate-fade-in">
          <h4 className="mb-3 font-mono text-xs uppercase tracking-wider text-ashtray">New Bookings</h4>
          {newBookings.length === 0 ? (
            <p className="text-center text-ashtray text-sm py-4">No new bookings</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {newBookings.map((b) => (
                <div key={b.id} className="rounded-lg border border-gold/20 bg-gold/5 p-2">
                  <p className="font-medium text-bone text-sm">{b.client_name}</p>
                  <p className="font-mono text-xs text-ashtray">{b.service_name} · {formatDate(b.booking_date)}</p>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => { setNewBookings([]); setShow(false) }} className="mt-3 w-full rounded-lg border border-smoke py-1.5 font-mono text-xs text-ashtray hover:border-gold hover:text-gold">Clear All</button>
        </div>
      )}
    </div>
  )
}

function exportToCSV(bookings: BookingRecord[]) {
  const headers = ['Reference', 'Client', 'Service', 'Project', 'Date', 'Time', 'Status', 'Contact', 'Notes']
  const rows = bookings.map((b) => [b.reference, b.client_name, b.service_name || '', b.barber_name || '', b.booking_date || '', b.booking_time || '', b.status, b.contact, b.notes || ''])
  const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `nathan-nko-bookings-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

type Tab = 'overview' | 'bookings' | 'clients' | 'calendar' | 'services' | 'categories' | 'testimonials' | 'settings'

export function AdminDashboard() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState<BookingRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const mountedRef = useRef(true)

  useEffect(() => {
    if (!isAdminAuthed()) { navigate('/admin/login'); return }
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [navigate])

  useEffect(() => {
    let active = true
    async function load() {
      const data = await fetchBookings(site.api.endpoint)
      if (!active || !mountedRef.current) return
      setBookings(data)
      setLoading(false)
      setLastRefresh(new Date())
    }
    load()
    const id = setInterval(load, POLL_MS)
    return () => { active = false; clearInterval(id) }
  }, [])

  function handleLogout() {
    adminLogout()
    navigate('/admin/login')
  }

  function handleStatusChange(id: number, newStatus: string) {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)))
  }

  function handleDelete(id: number) {
    if (confirm('Delete this booking?')) {
      setBookings((prev) => prev.filter((b) => b.id !== id))
    }
  }

  const totalBookings = bookings.length
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length
  const todayBookings = bookings.filter((b) => b.booking_date === new Date().toISOString().split('T')[0]).length
  const completedBookings = bookings.filter((b) => b.status === 'completed').length
  const hotDeals = getHotDeals()

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'bookings', label: 'Bookings', icon: '📋' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'clients', label: 'Clients', icon: '👥' },
    { id: 'services', label: 'Services', icon: '🎬' },
    { id: 'categories', label: 'Categories', icon: '📂' },
    { id: 'testimonials', label: 'Testimonials', icon: '💬' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ]

  return (
    <div className="min-h-screen bg-ink text-bone">
      <header className="border-b border-smoke bg-coal">
        <div className="container-slick flex items-center justify-between py-4">
          <div>
            <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-bone">
              Nathan N.O <span className="text-gold">Admin</span>
            </h1>
            {lastRefresh && <p className="font-mono text-xs text-ashtray">Last refresh: {lastRefresh.toLocaleTimeString()}</p>}
          </div>
          <div className="flex items-center gap-3">
            <Notifications bookings={bookings} />
            <Link to="/" className="rounded-lg border border-smoke px-4 py-2 font-mono text-xs uppercase tracking-wider text-ashtray transition hover:border-gold hover:text-gold">Back to site</Link>
            <button onClick={handleLogout} className="rounded-lg border border-smoke px-4 py-2 font-mono text-xs uppercase tracking-wider text-ashtray transition hover:border-red-500 hover:text-red-400">Logout</button>
          </div>
        </div>
      </header>

      <main className="container-slick py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            <div className="flex gap-2 border-b border-smoke pb-4 overflow-x-auto">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-xs uppercase tracking-wider whitespace-nowrap transition ${activeTab === tab.id ? 'bg-gold text-ink' : 'text-ashtray hover:border hover:border-gold hover:text-gold'}`}>
                  <span>{tab.icon}</span> {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
                  <StatCard label="Total" value={totalBookings} icon="📊" color="text-gold" />
                  <StatCard label="Pending" value={pendingBookings} icon="⏳" color="text-yellow-400" />
                  <StatCard label="Confirmed" value={confirmedBookings} icon="✓" color="text-green-400" />
                  <StatCard label="Completed" value={completedBookings} icon="✅" color="text-ashtray" />
                  <StatCard label="Today" value={todayBookings} icon="📅" color="text-blue-400" />
                </div>
                {hotDeals.length > 0 && (
                  <div className="rounded-xl border border-gold/30 bg-gold/5 p-4">
                    <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-gold">🔥 Hot Deals ({hotDeals.length})</h3>
                    <div className="flex flex-wrap gap-2">
                      {hotDeals.map((deal) => (
                        <span key={deal.id} className="rounded-full bg-gold/20 px-3 py-1 font-mono text-xs text-gold">{deal.name} - {deal.price}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid gap-6 lg:grid-cols-2">
                  <BookingChart bookings={bookings} />
                  <WeeklyChart bookings={bookings} />
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                  <RevenueChart bookings={bookings} />
                  <ServiceBreakdown bookings={bookings} />
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="rounded-xl border border-smoke bg-coal p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-mono text-sm uppercase tracking-wider text-ashtray">All Bookings ({bookings.length})</h2>
                  <button onClick={() => exportToCSV(bookings)} className="rounded-lg border border-smoke px-4 py-2 font-mono text-xs uppercase tracking-wider text-ashtray transition hover:border-gold hover:text-gold">📥 Export CSV</button>
                </div>
                {bookings.length === 0 ? (
                  <div className="py-12 text-center"><p className="font-display text-xl text-ashtray">No bookings yet</p></div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-smoke font-mono text-xs uppercase tracking-wider text-ashtray">
                          <th className="pb-3 pr-4">Ref</th><th className="pb-3 pr-4">Client</th><th className="pb-3 pr-4">Service</th><th className="pb-3 pr-4">Project</th><th className="pb-3 pr-4">Date</th><th className="pb-3 pr-4">Time</th><th className="pb-3 pr-4">Status</th><th className="pb-3 pr-4">Contact</th><th className="pb-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((b) => (
                          <tr key={b.id} className="border-b border-smoke/50 transition hover:bg-coal-soft">
                            <td className="whitespace-nowrap py-3 pr-4 font-mono text-gold">{b.reference}</td>
                            <td className="whitespace-nowrap py-3 pr-4 font-medium text-bone">{b.client_name}</td>
                            <td className="whitespace-nowrap py-3 pr-4 text-stone-mist">{b.service_name ?? b.service_id}</td>
                            <td className="whitespace-nowrap py-3 pr-4 text-stone-mist">{b.barber_name ?? '—'}</td>
                            <td className="whitespace-nowrap py-3 pr-4 text-stone-mist">{formatDate(b.booking_date)}</td>
                            <td className="whitespace-nowrap py-3 pr-4 text-stone-mist">{to12h(b.booking_time)}</td>
                            <td className="py-3 pr-4">
                              <select value={b.status} onChange={(e) => handleStatusChange(b.id, e.target.value)} className={`rounded-full px-2.5 py-0.5 font-mono text-xs uppercase bg-transparent border border-smoke cursor-pointer ${statusColor[b.status] ?? 'text-ashtray'}`}>
                                {statusOptions.map((s) => (<option key={s} value={s} className="bg-ink text-bone">{s}</option>))}
                              </select>
                            </td>
                            <td className="whitespace-nowrap py-3 font-mono text-xs text-ashtray">{b.contact}</td>
                            <td className="py-3"><button onClick={() => handleDelete(b.id)} className="rounded px-2 py-1 text-xs text-red-400 hover:bg-red-500/10">✕</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'calendar' && <CalendarView bookings={bookings} />}

            {activeTab === 'clients' && (
              <div className="rounded-xl border border-smoke bg-coal p-6">
                <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-ashtray">Client Directory</h3>
                <p className="text-ashtray text-sm">Client data is derived from bookings above.</p>
              </div>
            )}

            {activeTab === 'services' && <ServiceManager />}
            {activeTab === 'categories' && <CategoryManager />}
            {activeTab === 'testimonials' && <TestimonialManager />}
            {activeTab === 'settings' && <SiteSettings />}
          </div>
        )}
      </main>
    </div>
  )
}

import { site } from '../data/site-content'
