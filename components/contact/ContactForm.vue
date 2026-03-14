<script setup>
import { useContactForm } from "~/composables/useContactForm.js";

const {
  name,
  email,
  phone,
  message,
  loading,
  error,
  success,
  sendMessage,
} = useContactForm();
</script>

<template>
  <div class="d-flex flex-column gap-4">
    <div>
      <h2 class="fw-bold mb-2">Küldjön üzenetet</h2>
      <p class="text-muted mb-0">
        Töltse ki az alábbi űrlapot, és munkatársunk hamarosan keresni fogja.
      </p>
    </div>

    <div v-if="success" class="alert alert-success">
      <i class="bi bi-check-circle me-2"></i>
      Köszönjük az üzenetét! Hamarosan felvesszük Önnel a kapcsolatot.
    </div>

    <div v-if="error" class="alert alert-danger">
      <i class="bi bi-exclamation-triangle me-2"></i>{{ error }}
    </div>

    <form v-if="!success" class="d-flex flex-column gap-3" @submit.prevent="sendMessage">
      <div class="row g-3">
        <div class="col-sm-6">
          <label class="contact-field-label">Teljes Név</label>
          <input
            v-model="name"
            type="text"
            class="form-control contact-input"
            placeholder="Gipsz Jakab"
            required
          />
        </div>
        <div class="col-sm-6">
          <label class="contact-field-label">Telefonszám</label>
          <input
            v-model="phone"
            type="tel"
            class="form-control contact-input"
            placeholder="+36 30 123 4567"
          />
        </div>
      </div>

      <div>
        <label class="contact-field-label">E-mail cím</label>
        <input
          v-model="email"
          type="email"
          class="form-control contact-input"
          placeholder="pelda@email.hu"
          required
        />
      </div>

      <div>
        <label class="contact-field-label">Üzenet</label>
        <textarea
          v-model="message"
          class="form-control contact-input"
          rows="4"
          placeholder="Miben segíthetünk?"
          required
        ></textarea>
      </div>

      <button
        type="submit"
        class="btn btn-primary w-100 contact-submit-btn"
        :disabled="loading"
      >
        <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
        {{ loading ? "Küldés..." : "Üzenet elküldése" }}
        <i v-if="!loading" class="bi bi-arrow-right ms-2"></i>
      </button>
    </form>
  </div>
</template>

<style scoped>
.contact-field-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.contact-input {
  border-radius: var(--radius-md);
  height: 3.25rem;
  padding-left: 1rem;
  padding-right: 1rem;
  font-size: 1rem;
}

textarea.contact-input {
  height: auto;
  padding-top: 0.75rem;
  resize: none;
}

.contact-submit-btn {
  height: 3.25rem;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 1rem;
  transition: opacity 0.2s;
}
.contact-submit-btn:hover:not(:disabled) {
  opacity: 0.9;
}
</style>
