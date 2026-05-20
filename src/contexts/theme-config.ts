/**
 * Theme constants safe on server and client.
 *
 * Template 9 (Louisa): Cream (light) / Slate (dark) / Sage (light).
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
    label: 'Cream',
    description: 'Warm cream, teal care and apple red',
  },
  'township-diner': {
    id: 'township-diner',
    label: 'Slate',
    description: 'Deep slate with clean teal contrast',
  },
  'modern-plate': {
    id: 'modern-plate',
    label: 'Sage',
    description: 'Fresh sage, pencil gold and soft cream',
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
