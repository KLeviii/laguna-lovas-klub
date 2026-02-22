import { ref, computed } from "vue";
import {
  fetchAllHorses,
  fetchHorseById,
  fetchRelatedHorses,
  deleteHorse as deleteHorseService,
} from "../services/horseService.js";

export function useHorses() {
  const horses = ref([]);
  const selectedHorse = ref(null);
  const relatedHorses = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const filterStatus = ref("all"); // 'all', 'available', 'unavailable'

  /**
   * Load all horses from database
   */
  async function loadHorses(initialFilter = null) {
    loading.value = true;
    error.value = null;

    try {
      // If initialFilter is provided (for guests showing only available), use it
      const filters = {
        available_only: initialFilter !== null ? initialFilter : filterStatus.value === "available",
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
   * Set filter and reload horses
   */
  async function setFilterStatus(status) {
    filterStatus.value = status;
    await loadHorses();
  }

  /**
   * Load a single horse by ID
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
   * Computed: filtered horses based on current filter
   * (Local filtering – optimized if <1000 horses)
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
   * Computed: is list empty
   */
  const isEmpty = computed(() => filteredHorses.value.length === 0);

  /**
   * Delete horse: call service, reload list, handle errors
   */
  async function deleteHorse(id) {
    loading.value = true;
    error.value = null;
    try {
      await deleteHorseService(id);
      await loadHorses();
      return true;
    } catch (err) {
      error.value = err.message;
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
