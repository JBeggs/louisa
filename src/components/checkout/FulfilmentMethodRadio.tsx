'use client'

import type { StoreFulfilmentMode } from '@/lib/store-fulfilment'

export interface FulfilmentMethodRadioProps {
  value: StoreFulfilmentMode
  onChange: (v: StoreFulfilmentMode) => void
  pickupLabel: string
  deliveryLabel: string
  className?: string
}

export default function FulfilmentMethodRadio({
  value,
  onChange,
  pickupLabel,
  deliveryLabel,
  className,
}: FulfilmentMethodRadioProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Fulfilment method"
      className={['rounded-card border border-border-default bg-surface p-4', className].filter(Boolean).join(' ')}
    >
      <p className="text-sm font-semibold text-text mb-3">How would you like to receive your order?</p>
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
        <label className="flex cursor-pointer items-center gap-2 rounded-button border border-border-default px-3 py-2 has-[:checked]:border-primary has-[:checked]:bg-surface-raised">
          <input
            type="radio"
            name="louisa-fulfilment"
            className="text-primary focus:ring-ring"
            checked={value === 'collect'}
            onChange={() => onChange('collect')}
          />
          <span className="text-sm font-medium text-text">{pickupLabel}</span>
        </label>
        <label className="flex cursor-pointer items-center gap-2 rounded-button border border-border-default px-3 py-2 has-[:checked]:border-primary has-[:checked]:bg-surface-raised">
          <input
            type="radio"
            name="louisa-fulfilment"
            className="text-primary focus:ring-ring"
            checked={value === 'delivery'}
            onChange={() => onChange('delivery')}
          />
          <span className="text-sm font-medium text-text">{deliveryLabel}</span>
        </label>
      </div>
    </div>
  )
}
