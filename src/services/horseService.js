import { supabase } from "./supabase";

/**
 * Fetch all horses with optional filters
 * @param {Object} filters - { available_only: boolean }
 * @returns {Promise<Array>}
 */
export async function fetchAllHorses(filters = {}) {
  let query = supabase
    .from("horses")
    .select("id, name, gender, birth_date, is_for_sale, main_img_url");

  if (filters.available_only) {
    query = query.eq("is_for_sale", true);
  }

  const { data, error } = await query.order("name", { ascending: true });

  if (error) {
    console.error("Error fetching horses:", error);
    throw new Error("Failed to fetch horses");
  }

  return data || [];
}

/**
 * Fetch single horse with full details and relations
 * @param {string} id - horse UUID
 * @returns {Promise<Object>}
 */
export async function fetchHorseById(id) {
  const { data, error } = await supabase
    .from("horses")
    .select(
      `
      id,
      name,
      gender,
      birth_date,
      is_for_sale,
      main_img_url,
      description,
      sire:horses!sire_id(id, name),
      dam:horses!dam_id(id, name),
      images:horse_images(id, image_url, alt_text, display_order)
    `,
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching horse:", error);
    throw new Error(`Failed to fetch horse with ID ${id}`);
  }

  return data;
}

/**
 * Create new horse
 * @param {Object} horseData - { name, gender, is_for_sale, ... }
 * @returns {Promise<Object>}
 */
export async function createHorse(horseData) {
  // Remove main_image_url if it exists in horseData (not a real column)
  const cleanData = { ...horseData };
  delete cleanData.main_image_url;

  const { data, error } = await supabase
    .from("horses")
    .insert([cleanData])
    .select("id, name, gender, birth_date, is_for_sale, main_img_url, description")
    .single();

  if (error) {
    console.error("Create horse error:", error);
    throw new Error(error.message || "Failed to create horse");
  }
  return data;
}

/**
 * Update existing horse
 * @param {string} id - horse UUID
 * @param {Object} updates - fields to update
 * @returns {Promise<Object>}
 */
export async function updateHorse(id, updates) {
  const { data, error } = await supabase
    .from("horses")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete horse (cascade deletes images)
 * @param {string} id - horse UUID
 * @returns {Promise<void>}
 */
export async function deleteHorse(id) {
  // First, delete images from Storage
  const { data: images, error: imagesError } = await supabase
    .from("horse_images")
    .select("id, image_url")
    .eq("horse_id", id);

  if (imagesError) throw imagesError;

  // Delete each image from Storage
  for (const img of images || []) {
    const pathMatch = img.image_url.match(/horse-images\/(.+)$/);
    if (pathMatch) {
      await supabase.storage.from("horse-images").remove([pathMatch[1]]);
    }
  }

  // Delete horse (DB cascade handles horse_images rows)
  const { error: deleteError } = await supabase
    .from("horses")
    .delete()
    .eq("id", id);

  if (deleteError) throw deleteError;
}

/**
 * Fetch all horses (for sire/dam dropdown)
 * @returns {Promise<Array>}
 */
export async function fetchParentOptions() {
  const { data, error } = await supabase
    .from("horses")
    .select("id, name, gender, birth_date")
    .order("name", { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Fetch single horse for editing (with images)
 * @param {string} id - horse UUID
 * @returns {Promise<Object>}
 */
export async function fetchHorseForEdit(id) {
  const { data, error } = await supabase
    .from("horses")
    .select(
      `
      id,
      name,
      gender,
      birth_date,
      is_for_sale,
      description,
      sire_id,
      dam_id,
      horse_images(id, image_url, alt_text, display_order)
    `
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}
