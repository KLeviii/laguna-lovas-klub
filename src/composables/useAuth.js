import { ref, computed } from "vue";
import { supabase } from "@/services/supabase";

// Globális állapot - reactive
const user = ref(null);
const loading = ref(false);
const error = ref(null);
const authReady = ref(false); // Flag to indicate auth initialization is complete

export function useAuth() {
  const isAuthenticated = computed(() => user.value !== null);

  /**
   * Inicializálja az auth állapotot localStorage-ból
   * App indításkor hívódik meg (main.js)
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
   * Bejelentkezés email és jelszóval
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
   * Kijelentkezés
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
