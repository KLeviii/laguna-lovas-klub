/**
 * Set the page title and meta description for SEO using Nuxt's useHead.
 * @param {string} title - Page title (will be appended with " | Laguna Lovasklub")
 * @param {string} [description] - Meta description
 */
export function usePageHead(title, description) {
  const fullTitle = title ? `${title} | Laguna Lovasklub` : 'Laguna Lovasklub'
  const meta = []
  if (description) {
    meta.push({ name: 'description', content: description })
  }
  useHead({ title: fullTitle, meta })
}
