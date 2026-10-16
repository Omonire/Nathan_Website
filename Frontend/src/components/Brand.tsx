import type { SiteContent } from '../data/site'
import { FilmIcon } from './Icons'

type BrandProps = {
  brand?: SiteContent['brand']
}

export function Brand({ brand }: BrandProps) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="bg-metallic flex size-9 items-center justify-center text-ink">
        <FilmIcon className="size-4.5" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-extrabold uppercase tracking-tight text-bone">
          {brand?.name ?? 'Nathan N.O'}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-gold">
          {brand?.role ?? 'Video Editor'}
        </span>
      </span>
    </span>
  )
}
