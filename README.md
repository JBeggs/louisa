# Louisa — Template 9

Multi-tenant Next.js storefront for South African comfort-food businesses (vetkoek, chicken, pap takeaway, etc.). Connects to **django-crm** via the e-commerce API.

- **Plan:** `PLAN-09-LOUISA.md` in the monorepo (or copy into this repo for reference).
- **Dev:** `npm install` then `npm run dev` — default port **3010**.
- **Env:** copy `env-template.txt` to `.env.local` and set `NEXT_PUBLIC_COMPANY_SLUG=louisa` (or your tenant slug).

## Themes

Runtime themes (no reload): **Sunday Lunch** (default), **Township Diner**, **Modern Plate** — cookie `site_theme`.

## Pickup + delivery

When `SiteSetting` `pickup_enabled` is true, cart and checkout show a **pickup vs delivery** choice. Pickup uses cart/order `delivery_method: collect` and skips courier shipping. Optional: `pickup_lead_time_minutes`, `pickup_window_minutes`, `pickup_time_label`, `fulfilment_pickup_label`, `fulfilment_delivery_label`.

## Licence

Private / use per your deployment policy.
