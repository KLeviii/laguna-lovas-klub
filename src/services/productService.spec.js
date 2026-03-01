import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Supabase mock ──────────────────────────────────────────────
let mockChain

function createMockChain(resolveValue = { data: null, error: null }) {
  const chain = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
  }
  chain.then = vi.fn((resolve) => resolve(resolveValue))
  chain._resolve = (val) => {
    chain.then = vi.fn((resolve) => resolve(val))
  }
  return chain
}

vi.mock('./supabase', () => ({
  supabase: {
    from: vi.fn(() => mockChain),
    storage: { from: vi.fn() },
  },
}))

import { supabase } from './supabase'
import {
  fetchAllProducts,
  fetchProductById,
  fetchProductCategories,
  createProduct,
  deleteProductCategory,
} from './productService'

// ── Tests ──────────────────────────────────────────────────────
describe('productService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockChain = createMockChain()
  })

  // ── fetchAllProducts ─────────────────────────────────────────
  describe('fetchAllProducts', () => {
    it('returns all products on success', async () => {
      const products = [{ id: '1', name: 'Nyereg' }, { id: '2', name: 'Kantár' }]
      mockChain._resolve({ data: products, error: null })

      const result = await fetchAllProducts()
      expect(result).toEqual(products)
      expect(supabase.from).toHaveBeenCalledWith('products')
      expect(mockChain.order).toHaveBeenCalledWith('name', { ascending: true })
    })

    it('applies available_only filter when specified', async () => {
      mockChain._resolve({ data: [], error: null })

      await fetchAllProducts({ available_only: true })
      expect(mockChain.neq).toHaveBeenCalledWith('is_available', false)
    })

    it('throws on query error', async () => {
      mockChain._resolve({ data: null, error: { message: 'db error' } })

      await expect(fetchAllProducts()).rejects.toThrow('Failed to fetch products')
    })
  })

  // ── fetchProductById ─────────────────────────────────────────
  describe('fetchProductById', () => {
    it('returns product when found', async () => {
      const product = { id: 'p1', name: 'Nyereg', price_huf: 50000 }
      mockChain._resolve({ data: product, error: null })

      const result = await fetchProductById('p1')
      expect(result).toEqual(product)
      expect(mockChain.eq).toHaveBeenCalledWith('id', 'p1')
      expect(mockChain.single).toHaveBeenCalled()
    })

    it('returns null when product is not found (PGRST116)', async () => {
      mockChain._resolve({ data: null, error: { code: 'PGRST116', message: 'not found' } })

      const result = await fetchProductById('missing')
      expect(result).toBeNull()
    })

    it('throws on non-PGRST116 error', async () => {
      mockChain._resolve({ data: null, error: { code: 'OTHER', message: 'server error' } })

      await expect(fetchProductById('bad')).rejects.toThrow('Failed to fetch product')
    })
  })

  // ── fetchProductCategories ───────────────────────────────────
  describe('fetchProductCategories', () => {
    it('returns categories ordered by display_order', async () => {
      const categories = [{ id: 'c1', name: 'Felszerelés' }]
      mockChain._resolve({ data: categories, error: null })

      const result = await fetchProductCategories()
      expect(result).toEqual(categories)
      expect(supabase.from).toHaveBeenCalledWith('product_categories')
      expect(mockChain.order).toHaveBeenCalledWith('display_order', { ascending: true })
    })

    it('returns empty array when data is null', async () => {
      mockChain._resolve({ data: null, error: null })

      const result = await fetchProductCategories()
      expect(result).toEqual([])
    })

    it('throws on error', async () => {
      mockChain._resolve({ data: null, error: { message: 'fail' } })

      await expect(fetchProductCategories()).rejects.toThrow('Failed to fetch categories')
    })
  })

  // ── createProduct ────────────────────────────────────────────
  describe('createProduct', () => {
    it('creates a product and returns the record', async () => {
      const created = { id: 'new1', name: 'Nyereg' }
      mockChain._resolve({ data: created, error: null })

      const result = await createProduct({ name: 'Nyereg', price_huf: 50000 })
      expect(result).toEqual(created)
      expect(mockChain.insert).toHaveBeenCalledWith([{ name: 'Nyereg', price_huf: 50000 }])
    })

    it('throws on insert error', async () => {
      mockChain._resolve({ data: null, error: { message: 'duplicate' } })

      await expect(createProduct({ name: 'X' })).rejects.toThrow('Failed to create product')
    })
  })

  // ── deleteProductCategory ────────────────────────────────────
  describe('deleteProductCategory', () => {
    it('deletes category without throwing on success', async () => {
      mockChain._resolve({ data: null, error: null })

      await expect(deleteProductCategory('c1')).resolves.toBeUndefined()
      expect(supabase.from).toHaveBeenCalledWith('product_categories')
      expect(mockChain.delete).toHaveBeenCalled()
      expect(mockChain.eq).toHaveBeenCalledWith('id', 'c1')
    })

    it('throws on delete error', async () => {
      mockChain._resolve({ data: null, error: { message: 'has products' } })

      await expect(deleteProductCategory('c1')).rejects.toThrow('Failed to delete category')
    })
  })
})
