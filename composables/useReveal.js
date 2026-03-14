import { onMounted, onUnmounted } from 'vue'

let observer = null

function observe(selector = '.reveal') {
  if (!observer) return
  document.querySelectorAll(selector).forEach((el) => observer.observe(el))
}

export function useReveal(selector = '.reveal') {
  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible')
          } else {
            entry.target.classList.remove('reveal-visible')
          }
        })
      },
      { threshold: 0, rootMargin: '0px 0px 0px 0px' }
    )

    observe(selector)
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  })

  return { observe }
}
