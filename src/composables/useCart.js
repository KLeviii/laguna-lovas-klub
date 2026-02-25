import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'cart'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveToStorage(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

// Module-level singleton (shared across all components)
const cartItems = ref(loadFromStorage())

watch(cartItems, (items) => saveToStorage(items), { deep: true })

export function useCart() {
  const cartItemCount = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const cartTotal = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.price_huf * item.quantity, 0)
  )

  const isCartEmpty = computed(() => cartItems.value.length === 0)

  function addToCart(product, qty = 1) {
    const existing = cartItems.value.find((item) => item.productId === product.id)
    const maxStock = product.stock || 0

    if (existing) {
      const newQty = Math.min(existing.quantity + qty, maxStock)
      existing.quantity = newQty
    } else {
      if (maxStock <= 0) return false
      cartItems.value.push({
        productId: product.id,
        name: product.name,
        price_huf: product.price_huf,
        image_url: product.image_url || null,
        quantity: Math.min(qty, maxStock),
        stock: maxStock,
        categoryId: product.category?.id || null,
      })
    }
    return true
  }

  function removeFromCart(productId) {
    const idx = cartItems.value.findIndex((item) => item.productId === productId)
    if (idx !== -1) {
      cartItems.value.splice(idx, 1)
    }
  }

  function updateQuantity(productId, newQty) {
    const item = cartItems.value.find((item) => item.productId === productId)
    if (!item) return

    if (newQty <= 0) {
      removeFromCart(productId)
      return
    }

    item.quantity = Math.min(newQty, item.stock)
  }

  function clearCart() {
    cartItems.value = []
  }

  return {
    cartItems,
    cartItemCount,
    cartTotal,
    isCartEmpty,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  }
}
