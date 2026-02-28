import { ref, computed } from "vue";
import { supabase } from "@/services/supabase";

/**
 * @module useAuth
 * Composable az autentikáció kezeléséhez.
 * Module-level singleton pattern: a reaktív állapot (user, loading, error, authReady)
 * megosztott minden komponens között, amely ezt a composable-t használja.
 */

/** @type {import('vue').Ref<Object|null>} Az aktuálisan bejelentkezett Supabase user objektum, vagy null. */
const user = ref(null);
/** @type {import('vue').Ref<boolean>} Töltési állapot jelző az auth műveletek során. */
const loading = ref(false);
/** @type {import('vue').Ref<string|null>} Az utolsó auth hiba üzenete, vagy null. */
const error = ref(null);
/** @type {import('vue').Ref<boolean>} Jelzi, hogy az auth inicializálás befejeződött. */
const authReady = ref(false);

/**
 * Composable az autentikáció kezeléséhez (bejelentkezés, kijelentkezés, session figyelés).
 * @returns {{
 *   user: import('vue').Ref<Object|null>,
 *   isAuthenticated: import('vue').ComputedRef<boolean>,
 *   loading: import('vue').Ref<boolean>,
 *   error: import('vue').Ref<string|null>,
 *   authReady: import('vue').Ref<boolean>,
 *   initAuth: () => Promise<void>,
 *   signIn: (email: string, password: string) => Promise<{success: boolean, error?: string}>,
 *   signOut: () => Promise<{success: boolean, error?: string}>
 * }}
 */
export function useAuth() {
  /** @type {import('vue').ComputedRef<boolean>} Igaz, ha van bejelentkezett felhasználó. */
  const isAuthenticated = computed(() => user.value !== null);

  /**
   * Inicializálja az auth állapotot a Supabase session-ből.
   * App indításkor hívódik meg (main.js), beállítja a felhasználót és
   * feliratkozik a session változásokra (onAuthStateChange).
   * @returns {Promise<void>}
   */
  const initAuth = async () => {
    loading.value = true;
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        user.value = session.user;
      }

      // Figyelés a session változásokra
      supabase.auth.onAuthStateChange((_event, session) => {
        user.value = session?.user || null;
      });
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
      authReady.value = true; // Mark auth initialization as complete
    }
  };

  /**
   * Bejelentkezés email és jelszóval a Supabase Auth segítségével.
   * Sikeres bejelentkezés esetén beállítja a user ref-et.
   * @param {string} email - A felhasználó email címe.
   * @param {string} password - A felhasználó jelszava.
   * @returns {Promise<{success: boolean, error?: string}>} Eredmény objektum a művelet sikerességével.
   */
  const signIn = async (email, password) => {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) throw signInError;

      user.value = data.user;
      return { success: true };
    } catch (err) {
      error.value = err.message;
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Kijelentkezés a Supabase Auth-ból.
   * Sikeres kijelentkezés után a user ref null-ra áll.
   * @returns {Promise<{success: boolean, error?: string}>} Eredmény objektum a művelet sikerességével.
   */
  const signOut = async () => {
    loading.value = true;
    error.value = null;
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;

      user.value = null;
      return { success: true };
    } catch (err) {
      error.value = err.message;
      return { success: false, error: err.message };
    } finally {
      loading.value = false;
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    authReady,
    initAuth,
    signIn,
    signOut,
  };
}
