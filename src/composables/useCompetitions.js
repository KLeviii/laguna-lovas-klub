import { ref, computed } from "vue";
import { fetchAllCompetitions } from "@/services/competitionService.js";

/**
 * @module useCompetitions
 * Composable a versenyek listázásához, csoportosításához és statisztikáihoz.
 */

/**
 * Composable a versenyek adatainak betöltéséhez, évek szerinti csoportosításához
 * és összesített statisztikák számításához.
 * @returns {{
 *   competitions: import('vue').Ref<Array<Object>>,
 *   loading: import('vue').Ref<boolean>,
 *   error: import('vue').Ref<string|null>,
 *   isEmpty: import('vue').ComputedRef<boolean>,
 *   competitionsByYear: import('vue').ComputedRef<Array<{year: string, competitions: Array<Object>}>>,
 *   stats: import('vue').ComputedRef<{uniqueJockeys: number, firstPlaceCount: number, totalPlacements: number}>,
 *   loadCompetitions: () => Promise<void>
 * }}
 */
export function useCompetitions() {
  /** @type {import('vue').Ref<Array<Object>>} Az összes betöltött verseny. */
  const competitions = ref([]);
  /** @type {import('vue').Ref<boolean>} Töltési állapot jelző. */
  const loading = ref(false);
  /** @type {import('vue').Ref<string|null>} Az utolsó hiba üzenete. */
  const error = ref(null);

  /**
   * Az összes verseny betöltése az adatbázisból (eredményekkel együtt).
   * @returns {Promise<void>}
   */
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

  /**
   * Versenyek csoportosítva évek szerint, csökkenő sorrendben.
   * Az eredmények (competition_results) helyezés szerint rendezve.
   * @type {import('vue').ComputedRef<Array<{year: string, competitions: Array<Object>}>>}
   */
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

  /**
   * Összesített versenystatisztikák: egyedi lovasok száma, első helyezések száma, összes helyezés.
   * @type {import('vue').ComputedRef<{uniqueJockeys: number, firstPlaceCount: number, totalPlacements: number}>}
   */
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

  /**
   * Igaz, ha nincs egyetlen betöltött verseny sem.
   * @type {import('vue').ComputedRef<boolean>}
   */
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
