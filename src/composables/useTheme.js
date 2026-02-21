import { ref, watch } from "vue";

const isDarkMode = ref(true);

export function useTheme() {
  // Inicializál a localStorage-ből, ha van mentett téma
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

  // Téma alkalmazása a documentumra
  const applyTheme = () => {
    const body = document.body;
    if (isDarkMode.value) {
      body.classList.remove("light");
    } else {
      body.classList.add("light");
    }
    localStorage.setItem("theme", isDarkMode.value ? "dark" : "light");
  };

  // Téma váltása
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
