'use client'

import { useTheme, THEMES, THEME_META, type Theme } from '@/contexts/ThemeContext'

/** Primary brand colour per theme — 12px swatch only (hex ok for swatch fill). */
const SWATCH: Record<Theme, string> = {
  'sunday-lunch': '#5BAEA6',
  'township-diner': '#65C7BE',
  'modern-plate': '#D9573D',
}

interface ThemeToggleProps {
  variant?: 'icon' | 'full'
  className?: string
  label?: string
}

export default function ThemeToggle({
  variant = 'icon',
  className,
  label = 'Theme',
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={[
        'inline-flex items-center gap-1 rounded-full border p-1',
        'bg-surface border-border-default',
        className ?? '',
      ].join(' ')}
    >
      {THEMES.map((id) => {
        const meta = THEME_META[id]
        const active = id === theme
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={meta.label}
            title={`${meta.label} — ${meta.description}`}
            onClick={() => setTheme(id)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault()
                const i = THEMES.indexOf(id)
                setTheme(THEMES[(i + 1) % THEMES.length]!)
              }
              if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault()
                const i = THEMES.indexOf(id)
                setTheme(THEMES[(i - 1 + THEMES.length) % THEMES.length]!)
              }
            }}
            className={[
              'inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium',
              'transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              active
                ? 'bg-primary text-[rgb(var(--color-primary-fg))] shadow-sm'
                : 'text-text-muted hover:text-text',
            ].join(' ')}
          >
            <span
              className="h-3 w-3 shrink-0 rounded-full border border-border-default"
              style={{ backgroundColor: SWATCH[id] }}
              aria-hidden
            />
            {variant === 'full' && <span>{meta.label}</span>}
          </button>
        )
      })}
    </div>
  )
}
