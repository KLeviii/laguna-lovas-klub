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

export function useProductForm() {
  // Product form state
  const productName = ref('')
  const productDescription = ref('')
  const productPrice = ref('')
  const productPriceFocused = ref(false)
  const selectedCategoryId = ref(null)
  const isProductAvailable = ref(true)
  const productImageUrl = ref('')
  const productImageFile = ref(null)

  // Category form state
  const categoryName = ref('')
  const categorySlug = ref('')
  const categoryDescription = ref('')
  const categoryDisplayOrder = ref(0)

  // Loading/error state
  const loading = ref(false)
  const error = ref(null)
  const uploadingImage = ref(false)

  // Track if editing
  const editingProductId = ref(null)
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
    selectedCategoryId.value = product.category_id
    isProductAvailable.value = product.is_available
    productImageUrl.value = product.image_url || ''
    productImageFile.value = null
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

      const productData = {
        name: productName.value.trim(),
        description: productDescription.value.trim(),
        price_huf: parseInt(productPrice.value),
        category_id: selectedCategoryId.value,
        is_available: isProductAvailable.value,
        image_url: imageUrl || null,
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
      console.error('Error saving product:', err)
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
      console.error('Error deleting product:', err)
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
      console.error('Error saving category:', err)
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
      console.error('Error deleting category:', err)
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

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      error.value = 'A fájl ne legyen nagyobb 5MB-nál'
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
