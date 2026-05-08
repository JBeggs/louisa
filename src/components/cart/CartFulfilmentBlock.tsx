'use client'

import { useCallback, useEffect, useState } from 'react'
import { ecommerceApi, newsApi } from '@/lib/api'
import { useToast } from '@/contexts/ToastContext'
import FulfilmentMethodRadio from '@/components/checkout/FulfilmentMethodRadio'
import {
  getStoreFulfilmentMode,
  setStoreFulfilmentMode,
  type StoreFulfilmentMode,
} from '@/lib/store-fulfilment'
import {
  coerceSiteString,
  isTruthySetting,
  rowsToMap,
  unwrapSiteSettingsList,
} from '@/lib/site-settings-client'

interface CartFulfilmentBlockProps {
  /** When false, component renders nothing */
  onCartUpdate?: () => void
}

/**
 * Store pickup vs delivery + sync cart `delivery_method` for Template 9.
 */
export default function CartFulfilmentBlock({ onCartUpdate }: CartFulfilmentBlockProps) {
  const { showError } = useToast()
  const [pickupOffered, setPickupOffered] = useState(false)
  const [pickupLabel, setPickupLabel] = useState('')
  const [deliveryLabel, setDeliveryLabel] = useState('')
  const [mode, setMode] = useState<StoreFulfilmentMode>('delivery')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setMode(getStoreFulfilmentMode())
    setReady(true)
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const raw = await newsApi.siteSettings.list()
        const rows = unwrapSiteSettingsList(raw)
        const map = rowsToMap(rows)
        if (cancelled) return
        setPickupOffered(isTruthySetting(map.pickup_enabled))
        setPickupLabel(coerceSiteString(map.fulfilment_pickup_label).trim() || 'Pickup')
        setDeliveryLabel(coerceSiteString(map.fulfilment_delivery_label).trim() || 'Delivery')
      } catch {
        if (!cancelled) setPickupOffered(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const commitMode = useCallback(
    async (next: StoreFulfilmentMode) => {
      setMode(next)
      setStoreFulfilmentMode(next)
      try {
        if (next === 'collect') {
          await ecommerceApi.cart.updateShipping({
            delivery_method: 'collect',
            shipping_override: 0,
          } as Parameters<typeof ecommerceApi.cart.updateShipping>[0])
        } else {
          await ecommerceApi.cart.updateShipping({
            delivery_method: 'standard',
            shipping_override: undefined,
          } as Parameters<typeof ecommerceApi.cart.updateShipping>[0])
        }
        onCartUpdate?.()
      } catch (e: unknown) {
        showError(e instanceof Error ? e.message : 'Could not update fulfilment')
      }
    },
    [onCartUpdate, showError],
  )

  if (!ready || !pickupOffered) return null

  return (
    <FulfilmentMethodRadio
      className="mb-6"
      value={mode}
      onChange={commitMode}
      pickupLabel={pickupLabel}
      deliveryLabel={deliveryLabel}
    />
  )
}
