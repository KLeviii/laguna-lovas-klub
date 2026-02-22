import { ref, computed } from 'vue'
import {
  fetchAllProducts,
  fetchProductCategories,
  fetchProductById,
  fetchRelatedProducts,
  deleteProduct as deleteProductService,
} from '@/services/productService.js'

export function useProducts() {
  const products = ref([])
  const categories = ref([])
  const selectedProduct = ref(null)
  const relatedProducts = ref([])
  const categoryFilter = ref(null) // null = all categories
  const loading = ref(false)
  const error = ref(null)

  /**
   * Load all products from database
   */
  async function loadProducts({ available_only = false } = {}) {
    loading.value = true
    error.value = null

    try {
      const filters = { available_only }
      products.value = await fetchAllProducts(filters)
    } catch (err) {
      error.value = err.message
      products.value = []
    } finally {
      loading.value = false
    }
  }

  /**
   * Load all product categories
   */
  async function loadCategories() {
    try {
      categories.value = await fetchProductCategories()
    } catch (err) {
      error.value = err.message
      categories.value = []
    }
  }

  /**
   * Set category filter and implicitly filter products
   */
  function setProductCategory(categoryId) {
    categoryFilter.value = categoryId
  }

  /**
   * Clear category filter
   */
  function clearProductFilter() {
    categoryFilter.value = null
  }

  /**
   * Load a single product by ID with related products
   */
  async function loadProductById(productId) {
    loading.value = true
    error.value = null

    try {
      selectedProduct.value = await fetchProductById(productId)

      // Load related products if category exists
      if (selectedProduct.value?.category?.id) {
        relatedProducts.value = await fetchRelatedProducts(
          selectedProduct.value.category.id,
          productId
        )
      }
    } catch (err) {
      error.value = err.message
      selectedProduct.value = null
      relatedProducts.value = []
    } finally {
      loading.value = false
    }
  }

  /**
   * Computed: filtered products based on category filter
   */
  const filteredProducts = computed(() => {
    if (!categoryFilter.value) {
      return products.value
    }
    return products.value.filter(p => p.category?.id === categoryFilter.value)
  })

  /**
   * Computed: is product list empty
   */
  const isEmpty = computed(() => filteredProducts.value.length === 0)

  /**
   * Delete product (soft delete: mark as unavailable)
   */
  async function deleteProduct(productId) {
    loading.value = true
    error.value = null
    try {
      await deleteProductService(productId)
      await loadProducts()
      return true
    } catch (err) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    products: filteredProducts,
    categories,
    selectedProduct,
    relatedProducts,
    categoryFilter,
    loading,
    error,
    isEmpty,
    loadProducts,
    loadCategories,
    loadProductById,
    setProductCategory,
    clearProductFilter,
    deleteProduct,
  }
}
