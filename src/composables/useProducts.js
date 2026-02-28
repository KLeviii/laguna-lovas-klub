import { ref, computed } from 'vue'
import {
  fetchAllProducts,
  fetchProductCategories,
  fetchProductById,
  fetchRelatedProducts,
  deleteProduct as deleteProductService,
} from '@/services/productService.js'

/**
 * @module useProducts
 * Composable a termékek listázásához, kategória szűréséhez és kezeléséhez.
 */

/**
 * Composable a termékek és kategóriák betöltéséhez, szűréséhez és törléséhez.
 * @returns {{
 *   products: import('vue').ComputedRef<Array<Object>>,
 *   categories: import('vue').Ref<Array<Object>>,
 *   selectedProduct: import('vue').Ref<Object|null>,
 *   relatedProducts: import('vue').Ref<Array<Object>>,
 *   categoryFilter: import('vue').Ref<string|null>,
 *   loading: import('vue').Ref<boolean>,
 *   error: import('vue').Ref<string|null>,
 *   isEmpty: import('vue').ComputedRef<boolean>,
 *   loadProducts: (options?: {available_only?: boolean}) => Promise<void>,
 *   loadCategories: () => Promise<void>,
 *   loadProductById: (productId: string) => Promise<void>,
 *   setProductCategory: (categoryId: string) => void,
 *   clearProductFilter: () => void,
 *   deleteProduct: (productId: string) => Promise<boolean>
 * }}
 */
export function useProducts() {
  /** @type {import('vue').Ref<Array<Object>>} Az összes betöltött termék nyers listája. */
  const products = ref([])
  /** @type {import('vue').Ref<Array<Object>>} Az elérhető termékkategóriák listája. */
  const categories = ref([])
  /** @type {import('vue').Ref<Object|null>} Az egyedileg kiválasztott termék adatai. */
  const selectedProduct = ref(null)
  /** @type {import('vue').Ref<Array<Object>>} A kiválasztott termékhez kapcsolódó termékek (azonos kategória). */
  const relatedProducts = ref([])
  /** @type {import('vue').Ref<string|null>} Kategória szűrő: null = minden kategória. */
  const categoryFilter = ref(null) // null = all categories
  /** @type {import('vue').Ref<boolean>} Töltési állapot jelző. */
  const loading = ref(false)
  /** @type {import('vue').Ref<string|null>} Az utolsó hiba üzenete. */
  const error = ref(null)

  /**
   * Az összes termék betöltése az adatbázisból.
   * @param {Object} [options={}] - Betöltési opciók.
   * @param {boolean} [options.available_only=false] - Ha igaz, csak az elérhető termékeket tölti be.
   * @returns {Promise<void>}
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
   * Az összes termékkategória betöltése az adatbázisból.
   * @returns {Promise<void>}
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
   * Kategória szűrő beállítása. A filteredProducts computed automatikusan frissül.
   * @param {string} categoryId - A kiválasztott kategória azonosítója.
   */
  function setProductCategory(categoryId) {
    categoryFilter.value = categoryId
  }

  /**
   * Kategória szűrő törlése (minden kategória megjelenítése).
   */
  function clearProductFilter() {
    categoryFilter.value = null
  }

  /**
   * Egyetlen termék betöltése ID alapján, és a kapcsolódó termékek lekérése (azonos kategória).
   * @param {string} productId - A betöltendő termék azonosítója.
   * @returns {Promise<void>}
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
   * Szűrt termékek listája az aktuális kategória szűrő alapján.
   * @type {import('vue').ComputedRef<Array<Object>>}
   */
  const filteredProducts = computed(() => {
    if (!categoryFilter.value) {
      return products.value
    }
    return products.value.filter(p => p.category?.id === categoryFilter.value)
  })

  /**
   * Igaz, ha a szűrt termékek listája üres.
   * @type {import('vue').ComputedRef<boolean>}
   */
  const isEmpty = computed(() => filteredProducts.value.length === 0)

  /**
   * Termék törlése (soft delete: nem elérhetőként jelölés), majd a lista újratöltése.
   * @param {string} productId - A törlendő termék azonosítója.
   * @returns {Promise<boolean>} Igaz, ha a törlés sikeres volt.
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
