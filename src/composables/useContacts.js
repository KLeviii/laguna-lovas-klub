import { ref, computed } from "vue";
import {
  fetchContactSubmissions,
  markContactAsRead,
  markContactAsUnread,
  deleteContactSubmission,
} from "@/services/contactService.js";

/**
 * @module useContacts
 * Composable a kapcsolatfelvételi beküldések (admin oldali) kezeléséhez.
 */

/**
 * Composable a kapcsolatfelvételi beküldések betöltéséhez, olvasottság kezeléséhez és törléséhez.
 * @returns {{
 *   submissions: import('vue').Ref<Array<Object>>,
 *   loading: import('vue').Ref<boolean>,
 *   error: import('vue').Ref<string|null>,
 *   unreadCount: import('vue').ComputedRef<number>,
 *   isEmpty: import('vue').ComputedRef<boolean>,
 *   loadSubmissions: () => Promise<void>,
 *   markAsRead: (id: string) => Promise<void>,
 *   markAsUnread: (id: string) => Promise<void>,
 *   removeSubmission: (id: string) => Promise<void>
 * }}
 */
export function useContacts() {
  /** @type {import('vue').Ref<Array<Object>>} Az összes kapcsolatfelvételi beküldés. */
  const submissions = ref([]);
  /** @type {import('vue').Ref<boolean>} Töltési állapot jelző. */
  const loading = ref(false);
  /** @type {import('vue').Ref<string|null>} Az utolsó hiba üzenete. */
  const error = ref(null);

  /**
   * Az olvasatlan beküldések száma.
   * @type {import('vue').ComputedRef<number>}
   */
  const unreadCount = computed(() =>
    submissions.value.filter((s) => !s.is_read).length
  );

  /**
   * Igaz, ha nincs egyetlen beküldés sem.
   * @type {import('vue').ComputedRef<boolean>}
   */
  const isEmpty = computed(() => submissions.value.length === 0);

  /**
   * Az összes kapcsolatfelvételi beküldés betöltése az adatbázisból.
   * @returns {Promise<void>}
   */
  async function loadSubmissions() {
    loading.value = true;
    error.value = null;
    try {
      submissions.value = await fetchContactSubmissions();
    } catch (err) {
      error.value = err.message;
      submissions.value = [];
    } finally {
      loading.value = false;
    }
  }

  /**
   * Beküldés megjelölése olvasottként. Lokálisan is frissíti az állapotot.
   * @param {string} id - A beküldés azonosítója.
   * @returns {Promise<void>}
   */
  async function markAsRead(id) {
    try {
      await markContactAsRead(id);
      const item = submissions.value.find((s) => s.id === id);
      if (item) item.is_read = true;
    } catch (err) {
      error.value = err.message;
    }
  }

  /**
   * Beküldés megjelölése olvasatlanként. Lokálisan is frissíti az állapotot.
   * @param {string} id - A beküldés azonosítója.
   * @returns {Promise<void>}
   */
  async function markAsUnread(id) {
    try {
      await markContactAsUnread(id);
      const item = submissions.value.find((s) => s.id === id);
      if (item) item.is_read = false;
    } catch (err) {
      error.value = err.message;
    }
  }

  /**
   * Beküldés végleges törlése az adatbázisból. Lokálisan is eltávolítja a listából.
   * @param {string} id - A törlendő beküldés azonosítója.
   * @returns {Promise<void>}
   */
  async function removeSubmission(id) {
    try {
      await deleteContactSubmission(id);
      submissions.value = submissions.value.filter((s) => s.id !== id);
    } catch (err) {
      error.value = err.message;
    }
  }

  return {
    submissions,
    loading,
    error,
    unreadCount,
    isEmpty,
    loadSubmissions,
    markAsRead,
    markAsUnread,
    removeSubmission,
  };
}
