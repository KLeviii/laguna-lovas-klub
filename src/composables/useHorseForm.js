import { ref, computed } from "vue";
import { supabase } from "@/services/supabase";
import {
  createHorse,
  updateHorse,
  fetchHorseForEdit,
  fetchParentOptions,
} from "../services/horseService.js";

/**
 * @module useHorseForm
 * Composable a ló létrehozó/szerkesztő űrlap kezeléséhez.
 * Tartalmazza a validációt, kép feltöltést, és a mentés logikáját.
 */

/**
 * Composable a ló űrlap állapotának és logikájának kezeléséhez
 * (létrehozás és szerkesztés egyaránt).
 * @returns {{
 *   formErrors: import('vue').Ref<Object>,
 *   formSubmitting: import('vue').Ref<boolean>,
 *   loading: import('vue').Ref<boolean>,
 *   parentOptions: import('vue').Ref<Array<Object>>,
 *   sireOptions: import('vue').ComputedRef<Array<Object>>,
 *   damOptions: import('vue').ComputedRef<Array<Object>>,
 *   editingHorseId: import('vue').Ref<string|null>,
 *   images: import('vue').Ref<Array<Object>>,
 *   imageUploading: import('vue').Ref<boolean>,
 *   isEditing: import('vue').ComputedRef<boolean>,
 *   formTitle: import('vue').ComputedRef<string>,
 *   validateForm: () => boolean,
 *   resetForm: () => void,
 *   loadHorse: (id: string) => Promise<void>,
 *   loadParentOptions: () => Promise<void>,
 *   submitForm: () => Promise<boolean|undefined>,
 *   uploadMainImage: (file: File) => Promise<void>,
 *   name: import('vue').Ref<string>,
 *   gender: import('vue').Ref<string>,
 *   birth_date: import('vue').Ref<string>,
 *   sire_id: import('vue').Ref<string|null>,
 *   dam_id: import('vue').Ref<string|null>,
 *   is_for_sale: import('vue').Ref<boolean>,
 *   description: import('vue').Ref<string>,
 *   main_image_url: import('vue').Ref<string|null>
 * }}
 */
