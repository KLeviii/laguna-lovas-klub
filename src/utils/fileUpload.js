import { supabase } from '@/services/supabase'

/**
 * Default allowed image MIME types
 * @type {string[]}
 */
const DEFAULT_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

/**
 * Validate a file before upload.
 * @param {File} file - The file to validate
 * @param {Object} options - Validation options
 * @param {number} [options.maxSizeMB=50] - Maximum file size in megabytes
 * @param {string[]} [options.validTypes] - Allowed MIME types (defaults to JPEG/PNG/WebP)
 * @throws {Error} If file is null, too large, or invalid type
 * @example
 * validateFile(imageFile, { maxSizeMB: 5, validTypes: ['image/jpeg', 'image/png'] })
 */
export function validateFile(file, { maxSizeMB = 50, validTypes = DEFAULT_IMAGE_TYPES } = {}) {
  if (!file) {
    throw new Error('Nincs fájl kiválasztva')
  }

  const maxSize = maxSizeMB * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error(`A fájl túl nagy (maximum ${maxSizeMB}MB)`)
  }

  if (validTypes && validTypes.length > 0 && !validTypes.includes(file.type)) {
    const allowed = validTypes.map(t => t.split('/')[1]?.toUpperCase()).join(', ')
    throw new Error(`Nem támogatott fájltípus. Engedélyezett: ${allowed}`)
  }
}

/**
 * Generate a safe, unique filename using a timestamp.
 * Strips special characters from original name and prepends a timestamp.
 * @param {File} file - The original file
 * @param {string} [prefix=''] - Optional prefix for the filename path
 * @returns {string} Safe filename (e.g. "1709312345678.jpg" or "prefix/1709312345678.jpg")
 * @example
 * generateSafeFilename(file) // => "1709312345678.jpg"
 * generateSafeFilename(file, 'horse-uuid') // => "horse-uuid/1709312345678.jpg"
 */
export function generateSafeFilename(file, prefix = '') {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const fileName = `${Date.now()}.${ext}`
  return prefix ? `${prefix}/${fileName}` : fileName
}

/**
 * Upload a file to Supabase Storage and return its public URL.
 * @param {string} bucket - Storage bucket name (e.g. 'product-images')
 * @param {string} filePath - Path within the bucket
 * @param {File} file - File to upload
 * @param {Object} [options] - Upload options
 * @param {string} [options.cacheControl='3600'] - Cache-Control header
 * @param {boolean} [options.upsert=false] - Whether to overwrite existing files
 * @returns {Promise<string>} Public URL of the uploaded file
 * @throws {Error} If upload fails
 * @example
 * const url = await uploadToStorage('product-images', '1709312345678.jpg', file)
 */
export async function uploadToStorage(bucket, filePath, file, options = {}) {
  const { cacheControl = '3600', upsert = false } = options

  const { data, error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { cacheControl, upsert })

  if (uploadError) {
    throw new Error(`Feltöltési hiba: ${uploadError.message}`)
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path)

  return publicUrlData.publicUrl
}
