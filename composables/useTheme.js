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
 */
export function useTheme() {
  const initTheme = () => {
    if (!import.meta.client) return;
    const saved = localStorage.getItem("theme");
    if (saved) {
      isDarkMode.value = saved === "dark";
    } else {
      isDarkMode.value = true;
    }
    applyTheme();
  };

  const applyTheme = () => {
    if (!import.meta.client) return;
    const body = document.body;
    if (isDarkMode.value) {
      body.classList.remove("light");
    } else {
      body.classList.add("light");
    }
    localStorage.setItem("theme", isDarkMode.value ? "dark" : "light");
  };

  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value;
    applyTheme();
  };

  watch(isDarkMode, applyTheme);

  return {
    isDarkMode,
    initTheme,
    toggleTheme,
    applyTheme,
  };
}
