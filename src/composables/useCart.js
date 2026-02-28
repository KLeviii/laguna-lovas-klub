import { ref, computed, watch } from 'vue'

/**
 * @module useCart
 * Composable a bevásárlókosár kezeléséhez.
 * Module-level singleton pattern: a kosár állapota localStorage-ban perzisztálódik
 * és megosztott minden komponens között.
 */

/** @type {string} A localStorage kulcs a kosár adatokhoz. */
const STORAGE_KEY = 'cart'

/**
 * Betölti a kosár tartalmát a localStorage-ból.
 * @returns {Array<Object>} A kosár elemek tömbje, vagy üres tömb hiba esetén.
 */
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * Elmenti a kosár tartalmát a localStorage-ba.
 * @param {Array<Object>} items - A kosár elemek tömbje.
 */
function saveToStorage(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

/** @type {import('vue').Ref<Array<Object>>} Module-level singleton a kosár elemekhez. */
const cartItems = ref(loadFromStorage())

watch(cartItems, (items) => saveToStorage(items), { deep: true })

/**
 * Composable a bevásárlókosár kezeléséhez (hozzáadás, eltávolítás, frissítés, ürítés).
 * @returns {{
 *   cartItems: import('vue').Ref<Array<Object>>,
 *   cartItemCount: import('vue').ComputedRef<number>,
 *   cartTotal: import('vue').ComputedRef<number>,
 *   isCartEmpty: import('vue').ComputedRef<boolean>,
 *   addToCart: (product: Object, qty?: number) => boolean,
 *   removeFromCart: (productId: string) => void,
 *   updateQuantity: (productId: string, newQty: number) => void,
 *   clearCart: () => void
 * }}
 */
export function useCart() {
  /** @type {import('vue').ComputedRef<number>} A kosárban lévő termékek összesített darabszáma. */
  const cartItemCount = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  /** @type {import('vue').ComputedRef<number>} A kosár teljes értéke HUF-ban. */
  const cartTotal = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.price_huf * item.quantity, 0)
  )

  /** @type {import('vue').ComputedRef<boolean>} Igaz, ha a kosár üres. */
  const isCartEmpty = computed(() => cartItems.value.length === 0)

  /**
   * Termék hozzáadása a kosárhoz. Ha a termék már benne van, növeli a mennyiséget.
   * A mennyiség nem lépheti túl a készletet (stock).
   * @param {Object} product - A hozzáadandó termék objektum (id, name, price_huf, stock, image_url, category).
   * @param {number} [qty=1] - A hozzáadandó mennyiség.
   * @returns {boolean} Igaz, ha a hozzáadás sikeres volt; hamis, ha nincs készleten.
   */
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

  /**
   * Termék eltávolítása a kosárból a termék ID alapján.
   * @param {string} productId - Az eltávolítandó termék azonosítója.
   */
  function removeFromCart(productId) {
    const idx = cartItems.value.findIndex((item) => item.productId === productId)
    if (idx !== -1) {
      cartItems.value.splice(idx, 1)
    }
  }

  /**
   * Egy kosárelem mennyiségének frissítése. Ha az új mennyiség 0 vagy kevesebb,
   * a termék eltávolításra kerül a kosárból. A mennyiség nem lépheti túl a készletet.
   * @param {string} productId - A frissítendő termék azonosítója.
   * @param {number} newQty - Az új mennyiség.
   */
  function updateQuantity(productId, newQty) {
    const item = cartItems.value.find((item) => item.productId === productId)
    if (!item) return

    if (newQty <= 0) {
      removeFromCart(productId)
      return
    }

    item.quantity = Math.min(newQty, item.stock)
  }

  /**
   * A kosár teljes kiürítése. Minden elem eltávolításra kerül.
   */
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
