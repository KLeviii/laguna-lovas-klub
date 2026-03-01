import { ref } from "vue";
import {
  createCompetition,
  updateCompetition,
  createCompetitionResult,
  deleteCompetitionResult,
  uploadCompetitionImage,
} from "@/services/competitionService.js";

/**
 * @module useCompetitionForm
 * Composable a verseny űrlap kezeléséhez az admin felületen.
 * Tartalmazza a validációt, kép feltöltést, CRUD műveleteket versenyekhez és eredményekhez.
 */

/**
 * Composable a verseny űrlap állapotának, validációjának és mentési logikájának kezeléséhez.
 * @returns {{
 *   competitionName: import('vue').Ref<string>,
 *   competitionLocation: import('vue').Ref<string>,
 *   startDate: import('vue').Ref<string>,
 *   endDate: import('vue').Ref<string>,
 *   competitionDescription: import('vue').Ref<string>,
 *   competitionImageUrl: import('vue').Ref<string>,
 *   competitionImageFile: import('vue').Ref<File|null>,
 *   editingCompetitionId: import('vue').Ref<string|null>,
 *   loading: import('vue').Ref<boolean>,
 *   error: import('vue').Ref<string|null>,
 *   uploadingImage: import('vue').Ref<boolean>,
 *   clearCompetitionForm: () => void,
 *   loadCompetitionForEdit: (competition: Object) => void,
 *   saveCompetition: () => Promise<boolean>,
 *   handleImageSelect: (file: File|null) => void,
 *   addResult: (resultData: Object) => Promise<Object|null>,
 *   removeResult: (resultId: string) => Promise<boolean>
 * }}
 */
