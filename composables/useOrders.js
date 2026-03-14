import { ref, computed } from 'vue'
import {
  fetchAllOrders,
  fetchOrderWithItems,
  updateOrderStatus,
  markOrderAsRead,
  markOrderAsUnread,
} from '~/services/orderService'

export function useOrders() {
  const orders = ref([])
  const loading = ref(false)
  const error = ref(null)

  const unreadCount = computed(() =>
    orders.value.filter((o) => !o.is_read).length
  )

  const isEmpty = computed(() => orders.value.length === 0)

  async function loadOrders() {
    loading.value = true
    error.value = null
    try {
      orders.value = await fetchAllOrders()
    } catch (err) {
      error.value = err.message
      orders.value = []
    } finally {
      loading.value = false
    }
  }

  async function markAsRead(id) {
    try {
      await markOrderAsRead(id)
      const item = orders.value.find((o) => o.id === id)
      if (item) item.is_read = true
    } catch (err) {
      error.value = err.message
    }
  }

  async function markAsUnread(id) {
    try {
      await markOrderAsUnread(id)
      const item = orders.value.find((o) => o.id === id)
      if (item) item.is_read = false
    } catch (err) {
      error.value = err.message
    }
  }

  async function changeStatus(id, newStatus) {
    try {
      await updateOrderStatus(id, newStatus)
      const item = orders.value.find((o) => o.id === id)
      if (item) item.status = newStatus
    } catch (err) {
      error.value = err.message
    }
  }

  async function loadOrderDetail(id) {
    try {
      return await fetchOrderWithItems(id)
    } catch (err) {
      error.value = err.message
      return null
    }
  }

  return {
    orders,
    loading,
    error,
    unreadCount,
    isEmpty,
    loadOrders,
    markAsRead,
    markAsUnread,
    changeStatus,
    loadOrderDetail,
  }
}
