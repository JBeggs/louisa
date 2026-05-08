/**
 * Client-only preference for store pickup vs delivery (Template 9).
 * Aligns with cart `delivery_method: 'collect'` when pickup is chosen.
 */

export const LOUISA_FULFILMENT_STORAGE_KEY = 'louisa_fulfilment'
export const LOUISA_PICKUP_SLOT_KEY = 'louisa_pickup_slot_iso'

export type StoreFulfilmentMode = 'delivery' | 'collect'

export function getStoreFulfilmentMode(): StoreFulfilmentMode {
  if (typeof window === 'undefined') return 'delivery'
  try {
    const v = window.sessionStorage.getItem(LOUISA_FULFILMENT_STORAGE_KEY)
    return v === 'collect' ? 'collect' : 'delivery'
  } catch {
    return 'delivery'
  }
}

export function setStoreFulfilmentMode(mode: StoreFulfilmentMode): void {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(LOUISA_FULFILMENT_STORAGE_KEY, mode)
  } catch {
    /* ignore */
  }
}

export function getPickupSlotIso(): string {
  if (typeof window === 'undefined') return ''
  try {
    return window.sessionStorage.getItem(LOUISA_PICKUP_SLOT_KEY) || ''
  } catch {
    return ''
  }
}

export function setPickupSlotIso(iso: string): void {
  if (typeof window === 'undefined') return
  try {
    if (iso) window.sessionStorage.setItem(LOUISA_PICKUP_SLOT_KEY, iso)
    else window.sessionStorage.removeItem(LOUISA_PICKUP_SLOT_KEY)
  } catch {
    /* ignore */
  }
}
