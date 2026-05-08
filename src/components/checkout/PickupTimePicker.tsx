'use client'

import { useCompany } from '@/contexts/CompanyContext'
import { resolveLocale } from '@/lib/locale'
import { useMemo, useState } from 'react'
import { getPickupSlotIso, setPickupSlotIso } from '@/lib/store-fulfilment'
import { coerceSiteNumber } from '@/lib/site-settings-client'

export interface PickupTimePickerProps {
  /** SiteSetting `pickup_lead_time_minutes` */
  leadMinutes?: number | null
  /** SiteSetting `pickup_window_minutes` */
  windowMinutes?: number | null
  pickupTimeLabel?: string
  className?: string
}

/**
 * Builds simple same-day slots from lead time + window size. Closing time defaults to 21:00 local.
 */
export default function PickupTimePicker({
  leadMinutes,
  windowMinutes,
  pickupTimeLabel,
  className,
}: PickupTimePickerProps) {
  const company = useCompany()
  const locale = resolveLocale(company)
  const [selected, setSelected] = useState(() => getPickupSlotIso())

  const slots = useMemo(() => {
    const lead = Math.max(0, coerceSiteNumber(leadMinutes) ?? 30)
    const win = Math.max(15, coerceSiteNumber(windowMinutes) ?? 30)
    const now = new Date()
    const start = new Date(now.getTime() + lead * 60 * 1000)
    const dayStart = new Date(start)
    dayStart.setHours(0, 0, 0, 0)
    let t = start.getTime()
    const msWin = win * 60 * 1000
    const offset = Math.ceil((t - dayStart.getTime()) / msWin) * msWin
    let cursor = dayStart.getTime() + offset
    if (cursor < t) cursor += msWin

    const endOfDay = new Date(start)
    endOfDay.setHours(21, 0, 0, 0)
    const out: string[] = []
    while (cursor <= endOfDay.getTime() && out.length < 24) {
      out.push(new Date(cursor).toISOString())
      cursor += msWin
    }
    return out
  }, [leadMinutes, windowMinutes])

  if (!slots.length) return null

  function onSelect(iso: string) {
    setSelected(iso)
    setPickupSlotIso(iso)
  }

  return (
    <div className={className}>
      <label htmlFor="pickup-slot" className="form-label">
        {pickupTimeLabel?.trim() ? pickupTimeLabel : 'Preferred pickup time'}
      </label>
      <select
        id="pickup-slot"
        className="form-input"
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">—</option>
        {slots.map((iso) => (
          <option key={iso} value={iso}>
            {new Date(iso).toLocaleString(locale, { dateStyle: 'short', timeStyle: 'short' })}
          </option>
        ))}
      </select>
    </div>
  )
}
