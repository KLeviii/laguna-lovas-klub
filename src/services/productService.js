import { supabase } from './supabase'

/**
 * Fetch all products with category information.
 * Optionally filter by availability.
 * @param {Object} filters - Filter options
 * @param {boolean} filters.available_only - Show only available products
 * @returns {Promise<Array>} Array of product objects with category details
 */
export async function fetchAllProducts(filters = {}) {
  let query = supabase
    .from('products')
    .select(`
      id,
      name,
      description,
      price_huf,
      image_url,
      is_available,
      created_at,
      category:category_id(id, name, slug)
    `)

  if (filters.available_only) {
    query = query.neq('is_available', false)
  }

  const { data, error } = await query.order('name', { ascending: true })

  if (error) {
    console.error('Error fetching products:', error)
    throw new Error(`Failed to fetch products: ${error.message}`)
  }

  return data || []
}

/**
 * Fetch a single product by ID with full details.
 * @param {string} productId - Product UUID
 * @returns {Promise<Object|null>} Product object with related category, or null if not found
 */
export async function fetchProductById(productId) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      description,
      price_huf,
      image_url,
      is_available,
      category:category_id(id, name, slug),
      created_at
    `)
    .eq('id', productId)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching product:', error)
    throw new Error(`Failed to fetch product: ${error.message}`)
  }

  return data || null
}

/**
 * Fetch all product categories ordered by display order.
 * @returns {Promise<Array>} Array of category objects
 */
export async function fetchProductCategories() {
  const { data, error } = await supabase
    .from('product_categories')
    .select('id, name, slug, description, display_order')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    throw new Error(`Failed to fetch categories: ${error.message}`)
  }

  return data || []
}

/**
 * Fetch related products from the same category.
 * @param {string} categoryId - Category UUID
 * @param {string} excludeProductId - Product ID to exclude from results
 * @param {number} limit - Maximum number of results (default: 4)
 * @returns {Promise<Array>} Array of related product objects
 */
export async function fetchRelatedProducts(categoryId, excludeProductId = null, limit = 4) {
  let query = supabase
    .from('products')
    .select(`
      id,
      name,
      image_url,
      price_huf,
      is_available
    `)
    .eq('category_id', categoryId)
    .limit(limit)

  if (excludeProductId) {
    query = query.neq('id', excludeProductId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching related products:', error)
    throw new Error(`Failed to fetch related products: ${error.message}`)
  }

  return data || []
}

/**
 * Create a new product.
 * @param {Object} productData - { category_id, name, description, price_huf, image_url, is_available }
 * @returns {Promise<Object>} Created product object
 */
export async function createProduct(productData) {
  const { data, error } = await supabase
    .from('products')
    .insert([productData])
    .select('id, name, description, price_huf, image_url, is_available, category_id, created_at')
    .single()

  if (error) {
    console.error('Error creating product:', error)
    throw new Error(`Failed to create product: ${error.message}`)
  }

  return data
}

/**
 * Update a product.
 * @param {string} productId - Product UUID
 * @param {Object} productData - Fields to update
 * @returns {Promise<Object>} Updated product object
 */
export async function updateProduct(productId, productData) {
  const { data, error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', productId)
    .select('id, name, description, price_huf, image_url, is_available, category_id, created_at')
    .single()

  if (error) {
    console.error('Error updating product:', error)
    throw new Error(`Failed to update product: ${error.message}`)
  }

  return data
}

/**
 * Soft delete a product by marking it as unavailable.
 * @param {string} productId - Product UUID
 * @returns {Promise<Object>} Updated product object
 */
export async function deleteProduct(productId) {
  return updateProduct(productId, { is_available: false })
}

/**
 * Create a new product category.
 * @param {Object} categoryData - { name, slug, description, display_order }
 * @returns {Promise<Object>} Created category object
 */
export async function createProductCategory(categoryData) {
  const { data, error } = await supabase
    .from('product_categories')
    .insert([categoryData])
    .select('id, name, slug, description, display_order')
    .single()

  if (error) {
    console.error('Error creating category:', error)
    throw new Error(`Failed to create category: ${error.message}`)
  }

  return data
}

/**
 * Update a product category.
 * @param {string} categoryId - Category UUID
 * @param {Object} categoryData - Fields to update
 * @returns {Promise<Object>} Updated category object
 */
export async function updateProductCategory(categoryId, categoryData) {
  const { data, error } = await supabase
    .from('product_categories')
    .update(categoryData)
    .eq('id', categoryId)
    .select('id, name, slug, description, display_order')
    .single()

  if (error) {
    console.error('Error updating category:', error)
    throw new Error(`Failed to update category: ${error.message}`)
  }

  return data
}

/**
 * Delete a product category.
 * @param {string} categoryId - Category UUID
 * @returns {Promise<void>}
 */
export async function deleteProductCategory(categoryId) {
  const { error } = await supabase
    .from('product_categories')
    .delete()
    .eq('id', categoryId)

  if (error) {
    console.error('Error deleting category:', error)
    throw new Error(`Failed to delete category: ${error.message}`)
  }
}

/**
 * Upload a product image to Supabase Storage.
 * @param {File} file - Image file to upload
 * @returns {Promise<string>} Public URL of uploaded image
 */
export async function uploadProductImage(file) {
  if (!file) {
    throw new Error('No file provided')
  }

  // Validate file size (50MB max)
  const maxSize = 50 * 1024 * 1024 // 50MB
  if (file.size > maxSize) {
    throw new Error('File too large (max 50MB)')
  }

  // Generate filename with safe characters only
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
  const fileName = `${Date.now()}.${ext}`
  const { data, error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    console.error('Error uploading image:', uploadError)
    throw new Error(`Failed to upload image: ${uploadError.message}`)
  }

  const { data: publicUrlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(data.path)

  return publicUrlData.publicUrl
}
