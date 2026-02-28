import { ref, computed } from 'vue'
import {
  createProduct,
  updateProduct,
  deleteProduct,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
  uploadProductImage,
} from '@/services/productService.js'

/**
 * @module useProductForm
 * Composable a termék és kategória űrlapok kezeléséhez az admin felületen.
 * Tartalmazza a validációt, kép feltöltést, CRUD műveleteket termékekhez és kategóriákhoz.
 */

/**
 * Composable a termék és kategória űrlapok állapotának, validációjának és mentési logikájának kezeléséhez.
 * @returns {{
 *   productName: import('vue').Ref<string>,
 *   productDescription: import('vue').Ref<string>,
 *   productPrice: import('vue').Ref<string|number>,
 *   productPriceFocused: import('vue').Ref<boolean>,
 *   selectedCategoryId: import('vue').Ref<string|null>,
 *   isProductAvailable: import('vue').Ref<boolean>,
 *   productImageUrl: import('vue').Ref<string>,
 *   productImageFile: import('vue').Ref<File|null>,
 *   productStock: import('vue').Ref<number>,
 *   formattedPrice: import('vue').ComputedRef<string>,
 *   editingProductId: import('vue').Ref<string|null>,
 *   categoryName: import('vue').Ref<string>,
 *   categorySlug: import('vue').Ref<string>,
 *   categoryDescription: import('vue').Ref<string>,
 *   categoryDisplayOrder: import('vue').Ref<number>,
 *   editingCategoryId: import('vue').Ref<string|null>,
 *   loading: import('vue').Ref<boolean>,
 *   error: import('vue').Ref<string|null>,
 *   uploadingImage: import('vue').Ref<boolean>,
 *   clearProductForm: () => void,
 *   loadProductForEdit: (product: Object) => void,
 *   saveProduct: () => Promise<boolean>,
 *   removeProduct: (productId: string) => Promise<boolean>,
 *   handleImageSelect: (file: File|null) => void,
 *   clearCategoryForm: () => void,
 *   loadCategoryForEdit: (category: Object) => void,
 *   saveCategory: () => Promise<boolean>,
 *   removeCategory: (categoryId: string) => Promise<boolean>
 * }}
 */
