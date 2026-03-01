import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/services/productService.js', () => ({
  fetchAllProducts: vi.fn(),
  fetchProductCategories: vi.fn(),
  fetchProductById: vi.fn(),
  fetchRelatedProducts: vi.fn(),
  deleteProduct: vi.fn(),
}))

import { useProducts } from './useProducts.js'
import {
  fetchAllProducts,
  fetchProductCategories,
} from '@/services/productService.js'

describe('useProducts', () => {
  let products

  beforeEach(() => {
    vi.clearAllMocks()
    products = useProducts()
  })

  // ── loadProducts ─────────────────────────────────────────────
  describe('loadProducts', () => {
    it('populates products array on success', async () => {
      const mockProducts = [
        { id: '1', name: 'Nyereg', category: { id: 'c1' } },
        { id: '2', name: 'Kantár', category: { id: 'c2' } },
      ]
      fetchAllProducts.mockResolvedValueOnce(mockProducts)

      await products.loadProducts()

      expect(products.products.value).toHaveLength(2)
      expect(products.loading.value).toBe(false)
      expect(products.error.value).toBeNull()
    })

    it('sets error on failure', async () => {
      fetchAllProducts.mockRejectedValueOnce(new Error('Network error'))

      await products.loadProducts()

      expect(products.products.value).toEqual([])
      expect(products.error.value).toBe('Network error')
    })

    it('passes available_only filter to service', async () => {
      fetchAllProducts.mockResolvedValueOnce([])

      await products.loadProducts({ available_only: true })

      expect(fetchAllProducts).toHaveBeenCalledWith({ available_only: true })
    })
  })

  // ── setProductCategory ───────────────────────────────────────
  describe('setProductCategory', () => {
    it('filters products by category', async () => {
      const mockProducts = [
        { id: '1', name: 'Nyereg', category: { id: 'c1' } },
        { id: '2', name: 'Kantár', category: { id: 'c2' } },
        { id: '3', name: 'Zabla', category: { id: 'c1' } },
      ]
      fetchAllProducts.mockResolvedValueOnce(mockProducts)
      await products.loadProducts()

      products.setProductCategory('c1')

      expect(products.products.value).toHaveLength(2)
      expect(products.products.value.every((p) => p.category.id === 'c1')).toBe(true)
    })

    it('sets categoryFilter ref', () => {
      products.setProductCategory('c2')

      expect(products.categoryFilter.value).toBe('c2')
    })
  })

  // ── clearProductFilter ───────────────────────────────────────
  describe('clearProductFilter', () => {
    it('resets category filter to null', async () => {
      const mockProducts = [
        { id: '1', name: 'Nyereg', category: { id: 'c1' } },
        { id: '2', name: 'Kantár', category: { id: 'c2' } },
      ]
      fetchAllProducts.mockResolvedValueOnce(mockProducts)
      await products.loadProducts()

      products.setProductCategory('c1')
      expect(products.products.value).toHaveLength(1)

      products.clearProductFilter()

      expect(products.categoryFilter.value).toBeNull()
      expect(products.products.value).toHaveLength(2)
    })
  })
})
