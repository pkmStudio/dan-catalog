import { describe, expect, it } from 'vitest'
import { buildCanonicalUrl, createPageSeo } from '~/shared/lib/seo'

describe('page SEO helpers', () => {
  it('removes state parameters from canonical paths', () => {
    expect(buildCanonicalUrl('/category/wipers?page=2#products')).toBe('/category/wipers')
  })

  it('creates an absolute canonical URL when a site URL is provided', () => {
    expect(buildCanonicalUrl('product/lw-600', 'https://dan.example/catalog/')).toBe(
      'https://dan.example/product/lw-600'
    )
  })

  it('uses noindex,follow for parameterized state', () => {
    expect(
      createPageSeo({
        title: 'Щётки DAN',
        description: 'Каталог щёток',
        canonicalPath: '/category/wipers',
        noindex: true
      })
    ).toEqual({
      title: 'Щётки DAN',
      description: 'Каталог щёток',
      robots: 'noindex,follow',
      canonicalUrl: '/category/wipers'
    })
  })
})
