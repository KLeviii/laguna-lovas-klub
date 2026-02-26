import { ref, computed } from "vue";
import {
  fetchContactSubmissions,
  markContactAsRead,
  markContactAsUnread,
  deleteContactSubmission,
} from "@/services/contactService.js";

export function useContacts() {
  const submissions = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const unreadCount = computed(() =>
    submissions.value.filter((s) => !s.is_read).length
  );

  const isEmpty = computed(() => submissions.value.length === 0);

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

  async function markAsRead(id) {
    try {
      await markContactAsRead(id);
      const item = submissions.value.find((s) => s.id === id);
      if (item) item.is_read = true;
    } catch (err) {
      error.value = err.message;
    }
  }

  async function markAsUnread(id) {
    try {
      await markContactAsUnread(id);
      const item = submissions.value.find((s) => s.id === id);
      if (item) item.is_read = false;
    } catch (err) {
      error.value = err.message;
    }
  }

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
