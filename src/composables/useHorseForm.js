import { ref, computed } from "vue";
import { supabase } from "@/services/supabase";
import {
  createHorse,
  updateHorse,
  fetchHorseForEdit,
  fetchParentOptions,
} from "../services/horseService.js";

export function useHorseForm() {
  // Form fields
  const name = ref("");
  const gender = ref("");
  const birth_date = ref(new Date().getFullYear());
  const sire_id = ref(null);
  const dam_id = ref(null);
  const is_for_sale = ref(false);
  const description = ref("");
  const images = ref([]);
  const main_image_url = ref(null);
  const mainImageFile = ref(null);

  // State
  const loading = ref(false);
  const submitting = ref(false);
  const errors = ref({});
  const parentOptions = ref([]);
  const editingHorseId = ref(null);
  const imageUploading = ref(false);

  /**
   * Validate form
   */
  function validateForm() {
    const newErrors = {};

    if (!name.value.trim()) {
      newErrors.name = "Név kötelező";
    }

    if (!gender.value) {
      newErrors.gender = "Nem kiválasztása kötelező";
    }

    if (birth_date.value) {
      const year = parseInt(birth_date.value);
      const currentYear = new Date().getFullYear();
      if (year > currentYear) {
        newErrors.birth_date = "Születési év nem lehet a jövőben";
      }
      if (year < 1900) {
        newErrors.birth_date = "Születési év nincs realisztikusan";
      }
    }

    if (sire_id.value && dam_id.value && sire_id.value === dam_id.value) {
      newErrors.sire_id = "Apa és anya nem lehet ugyanaz a ló";
    }

    errors.value = newErrors;
    return Object.keys(newErrors).length === 0;
  }

  /**
   * Upload main image to Storage
   */
  async function uploadMainImage(file) {
    if (!file) return;

    imageUploading.value = true;
    try {
      // Validate file
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error("Fájl túl nagy (max 5MB)");
      }

      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        throw new Error("Érvénytelen fájltípus. Használj JPG, PNG vagy WebP");
      }

      // Generate filename
      const timestamp = Date.now();
      const ext = file.name.split(".").pop();
      const filename = `main-${timestamp}.${ext}`;
      const filePath = `temp/${filename}`;

      // Upload to Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("horse-images")
        .upload(filePath, file, { upsert: false });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("horse-images")
        .getPublicUrl(filePath);

      main_image_url.value = urlData.publicUrl;
      mainImageFile.value = file;
      errors.value.main_image = null;
    } catch (err) {
      errors.value.main_image = err.message;
      console.error("Error uploading image:", err);
    } finally {
      imageUploading.value = false;
    }
  }

  /**
   * Reset form
   */
  function resetForm() {
    name.value = "";
    gender.value = "";
    birth_date.value = new Date().getFullYear();
    sire_id.value = null;
    dam_id.value = null;
    is_for_sale.value = false;
    description.value = "";
    images.value = [];
    main_image_url.value = null;
    mainImageFile.value = null;
    errors.value = {};
    editingHorseId.value = null;
  }

  /**
   * Load horse data into form (for editing)
   */
  async function loadHorse(id) {
    loading.value = true;

    try {
      const horse = await fetchHorseForEdit(id);
      name.value = horse.name;
      gender.value = horse.gender;
      birth_date.value = horse.birth_date;
      sire_id.value = horse.sire_id;
      dam_id.value = horse.dam_id;
      is_for_sale.value = horse.is_for_sale;
      description.value = horse.description || "";
      images.value = horse.horse_images || [];
      editingHorseId.value = id;
      errors.value = {};
    } catch (err) {
      errors.value = { general: err.message };
    } finally {
      loading.value = false;
    }
  }

  /**
   * Load parent options for dropdowns
   */
  async function loadParentOptions() {
    try {
      parentOptions.value = await fetchParentOptions();
    } catch (err) {
      console.error("Error loading parent options:", err);
    }
  }

  /**
   * Submit form (create or update)
   */
  async function submitForm() {
    if (!validateForm()) return;

    submitting.value = true;

    try {
      // Build minimal required data
      const horseData = {
        name: name.value?.trim() || "",
        gender: gender.value || "",
        is_for_sale: Boolean(is_for_sale.value),
        description: description.value?.trim() || "",
      };

      // Add optional fields only if they have values
      if (birth_date.value) {
        const year = parseInt(birth_date.value);
        horseData.birth_date = `${year}-01-01`;
      }

      // Note: main_image_url is stored in Storage, not in DB horses table
      // We'll handle image storage separately after horse creation

      if (sire_id.value) {
        horseData.sire_id = sire_id.value;
      }

      if (dam_id.value) {
        horseData.dam_id = dam_id.value;
      }

      if (editingHorseId.value) {
        await updateHorse(editingHorseId.value, horseData);
      } else {
        await createHorse(horseData);
      }

      errors.value = {};
      return true;
    } catch (err) {
      console.error("Submit error:", err);
      errors.value = { general: err.message || "Hiba történt a mentéskor" };
      return false;
    } finally {
      submitting.value = false;
    }
  }

  const isEditing = computed(() => !!editingHorseId.value);
  const formTitle = computed(() =>
    isEditing.value ? `Ló szerkesztése: ${name.value}` : "Új ló",
  );

  return {
    // State (aliased for component compatibility)
    formErrors: errors,
    formSubmitting: submitting,
    loading,
    parentOptions,
    editingHorseId,
    images,
    imageUploading,
    // Computed
    isEditing,
    formTitle,
    // Methods
    validateForm,
    resetForm,
    loadHorse,
    loadParentOptions,
    submitForm,
    uploadMainImage,
    // Individual fields for v-model
    name,
    gender,
    birth_date,
    sire_id,
    dam_id,
    is_for_sale,
    description,
    main_image_url,
  };
}
