import { supabase } from "./supabase";

/**
 * Fetch all competitions with nested results and horse names
 * @returns {Promise<Array>}
 */
export async function fetchAllCompetitions() {
  const { data, error } = await supabase
    .from("competitions")
    .select(`
      id,
      name,
      location,
      start_date,
      end_date,
      image_url,
      description,
      competition_results (
        id,
        jockey_name,
        discipline,
        placement,
        achievement,
        horse:horse_id (
          id,
          name
        )
      )
    `)
    .order("start_date", { ascending: false });

  if (error) {
    console.error("Error fetching competitions:", error);
    throw new Error(`Failed to fetch competitions: ${error.message}`);
  }

  return data || [];
}

/**
 * Fetch latest competitions (for homepage sidebar)
 * @param {number} limit - Max number of competitions to fetch
 * @returns {Promise<Array>}
 */
export async function fetchLatestCompetitions(limit = 5) {
  const { data, error } = await supabase
    .from("competitions")
    .select("id, name, start_date, image_url")
    .order("start_date", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching latest competitions:", error);
    throw new Error(`Failed to fetch latest competitions: ${error.message}`);
  }

  return data || [];
}

/**
 * Fetch a single competition by ID with nested results and horse names
 * @param {string} id - Competition UUID
 * @returns {Promise<Object|null>}
 */
export async function fetchCompetitionById(id) {
  const { data, error } = await supabase
    .from("competitions")
    .select(`
      id,
      name,
      location,
      start_date,
      end_date,
      image_url,
      description,
      competition_results (
        id,
        jockey_name,
        discipline,
        placement,
        achievement,
        horse_id,
        horse:horse_id (
          id,
          name
        )
      )
    `)
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching competition:", error);
    throw new Error(`Failed to fetch competition: ${error.message}`);
  }

  return data || null;
}

/**
 * Create a new competition
 * @param {Object} data - { name, location, start_date, end_date, image_url, description }
 * @returns {Promise<Object>}
 */
export async function createCompetition(data) {
  const { data: created, error } = await supabase
    .from("competitions")
    .insert([data])
    .select("id, name, location, start_date, end_date, image_url, description")
    .single();

  if (error) {
    console.error("Error creating competition:", error);
    throw new Error(`Failed to create competition: ${error.message}`);
  }

  return created;
}

/**
 * Update a competition
 * @param {string} id - Competition UUID
 * @param {Object} data - Fields to update
 * @returns {Promise<Object>}
 */
export async function updateCompetition(id, data) {
  // Use upsert (POST) instead of update (PATCH) to work around CORS
  // preflight blocking PATCH on the competitions table
  const { data: updated, error } = await supabase
    .from("competitions")
    .upsert({ id, ...data })
    .select("id, name, location, start_date, end_date, image_url, description")
    .single();

  if (error) {
    console.error("Error updating competition:", error);
    throw new Error(`Failed to update competition: ${error.message}`);
  }

  return updated;
}

/**
 * Delete a competition (hard delete, cascade deletes results)
 * @param {string} id - Competition UUID
 * @returns {Promise<void>}
 */
export async function deleteCompetition(id) {
  const { error } = await supabase
    .from("competitions")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting competition:", error);
    throw new Error(`Failed to delete competition: ${error.message}`);
  }
}

/**
 * Create a competition result
 * @param {Object} data - { competition_id, jockey_name, discipline, placement, achievement, horse_id }
 * @returns {Promise<Object>}
 */
export async function createCompetitionResult(data) {
  const { data: created, error } = await supabase
    .from("competition_results")
    .insert([data])
    .select("id, competition_id, jockey_name, discipline, placement, achievement, horse_id")
    .single();

  if (error) {
    console.error("Error creating competition result:", error);
    throw new Error(`Failed to create competition result: ${error.message}`);
  }

  return created;
}

/**
 * Delete a competition result
 * @param {string} id - Result UUID
 * @returns {Promise<void>}
 */
export async function deleteCompetitionResult(id) {
  const { error } = await supabase
    .from("competition_results")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting competition result:", error);
    throw new Error(`Failed to delete competition result: ${error.message}`);
  }
}

/**
 * Upload a competition image to Supabase Storage
 * @param {File} file - Image file to upload
 * @returns {Promise<string>} Public URL of uploaded image
 */
export async function uploadCompetitionImage(file) {
  if (!file) {
    throw new Error("No file provided");
  }

  if (file.size > 50 * 1024 * 1024) {
    throw new Error("File too large (max 50MB)");
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const fileName = `${Date.now()}.${ext}`;
  const { data, error: uploadError } = await supabase.storage
    .from("competition-images")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("Error uploading image:", uploadError);
    throw new Error(`Failed to upload image: ${uploadError.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from("competition-images")
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}
