const work = [1, 2, 3, 4, 5].map((n) => `/images/work-${n}.jpg`)
const workVertical = [1, 2, 3, 4, 5].map((n) => `/images/work-${n}-vertical.jpg`)

export const images = {
  hero: '/images/hero-poster.jpg',
  interior: work[1],
  tools: work[4],
  projects: [work[0], work[1], work[2]],
  beforeAfter: {
    before: '/images/before.jpg',
    after: '/images/after.jpg',
  },
  gallery: [
    { src: work[0], category: 'edits' },
    { src: work[1], category: 'edits' },
    { src: work[2], category: 'edits' },
    { src: work[3], category: 'edits' },
    { src: work[4], category: 'edits' },
    { src: work[0], category: 'color' },
    { src: work[2], category: 'color' },
    { src: work[4], category: 'color' },
    { src: work[1], category: 'color' },
    { src: work[3], category: 'color' },
    { src: workVertical[0], category: 'shorts' },
    { src: workVertical[1], category: 'shorts' },
    { src: workVertical[2], category: 'shorts' },
    { src: workVertical[3], category: 'shorts' },
    { src: workVertical[4], category: 'shorts' },
  ],
} as const
