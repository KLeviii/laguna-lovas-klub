import { ref, computed } from "vue";
import { fetchAllCompetitions } from "@/services/competitionService.js";

export function useCompetitions() {
  const competitions = ref([]);
  const loading = ref(false);
  const error = ref(null);

  async function loadCompetitions() {
    loading.value = true;
    error.value = null;
    try {
      competitions.value = await fetchAllCompetitions();
    } catch (err) {
      error.value = err.message;
      competitions.value = [];
    } finally {
      loading.value = false;
    }
  }

  const competitionsByYear = computed(() => {
    const groups = {};
    for (const comp of competitions.value) {
      const year = comp.start_date ? comp.start_date.slice(0, 4) : "Ismeretlen";
      if (!groups[year]) groups[year] = [];
      const sortedResults = [...(comp.competition_results || [])].sort(
        (a, b) => {
          if (a.placement == null) return 1;
          if (b.placement == null) return -1;
          return a.placement - b.placement;
        }
      );
      groups[year].push({ ...comp, competition_results: sortedResults });
    }
    return Object.keys(groups)
      .sort((a, b) => b.localeCompare(a))
      .map((year) => ({ year, competitions: groups[year] }));
  });

  const stats = computed(() => {
    const allResults = competitions.value.flatMap(
      (c) => c.competition_results || []
    );
    const uniqueJockeys = new Set(
      allResults.map((r) => r.jockey_name).filter(Boolean)
    ).size;
    const firstPlaceCount = allResults.filter(
      (r) => r.placement === 1
    ).length;
    const totalPlacements = allResults.filter(
      (r) => r.placement != null
    ).length;
    return { uniqueJockeys, firstPlaceCount, totalPlacements };
  });

  const isEmpty = computed(() => competitions.value.length === 0);

  return {
    competitions,
    loading,
    error,
    isEmpty,
    competitionsByYear,
    stats,
    loadCompetitions,
  };
}
