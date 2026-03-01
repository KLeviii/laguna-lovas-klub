import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/services/productService.js', () => ({
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
  createProductCategory: vi.fn(),
  updateProductCategory: vi.fn(),
  deleteProductCategory: vi.fn(),
  uploadProductImage: vi.fn(),
}))

import { useProductForm } from './useProductForm.js'

describe('useProductForm', () => {
  let form

  beforeEach(() => {
    vi.clearAllMocks()
    form = useProductForm()
    form.clearProductForm()
  })

  // ── validateForm (via saveProduct) ───────────────────────────
  describe('saveProduct validation', () => {
    it('sets error when product name is empty', async () => {
      form.productName.value = ''
      form.selectedCategoryId.value = 'c1'
      form.productPrice.value = 1000

      const result = await form.saveProduct()

      expect(result).toBe(false)
      expect(form.error.value).toBe('A termék neve kötelező')
    })

    it('sets error when price is missing', async () => {
      form.productName.value = 'Test Product'
      form.selectedCategoryId.value = 'c1'
      form.productPrice.value = ''

      const result = await form.saveProduct()

      expect(result).toBe(false)
      expect(form.error.value).toContain('ár')
    })

    it('sets error when category is not selected', async () => {
      form.productName.value = 'Test Product'
      form.selectedCategoryId.value = null
      form.productPrice.value = 1000

      const result = await form.saveProduct()

      expect(result).toBe(false)
      expect(form.error.value).toContain('kategóriát')
    })
  })

  // ── clearProductForm (reset) ─────────────────────────────────
  describe('clearProductForm', () => {
    it('clears all product form fields to defaults', () => {
      form.productName.value = 'Product'
      form.productDescription.value = 'Desc'
      form.productPrice.value = 5000
      form.selectedCategoryId.value = 'c1'
      form.isProductAvailable.value = false
      form.productImageUrl.value = 'http://img.jpg'
      form.productStock.value = 10
      form.editingProductId.value = 'p1'
      form.error.value = 'Some error'

      form.clearProductForm()

      expect(form.productName.value).toBe('')
      expect(form.productDescription.value).toBe('')
      expect(form.productPrice.value).toBe('')
      expect(form.selectedCategoryId.value).toBeNull()
      expect(form.isProductAvailable.value).toBe(true)
      expect(form.productImageUrl.value).toBe('')
      expect(form.productStock.value).toBe(0)
      expect(form.editingProductId.value).toBeNull()
      expect(form.error.value).toBeNull()
    })
  })

  // ── handleImageSelect ────────────────────────────────────────
  describe('handleImageSelect', () => {
    it('sets image file for valid image', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: 1024 })

      form.handleImageSelect(file)

      expect(form.productImageFile.value).toBe(file)
      expect(form.error.value).toBeNull()
    })

    it('sets error for non-image file', () => {
      const file = new File([''], 'test.pdf', { type: 'application/pdf' })

      form.handleImageSelect(file)

      expect(form.productImageFile.value).toBeNull()
      expect(form.error.value).toContain('képfájlok')
    })

    it('clears file when null is passed', () => {
      form.productImageFile.value = new File([''], 'old.jpg', { type: 'image/jpeg' })

      form.handleImageSelect(null)

      expect(form.productImageFile.value).toBeNull()
    })
  })

  // ── saveCategory validation ──────────────────────────────────
  describe('saveCategory validation', () => {
    it('sets error when category name is empty', async () => {
      form.categoryName.value = ''
      form.categorySlug.value = 'test'

      const result = await form.saveCategory()

      expect(result).toBe(false)
      expect(form.error.value).toContain('kategória neve')
    })

    it('sets error when slug is empty', async () => {
      form.categoryName.value = 'Test'
      form.categorySlug.value = ''

      const result = await form.saveCategory()

      expect(result).toBe(false)
      expect(form.error.value).toContain('slug')
    })
  })
})
