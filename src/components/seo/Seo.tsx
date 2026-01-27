import { useEffect } from 'react'

type OpenGraph = {
  title?: string
  description?: string
  image?: string
  type?: 'website' | 'product'
}

type SeoProps = {
  title: string
  description: string
  canonicalPath?: string
  og?: OpenGraph
  noindex?: boolean
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

function toAbsoluteUrl(path: string) {
  try {
    return new URL(path, window.location.origin).toString()
  } catch {
    return path
  }
}

export function Seo({ title, description, canonicalPath, og, noindex, jsonLd }: SeoProps) {
  const canonical = canonicalPath ? toAbsoluteUrl(canonicalPath) : undefined
  const ogTitle = og?.title ?? title
  const ogDescription = og?.description ?? description
  const ogImage = og?.image
  const ogType = og?.type ?? 'website'
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : ''

  function upsertMeta(selector: string, attributes: Record<string, string>) {
    let el = document.head.querySelector(selector) as HTMLMetaElement | null
    if (!el) {
      el = document.createElement('meta')
      document.head.appendChild(el)
    }
    Object.entries(attributes).forEach(([k, v]) => el!.setAttribute(k, v))
  }

  function upsertLink(selector: string, attributes: Record<string, string>) {
    let el = document.head.querySelector(selector) as HTMLLinkElement | null
    if (!el) {
      el = document.createElement('link')
      document.head.appendChild(el)
    }
    Object.entries(attributes).forEach(([k, v]) => el!.setAttribute(k, v))
  }

  function removeSeoJsonLd() {
    document.head
      .querySelectorAll('script[data-seo-jsonld="true"]')
      .forEach((node) => node.parentElement?.removeChild(node))
  }

  useEffect(() => {
    document.title = title
    upsertMeta('meta[name="description"]', { name: 'description', content: description })

    if (canonical) {
      upsertLink('link[rel="canonical"]', { rel: 'canonical', href: canonical })
    }

    if (noindex) {
      upsertMeta('meta[name="robots"]', { name: 'robots', content: 'noindex,nofollow' })
    } else {
      const robots = document.head.querySelector('meta[name="robots"]')
      if (robots) robots.parentElement?.removeChild(robots)
    }

    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: ogTitle })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: ogDescription })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: ogType })
    if (canonical) upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
    if (ogImage) upsertMeta('meta[property="og:image"]', { property: 'og:image', content: toAbsoluteUrl(ogImage) })

    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: ogImage ? 'summary_large_image' : 'summary' })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: ogTitle })
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: ogDescription })
    if (ogImage) upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: toAbsoluteUrl(ogImage) })

    removeSeoJsonLd()
    if (jsonLdKey) {
      const parsed = JSON.parse(jsonLdKey) as Record<string, unknown> | Record<string, unknown>[]
      const items = Array.isArray(parsed) ? parsed : [parsed]
      items.forEach((item) => {
        const script = document.createElement('script')
        script.type = 'application/ld+json'
        script.setAttribute('data-seo-jsonld', 'true')
        script.text = JSON.stringify(item)
        document.head.appendChild(script)
      })
    }

    return () => {
      removeSeoJsonLd()
    }
  }, [title, description, canonical, ogTitle, ogDescription, ogImage, ogType, noindex, jsonLdKey])

  return null
}
