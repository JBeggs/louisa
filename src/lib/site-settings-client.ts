/**
 * Parse public site-settings API responses into a key/value map (client).
 */

export type SiteSettingRow = { key: string; value: string; type?: string }

function parseValue(row: SiteSettingRow): unknown {
  try {
    if (row.type === 'json') return JSON.parse(row.value)
  } catch {
    /* fall through */
  }
  return row.value
}

export function unwrapSiteSettingsList(raw: unknown): SiteSettingRow[] {
  if (Array.isArray(raw)) return raw as SiteSettingRow[]
  if (raw && typeof raw === 'object' && 'results' in raw) {
    const r = (raw as { results?: SiteSettingRow[] }).results
    return Array.isArray(r) ? r : []
  }
  if (raw && typeof raw === 'object' && 'data' in raw) {
    const d = (raw as { data?: unknown }).data
    return unwrapSiteSettingsList(d)
  }
  return []
}

export function rowsToMap(rows: SiteSettingRow[]): Record<string, unknown> {
  const map: Record<string, unknown> = {}
  for (const row of rows) {
    if (row?.key) map[row.key] = parseValue(row)
  }
  return map
}

export function isTruthySetting(v: unknown): boolean {
  if (v === true || v === 1) return true
  if (typeof v === 'string') {
    const s = v.trim().toLowerCase()
    return s === 'true' || s === '1' || s === 'yes'
  }
  return false
}

export function coerceSiteNumber(v: unknown): number | null {
  if (v == null || v === '') return null
  if (typeof v === 'number' && Number.isFinite(v)) return v
  const n = Number(String(v).replace(/,/g, '').trim())
  return Number.isFinite(n) ? n : null
}

export function coerceSiteString(v: unknown): string {
  if (typeof v === 'string') return v
  if (v == null) return ''
  return String(v)
}
