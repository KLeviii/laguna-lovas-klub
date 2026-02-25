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
 * Fetch full pedigree tree (all available generations) for a horse
 * @param {string} horseId - horse UUID
 * @returns {Promise<{ root: Object, byId: Object }>}
 */
export async function fetchPedigree(horseId) {
  const { data: root, error } = await supabase
    .from("horses")
    .select("id, name, gender, sire_id, dam_id")
    .eq("id", horseId)
    .single();

  if (error || !root) return null;

  const byId = { [root.id]: root };
  let currentIds = [root.sire_id, root.dam_id].filter(Boolean);
  let depth = 0;
  const MAX_DEPTH = 10;

  while (currentIds.length > 0 && depth < MAX_DEPTH) {
    const uniqueIds = [...new Set(currentIds)].filter((id) => !byId[id]);
    if (uniqueIds.length === 0) break;

    const { data: ancestors } = await supabase
      .from("horses")
      .select("id, name, gender, sire_id, dam_id")
      .in("id", uniqueIds);

    if (!ancestors || ancestors.length === 0) break;

    const nextIds = [];
    for (const ancestor of ancestors) {
      byId[ancestor.id] = ancestor;
      if (ancestor.sire_id) nextIds.push(ancestor.sire_id);
      if (ancestor.dam_id) nextIds.push(ancestor.dam_id);
    }

    currentIds = nextIds;
    depth++;
  }

  return { root, byId };
}

/**
 * Fetch horses for sale (for homepage section)
 * @param {number} limit - Max number of horses to fetch
 * @returns {Promise<Array>}
 */
export async function fetchHorsesForSale(limit = 2) {
  const { data, error } = await supabase
    .from("horses")
    .select("id, name, description, main_img_url")
    .eq("is_for_sale", true)
    .order("name", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error fetching horses for sale:", error);
    throw new Error("Failed to fetch horses for sale");
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
      `id, name, gender, birth_date, is_for_sale, main_img_url, description,
       sire_id, dam_id,
       images:horse_images(id, image_url, display_order)`,
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching horse:", error);
    throw new Error(`Failed to fetch horse with ID ${id}`);
  }

  // Fetch sire/dam names separately to avoid self-join issues
  const [sire, dam] = await Promise.all([
    data.sire_id ? supabase.from("horses").select("id, name").eq("id", data.sire_id).single().then(r => r.data) : null,
    data.dam_id  ? supabase.from("horses").select("id, name").eq("id", data.dam_id).single().then(r => r.data)  : null,
  ]);

  // If no images in horse_images table but has main_img_url, include it as first image
  const images = data.images && data.images.length > 0 ? data.images : [];
  if (images.length === 0 && data.main_img_url) {
    images.push({
      id: 'main',
      image_url: data.main_img_url,
      display_order: 0,
      alt_text: data.name,
    });
  }

  return { ...data, images, sire, dam };
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
    .upsert({ id, ...updates })
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
 * Fetch horses of the same gender (for related horses section)
 * @param {string} gender - gender to match ('mén' or 'kanca')
 * @param {string} excludeId - horse ID to exclude (current horse)
 * @param {number} limit - max results
 * @returns {Promise<Array>}
 */
export async function fetchRelatedHorses(gender, excludeId, limit = 4) {
  const { data, error } = await supabase
    .from('horses')
    .select('id, name, gender, birth_date, is_for_sale, main_img_url')
    .eq('gender', gender)
    .neq('id', excludeId)
    .limit(limit)

  if (error) {
    console.error('Error fetching related horses:', error)
    throw new Error('Failed to fetch related horses')
  }

  return data || []
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
      main_img_url,
      horse_images(id, image_url, display_order)
    `
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}
