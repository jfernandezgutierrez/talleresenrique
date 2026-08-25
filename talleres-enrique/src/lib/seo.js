const SITE_NAME = 'Talleres Enrique'

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value))
}

function upsertCanonical(url) {
  let element = document.head.querySelector('link[rel="canonical"]')
  if (!element) {
    element = document.createElement('link')
    element.rel = 'canonical'
    document.head.appendChild(element)
  }
  element.href = url
}

export function applyRouteSeo(route) {
  const title = `${route.meta.title} | ${SITE_NAME}`
  const description = route.meta.description || 'Talleres Enrique en Selaya, Cantabria.'
  const canonical = new URL(route.path, window.location.origin).href
  const robots = route.meta.noindex ? 'noindex,follow' : 'index,follow'

  document.title = title
  upsertCanonical(canonical)
  upsertMeta('meta[name="description"]', { name: 'description', content: description })
  upsertMeta('meta[name="robots"]', { name: 'robots', content: robots })
  upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title })
  upsertMeta('meta[property="og:description"]', {
    property: 'og:description',
    content: description,
  })
  upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
  upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' })
}
