import { ref, computed } from 'vue'
import { fetchOrderWithItems } from '~/services/orderService'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function useOrderLookup() {
  const order = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const searched = ref(false)

  const notFound = computed(() => searched.value && !order.value && !error.value)

  function isValidUUID(str) {
    return UUID_REGEX.test(str?.trim())
  }

  async function lookupOrder(orderId) {
    const trimmed = orderId?.trim()

    if (!trimmed) {
      error.value = 'Kérjük, add meg a rendelés azonosítóját.'
      return
    }

    if (!isValidUUID(trimmed)) {
      error.value = 'Érvénytelen rendelés azonosító formátum.'
      return
    }

    loading.value = true
    error.value = null
    order.value = null
    searched.value = false

    try {
      order.value = await fetchOrderWithItems(trimmed)
      searched.value = true
    } catch (err) {
      error.value = 'Hiba történt a rendelés lekérése közben. Kérjük, próbáld újra később.'
    } finally {
      loading.value = false
    }
  }

  return { order, loading, error, searched, notFound, lookupOrder, isValidUUID }
}
