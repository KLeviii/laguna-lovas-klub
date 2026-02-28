<script setup>
import { useContactForm } from "@/composables/useContactForm.js";

const {
  name,
  email,
  phone,
  subject,
  message,
  consent,
  loading,
  error,
  success,
  sendMessage,
} = useContactForm();

async function handleSubmit() {
  await sendMessage();
}
</script>

<template>
  <div class="card shadow-sm pt-0">
    <div class="card-header">
      <h4 class="mb-0">
        <i class="bi bi-envelope me-2"></i>Kapcsolatfelvétel
      </h4>
    </div>
    <div class="card-body">
      <div v-if="success" class="alert alert-success">
        <i class="bi bi-check-circle me-2"></i>
        Köszönjük az üzenetét! Hamarosan felvesszük Önnel a kapcsolatot.
      </div>

      <div v-if="error" class="alert alert-danger">
        <i class="bi bi-exclamation-triangle me-2"></i>{{ error }}
      </div>

      <form v-if="!success" @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="contact-name" class="form-label">Név *</label>
          <input
            id="contact-name"
            v-model="name"
            type="text"
            class="form-control"
            placeholder="Az Ön neve"
            required
          />
        </div>

        <div class="mb-3">
          <label for="contact-email" class="form-label">Email cím *</label>
          <input
            id="contact-email"
            v-model="email"
            type="email"
            class="form-control"
            placeholder="pelda@email.com"
            required
          />
        </div>

        <div class="mb-3">
          <label for="contact-phone" class="form-label">Telefonszám</label>
          <input
            id="contact-phone"
            v-model="phone"
            type="tel"
            class="form-control"
            placeholder="+36 ..."
          />
        </div>

        <div class="mb-3">
          <label for="contact-subject" class="form-label">Tárgy</label>
          <input
            id="contact-subject"
            v-model="subject"
            type="text"
            class="form-control"
            placeholder="Miben segíthetünk?"
          />
        </div>

        <div class="mb-3">
          <label for="contact-message" class="form-label">Üzenet *</label>
          <textarea
            id="contact-message"
            v-model="message"
            class="form-control"
            rows="5"
            placeholder="Írja le üzenetét..."
            required
          ></textarea>
        </div>

        <div class="mb-3 form-check">
          <input
            id="contact-consent"
            v-model="consent"
            type="checkbox"
            class="form-check-input"
          />
          <label for="contact-consent" class="form-check-label">
            Elolvastam és elfogadom az
            <router-link to="/adatvedelem">adatvédelmi nyilatkozatot</router-link>.
          </label>
        </div>

        <button type="submit" class="btn btn-primary" :disabled="loading">
          <span
            v-if="loading"
            class="spinner-border spinner-border-sm me-2"
          ></span>
          {{ loading ? "Küldés..." : "Üzenet küldése" }}
        </button>
      </form>
    </div>
  </div>
</template>
