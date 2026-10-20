import { images } from './images'

export type GalleryCategory = 'edits' | 'color' | 'shorts'

export const galleryCategories: { id: GalleryCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'edits', label: 'Edits' },
  { id: 'color', label: 'Color' },
  { id: 'shorts', label: 'Shorts' },
]

export type GalleryItem = {
  src: string
  alt: string
  category: GalleryCategory
}

export const gallery: GalleryItem[] = images.gallery.map((g) => ({
  src: g.src,
  category: g.category,
  alt:
    g.category === 'edits'
      ? 'Long-form video edit by Nathan N.O'
      : g.category === 'shorts'
        ? 'Vertical short edit by Nathan N.O'
        : 'Color graded footage by Nathan N.O',
}))

export const beforeAfter = {
  before: images.beforeAfter.before,
  after: images.beforeAfter.after,
  note: 'Graded vs. ungraded — same frame, different feel.',
}