import { ref, computed } from "vue";
import {
  fetchAllHorses,
  fetchHorseById,
  fetchRelatedHorses,
  deleteHorse as deleteHorseService,
} from "../services/horseService.js";

/**
 * @module useHorses
 * Composable a lovak listázásához, szűréséhez és kezeléséhez.
 */

/**
 * Composable a lovak adatainak betöltéséhez, szűréséhez és törléséhez.
 * @returns {{
 *   horses: import('vue').ComputedRef<Array<Object>>,
 *   selectedHorse: import('vue').Ref<Object|null>,
 *   relatedHorses: import('vue').Ref<Array<Object>>,
 *   loading: import('vue').Ref<boolean>,
 *   error: import('vue').Ref<string|null>,
 *   filterStatus: import('vue').Ref<string>,
 *   isEmpty: import('vue').ComputedRef<boolean>,
 *   loadHorses: (initialFilter?: boolean|null) => Promise<void>,
 *   setFilterStatus: (status: string) => Promise<void>,
 *   loadHorseById: (id: string) => Promise<void>,
 *   deleteHorse: (id: string) => Promise<boolean>
 * }}
 */
export function useHorses() {
  /** @type {import('vue').Ref<Array<Object>>} Az összes betöltött ló nyers listája. */
  const horses = ref([]);
  /** @type {import('vue').Ref<Object|null>} Az egyedileg kiválasztott ló adatai. */
  const selectedHorse = ref(null);
  /** @type {import('vue').Ref<Array<Object>>} A kiválasztott lóhoz kapcsolódó lovak (azonos nem). */
  const relatedHorses = ref([]);
  /** @type {import('vue').Ref<boolean>} Töltési állapot jelző. */
  const loading = ref(false);
  /** @type {import('vue').Ref<string|null>} Az utolsó hiba üzenete. */
  const error = ref(null);
  /** @type {import('vue').Ref<string>} Szűrő állapot: 'all', 'available' vagy 'unavailable'. */
  const filterStatus = ref("all"); // 'all', 'available', 'unavailable'

  /**
   * Az összes ló betöltése az adatbázisból, opcionális szűréssel.
   * @param {boolean|null} [initialFilter=null] - Ha nem null, felülírja a filterStatus-t
   *   (pl. vendégek számára csak az eladó lovakat mutatja).
   * @returns {Promise<void>}
   */
  async function loadHorses(initialFilter = null, options = {}) {
    loading.value = true;
    error.value = null;

    try {
      // If initialFilter is provided (for guests showing only available), use it
      const filters = {
        available_only: initialFilter !== null ? initialFilter : filterStatus.value === "available",
        include_pedigree_only: options.include_pedigree_only || false,
      };
      horses.value = await fetchAllHorses(filters);
    } catch (err) {
      error.value = err.message;
      horses.value = [];
    } finally {
      loading.value = false;
    }
  }

  /**
   * Szűrő állapot beállítása és a lovak újratöltése.
   * @param {string} status - Az új szűrő érték: 'all', 'available' vagy 'unavailable'.
   * @returns {Promise<void>}
   */
  async function setFilterStatus(status) {
    filterStatus.value = status;
    await loadHorses();
  }

  /**
   * Egyetlen ló betöltése ID alapján, és a kapcsolódó lovak lekérése (azonos nem).
   * @param {string} id - A betöltendő ló azonosítója.
   * @returns {Promise<void>}
   */
  async function loadHorseById(id) {
    loading.value = true;
    error.value = null;

    try {
      selectedHorse.value = await fetchHorseById(id);
      if (selectedHorse.value?.gender) {
        relatedHorses.value = await fetchRelatedHorses(selectedHorse.value.gender, id)
      }
    } catch (err) {
      error.value = err.message;
      selectedHorse.value = null;
      relatedHorses.value = [];
    } finally {
      loading.value = false;
    }
  }

  /**
   * Szűrt lovak listája az aktuális filterStatus alapján.
   * Lokális szűrés – optimalizált kis adathalmazra (<1000 ló).
   * @type {import('vue').ComputedRef<Array<Object>>}
   */
  const filteredHorses = computed(() => {
    if (filterStatus.value === "all") return horses.value;
    if (filterStatus.value === "available") {
      return horses.value.filter((h) => h.is_for_sale);
    }
    if (filterStatus.value === "unavailable") {
      return horses.value.filter((h) => !h.is_for_sale);
    }
    return horses.value;
  });

  /**
   * Igaz, ha a szűrt lovak listája üres.
   * @type {import('vue').ComputedRef<boolean>}
   */
  const isEmpty = computed(() => filteredHorses.value.length === 0);

  /**
   * Ló törlése az adatbázisból, majd a lista újratöltése.
   * Foreign key constraint hiba esetén felhasználóbarát hibaüzenetet állít be.
   * @param {string} id - A törlendő ló azonosítója.
   * @returns {Promise<boolean>} Igaz, ha a törlés sikeres volt.
   */
  async function deleteHorse(id) {
    loading.value = true;
    error.value = null;
    try {
      await deleteHorseService(id);
      await loadHorses();
      return true;
    } catch (err) {
      // Check if it's a foreign key constraint error
      if (err.message && err.message.includes("foreign key constraint")) {
        error.value = "Nem lehet törölni ezt a lovat, mert más lovak szülőjeként van beállítva. Először módosítsd azokat a lovakat.";
      } else {
        error.value = err.message || "Hiba a törlés során";
      }
      return false;
    } finally {
      loading.value = false;
    }
  }

  return {
    horses: filteredHorses,
    selectedHorse,
    relatedHorses,
    loading,
    error,
    filterStatus,
    isEmpty,
    loadHorses,
    setFilterStatus,
    loadHorseById,
    deleteHorse,
  };
}
