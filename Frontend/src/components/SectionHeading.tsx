import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

type SectionHeadingProps = {
  eyebrow: string
  title: ReactNode
  sub?: string
  align?: 'left' | 'center'
}

export function SectionHeading({ eyebrow, title, sub, align = 'center' }: SectionHeadingProps) {
  const alignCls = align === 'center' ? 'items-center text-center' : 'items-start text-left'
  return (
    <div className={`flex flex-col gap-4 ${alignCls}`}>
      <Reveal>
        <span className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-gold">
          <span className="inline-block h-px w-6 bg-gold/60" aria-hidden="true" />
          {eyebrow}
          {align === 'center' && <span className="inline-block h-px w-6 bg-gold/60" aria-hidden="true" />}
        </span>
      </Reveal>
      <Reveal delay={1}>
        <h2 className="font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-bone sm:text-5xl lg:text-6xl">
          {title}
        </h2>
      </Reveal>
      {sub ? (
        <Reveal delay={2}>
          <p className={`max-w-xl text-base leading-relaxed text-ashtray ${align === 'center' ? 'mx-auto' : ''}`}>
            {sub}
          </p>
        </Reveal>
      ) : null}
    </div>
  )
}