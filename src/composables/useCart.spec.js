import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock localStorage before module import
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, value) => { store[key] = value }),
    removeItem: vi.fn((key) => { delete store[key] }),
    clear: vi.fn(() => { store = {} }),
    _getStore: () => store,
  }
})()

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock })

describe('useCart', () => {
  let useCart

  beforeEach(async () => {
    localStorageMock.clear()
    vi.resetModules()
    const mod = await import('./useCart.js')
    useCart = mod.useCart
  })

  it('starts with an empty cart when localStorage is empty', () => {
    const { cartItems, isCartEmpty, cartItemCount, cartTotal } = useCart()
    expect(cartItems.value).toEqual([])
    expect(isCartEmpty.value).toBe(true)
    expect(cartItemCount.value).toBe(0)
    expect(cartTotal.value).toBe(0)
  })

  it('addToCart adds a new item to the cart', () => {
    const { addToCart, cartItems, cartItemCount, isCartEmpty } = useCart()
    const product = { id: 'p1', name: 'Test', price_huf: 1000, stock: 5 }

    const result = addToCart(product)

    expect(result).toBe(true)
    expect(cartItems.value).toHaveLength(1)
    expect(cartItems.value[0].productId).toBe('p1')
    expect(cartItems.value[0].quantity).toBe(1)
    expect(cartItemCount.value).toBe(1)
    expect(isCartEmpty.value).toBe(false)
  })

  it('addToCart increments quantity for existing item', () => {
    const { addToCart, cartItems } = useCart()
    const product = { id: 'p1', name: 'Test', price_huf: 1000, stock: 10 }

    addToCart(product, 2)
    addToCart(product, 3)

    expect(cartItems.value).toHaveLength(1)
    expect(cartItems.value[0].quantity).toBe(5)
  })

  it('addToCart respects stock limit', () => {
    const { addToCart, cartItems } = useCart()
    const product = { id: 'p1', name: 'Test', price_huf: 1000, stock: 3 }

    addToCart(product, 5)

    expect(cartItems.value[0].quantity).toBe(3)
  })

  it('addToCart returns false when stock is 0', () => {
    const { addToCart, cartItems } = useCart()
    const product = { id: 'p1', name: 'Test', price_huf: 1000, stock: 0 }

    const result = addToCart(product)

    expect(result).toBe(false)
    expect(cartItems.value).toHaveLength(0)
  })

  it('removeFromCart removes an item by productId', () => {
    const { addToCart, removeFromCart, cartItems } = useCart()
    addToCart({ id: 'p1', name: 'A', price_huf: 100, stock: 5 })
    addToCart({ id: 'p2', name: 'B', price_huf: 200, stock: 5 })

    removeFromCart('p1')

    expect(cartItems.value).toHaveLength(1)
    expect(cartItems.value[0].productId).toBe('p2')
  })

  it('updateQuantity updates item quantity', () => {
    const { addToCart, updateQuantity, cartItems } = useCart()
    addToCart({ id: 'p1', name: 'A', price_huf: 100, stock: 10 })

    updateQuantity('p1', 7)

    expect(cartItems.value[0].quantity).toBe(7)
  })

  it('updateQuantity removes item when quantity is 0', () => {
    const { addToCart, updateQuantity, cartItems } = useCart()
    addToCart({ id: 'p1', name: 'A', price_huf: 100, stock: 10 })

    updateQuantity('p1', 0)

    expect(cartItems.value).toHaveLength(0)
  })

  it('clearCart empties the cart', () => {
    const { addToCart, clearCart, cartItems, isCartEmpty } = useCart()
    addToCart({ id: 'p1', name: 'A', price_huf: 100, stock: 5 })
    addToCart({ id: 'p2', name: 'B', price_huf: 200, stock: 5 })

    clearCart()

    expect(cartItems.value).toHaveLength(0)
    expect(isCartEmpty.value).toBe(true)
  })

  it('cartTotal computes correct total', () => {
    const { addToCart, cartTotal } = useCart()
    addToCart({ id: 'p1', name: 'A', price_huf: 1000, stock: 10 }, 2)
    addToCart({ id: 'p2', name: 'B', price_huf: 500, stock: 10 }, 3)

    // 1000*2 + 500*3 = 3500
    expect(cartTotal.value).toBe(3500)
  })
})
