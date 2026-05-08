import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { serverEcommerceApi } from '@/lib/api-server'
import { Product } from '@/lib/types'
import ProductCard from '@/components/products/ProductCard'
import SafeImage from '@/components/media/SafeImage'
import { getCompany, type Company } from '@/lib/company'
import { unwrapEcommerceProductList } from '@/lib/ecommerce-list'
import PageHero from '@/components/hero/PageHero'
import { getSiteSetting, coerceSiteString } from '@/lib/site-settings'

export const dynamic = 'force-dynamic'

function sortProductsByName(products: Product[]): Product[] {
  return [...products].sort((a, b) =>
    (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' }),
  )
}

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res: unknown = await serverEcommerceApi.products.list({
      is_active: true,
      featured: true,
      page_size: 8,
      ordering: 'name',
    })
    const raw = unwrapEcommerceProductList(res) as Product[]
    return sortProductsByName(
      raw.filter((p: Product) => p && typeof p === 'object' && p.status !== 'archived'),
    ).slice(0, 8)
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return []
  }
}

const HOME_HERO_SECTION_LAYOUT =
  'relative overflow-hidden flex flex-col justify-center min-h-[24rem] sm:min-h-[28rem] md:min-h-[32rem]'

function DefaultHomeHero({
  company,
  primaryCtaLabel,
  secondaryCtaLabel,
  secondaryHref,
}: {
  company: Company
  primaryCtaLabel: string
  secondaryCtaLabel: string | null
  secondaryHref: string | null
}) {
  return (
    <section className={HOME_HERO_SECTION_LAYOUT}>
      <div className="absolute inset-0">
        <SafeImage
          src={company.heroImageUrl}
          alt=""
          kind="hero"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0"
          imgClassName="object-cover"
        />
        <div className="absolute inset-0 hero-gradient-overlay" aria-hidden />
      </div>

      <div className="relative container-wide py-24 md:py-32 text-on-dark w-full">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-4">
            {company.name}
          </h1>
          {company.tagline && (
            <p className="text-base md:text-lg uppercase tracking-[0.25em] text-on-dark-muted mb-6">
              {company.tagline}
            </p>
          )}
          <p className="text-lg md:text-xl text-on-dark-muted mb-8 max-w-xl">
            {company.description}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/products" className="btn btn-accent text-base px-6 py-3">
              <ShoppingBag className="w-5 h-5 mr-2" />
              {primaryCtaLabel}
            </Link>
            {secondaryCtaLabel && secondaryHref ? (
              <Link href={secondaryHref} className="btn btn-secondary-on-dark text-base px-6 py-3">
                {secondaryCtaLabel}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

export default async function HomePage() {
  const [company, featuredProducts, primaryLabelRaw, secondaryLabelRaw, secondaryHrefRaw] =
    await Promise.all([
      getCompany(),
      getFeaturedProducts(),
      getSiteSetting('home_primary_cta_label'),
      getSiteSetting('home_secondary_cta_label'),
      getSiteSetting('home_secondary_cta_href'),
    ])

  const primaryCtaLabel =
    coerceSiteString(primaryLabelRaw).trim() ||
    (company.name.trim() ? `Shop ${company.name}` : 'Browse menu')
  const secondaryCtaLabel = coerceSiteString(secondaryLabelRaw).trim() || null
  const secondaryHref = coerceSiteString(secondaryHrefRaw).trim() || null

  return (
    <div className="min-h-screen">
      <PageHero
        pageSlug="home"
        fallback={
          <DefaultHomeHero
            company={company}
            primaryCtaLabel={primaryCtaLabel}
            secondaryCtaLabel={secondaryCtaLabel}
            secondaryHref={secondaryHref}
          />
        }
      />

      <section className="py-16 bg-bg">
        <div className="container-wide">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured</h2>
              <p className="text-text-muted mt-1">Highlighted menu items from your catalog</p>
            </div>
            <Link href="/products" className="btn btn-secondary">
              View all
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="product-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} homeQuickView />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-text-muted">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="font-medium text-text">No featured products yet</p>
              <p className="text-sm mt-2 max-w-md mx-auto">
                Mark products as featured in admin to show them here.
              </p>
              <Link href="/products" className="btn btn-primary mt-6 inline-flex">
                {primaryCtaLabel}
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-14 bg-surface border-t border-border-default">
        <div className="container-wide text-center">
          <Link href="/products" className="btn btn-primary text-lg px-8 py-3 inline-flex">
            {primaryCtaLabel}
          </Link>
        </div>
      </section>
    </div>
  )
}
