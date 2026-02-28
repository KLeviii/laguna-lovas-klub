import { supabase } from "./supabase";

/**
 * Upload a single image to Supabase Storage
 * @param {string} horseId - horse UUID
 * @param {File} file - image file object
 * @param {number} displayOrder - position in gallery
 * @returns {Promise<Object>} - { id, horse_id, image_url, ... }
 */
export async function uploadImage(horseId, file, displayOrder = 0) {
  // Validate file
  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    throw new Error("File too large (max 50MB)");
  }

  const validTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!validTypes.includes(file.type)) {
    throw new Error("Invalid file type. Use JPG, PNG, or WebP");
  }

  // Generate filename with safe characters only
  const timestamp = Date.now();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  // Use only timestamp + extension to avoid special character issues
  const filename = `${timestamp}.${ext}`;
  const filePath = `${horseId}/${filename}`;

  try {
    // Upload to Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("horse-images")
      .upload(filePath, file, { upsert: false });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("horse-images")
      .getPublicUrl(filePath);

    const imageUrl = urlData.publicUrl;

    // Insert into horse_images table
    const { data: imageData, error: insertError } = await supabase
      .from("horse_images")
      .insert({
        horse_id: horseId,
        image_url: imageUrl,
        alt_text: file.name.split(".")[0],
        display_order: displayOrder,
      })
      .select()
      .single();

    if (insertError) {
      // Rollback: delete uploaded file
      await supabase.storage.from("horse-images").remove([filePath]);
      throw insertError;
    }

    return imageData;
  } catch (err) {
    throw err;
  }
}

/**
 * Delete an image from Storage and database
 * @param {string} imageId - horse_images table UUID
 * @param {string} imageUrl - full public URL of image
 * @returns {Promise<void>}
 */
export async function deleteImage(imageId, imageUrl) {
  try {
    // Extract file path from URL
    const pathMatch = imageUrl.match(/horse-images\/(.+)$/);
    if (!pathMatch) throw new Error("Invalid image URL");
    const filePath = pathMatch[1];

    // Delete from Storage
    const { error: deleteError } = await supabase.storage
      .from("horse-images")
      .remove([filePath]);

    if (deleteError) throw deleteError;

    // Delete from database
    const { error: dbError } = await supabase
      .from("horse_images")
      .delete()
      .eq("id", imageId);

    if (dbError) throw dbError;
  } catch (err) {
    throw err;
  }
}

/**
 * Update image display order
 * @param {string} imageId - horse_images table UUID
 * @param {number} displayOrder - new order
 * @returns {Promise<Object>}
 */
export async function updateImageOrder(imageId, displayOrder) {
  const { data, error } = await supabase
    .from("horse_images")
    .upsert({ id: imageId, display_order: displayOrder })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update image alt text
 * @param {string} imageId - horse_images table UUID
 * @param {string} altText - new alt text
 * @returns {Promise<Object>}
 */
export async function updateImageAltText(imageId, altText) {
  const { data, error } = await supabase
    .from("horse_images")
    .upsert({ id: imageId, alt_text: altText })
    .select()
    .single();

  if (error) throw error;
  return data;
}
