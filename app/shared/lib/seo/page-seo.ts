export interface PageSeoInput {
  title: string
  description: string
  canonicalPath: string
  siteUrl?: string
  noindex?: boolean
}

export interface PageSeo {
  title: string
  description: string
  robots: 'index,follow' | 'noindex,follow'
  canonicalUrl: string
}

const normalizePath = (path: string): string => {
  const cleanPath = path.split(/[?#]/u, 1)[0]?.trim() || '/'
  return cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`
}

export const buildCanonicalUrl = (path: string, siteUrl?: string): string => {
  const canonicalPath = normalizePath(path)
  if (!siteUrl) return canonicalPath

  return new URL(canonicalPath, `${siteUrl.replace(/\/+$/u, '')}/`).toString()
}

export const createPageSeo = (input: PageSeoInput): PageSeo => ({
  title: input.title,
  description: input.description,
  robots: input.noindex ? 'noindex,follow' : 'index,follow',
  canonicalUrl: buildCanonicalUrl(input.canonicalPath, input.siteUrl)
})
