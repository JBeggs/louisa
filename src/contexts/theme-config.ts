/**
 * Theme constants safe on server and client.
 *
 * Template 9 (Louisa): Lavender (light) / Midnight (dark) / Sage (light).
 */

export const THEMES = ['sunday-lunch', 'township-diner', 'modern-plate'] as const
export type Theme = (typeof THEMES)[number]

export const DEFAULT_THEME: Theme = 'sunday-lunch'

export const THEME_META: Record<
  Theme,
  { id: Theme; label: string; description: string }
> = {
  'sunday-lunch': {
    id: 'sunday-lunch',
    label: 'Lavender',
    description: 'Pale lilac, violet accent',
  },
  'township-diner': {
    id: 'township-diner',
    label: 'Midnight',
    description: 'Navy surface, blue and cyan',
  },
  'modern-plate': {
    id: 'modern-plate',
    label: 'Sage',
    description: 'Fresh mint, emerald and lime',
  },
}

export const THEME_COOKIE_KEY = 'site_theme'
export const THEME_STORAGE_KEY = 'site_theme'

export function isTheme(v: unknown): v is Theme {
  return typeof v === 'string' && (THEMES as readonly string[]).includes(v)
}

export const THEME_BOOTSTRAP_SCRIPT = `
(function(){try{
  var m=document.cookie.match(/(?:^|; )${THEME_COOKIE_KEY}=([^;]+)/);
  var t=m?decodeURIComponent(m[1]):null;
  if(!t){try{t=localStorage.getItem('${THEME_STORAGE_KEY}');}catch(e){}}
  var allowed=${JSON.stringify(THEMES)};
  if(!t||allowed.indexOf(t)===-1)t='${DEFAULT_THEME}';
  document.documentElement.setAttribute('data-theme',t);
}catch(e){document.documentElement.setAttribute('data-theme','${DEFAULT_THEME}');}})();
`
