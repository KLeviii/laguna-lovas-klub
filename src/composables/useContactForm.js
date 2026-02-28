import { ref } from "vue";
import { submitContactForm } from "@/services/contactService.js";

export function useContactForm() {
  const name = ref("");
  const email = ref("");
  const phone = ref("");
  const subject = ref("");
  const message = ref("");
  const consent = ref(false);
  const loading = ref(false);
  const error = ref(null);
  const success = ref(false);

  function clearForm() {
    name.value = "";
    email.value = "";
    phone.value = "";
    subject.value = "";
    message.value = "";
    consent.value = false;
    error.value = null;
    success.value = false;
  }

  async function sendMessage() {
    loading.value = true;
    error.value = null;
    success.value = false;

    try {
      if (!name.value.trim()) throw new Error("A név megadása kötelező.");
      if (!email.value.trim()) throw new Error("Az email cím megadása kötelező.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        throw new Error("Érvénytelen email cím formátum.");
      }
      if (!message.value.trim()) throw new Error("Az üzenet megadása kötelező.");
      if (!consent.value) throw new Error("Az adatvédelmi nyilatkozat elfogadása kötelező.");

      await submitContactForm({
        name: name.value.trim(),
        email: email.value.trim(),
        phone: phone.value.trim() || null,
        subject: subject.value.trim() || null,
        message: message.value.trim(),
      });

      clearForm();
      success.value = true;
      return true;
    } catch (err) {
      error.value = err.message;
      return false;
    } finally {
      loading.value = false;
    }
  }

  return {
    name,
    email,
    phone,
    subject,
    message,
    consent,
    loading,
    error,
    success,
    clearForm,
    sendMessage,
  };
}
