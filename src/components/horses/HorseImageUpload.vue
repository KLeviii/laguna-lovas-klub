<template>
  <div class="horse-image-upload">
    <div class="mb-3">
      <label for="imageFile" class="form-label">Képek feltöltése</label>
      <input
        id="imageFile"
        type="file"
        class="form-control"
        multiple
        accept="image/jpeg,image/png,image/webp"
        @change="onFileSelect"
        :disabled="uploading"
      />
      <small class="text-muted d-block mt-1">
        Támogatott: JPG, PNG, WebP (max. 50MB/kép)
      </small>
    </div>

    <!-- Upload progress -->
    <div v-if="selectedFiles.length > 0" class="mb-3">
      <p class="text-muted">
        <strong>{{ selectedFiles.length }}</strong> kép kiválasztva
      </p>
      <button
        class="btn btn-success"
        @click="uploadImages"
        :disabled="uploading"
      >
        <span
          v-if="uploading"
          class="spinner-border spinner-border-sm me-2"
          role="status"
          aria-hidden="true"
        ></span>
        {{ uploading ? "Feltöltés..." : "Képek feltöltése" }}
      </button>
    </div>

    <!-- Upload status messages -->
    <div v-if="uploadError" class="alert alert-danger" role="alert">
      {{ uploadError }}
    </div>
    <div v-if="uploadSuccess" class="alert alert-success" role="alert">
      {{ uploadSuccess }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { uploadImage } from "../../services/horseImageService.js";
import { useHorses } from "../../composables/useHorses.js";

const props = defineProps({
  horseId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["upload-success"]);

const selectedFiles = ref([]);
const uploading = ref(false);
const uploadError = ref(null);
const uploadSuccess = ref(null);

const { loadHorseById } = useHorses();

function onFileSelect(event) {
  selectedFiles.value = Array.from(event.target.files);
  uploadError.value = null;
  uploadSuccess.value = null;
}

async function uploadImages() {
  if (selectedFiles.value.length === 0) return;

  uploading.value = true;
  uploadError.value = null;
  uploadSuccess.value = null;

  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < selectedFiles.value.length; i++) {
    const file = selectedFiles.value[i];
    try {
      await uploadImage(props.horseId, file, i + 1);
      successCount++;
    } catch (err) {
      console.error(`Hiba ${file.name} feltöltésénél:`, err);
      failureCount++;
    }
  }

  uploading.value = false;

  if (successCount > 0) {
    uploadSuccess.value = `${successCount} kép sikeresen feltöltve.`;
    selectedFiles.value = [];
    emit("upload-success");
    await loadHorseById(props.horseId);
  }

  if (failureCount > 0) {
    uploadError.value = `${failureCount} kép feltöltése sikertelen. Ellenőrizd a naplókat.`;
  }
}
</script>

<style scoped>
.horse-image-upload {
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  padding: 1rem;
  background-color: var(--bg-light);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
  border-width: 0.2em;
}
</style>