export function useProductForm() {
  // Product form state
  /** @type {import('vue').Ref<string>} A termék neve. */
  const productName = ref('')
  /** @type {import('vue').Ref<string>} A termék leírása. */
  const productDescription = ref('')
  /** @type {import('vue').Ref<string|number>} A termék ára HUF-ban. */
  const productPrice = ref('')
  /** @type {import('vue').Ref<boolean>} Az ár mező fókuszban van-e (formázás vezérléséhez). */
  const productPriceFocused = ref(false)
  /** @type {import('vue').Ref<string|null>} A kiválasztott kategória azonosítója. */
  const selectedCategoryId = ref(null)
  /** @type {import('vue').Ref<boolean>} A termék elérhető-e. */
  const isProductAvailable = ref(true)
  /** @type {import('vue').Ref<string>} A termék kép URL-je. */
  const productImageUrl = ref('')
  /** @type {import('vue').Ref<File|null>} A kiválasztott kép fájl (feltöltés előtt). */
  const productImageFile = ref(null)
  /** @type {import('vue').Ref<number>} A termék készleten lévő darabszáma. */
  const productStock = ref(0)

  // Category form state
  /** @type {import('vue').Ref<string>} A kategória neve. */
  const categoryName = ref('')
  /** @type {import('vue').Ref<string>} A kategória slug-ja (URL-barát azonosító). */
  const categorySlug = ref('')
  /** @type {import('vue').Ref<string>} A kategória leírása. */
  const categoryDescription = ref('')
  /** @type {import('vue').Ref<number>} A kategória megjelenítési sorrendje. */
  const categoryDisplayOrder = ref(0)

  // Loading/error state
  /** @type {import('vue').Ref<boolean>} Töltési állapot jelző. */
  const loading = ref(false)
  /** @type {import('vue').Ref<string|null>} Az utolsó hiba üzenete. */
  const error = ref(null)
  /** @type {import('vue').Ref<boolean>} Kép feltöltés folyamatban jelző. */
  const uploadingImage = ref(false)

  // Track if editing
  /** @type {import('vue').Ref<string|null>} A szerkesztés alatt álló termék ID-ja. */
  const editingProductId = ref(null)
  /** @type {import('vue').Ref<string|null>} A szerkesztés alatt álló kategória ID-ja. */
  const editingCategoryId = ref(null)

  // Format price with Hungarian number format
  const formattedPrice = computed(() => {
    if (!productPrice.value) return ''
    return parseInt(productPrice.value).toLocaleString('hu-HU')
  })

  // Clear all product form fields
  const clearProductForm = () => {
    productName.value = ''
    productDescription.value = ''
    productPrice.value = ''
    selectedCategoryId.value = null
    isProductAvailable.value = true
    productImageUrl.value = ''
    productImageFile.value = null
    productStock.value = 0
    editingProductId.value = null
    error.value = null
  }

  // Clear all category form fields
  const clearCategoryForm = () => {
    categoryName.value = ''
    categorySlug.value = ''
    categoryDescription.value = ''
    categoryDisplayOrder.value = 0
    editingCategoryId.value = null
    error.value = null
  }

  // Load product for editing
  const loadProductForEdit = (product) => {
    productName.value = product.name
    productDescription.value = product.description || ''
    productPrice.value = product.price_huf
    selectedCategoryId.value = product.category?.id || product.category_id
    productImageUrl.value = product.image_url || ''
    productImageFile.value = null
    productStock.value = product.stock || 0
    isProductAvailable.value = productStock.value > 0
    editingProductId.value = product.id
    error.value = null
  }

  // Load category for editing
  const loadCategoryForEdit = (category) => {
    categoryName.value = category.name
    categorySlug.value = category.slug
    categoryDescription.value = category.description || ''
    categoryDisplayOrder.value = category.display_order || 0
    editingCategoryId.value = category.id
    error.value = null
  }

  // Save product (create or update)
  const saveProduct = async () => {
    loading.value = true
    error.value = null

    try {
      // Validate form
      if (!productName.value.trim()) {
        throw new Error('A termék neve kötelező')
      }
      if (!selectedCategoryId.value) {
        throw new Error('Válassz ki egy kategóriát')
      }
      if (!productPrice.value || productPrice.value <= 0) {
        throw new Error('Az ár kötelező és nullánál nagyobb')
      }

      let imageUrl = productImageUrl.value

      // Upload image if new file selected
      if (productImageFile.value) {
        uploadingImage.value = true
        imageUrl = await uploadProductImage(productImageFile.value)
      }

      const stockValue = parseInt(productStock.value) || 0

      const productData = {
        name: productName.value.trim(),
        description: productDescription.value.trim(),
        price_huf: parseInt(productPrice.value),
        category_id: selectedCategoryId.value,
        is_available: stockValue > 0,
        image_url: imageUrl || null,
        stock: stockValue,
      }

      if (editingProductId.value) {
        // Update
        await updateProduct(editingProductId.value, productData)
      } else {
        // Create
        await createProduct(productData)
      }

      clearProductForm()
      return true
    } catch (err) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
      uploadingImage.value = false
    }
  }

  // Delete product (soft delete)
  const removeProduct = async (productId) => {
    loading.value = true
    error.value = null

    try {
      await deleteProduct(productId)
      return true
    } catch (err) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  // Save category (create or update)
  const saveCategory = async () => {
    loading.value = true
    error.value = null

    try {
      // Validate form
      if (!categoryName.value.trim()) {
        throw new Error('A kategória neve kötelező')
      }
      if (!categorySlug.value.trim()) {
        throw new Error('A slug kötelező')
      }

      const categoryData = {
        name: categoryName.value.trim(),
        slug: categorySlug.value.trim().toLowerCase(),
        description: categoryDescription.value.trim(),
        display_order: parseInt(categoryDisplayOrder.value) || 0,
      }

      if (editingCategoryId.value) {
        // Update
        await updateProductCategory(editingCategoryId.value, categoryData)
      } else {
        // Create
        await createProductCategory(categoryData)
      }

      clearCategoryForm()
      return true
    } catch (err) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  // Delete category
  const removeCategory = async (categoryId) => {
    loading.value = true
    error.value = null

    try {
      await deleteProductCategory(categoryId)
      return true
    } catch (err) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  // Handle image file selection
  const handleImageSelect = (file) => {
    if (!file) {
      productImageFile.value = null
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      error.value = 'Csak képfájlok engedélyezettek'
      return
    }

    // Validate file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      error.value = 'A fájl ne legyen nagyobb 50MB-nál'
      return
    }

    productImageFile.value = file
    error.value = null
  }

  return {
    // Product form
    productName,
    productDescription,
    productPrice,
    productPriceFocused,
    selectedCategoryId,
    isProductAvailable,
    productImageUrl,
    productImageFile,
    productStock,
    formattedPrice,
    editingProductId,

    // Category form
    categoryName,
    categorySlug,
    categoryDescription,
    categoryDisplayOrder,
    editingCategoryId,

    // State
    loading,
    error,
    uploadingImage,

    // Methods - Product
    clearProductForm,
    loadProductForEdit,
    saveProduct,
    removeProduct,
    handleImageSelect,

    // Methods - Category
    clearCategoryForm,
    loadCategoryForEdit,
    saveCategory,
    removeCategory,
  }
}
