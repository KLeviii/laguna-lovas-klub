import { watch } from 'vue'

export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return navigateTo('/admin/login')

  const { user, authReady } = useAuth()
  if (!authReady.value) {
    await new Promise(resolve => {
      const unwatch = watch(authReady, (val) => {
        if (val) { unwatch(); resolve() }
      })
    })
  }
  if (!user.value) return navigateTo('/admin/login')
})
