import { FilmIcon } from './Icons'

export function Brand({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className={`grid size-9 shrink-0 place-items-center bg-metallic ${tone === 'light' ? 'text-ink' : 'text-ink'}`}>
        <FilmIcon className="size-5" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-2xl font-extrabold uppercase tracking-tight text-bone">Nathan N.O</span>
        <span className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.35em] text-gold">Video Editor</span>
      </span>
    </span>
  )
}