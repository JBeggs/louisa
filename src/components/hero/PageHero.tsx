import 'server-only'
import type { ReactNode } from 'react'
import { getPageHero } from '@/lib/page-hero'
import PageHeroView from './PageHeroView'
import { getCompany } from '@/lib/company'
import { getSiteSetting, coerceSiteString } from '@/lib/site-settings'

/**
 * Server component that renders an uploaded hero for `pageSlug` when the admin
 * has enabled it and attached an image. Otherwise renders `fallback` so each
 * page can decide what to show by default (e.g. home keeps its company-name
 * layout; inner pages render nothing).
 */
export default async function PageHero({
  pageSlug,
  fallback = null,
}: {
  pageSlug: string
  fallback?: ReactNode
}) {
  const hero = await getPageHero(pageSlug)
  if (!hero?.enabled || !hero.imageUrl) return <>{fallback}</>
  const company = pageSlug === 'home' ? await getCompany() : undefined
  if (pageSlug === 'home' && company) {
    const [primaryRaw, secondaryLabelRaw, secondaryHrefRaw] = await Promise.all([
      getSiteSetting('home_primary_cta_label'),
      getSiteSetting('home_secondary_cta_label'),
      getSiteSetting('home_secondary_cta_href'),
    ])
    const primaryCtaLabel =
      coerceSiteString(primaryRaw).trim() ||
      (company.name.trim() ? `Shop ${company.name}` : 'Shop essentials')
    const secondaryCtaLabel = coerceSiteString(secondaryLabelRaw).trim() || null
    const secondaryCtaHref = coerceSiteString(secondaryHrefRaw).trim() || null
    return (
      <PageHeroView
        hero={hero}
        pageSlug={pageSlug}
        company={company}
        primaryCtaLabel={primaryCtaLabel}
        secondaryCtaLabel={secondaryCtaLabel}
        secondaryCtaHref={secondaryCtaHref}
      />
    )
  }
  return <PageHeroView hero={hero} pageSlug={pageSlug} company={company} />
}
