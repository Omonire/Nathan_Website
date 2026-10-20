// CMS - Content Management System
// Stores all site content in localStorage for dynamic management

export interface Service {
  id: string
  name: string
  description: string
  price: string
  duration: string
  category: string
  hotDeal: boolean
  image?: string
  active: boolean
}

export interface Category {
  id: string
  name: string
  description: string
  image?: string
  active: boolean
  order: number
}

export interface SiteContent {
  brand: {
    name: string
    studio: string
    city: string
    tagline: string
  }
  hours: {
    days: string
    open: string
    close: string
    note: string
  }
  contact: {
    address: string
    addressLine2: string
    phone: string
    email: string
  }
  socials: {
    label: string
    href: string
  }[]
}

const STORAGE_KEYS = {
  services: 'slick_cms_services',
  categories: 'slick_cms_categories',
  siteContent: 'slick_cms_siteContent',
  images: 'slick_cms_images',
}

// Default data
const defaultServices: Service[] = [
  { id: 'video-editing', name: 'Video Editing', description: 'Long-form edits paced for retention — story, rhythm and timing.', price: '$150', duration: 'YouTube / Podcast', category: 'editing', hotDeal: false, active: true },
  { id: 'color-grading', name: 'Color Grading', description: 'Consistent, cinematic looks that make footage feel premium.', price: '$90', duration: 'DaVinci Resolve', category: 'finishing', hotDeal: true, active: true },
  { id: 'sound-design', name: 'Sound Design', description: 'Clean dialogue, music beds and SFX that hit on the beat.', price: '$80', duration: 'Mix & Master', category: 'finishing', hotDeal: false, active: true },
  { id: 'motion-graphics', name: 'Motion Graphics', description: 'Titles, lower-thirds and animated hooks built in After Effects.', price: '$120', duration: 'AE / Templates', category: 'motion', hotDeal: false, active: true },
  { id: 'shorts-reels', name: 'Shorts & Reels', description: 'Vertical cutdowns repurposed for Shorts, Reels and TikTok.', price: '$60', duration: '9:16 Formats', category: 'social', hotDeal: true, active: true },
  { id: 'thumbnails', name: 'Thumbnails', description: 'Scroll-stopping thumbnail concepts that match the edit.', price: '$40', duration: 'Design Pass', category: 'social', hotDeal: false, active: true },
]

const defaultCategories: Category[] = [
  { id: 'editing', name: 'Editing', description: 'Long-form and story-driven edits', active: true, order: 1 },
  { id: 'finishing', name: 'Finishing', description: 'Color grading and sound design', active: true, order: 2 },
  { id: 'motion', name: 'Motion', description: 'Motion graphics and titles', active: true, order: 3 },
  { id: 'social', name: 'Social', description: 'Shorts, Reels and thumbnails', active: true, order: 4 },
]

const defaultSiteContent: SiteContent = {
  brand: {
    name: 'Nathan N.O',
    studio: 'Video Editor',
    city: 'Benin City, Nigeria',
    tagline: 'Cuts that hold. Edits that convert.',
  },
  hours: {
    days: 'Reply within 24 hours',
    open: 'Mon',
    close: 'Sat',
    note: 'Booking new projects',
  },
  contact: {
    address: 'Remote · Worldwide',
    addressLine2: 'Based in Benin City, Nigeria (GMT+1)',
    phone: '+234 000 000 0000',
    email: 'hello@nathanno.com',
  },
  socials: [
    { label: 'YouTube', href: 'https://youtube.com/@nathanno' },
    { label: 'Instagram', href: 'https://instagram.com/skidobanz' },
    { label: 'TikTok', href: 'https://www.tiktok.com/@skidobanz_fx' },
  ],
}

// Helper functions
function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaultValue
  } catch {
    return defaultValue
  }
}

function saveToStorage<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data))
}

// Services
export function getServices(): Service[] {
  return loadFromStorage(STORAGE_KEYS.services, defaultServices)
}

export function saveServices(services: Service[]): void {
  saveToStorage(STORAGE_KEYS.services, services)
}

export function addService(service: Omit<Service, 'id'>): Service {
  const services = getServices()
  const newService: Service = {
    ...service,
    id: `service-${Date.now()}`,
  }
  services.push(newService)
  saveServices(services)
  return newService
}

export function updateService(id: string, updates: Partial<Service>): boolean {
  const services = getServices()
  const index = services.findIndex((s) => s.id === id)
  if (index === -1) return false
  services[index] = { ...services[index], ...updates }
  saveServices(services)
  return true
}

export function deleteService(id: string): boolean {
  const services = getServices()
  const filtered = services.filter((s) => s.id !== id)
  if (filtered.length === services.length) return false
  saveServices(filtered)
  return true
}

// Categories
export function getCategories(): Category[] {
  return loadFromStorage(STORAGE_KEYS.categories, defaultCategories)
}

export function saveCategories(categories: Category[]): void {
  saveToStorage(STORAGE_KEYS.categories, categories)
}

export function addCategory(category: Omit<Category, 'id'>): Category {
  const categories = getCategories()
  const newCategory: Category = {
    ...category,
    id: `category-${Date.now()}`,
  }
  categories.push(newCategory)
  saveCategories(categories)
  return newCategory
}

export function updateCategory(id: string, updates: Partial<Category>): boolean {
  const categories = getCategories()
  const index = categories.findIndex((c) => c.id === id)
  if (index === -1) return false
  categories[index] = { ...categories[index], ...updates }
  saveCategories(categories)
  return true
}

export function deleteCategory(id: string): boolean {
  const categories = getCategories()
  const filtered = categories.filter((c) => c.id !== id)
  if (filtered.length === categories.length) return false
  saveCategories(filtered)
  return true
}

// Site Content
export function getSiteContent(): SiteContent {
  return loadFromStorage(STORAGE_KEYS.siteContent, defaultSiteContent)
}

export function saveSiteContent(content: SiteContent): void {
  saveToStorage(STORAGE_KEYS.siteContent, content)
}

export function updateSiteContent(updates: Partial<SiteContent>): void {
  const content = getSiteContent()
  saveSiteContent({ ...content, ...updates })
}

// Hot Deals
export function getHotDeals(): Service[] {
  return getServices().filter((s) => s.hotDeal && s.active)
}

export function toggleHotDeal(id: string): boolean {
  const services = getServices()
  const service = services.find((s) => s.id === id)
  if (!service) return false
  service.hotDeal = !service.hotDeal
  saveServices(services)
  return true
}

// Images (stored as base64 or URLs)
export interface SiteImage {
  id: string
  name: string
  url: string
  category: string
}

export function getImages(): SiteImage[] {
  return loadFromStorage(STORAGE_KEYS.images, [])
}

export function addImage(image: Omit<SiteImage, 'id'>): SiteImage {
  const images = getImages()
  const newImage: SiteImage = {
    ...image,
    id: `image-${Date.now()}`,
  }
  images.push(newImage)
  saveToStorage(STORAGE_KEYS.images, images)
  return newImage
}

export function deleteImage(id: string): boolean {
  const images = getImages()
  const filtered = images.filter((i) => i.id !== id)
  if (filtered.length === images.length) return false
  saveToStorage(STORAGE_KEYS.images, filtered)
  return true
}

// Reset to defaults
export function resetToDefaults(): void {
  saveServices(defaultServices)
  saveCategories(defaultCategories)
  saveSiteContent(defaultSiteContent)
  localStorage.removeItem(STORAGE_KEYS.images)
}
