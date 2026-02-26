import { supabase } from "./supabase";

export async function submitContactForm(formData) {
  const { error } = await supabase
    .from("contact_submissions")
    .insert([formData]);

  if (error) {
    console.error("Error submitting contact form:", error);
    throw new Error("Hiba az üzenet küldése közben. Kérjük, próbáld újra később.");
  }
}

export async function fetchContactSubmissions() {
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("id, name, email, phone, subject, message, is_read, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching contact submissions:", error);
    throw new Error("Hiba az üzenetek betöltése közben.");
  }

  return data || [];
}

export async function markContactAsRead(id) {
  // Use upsert (POST) instead of update (PATCH) to work around CORS
  // preflight blocking PATCH requests
  const { data: existing, error: fetchError } = await supabase
    .from("contact_submissions")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("Error fetching contact for update:", fetchError);
    throw new Error("Hiba az olvasottá jelölés közben.");
  }

  const { error } = await supabase
    .from("contact_submissions")
    .upsert({ ...existing, is_read: true });

  if (error) {
    console.error("Error marking contact as read:", error);
    throw new Error("Hiba az olvasottá jelölés közben.");
  }
}

export async function markContactAsUnread(id) {
  const { data: existing, error: fetchError } = await supabase
    .from("contact_submissions")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("Error fetching contact for update:", fetchError);
    throw new Error("Hiba az olvasatlanná jelölés közben.");
  }

  const { error } = await supabase
    .from("contact_submissions")
    .upsert({ ...existing, is_read: false });

  if (error) {
    console.error("Error marking contact as unread:", error);
    throw new Error("Hiba az olvasatlanná jelölés közben.");
  }
}

export async function deleteContactSubmission(id) {
  const { error } = await supabase
    .from("contact_submissions")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting contact submission:", error);
    throw new Error("Hiba az üzenet törlése közben.");
  }
}