export function useCompetitionForm() {
  // Competition form state
  /** @type {import('vue').Ref<string>} A verseny neve. */
  const competitionName = ref("");
  /** @type {import('vue').Ref<string>} A verseny helyszíne. */
  const competitionLocation = ref("");
  /** @type {import('vue').Ref<string>} A verseny kezdő dátuma (YYYY-MM-DD). */
  const startDate = ref("");
  /** @type {import('vue').Ref<string>} A verseny záró dátuma (YYYY-MM-DD), opcionális. */
  const endDate = ref("");
  /** @type {import('vue').Ref<string>} A verseny leírása. */
  const competitionDescription = ref("");
  /** @type {import('vue').Ref<string>} A verseny kép URL-je. */
  const competitionImageUrl = ref("");
  /** @type {import('vue').Ref<File|null>} A kiválasztott kép fájl (feltöltés előtt). */
  const competitionImageFile = ref(null);

  // Loading/error state
  /** @type {import('vue').Ref<boolean>} Töltési állapot jelző. */
  const loading = ref(false);
  /** @type {import('vue').Ref<string|null>} Az utolsó hiba üzenete. */
  const error = ref(null);
  /** @type {import('vue').Ref<boolean>} Kép feltöltés folyamatban jelző. */
  const uploadingImage = ref(false);

  // Track if editing
  /** @type {import('vue').Ref<string|null>} A szerkesztés alatt álló verseny ID-ja, vagy null új verseny esetén. */
  const editingCompetitionId = ref(null);

  /**
   * Az űrlap alaphelyzetbe állítása. Minden mezőt visszaállít az alapértékekre,
   * törli a hibákat és a szerkesztési állapotot.
   * @returns {void}
   */
  function clearCompetitionForm() {
    competitionName.value = "";
    competitionLocation.value = "";
    startDate.value = "";
    endDate.value = "";
    competitionDescription.value = "";
    competitionImageUrl.value = "";
    competitionImageFile.value = null;
    editingCompetitionId.value = null;
    error.value = null;
  }

  /**
   * Verseny adatainak betöltése az űrlapba szerkesztéshez.
   * Beállítja az editingCompetitionId ref-et, ami a saveCompetition viselkedését is befolyásolja
   * (létrehozás helyett frissítést végez).
   * @param {Object} competition - A szerkesztendő verseny objektum.
   * @param {string} competition.id - A verseny azonosítója.
   * @param {string} competition.name - A verseny neve.
   * @param {string} competition.location - A verseny helyszíne.
   * @param {string} [competition.start_date] - A verseny kezdő dátuma.
   * @param {string} [competition.end_date] - A verseny záró dátuma.
   * @param {string} [competition.description] - A verseny leírása.
   * @param {string} [competition.image_url] - A verseny kép URL-je.
   * @returns {void}
   */
  function loadCompetitionForEdit(competition) {
    competitionName.value = competition.name;
    competitionLocation.value = competition.location;
    startDate.value = competition.start_date || "";
    endDate.value = competition.end_date || "";
    competitionDescription.value = competition.description || "";
    competitionImageUrl.value = competition.image_url || "";
    competitionImageFile.value = null;
    editingCompetitionId.value = competition.id;
    error.value = null;
  }

  /**
   * Verseny mentése (létrehozás vagy frissítés).
   * Validálja a kötelező mezőket (név, helyszín, kezdő dátum), majd
   * feltölti a képet ha van kiválasztott fájl, és menti a versenyt.
   * Ha editingCompetitionId be van állítva, frissít; egyébként újat hoz létre.
   * Sikeres mentés után az űrlapot alaphelyzetbe állítja.
   * @returns {Promise<boolean>} Igaz, ha a mentés sikeres volt; hamis hiba esetén.
   */
  async function saveCompetition() {
    loading.value = true;
    error.value = null;

    try {
      if (!competitionName.value.trim()) {
        throw new Error("A verseny neve kötelező");
      }
      if (!competitionLocation.value.trim()) {
        throw new Error("A helyszín kötelező");
      }
      if (!startDate.value) {
        throw new Error("A kezdő dátum kötelező");
      }
      if (endDate.value && endDate.value < startDate.value) {
        throw new Error("A záró dátum nem lehet korábbi a kezdő dátumnál");
      }

      let imageUrl = competitionImageUrl.value;

      if (competitionImageFile.value) {
        uploadingImage.value = true;
        imageUrl = await uploadCompetitionImage(competitionImageFile.value);
      }

      const competitionData = {
        name: competitionName.value.trim(),
        location: competitionLocation.value.trim(),
        start_date: startDate.value,
        end_date: endDate.value || null,
        description: competitionDescription.value.trim() || null,
        image_url: imageUrl || null,
      };

      if (editingCompetitionId.value) {
        await updateCompetition(editingCompetitionId.value, competitionData);
      } else {
        await createCompetition(competitionData);
      }

      clearCompetitionForm();
      return true;
    } catch (err) {
      error.value = err.message;
      return false;
    } finally {
      loading.value = false;
      uploadingImage.value = false;
    }
  }

  /**
   * Kép fájl kiválasztásának kezelése.
   * Validálja a fájl típusát (csak képfájlok) és méretét (max 50MB).
   * Ha a validáció sikertelen, hibaüzenetet állít be az error ref-ben.
   * @param {File|null} file - A kiválasztott fájl, vagy null a kiválasztás törléséhez.
   * @returns {void}
   */
  function handleImageSelect(file) {
    if (!file) {
      competitionImageFile.value = null;
      return;
    }

    if (!file.type.startsWith("image/")) {
      error.value = "Csak képfájlok engedélyezettek";
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      error.value = "A fájl ne legyen nagyobb 50MB-nál";
      return;
    }

    competitionImageFile.value = file;
    error.value = null;
  }

  /**
   * Új versenyeredmény hozzáadása.
   * Az eredményt a competitionService createCompetitionResult metódusán keresztül menti az adatbázisba.
   * @param {Object} resultData - Az eredmény adatai.
   * @param {string} resultData.competition_id - A verseny azonosítója.
   * @param {string} [resultData.jockey_name] - A lovas neve.
   * @param {string} [resultData.discipline] - A versenyszám neve.
   * @param {number} [resultData.placement] - A helyezés.
   * @param {string} [resultData.achievement] - Az elért eredmény szöveges leírása.
   * @param {string} [resultData.horse_id] - A ló azonosítója.
   * @returns {Promise<Object|null>} A létrehozott eredmény objektum, vagy null hiba esetén.
   */
  async function addResult(resultData) {
    loading.value = true;
    error.value = null;

    try {
      const created = await createCompetitionResult(resultData);
      return created;
    } catch (err) {
      error.value = err.message;
      return null;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Versenyeredmény eltávolítása az adatbázisból.
   * @param {string} resultId - A törlendő eredmény azonosítója.
   * @returns {Promise<boolean>} Igaz, ha a törlés sikeres volt; hamis hiba esetén.
   */
  async function removeResult(resultId) {
    loading.value = true;
    error.value = null;

    try {
      await deleteCompetitionResult(resultId);
      return true;
    } catch (err) {
      error.value = err.message;
      return false;
    } finally {
      loading.value = false;
    }
  }

  return {
    // Form state
    competitionName,
    competitionLocation,
    startDate,
    endDate,
    competitionDescription,
    competitionImageUrl,
    competitionImageFile,
    editingCompetitionId,

    // State
    loading,
    error,
    uploadingImage,

    // Methods
    clearCompetitionForm,
    loadCompetitionForEdit,
    saveCompetition,
    handleImageSelect,
    addResult,
    removeResult,
  };
}
