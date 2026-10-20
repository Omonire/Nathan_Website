import { useState } from 'react'
import { getServices, addService, updateService, deleteService, toggleHotDeal, type Service } from '../../lib/cms'

export function ServiceManager() {
  const [services, setServices] = useState<Service[]>(getServices)
  const [editing, setEditing] = useState<Service | null>(null)
  const [showForm, setShowForm] = useState(false)

  const emptyService: Omit<Service, 'id'> = {
    name: '',
    description: '',
    price: '$',
    duration: '30 min',
    category: 'editing',
    hotDeal: false,
    active: true,
  }

  const [formData, setFormData] = useState<Omit<Service, 'id'>>(emptyService)

  function handleSave() {
    if (editing) {
      updateService(editing.id, formData)
    } else {
      addService(formData)
    }
    setServices(getServices())
    setShowForm(false)
    setEditing(null)
    setFormData(emptyService)
  }

  function handleEdit(service: Service) {
    setEditing(service)
    setFormData({ ...service })
    setShowForm(true)
  }

  function handleDelete(id: string) {
    if (confirm('Delete this service?')) {
      deleteService(id)
      setServices(getServices())
    }
  }

  function handleToggleHotDeal(id: string) {
    toggleHotDeal(id)
    setServices(getServices())
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-sm uppercase tracking-wider text-ashtray">Services & Pricing</h2>
        <button
          onClick={() => { setEditing(null); setFormData(emptyService); setShowForm(true) }}
          className="rounded-lg bg-gold px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-ink transition hover:bg-gold/80"
        >
          + Add Service
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-gold/30 bg-coal p-6 animate-fade-in">
          <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-gold">
            {editing ? 'Edit Service' : 'Add New Service'}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-mono text-xs text-ashtray">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-smoke bg-ink px-3 py-2 text-bone font-mono text-sm outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="mb-1 block font-mono text-xs text-ashtray">Price</label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full rounded-lg border border-smoke bg-ink px-3 py-2 text-bone font-mono text-sm outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="mb-1 block font-mono text-xs text-ashtray">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full rounded-lg border border-smoke bg-ink px-3 py-2 text-bone font-mono text-sm outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="mb-1 block font-mono text-xs text-ashtray">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-lg border border-smoke bg-ink px-3 py-2 text-bone font-mono text-sm outline-none focus:border-gold"
              >
                <option value="editing">Editing</option>
                <option value="finishing">Finishing</option>
                <option value="motion">Motion</option>
                <option value="social">Social</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block font-mono text-xs text-ashtray">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full rounded-lg border border-smoke bg-ink px-3 py-2 text-bone font-mono text-sm outline-none focus:border-gold"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hotDeal}
                  onChange={(e) => setFormData({ ...formData, hotDeal: e.target.checked })}
                  className="size-4 rounded border-smoke accent-gold"
                />
                <span className="font-mono text-xs text-ashtray">Hot Deal 🔥</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="size-4 rounded border-smoke accent-gold"
                />
                <span className="font-mono text-xs text-ashtray">Active</span>
              </label>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleSave}
              disabled={!formData.name || !formData.price}
              className="rounded-lg bg-gold px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-ink transition hover:bg-gold/80 disabled:opacity-50"
            >
              {editing ? 'Update' : 'Save'}
            </button>
            <button
              onClick={() => { setShowForm(false); setEditing(null) }}
              className="rounded-lg border border-smoke px-4 py-2 font-mono text-xs uppercase tracking-wider text-ashtray transition hover:border-gold hover:text-gold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex items-center justify-between rounded-xl border border-smoke bg-coal p-4 transition hover:border-gold/30"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-bone">{service.name}</span>
                {service.hotDeal && <span className="text-sm">🔥</span>}
                {!service.active && <span className="text-xs text-red-400">(inactive)</span>}
              </div>
              <p className="mt-1 font-mono text-xs text-ashtray">{service.description}</p>
              <div className="mt-2 flex gap-4">
                <span className="font-mono text-sm text-gold font-bold">{service.price}</span>
                <span className="font-mono text-xs text-ashtray">{service.duration}</span>
                <span className="font-mono text-xs text-ashtray capitalize">{service.category}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggleHotDeal(service.id)}
                className={`rounded-lg px-3 py-1.5 font-mono text-xs transition ${
                  service.hotDeal
                    ? 'bg-gold/20 text-gold hover:bg-gold/30'
                    : 'border border-smoke text-ashtray hover:border-gold hover:text-gold'
                }`}
              >
                🔥
              </button>
              <button
                onClick={() => handleEdit(service)}
                className="rounded-lg border border-smoke px-3 py-1.5 font-mono text-xs text-ashtray transition hover:border-gold hover:text-gold"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="rounded-lg border border-smoke px-3 py-1.5 font-mono text-xs text-red-400 transition hover:border-red-500 hover:bg-red-500/10"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
