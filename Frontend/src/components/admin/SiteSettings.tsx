import { useState } from 'react'
import { getSiteContent, saveSiteContent, type SiteContent } from '../../lib/cms'

export function SiteSettings() {
  const [content, setContent] = useState<SiteContent>(getSiteContent)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    saveSiteContent(content)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function updateBrand(field: keyof SiteContent['brand'], value: string) {
    setContent({
      ...content,
      brand: { ...content.brand, [field]: value },
    })
  }

  function updateHours(field: keyof SiteContent['hours'], value: string) {
    setContent({
      ...content,
      hours: { ...content.hours, [field]: value },
    })
  }

  function updateContact(field: keyof SiteContent['contact'], value: string) {
    setContent({
      ...content,
      contact: { ...content.contact, [field]: value },
    })
  }

  function updateSocial(index: number, field: 'label' | 'href', value: string) {
    const newSocials = [...content.socials]
    newSocials[index] = { ...newSocials[index], [field]: value }
    setContent({ ...content, socials: newSocials })
  }

  function addSocial() {
    setContent({
      ...content,
      socials: [...content.socials, { label: '', href: '' }],
    })
  }

  function removeSocial(index: number) {
    setContent({
      ...content,
      socials: content.socials.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-sm uppercase tracking-wider text-ashtray">Site Settings</h2>
        <button
          onClick={handleSave}
          className="rounded-lg bg-gold px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-ink transition hover:bg-gold/80"
        >
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Brand */}
      <div className="rounded-xl border border-smoke bg-coal p-6">
        <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-gold">Brand</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block font-mono text-xs text-ashtray">Brand Name</label>
            <input
              type="text"
              value={content.brand.name}
              onChange={(e) => updateBrand('name', e.target.value)}
              className="w-full rounded-lg border border-smoke bg-ink px-3 py-2 text-bone font-mono text-sm outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs text-ashtray">Studio Type</label>
            <input
              type="text"
              value={content.brand.studio}
              onChange={(e) => updateBrand('studio', e.target.value)}
              className="w-full rounded-lg border border-smoke bg-ink px-3 py-2 text-bone font-mono text-sm outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs text-ashtray">City</label>
            <input
              type="text"
              value={content.brand.city}
              onChange={(e) => updateBrand('city', e.target.value)}
              className="w-full rounded-lg border border-smoke bg-ink px-3 py-2 text-bone font-mono text-sm outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs text-ashtray">Tagline</label>
            <input
              type="text"
              value={content.brand.tagline}
              onChange={(e) => updateBrand('tagline', e.target.value)}
              className="w-full rounded-lg border border-smoke bg-ink px-3 py-2 text-bone font-mono text-sm outline-none focus:border-gold"
            />
          </div>
        </div>
      </div>

      {/* Hours */}
      <div className="rounded-xl border border-smoke bg-coal p-6">
        <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-gold">Hours</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block font-mono text-xs text-ashtray">Days</label>
            <input
              type="text"
              value={content.hours.days}
              onChange={(e) => updateHours('days', e.target.value)}
              className="w-full rounded-lg border border-smoke bg-ink px-3 py-2 text-bone font-mono text-sm outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs text-ashtray">Note</label>
            <input
              type="text"
              value={content.hours.note}
              onChange={(e) => updateHours('note', e.target.value)}
              className="w-full rounded-lg border border-smoke bg-ink px-3 py-2 text-bone font-mono text-sm outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs text-ashtray">Open Time</label>
            <input
              type="text"
              value={content.hours.open}
              onChange={(e) => updateHours('open', e.target.value)}
              className="w-full rounded-lg border border-smoke bg-ink px-3 py-2 text-bone font-mono text-sm outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs text-ashtray">Close Time</label>
            <input
              type="text"
              value={content.hours.close}
              onChange={(e) => updateHours('close', e.target.value)}
              className="w-full rounded-lg border border-smoke bg-ink px-3 py-2 text-bone font-mono text-sm outline-none focus:border-gold"
            />
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="rounded-xl border border-smoke bg-coal p-6">
        <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-gold">Contact</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block font-mono text-xs text-ashtray">Address</label>
            <input
              type="text"
              value={content.contact.address}
              onChange={(e) => updateContact('address', e.target.value)}
              className="w-full rounded-lg border border-smoke bg-ink px-3 py-2 text-bone font-mono text-sm outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs text-ashtray">Address Line 2</label>
            <input
              type="text"
              value={content.contact.addressLine2}
              onChange={(e) => updateContact('addressLine2', e.target.value)}
              className="w-full rounded-lg border border-smoke bg-ink px-3 py-2 text-bone font-mono text-sm outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs text-ashtray">Phone</label>
            <input
              type="text"
              value={content.contact.phone}
              onChange={(e) => updateContact('phone', e.target.value)}
              className="w-full rounded-lg border border-smoke bg-ink px-3 py-2 text-bone font-mono text-sm outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs text-ashtray">Email</label>
            <input
              type="email"
              value={content.contact.email}
              onChange={(e) => updateContact('email', e.target.value)}
              className="w-full rounded-lg border border-smoke bg-ink px-3 py-2 text-bone font-mono text-sm outline-none focus:border-gold"
            />
          </div>
        </div>
      </div>

      {/* Socials */}
      <div className="rounded-xl border border-smoke bg-coal p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-mono text-xs uppercase tracking-wider text-gold">Social Links</h3>
          <button
            onClick={addSocial}
            className="rounded-lg border border-smoke px-3 py-1.5 font-mono text-xs text-ashtray transition hover:border-gold hover:text-gold"
          >
            + Add
          </button>
        </div>
        <div className="space-y-3">
          {content.socials.map((social, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="text"
                value={social.label}
                onChange={(e) => updateSocial(index, 'label', e.target.value)}
                placeholder="Label"
                className="w-32 rounded-lg border border-smoke bg-ink px-3 py-2 text-bone font-mono text-sm outline-none focus:border-gold"
              />
              <input
                type="url"
                value={social.href}
                onChange={(e) => updateSocial(index, 'href', e.target.value)}
                placeholder="URL"
                className="flex-1 rounded-lg border border-smoke bg-ink px-3 py-2 text-bone font-mono text-sm outline-none focus:border-gold"
              />
              <button
                onClick={() => removeSocial(index)}
                className="rounded-lg border border-smoke px-3 py-2 font-mono text-xs text-red-400 transition hover:border-red-500 hover:bg-red-500/10"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
