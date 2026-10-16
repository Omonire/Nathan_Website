type PosterProps = {
  label: string
  sub?: string
  className?: string
}

export function Poster({ label, sub, className = '' }: PosterProps) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-[radial-gradient(120%_120%_at_30%_0%,#232120_0%,#0c0a09_65%)] ${className}`}
      aria-hidden="true"
    >
      <div className="bg-grain absolute inset-0 opacity-60" />
      <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-transparent to-transparent" />
      <div className="relative flex flex-col items-center gap-1 px-6 text-center">
        <span className="font-display text-2xl font-black uppercase tracking-tight text-bone/90 sm:text-3xl">
          {label}
        </span>
        {sub ? <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold">{sub}</span> : null}
      </div>
    </div>
  )
}
