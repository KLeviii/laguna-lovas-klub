import { ref, computed } from "vue";
import {
  fetchAllHorses,
  fetchHorseById,
  fetchRelatedHorses,
  deleteHorse as deleteHorseService,
} from "../services/horseService.js";

const PAGE_SIZE = 12;

export function useHorses() {
  const horses = ref([]);
  const selectedHorse = ref(null);
  const relatedHorses = ref([]);
  const loading = ref(false);
  const error = ref(null);

  /** @type {import('vue').Ref<string[]>} Kiválasztott kategóriák: 'available', 'racehorse'. Üres = összes. */
  const selectedCategories = ref([]);
  const ageMin = ref(null);
  const ageMax = ref(null);
  const sortBy = ref("name");
  const currentPage = ref(1);

  async function loadHorses(options = {}) {
    loading.value = true;
    error.value = null;
    try {
      horses.value = await fetchAllHorses({
        available_only: false,
        include_pedigree_only: options.include_pedigree_only || false,
      });
    } catch (err) {
      error.value = err.message;
      horses.value = [];
    } finally {
      loading.value = false;
    }
  }

  function setCategories(cats) {
    selectedCategories.value = cats;
    currentPage.value = 1;
  }

  function setAgeRange(min, max) {
    ageMin.value = min;
    ageMax.value = max;
    currentPage.value = 1;
  }

  function setSortBy(sort) {
    sortBy.value = sort;
    currentPage.value = 1;
  }

  function setPage(page) {
    currentPage.value = page;
  }

  function getAge(birth_date) {
    if (!birth_date) return 0;
    return new Date().getFullYear() - new Date(birth_date).getFullYear();
  }

  async function loadHorseById(id) {
    loading.value = true;
    error.value = null;
    try {
      selectedHorse.value = await fetchHorseById(id);
      if (selectedHorse.value?.gender) {
        relatedHorses.value = await fetchRelatedHorses(selectedHorse.value.gender, id);
      }
    } catch (err) {
      error.value = err.message;
      selectedHorse.value = null;
      relatedHorses.value = [];
    } finally {
      loading.value = false;
    }
  }

  const filteredHorses = computed(() => {
    let result = horses.value;

    // Kategória szűrés (OR logika: bármelyik kiválasztott kategóriába esik)
    if (selectedCategories.value.length > 0) {
      result = result.filter((h) =>
        selectedCategories.value.some((cat) => {
          if (cat === "available") return h.is_for_sale;
          if (cat === "racehorse") return h.is_racehorse;
          return false;
        })
      );
    }

    // Életkor szűrés
    if (ageMin.value !== null && ageMin.value !== "") {
      result = result.filter((h) => getAge(h.birth_date) >= Number(ageMin.value));
    }
    if (ageMax.value !== null && ageMax.value !== "") {
      result = result.filter((h) => getAge(h.birth_date) <= Number(ageMax.value));
    }

    // Rendezés
    if (sortBy.value === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name, "hu"));
    } else if (sortBy.value === "age_asc") {
      result = [...result].sort((a, b) => getAge(a.birth_date) - getAge(b.birth_date));
    } else if (sortBy.value === "age_desc") {
      result = [...result].sort((a, b) => getAge(b.birth_date) - getAge(a.birth_date));
    }

    return result;
  });

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredHorses.value.length / PAGE_SIZE))
  );

  const paginatedHorses = computed(() => {
    const start = (currentPage.value - 1) * PAGE_SIZE;
    return filteredHorses.value.slice(start, start + PAGE_SIZE);
  });

  const isEmpty = computed(() => filteredHorses.value.length === 0);

  async function deleteHorse(id) {
    loading.value = true;
    error.value = null;
    try {
      await deleteHorseService(id);
      await loadHorses();
      return true;
    } catch (err) {
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
    horses: paginatedHorses,
    allHorses: filteredHorses,
    selectedHorse,
    relatedHorses,
    loading,
    error,
    selectedCategories,
    ageMin,
    ageMax,
    sortBy,
    currentPage,
    totalPages,
    isEmpty,
    loadHorses,
    setCategories,
    setAgeRange,
    setSortBy,
    setPage,
    loadHorseById,
    deleteHorse,
  };
}