export function useHorseForm() {
  // Form fields
  /** @type {import('vue').Ref<string>} A ló neve. */
  const name = ref("");
  /** @type {import('vue').Ref<string>} A ló neme ('male' vagy 'female'). */
  const gender = ref("");
  /** @type {import('vue').Ref<string>} Születési dátum YYYY-MM-DD formátumban. */
  const birth_date = ref(new Date().toISOString().split('T')[0]);
  /** @type {import('vue').Ref<string|null>} Az apa ló azonosítója. */
  const sire_id = ref(null);
  /** @type {import('vue').Ref<string|null>} Az anya ló azonosítója. */
  const dam_id = ref(null);
  /** @type {import('vue').Ref<boolean>} Eladó-e a ló. */
  const is_for_sale = ref(false);
  /** @type {import('vue').Ref<string>} A ló leírása. */
  const description = ref("");
  /** @type {import('vue').Ref<Array<Object>>} A lóhoz tartozó képek listája. */
  const images = ref([]);
  /** @type {import('vue').Ref<string|null>} A fő kép publikus URL-je. */
  const main_image_url = ref(null);
  /** @type {import('vue').Ref<File|null>} A kiválasztott fő kép fájl (feltöltés előtt). */
  const mainImageFile = ref(null);

  // State
  /** @type {import('vue').Ref<boolean>} Töltési állapot jelző (adatlekéréshez). */
  const loading = ref(false);
  /** @type {import('vue').Ref<boolean>} Beküldési állapot jelző (mentéshez). */
  const submitting = ref(false);
  /** @type {import('vue').Ref<Object>} Validációs hibák objektuma (mező név -> hibaüzenet). */
  const errors = ref({});
  /** @type {import('vue').Ref<Array<Object>>} Az elérhető szülő lovak listája a legördülő menühöz. */
  const parentOptions = ref([]);
  /** @type {import('vue').Ref<string|null>} A szerkesztés alatt álló ló ID-ja, vagy null új ló esetén. */
  const editingHorseId = ref(null);
  /** @type {import('vue').Ref<boolean>} Kép feltöltés folyamatban jelző. */
  const imageUploading = ref(false);

  /**
   * Az űrlap validálása. Ellenőrzi a kötelező mezőket (név, nem),
   * a születési dátum érvényességét, és a szülő lovak különbözőségét.
   * @returns {boolean} Igaz, ha az űrlap érvényes (nincs hiba).
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
      const year = parseInt(birth_date.value.substring(0, 4));
      const currentYear = new Date().getFullYear();
      if (year > currentYear) {
        newErrors.birth_date = "Születési év nem lehet a jövőben";
      }
      if (year < 1900) {
        newErrors.birth_date = "Születési év nincs realisztikusan";
      }
    }

    // Only validate parent references if not editing (parent refs are disabled during edit)
    if (!editingHorseId.value && sire_id.value && dam_id.value && sire_id.value === dam_id.value) {
      newErrors.sire_id = "Apa és anya nem lehet ugyanaz a ló";
    }

    errors.value = newErrors;
    return Object.keys(newErrors).length === 0;
  }

  /**
   * Fő kép feltöltése a Supabase Storage-ba ('horse-images' bucket).
   * Validálja a fájl méretét (max 5MB) és típusát (JPG, PNG, WebP).
   * Sikeres feltöltés után beállítja a main_image_url ref-et.
   * @param {File} file - A feltöltendő képfájl.
   * @returns {Promise<void>}
   * @throws {Error} Ha a fájl túl nagy vagy érvénytelen típusú.
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
    } finally {
      imageUploading.value = false;
    }
  }

  /**
   * Az űrlap alaphelyzetbe állítása. Minden mezőt visszaállít az alapértékekre,
   * törli a hibákat és a szerkesztési állapotot.
   */
  function resetForm() {
    name.value = "";
    gender.value = "";
    birth_date.value = new Date().toISOString().split('T')[0]; // Reset to today's date in YYYY-MM-DD format
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
   * Ló adatainak betöltése az űrlapba szerkesztéshez.
   * Beállítja az editingHorseId ref-et, ami a submitForm viselkedését is befolyásolja.
   * @param {string} id - A szerkesztendő ló azonosítója.
   * @returns {Promise<void>}
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
      main_image_url.value = horse.main_img_url || null;
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
   * Szülő lovak betöltése a legördülő menükhöz (apa/anya kiválasztás).
   * Hiba esetén csendben elnyeli a hibát, mivel nem kritikus funkció.
   * @returns {Promise<void>}
   */
  async function loadParentOptions() {
    try {
      parentOptions.value = await fetchParentOptions();
    } catch (err) {
      // error silently ignored – parent options are non-critical
    }
  }

  /**
   * Űrlap beküldése: új ló létrehozása vagy meglévő frissítése.
   * Szerkesztés esetén a szülő referenciák nem módosíthatók.
   * Előbb validálja az űrlapot, majd a megfelelő service-t hívja.
   * @returns {Promise<boolean|undefined>} Igaz sikeres mentés esetén, hamis hiba esetén,
   *   undefined ha a validáció sikertelen.
   */
  async function submitForm() {
    if (!validateForm()) return;

    submitting.value = true;

    try {
      // Build data for creation vs update
      if (editingHorseId.value) {
        // For editing: only update allowed fields, NOT parent references
        const horseData = {
          name: name.value?.trim() || "",
          gender: gender.value || "",
          is_for_sale: Boolean(is_for_sale.value),
          main_img_url: main_image_url.value || null,
          description: description.value?.trim() || "",
        };

        if (birth_date.value) {
          horseData.birth_date = birth_date.value; // Already in YYYY-MM-DD format from input type="date"
        }

        await updateHorse(editingHorseId.value, horseData);
      } else {
        // For creation: include parent references
        const horseData = {
          name: name.value?.trim() || "",
          gender: gender.value || "",
          is_for_sale: Boolean(is_for_sale.value),
          main_img_url: main_image_url.value || null,
          description: description.value?.trim() || "",
        };

        if (birth_date.value) {
          horseData.birth_date = birth_date.value; // Already in YYYY-MM-DD format from input type="date"
        }

        if (sire_id.value) {
          horseData.sire_id = sire_id.value;
        }

        if (dam_id.value) {
          horseData.dam_id = dam_id.value;
        }

        await createHorse(horseData);
      }

      errors.value = {};
      return true;
    } catch (err) {
      errors.value = { general: err.message || "Hiba történt a mentéskor" };
      return false;
    } finally {
      submitting.value = false;
    }
  }

  /**
   * Igaz, ha szerkesztési módban van az űrlap (editingHorseId be van állítva).
   * @type {import('vue').ComputedRef<boolean>}
   */
  const isEditing = computed(() => !!editingHorseId.value);
  /**
   * Az űrlap címe: szerkesztés esetén a ló nevét is tartalmazza.
   * @type {import('vue').ComputedRef<string>}
   */
  const formTitle = computed(() =>
    isEditing.value ? `Ló szerkesztése: ${name.value}` : "Új egyed felvétele",
  );
  /**
   * Az apa (sire) kiválasztáshoz szűrt opciók (csak hím lovak).
   * @type {import('vue').ComputedRef<Array<Object>>}
   */
  const sireOptions = computed(() =>
    parentOptions.value.filter(h => h.gender === 'male')
  );
  /**
   * Az anya (dam) kiválasztáshoz szűrt opciók (csak nőstény lovak).
   * @type {import('vue').ComputedRef<Array<Object>>}
   */
  const damOptions = computed(() =>
    parentOptions.value.filter(h => h.gender === 'female')
  );

  return {
    // State (aliased for component compatibility)
    formErrors: errors,
    formSubmitting: submitting,
    loading,
    parentOptions,
    sireOptions,
    damOptions,
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
