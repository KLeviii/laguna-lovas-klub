import { supabase } from "./supabase";

/**
 * Submit a new contact form entry.
 * @param {Object} formData - { name, email, phone?, subject?, message }
 * @returns {Promise<void>}
 * @throws {Error} If the insert fails
 */
export async function submitContactForm(formData) {
  const { error } = await supabase
    .from("contact_submissions")
    .insert([formData]);

  if (error) {
    throw new Error("Hiba az üzenet küldése közben. Kérjük, próbáld újra később.");
  }
}

/**
 * Fetch all contact submissions for the admin panel.
 * @returns {Promise<Array>} Array of contact submission objects
 * @throws {Error} If the query fails
 */
export async function fetchContactSubmissions() {
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("id, name, email, phone, subject, message, is_read, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Hiba az üzenetek betöltése közben.");
  }

  return data || [];
}

/**
 * Update the read status of a contact submission.
 * Uses upsert (POST) instead of update (PATCH) to work around CORS preflight issues.
 * Only fetches non-personal fields to comply with GDPR data minimization.
 * @param {string} id - Contact submission UUID
 * @param {boolean} isRead - New read status
 * @returns {Promise<void>}
 * @throws {Error} If the update fails
 */
async function updateContactReadStatus(id, isRead) {
  const { error } = await supabase
    .from("contact_submissions")
    .update({ is_read: isRead })
    .eq("id", id);

  if (error) {
    throw new Error(`Hiba a jelölés közben.`);
  }
}

/**
 * Mark a contact submission as read.
 * @param {string} id - Contact submission UUID
 * @returns {Promise<void>}
 */
export async function markContactAsRead(id) {
  return updateContactReadStatus(id, true);
}

/**
 * Mark a contact submission as unread.
 * @param {string} id - Contact submission UUID
 * @returns {Promise<void>}
 */
export async function markContactAsUnread(id) {
  return updateContactReadStatus(id, false);
}

/**
 * Delete a contact submission.
 * @param {string} id - Contact submission UUID
 * @returns {Promise<void>}
 * @throws {Error} If the delete fails
 */
export async function deleteContactSubmission(id) {
  const { error } = await supabase
    .from("contact_submissions")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error("Hiba az üzenet törlése közben.");
  }
}
