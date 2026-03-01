import { ref, watch } from "vue";

/**
 * @module useTheme
 * Composable a sötét/világos téma kezeléséhez.
 * Module-level singleton pattern: az isDarkMode ref megosztott minden komponens között.
 */

/** @type {import('vue').Ref<boolean>} Igaz, ha sötét mód aktív; hamis világos módban. */
const isDarkMode = ref(true);

/**
 * Composable a téma váltásához és alkalmazásához.
 * Kezeli a localStorage-ban való perzisztálást és a DOM osztályok frissítését.
 * @returns {{
 *   isDarkMode: import('vue').Ref<boolean>,
 *   initTheme: () => void,
 *   toggleTheme: () => void,
 *   applyTheme: () => void
 * }}
 */
export function useTheme() {
  /**
   * Inicializálja a témát a localStorage-ből mentett értékkel.
   * Ha nincs mentett téma, az alapértelmezett sötét módot alkalmazza.
   * Hívd meg az alkalmazás indításakor (pl. App.vue onMounted).
   * @returns {void}
   */
  const initTheme = () => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      isDarkMode.value = saved === "dark";
    } else {
      // Alapértelmezett: sötét mód
      isDarkMode.value = true;
    }
    applyTheme();
  };

  /**
   * A téma alkalmazása a dokumentumra: hozzáadja vagy eltávolítja a 'light' CSS osztályt
   * a body elemen, és elmenti az aktuális témát a localStorage-ba.
   * @returns {void}
   */
  const applyTheme = () => {
    const body = document.body;
    if (isDarkMode.value) {
      body.classList.remove("light");
    } else {
      body.classList.add("light");
    }
    localStorage.setItem("theme", isDarkMode.value ? "dark" : "light");
  };

  /**
   * Téma váltása sötét és világos mód között.
   * Megfordítja az isDarkMode értékét, majd alkalmazza a változást.
   * @returns {void}
   */
  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value;
    applyTheme();
  };

  // Témavéltás figyelése és alkalmazása
  watch(isDarkMode, applyTheme);

  return {
    isDarkMode,
    initTheme,
    toggleTheme,
    applyTheme,
  };
}
