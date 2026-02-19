<template>
  <div class="horse-image-gallery">
    <h5 class="mb-3">Képek ({{ images.length }})</h5>

    <!-- Empty state -->
    <div v-if="images.length === 0" class="alert alert-info">
      Nincsenek képek. Töltsd fel az első képet!
    </div>

    <!-- Image grid -->
    <div v-else class="row g-3">
      <div
        v-for="(image, index) in sortedImages"
        :key="image.id"
        class="col-md-4"
      >
        <div class="card h-100 position-relative">
          <!-- Image -->
          <img
            :src="image.image_url"
            :alt="image.alt_text"
            class="card-img-top"
          />

          <!-- Badge with order -->
          <span class="position-absolute top-0 start-0 badge bg-primary m-2">
            {{ image.display_order }}
          </span>

          <!-- Card body -->
          <div class="card-body d-flex flex-column">
            <!-- Alt text input -->
            <div class="mb-2">
              <input
                :value="image.alt_text"
                type="text"
                class="form-control form-control-sm"
                placeholder="Alt szöveg"
                @change="updateAltText(image.id, $event.target.value)"
              />
            </div>

            <!-- Order controls -->
            <div class="btn-group mb-2" role="group">
              <button
                class="btn btn-sm btn-outline-secondary"
                @click="moveUp(index)"
                :disabled="index === 0"
                title="Feljebb"
              >
                <i class="bi bi-arrow-up"></i>
              </button>
              <button
                class="btn btn-sm btn-outline-secondary"
                @click="moveDown(index)"
                :disabled="index === sortedImages.length - 1"
                title="Lejjebb"
              >
                <i class="bi bi-arrow-down"></i>
              </button>
            </div>

            <!-- Delete button -->
            <button
              class="btn btn-sm btn-outline-danger mt-auto"
              @click="removeImage(image.id)"
            >
              <i class="bi bi-trash"></i> Törlés
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Error message -->
    <div v-if="error" class="alert alert-danger mt-3">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import {
  deleteImage,
  updateImageOrder,
  updateImageAltText,
} from "../../services/horseImageService.js";

const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["delete-image"]);

const error = ref(null);
const localImages = ref([...props.images]);

watch(
  () => props.images,
  (newImages) => {
    localImages.value = [...newImages];
  },
  { deep: true },
);

const sortedImages = computed(() => {
  return [...localImages.value].sort(
    (a, b) => a.display_order - b.display_order,
  );
});

async function removeImage(imageId) {
  if (!confirm("Biztosan szeretnéd törölni ezt a képet?")) return;

  try {
    const image = localImages.value.find((img) => img.id === imageId);
    if (!image) return;

    await deleteImage(imageId, image.image_url);
    localImages.value = localImages.value.filter((img) => img.id !== imageId);
    emit("delete-image", imageId);
    error.value = null;
  } catch (err) {
    error.value = `Hiba: ${err.message}`;
  }
}

async function moveUp(index) {
  if (index <= 0) return;
  const sorted = sortedImages.value;
  const image = sorted[index];
  const prevImage = sorted[index - 1];

  try {
    await updateImageOrder(image.id, prevImage.display_order);
    await updateImageOrder(prevImage.id, image.display_order);

    // Swap in local array
    const local = localImages.value;
    const localImg = local.find((i) => i.id === image.id);
    const localPrev = local.find((i) => i.id === prevImage.id);
    [localImg.display_order, localPrev.display_order] = [
      localPrev.display_order,
      localImg.display_order,
    ];

    error.value = null;
  } catch (err) {
    error.value = `Hiba: ${err.message}`;
  }
}

async function moveDown(index) {
  const sorted = sortedImages.value;
  if (index >= sorted.length - 1) return;

  const image = sorted[index];
  const nextImage = sorted[index + 1];

  try {
    await updateImageOrder(image.id, nextImage.display_order);
    await updateImageOrder(nextImage.id, image.display_order);

    // Swap in local array
    const local = localImages.value;
    const localImg = local.find((i) => i.id === image.id);
    const localNext = local.find((i) => i.id === nextImage.id);
    [localImg.display_order, localNext.display_order] = [
      localNext.display_order,
      localImg.display_order,
    ];

    error.value = null;
  } catch (err) {
    error.value = `Hiba: ${err.message}`;
  }
}

async function updateAltText(imageId, newAltText) {
  try {
    await updateImageAltText(imageId, newAltText);
    const image = localImages.value.find((img) => img.id === imageId);
    if (image) image.alt_text = newAltText;
    error.value = null;
  } catch (err) {
    error.value = `Hiba: ${err.message}`;
  }
}
</script>

<style scoped>
.horse-image-gallery {
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 0.375rem;
  border: 1px solid #dee2e6;
}

.card {
  transition: box-shadow 0.2s;
}

.card:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.card-img-top {
  object-fit: cover;
  height: 200px;
}

.position-relative {
  position: relative;
}

.top-0 {
  top: 0;
}

.start-0 {
  left: 0;
}

.m-2 {
  margin: 0.5rem;
}

input.form-control-sm {
  font-size: 0.875rem;
}
</style>
