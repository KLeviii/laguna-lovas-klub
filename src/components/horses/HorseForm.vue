<style scoped>
h5 {
  color: var(--bg-dark) !important;
}
.light h5 {
  color: var(--highlight) !important;
}
</style>

<template>
  <div class="card m-5 pt-0">
    <!-- Card header -->
    <div class="card-header bg-primary text-center">
      <h5 class="mb-0 text-white">{{ formTitle }}</h5>
    </div>

    <div class="card-body">
    <!-- Error message -->
    <div v-if="formErrors.general" class="alert alert-danger" role="alert">
      {{ formErrors.general }}
    </div>

    <!-- Form fields -->
    <form @submit.prevent="handleFormSubmit">
      <!-- Name -->
      <div class="mb-3">
        <label for="name" class="form-label">Név *</label>
        <input
          id="name"
          v-model="name"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': formErrors.name }"
          placeholder="pl. Szépfiú"
        />
        <div v-if="formErrors.name" class="invalid-feedback d-block">
          {{ formErrors.name }}
        </div>
      </div>

      <!-- Gender -->
      <div class="mb-3">
        <label for="gender" class="form-label">Nem *</label>
        <select
          id="gender"
          v-model="gender"
          class="form-select"
          :class="{ 'is-invalid': formErrors.gender }"
        >
          <option value="">-- Válassz nemet --</option>
          <option value="male">♂ Mén</option>
          <option value="female">♀ Kanca</option>
        </select>
        <div v-if="formErrors.gender" class="invalid-feedback d-block">
          {{ formErrors.gender }}
        </div>
      </div>

      <!-- Birth date -->
      <div class="mb-3">
        <label for="birthDate" class="form-label">Születési dátum</label>
        <input
          id="birthDate"
          v-model="birth_date"
          type="date"
          class="form-control"
          :class="{ 'is-invalid': formErrors.birth_date }"
        />
        <div v-if="formErrors.birth_date" class="invalid-feedback d-block">
          {{ formErrors.birth_date }}
        </div>
      </div>

      <!-- Sire (father) -->
      <div class="mb-3">
        <label for="sireId" class="form-label">Apa</label>
        <select id="sireId" v-model="sire_id" class="form-select" :disabled="isEditing">
          <option :value="null">-- Nincs megadva --</option>
          <option
            v-for="horse in sireOptions"
            :key="horse.id"
            :value="horse.id"
          >
            {{ horse.name }} (♂)
          </option>
        </select>
        <small v-if="isEditing" class="text-muted d-block mt-1">
          A szülő információk nem módosíthatóak szerkesztéskor.
        </small>
        <div v-if="formErrors.sire_id" class="invalid-feedback d-block">
          {{ formErrors.sire_id }}
        </div>
      </div>

      <!-- Dam (mother) -->
      <div class="mb-3">
        <label for="damId" class="form-label">Anya</label>
        <select id="damId" v-model="dam_id" class="form-select" :disabled="isEditing">
          <option :value="null">-- Nincs megadva --</option>
          <option
            v-for="horse in damOptions"
            :key="horse.id"
            :value="horse.id"
          >
            {{ horse.name }} (♀)
          </option>
        </select>
        <small v-if="isEditing" class="text-muted d-block mt-1">
          A szülő információk nem módosíthatóak szerkesztéskor.
        </small>
        <div v-if="formErrors.dam_id" class="invalid-feedback d-block">
          {{ formErrors.dam_id }}
        </div>
      </div>

      <!-- Available for sale -->
      <div class="mb-3">
        <div class="form-check">
          <input
            id="isAvailable"
            v-model="is_for_sale"
            type="checkbox"
            class="form-check-input"
          />
          <label for="isAvailable" class="form-check-label">
            Eladásra kínálva
          </label>
        </div>
      </div>

      <!-- Description -->
      <div class="mb-3">
        <label for="description" class="form-label">Leírás</label>
        <textarea
          id="description"
          v-model="description"
          class="form-control"
          rows="4"
          placeholder="Írj le információkat erről a lóról..."
        ></textarea>
      </div>

      <!-- Main Image -->
      <div class="mb-3">
        <label for="mainImage" class="form-label">Fő kép</label>
        <input
          id="mainImage"
          type="file"
          class="form-control"
          :class="{ 'is-invalid': formErrors.main_image }"
          accept="image/jpeg,image/png,image/webp"
          @change="(e) => uploadMainImage(e.target.files?.[0])"
          :disabled="imageUploading"
        />
        <small class="text-muted d-block mt-1">
          Támogatott: JPG, PNG, WebP (max. 5MB)
        </small>
        <div v-if="formErrors.main_image" class="invalid-feedback d-block">
          {{ formErrors.main_image }}
        </div>

        <!-- Image preview -->
        <div v-if="main_image_url" class="mt-3">
          <img
            :src="main_image_url"
            :alt="name || 'Fő kép előnézete'"
            class="img-thumbnail"
            style="max-width: 200px; max-height: 200px"
          />
          <p v-if="imageUploading" class="text-muted small mt-2">
            <span
              class="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Feltöltés...
          </p>
        </div>
      </div>

      <!-- Form buttons -->
      <div class="mb-4 d-flex gap-2">
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="formSubmitting"
        >
          <span
            v-if="formSubmitting"
            class="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
          {{
            formSubmitting
              ? "Mentés..."
              : isEditing
                ? "Frissítés"
                : "Létrehozás"
          }}
        </button>
        <button type="button" class="btn btn-secondary" @click="$router.back()">
          Mégse
        </button>
      </div>
    </form>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import HorseImageUpload from "./HorseImageUpload.vue";
import HorseImageGallery from "./HorseImageGallery.vue";
import { useHorseForm } from "../../composables/useHorseForm.js";

const router = useRouter();
const route = useRoute();

const {
  name,
  gender,
  birth_date,
  sire_id,
  dam_id,
  is_for_sale,
  description,
  images,
  main_image_url,
  imageUploading,
  formTitle,
  isEditing,
  formErrors,
  formSubmitting,
  parentOptions,
  sireOptions,
  damOptions,
  editingHorseId,
  loadHorse,
  loadParentOptions,
  submitForm,
  uploadMainImage,
} = useHorseForm();

onMounted(async () => {
  await loadParentOptions();

  // Load horse data if we have an ID in the route (editing mode)
  const horseId = route.params.id;
  if (horseId) {
    await loadHorse(horseId);
  }
});

async function handleFormSubmit() {
  const success = await submitForm();
  if (success) {
    // Navigate back to admin horses list on successful submission
    router.push("/admin/horses");
  }
}

async function onImageUploadSuccess() {
  // Refresh horse data to show newly uploaded images
  if (isEditing.value) {
    await loadHorse(route.params.id);
  }
}

function onImageDelete(imageId) {
  // Image already deleted from API; refresh if needed
  // (HorseImageGallery already updates its local state)
}
</script>

<style scoped>
.form-label {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.form-control,
.form-select {
  border: 1px solid var(--border);
  border-radius: 0.375rem;
}

.form-control:focus,
.form-select:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 0.25rem rgba(0, 0, 0, 0.25);
}

.invalid-feedback {
  color: var(--danger);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

button[type="submit"]:disabled,
button[type="submit"]:disabled:hover {
  opacity: 0.65;
  cursor: not-allowed;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
  border-width: 0.2em;
}

textarea.form-control {
  resize: vertical;
  font-family: inherit;
}

.border-top {
  border-top: 1px solid var(--border) !important;
}

.pt-5 {
  padding-top: 3rem !important;
}

.mt-5 {
  margin-top: 3rem !important;
}
</style>
