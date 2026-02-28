/**
 * Set the page title and meta description for SEO.
 * @param {string} title - Page title (will be appended with " | Laguna Lovasklub")
 * @param {string} [description] - Meta description
 */
export function useHead(title, description) {
  document.title = title ? `${title} | Laguna Lovasklub` : 'Laguna Lovasklub'
  if (description) {
    let meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', description)
  }
}
