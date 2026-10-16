import { FilmIcon } from './Icons'

export function Brand() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="bg-metallic flex size-9 items-center justify-center text-ink">
        <FilmIcon className="size-4.5" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-extrabold uppercase tracking-tight text-bone">Nathan N.O</span>
        <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-gold">Video Editor</span>
      </span>
    </span>
  )
}
