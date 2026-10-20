export type Service = {
  id: string
  name: string
  description: string
  price: string
  duration: string
  tag?: string
}

export type Project = {
  id: string
  name: string
  specialty: string
  bio: string
}

export type Review = {
  name: string
  service: string
  quote: string
  rating: number
}

const brand = {
  name: 'Nathan N.O',
  studio: 'Video Editor',
  city: 'Benin City, Nigeria',
  tagline: 'Edits that hold. Stories that convert.',
}

const services: Service[] = [
  {
    id: 'video-editing',
    name: 'Video Editing',
    description: 'Long-form edits paced for retention — story, rhythm and timing.',
    price: 'from $150',
    duration: 'YouTube / Podcast',
  },
  {
    id: 'color-grading',
    name: 'Color Grading',
    description: 'Consistent, cinematic looks that make footage feel premium.',
    price: 'from $90',
    duration: 'DaVinci Resolve',
    tag: 'Most Popular',
  },
  {
    id: 'sound-design',
    name: 'Sound Design',
    description: 'Clean dialogue, music beds and SFX that hit on the beat.',
    price: 'from $80',
    duration: 'Mix & Master',
  },
  {
    id: 'motion-graphics',
    name: 'Motion Graphics',
    description: 'Titles, lower-thirds and animated hooks built in After Effects.',
    price: 'from $120',
    duration: 'AE / Templates',
  },
  {
    id: 'shorts-reels',
    name: 'Shorts & Reels',
    description: 'Vertical cutdowns repurposed for Shorts, Reels and TikTok.',
    price: 'from $60',
    duration: '9:16 Formats',
  },
  {
    id: 'thumbnails',
    name: 'Thumbnails',
    description: 'Scroll-stopping thumbnail concepts that match the edit.',
    price: 'from $40',
    duration: 'Design Pass',
    tag: 'Add-on',
  },
]

const projects: Project[] = [
  {
    id: 'project-1',
    name: 'The Retention Edit',
    specialty: 'Long-Form · Edit & Sound',
    bio: 'A 14-minute documentary-style video rebuilt around retention — cutting dead air and reinforcing every hook. Avg. watch time rose 38%.',
  },
  {
    id: 'project-2',
    name: 'Brand Film — Northline',
    specialty: 'Brand · Edit & Motion',
    bio: 'A 60-second brand film with animated type and a graded look that carried a full campaign to 1.2M organic views.',
  },
  {
    id: 'project-3',
    name: 'Shorts Repurposing System',
    specialty: 'Shorts · Edit & Sound',
    bio: 'A repeatable vertical workflow turning one long-form video into nine Shorts a week — same story, nine different hooks.',
  },
]

const hours = {
  days: 'Reply within 24 hours',
  open: 'Mon',
  close: 'Sat',
  note: 'Booking new projects',
}

const contact = {
  city: brand.city,
  address: 'Remote · Worldwide',
  addressLine2: 'Based in Benin City, Nigeria (GMT+1)',
  phone: '+2349031445311',
  email: 'nathannkuma@gmail.com',
  mapEmbedUrl:
    'https://www.openstreetmap.org/export/embed.html?bbox=5.44%2C6.20%2C5.75%2C6.50&layer=mapnik&marker=6.335%2C5.626',
}

const socials = [
  { label: 'YouTube', href: 'https://youtube.com/@Skidobanzz' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@skidobanz.fx' },
]

const reviewStats = { average: 5.0, count: '47' }

const reviews: Review[] = [
  {
    name: 'Omonire O.',
    service: 'The Retention Edit',
    quote: 'Turnaround is fast and the retention on our edits went up immediately. Nathan just gets pacing.',
    rating: 5,
  },
  {
    name: 'Priya R.',
    service: 'Brand Film — Northline',
    quote: 'The color and sound work made a talking-head video feel like a production. Zero notes.',
    rating: 5,
  },
  {
    name: 'Marcus L.',
    service: 'Shorts Repurposing System',
    quote: 'Handed over raw footage, got back something better than I imagined. Now my default editor.',
    rating: 5,
  },
]

const booking = {
  daysAhead: 14,
  slotStart: '12:00',
  slotEnd: '21:30',
  slotStepMinutes: 30,
}

const api = {
  endpoint: import.meta.env.VITE_BOOKINGS_API_URL || 'https://nathan-portfolio-backend-api.onrender.com/api/bookings',
  enabled: import.meta.env.VITE_BOOKINGS_API !== 'false',
}

export const site = {
  brand,
  services,
  projects,
  hours,
  contact,
  socials,
  reviewStats,
  reviews,
  booking,
  api,
}
