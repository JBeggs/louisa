'use client'

import { Flame } from 'lucide-react'
import type { CSSProperties } from 'react'

export interface SpiceLevelProps {
  /** 0–5 from API; omit or 0 hides the row */
  level: number | null | undefined
  max?: number
  className?: string
}

/**
 * Renders a row of heat icons from numeric product data only (no hardcoded heat words).
 */
export default function SpiceLevel({ level, max = 5, className = '' }: SpiceLevelProps) {
  const n = typeof level === 'number' && Number.isFinite(level) ? Math.max(0, Math.min(max, Math.round(level))) : 0
  if (n <= 0) return null

  const styleIcon = {
    color: 'rgb(var(--color-accent) / 1)',
  } satisfies CSSProperties

  return (
    <div
      className={`flex items-center gap-0.5 ${className}`.trim()}
      role="img"
      aria-label={`Heat level ${n} of ${max}`}
    >
      {Array.from({ length: max }, (_, i) => (
        <Flame
          key={i}
          className="h-4 w-4 shrink-0"
          style={{
            ...styleIcon,
            opacity: i < n ? 1 : 0.25,
          }}
          aria-hidden
        />
      ))}
    </div>
  )
}
