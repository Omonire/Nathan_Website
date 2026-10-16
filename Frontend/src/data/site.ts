export type Project = {
  slug: string
  title: string
  client: string
  year: string
  tag: string
  role: string
  videoUrl: string
  thumb: string
  description: string
  result?: string
}

export type Service = {
  index: string
  name: string
  description: string
  detail: string
}

export type Testimonial = {
  quote: string
  name: string
  role: string
}

export type SiteContent = {
  brand: {
    name: string
    role: string
    positioning: string
  }
  showreel: {
    url: string
    caption: string
    length: string
  }
  about: {
    bio: string
    years: string
    tools: string[]
    clients: string[]
  }
  services: Service[]
  testimonials: Testimonial[]
  socials: {
    label: string
    href: string
  }[]
  contact: {
    email: string
    location: string
    availability: string
  }
}

export const site: SiteContent = {
  brand: {
    name: 'Nathan N.O',
    role: 'Video Editor & Post-Production',
    positioning: 'Video editor for YouTube creators',
  },
  showreel: {
    url: '',
    caption: 'A minute of cuts, color and sound — the reel that says it faster than a bio.',
    length: '01:20',
  },
  about: {
    bio: 'I edit video for YouTube creators who live or die by retention. Every cut, transition and beat of sound design is there to keep a viewer from leaving — then to make them hit subscribe. From raw footage to final upload, I handle the edit, color, sound and motion.',
    years: '5+',
    tools: ['Premiere Pro', 'DaVinci Resolve', 'After Effects', 'Audition'],
    clients: ['Creator Studio', 'Independent Channels', 'Brand Campaigns'],
  },
  services: [
    {
      index: '01',
      name: 'Video Editing',
      description: 'Long-form edits paced for retention — story, rhythm and timing.',
      detail: 'YouTube / Podcast',
    },
    {
      index: '02',
      name: 'Color Grading',
      description: 'Consistent, cinematic looks that make footage feel premium.',
      detail: 'DaVinci Resolve',
    },
    {
      index: '03',
      name: 'Sound Design',
      description: 'Clean dialogue, music beds and SFX that hit on the beat.',
      detail: 'Mix & Master',
    },
    {
      index: '04',
      name: 'Motion Graphics',
      description: 'Titles, lower-thirds and animated hooks built in After Effects.',
      detail: 'AE / Templates',
    },
    {
      index: '05',
      name: 'Shorts & Reels',
      description: 'Vertical cutdowns repurposed for Shorts, Reels and TikTok.',
      detail: '9:16 Formats',
    },
    {
      index: '06',
      name: 'Thumbnails',
      description: 'Scroll-stopping thumbnail concepts that match the edit.',
      detail: 'Design Pass',
    },
  ],
  testimonials: [
    {
      quote: 'Turnaround is fast and the retention on our edits went up immediately. Nathan just gets pacing.',
      name: 'Alex Rivera',
      role: 'YouTube Creator',
    },
    {
      quote: 'The color and sound work made a talking-head video feel like a production. Zero notes.',
      name: 'Priya Raman',
      role: 'Brand Content Lead',
    },
    {
      quote: 'Handed over raw footage, got back something better than I imagined. Now my default editor.',
      name: 'Marcus Lee',
      role: 'Podcast Host',
    },
  ],
  socials: [
    { label: 'YouTube', href: '#' },
    { label: 'Instagram', href: '#' },
    { label: 'TikTok', href: '#' },
    { label: 'LinkedIn', href: '#' },
    { label: 'Behance', href: '#' },
  ],
  contact: {
    email: 'hello@nathanno.com',
    location: 'Remote · Worldwide',
    availability: 'Booking new projects',
  },
}

export const projects: Project[] = [
  {
    slug: 'retention-edit',
    title: 'The Retention Cut',
    client: 'Creator Studio',
    year: '2025',
    tag: 'Long-Form',
    role: 'Edit · Color · Sound',
    videoUrl: '',
    thumb: '',
    description: 'A 14-minute documentary-style video rebuilt around retention, cutting dead air and reinforcing every hook.',
    result: 'Avg. watch time +38%',
  },
  {
    slug: 'brand-film',
    title: 'Brand Film — Northline',
    client: 'Northline',
    year: '2025',
    tag: 'Brand',
    role: 'Edit · Motion',
    videoUrl: '',
    thumb: '',
    description: 'A 60-second brand film with animated type and a graded look that carried a full campaign.',
    result: '1.2M organic views',
  },
  {
    slug: 'shorts-system',
    title: 'Shorts Repurposing System',
    client: 'Independent Channels',
    year: '2024',
    tag: 'Shorts',
    role: 'Edit · Sound',
    videoUrl: '',
    thumb: '',
    description: 'A repeatable vertical workflow turning one long-form video into nine Shorts per week.',
    result: '9 shorts / week',
  },
  {
    slug: 'podcast-package',
    title: 'Podcast Post Package',
    client: 'The Long Game',
    year: '2024',
    tag: 'Podcast',
    role: 'Edit · Color · Sound',
    videoUrl: '',
    thumb: '',
    description: 'End-to-end post for a weekly podcast: multicam edit, cleanup, grade and clip delivery.',
    result: 'Weekly, on time',
  },
  {
    slug: 'product-launch',
    title: 'Product Launch Teaser',
    client: 'Atlas Gear',
    year: '2024',
    tag: 'Commercial',
    role: 'Edit · Motion · Sound',
    videoUrl: '',
    thumb: '',
    description: 'A punchy 30-second teaser cut to a custom sound bed for a product drop.',
    result: 'CTR 2.4x',
  },
  {
    slug: 'music-visual',
    title: 'Music Visual',
    client: 'Artist Collab',
    year: '2023',
    tag: 'Music',
    role: 'Edit · Color',
    videoUrl: '',
    thumb: '',
    description: 'A stylized performance visual with beat-matched cuts and a heavy grade.',
    result: 'Featured',
  },
]

export const workTags = ['All', 'Long-Form', 'Brand', 'Shorts', 'Podcast', 'Commercial', 'Music']
