<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  images: {
    type: Array,
    default: () => [],
  },
});

const currentIndex = ref(0);

const sortedImages = computed(() => {
  return [...props.images].sort((a, b) => a.display_order - b.display_order);
});

const currentImage = computed(() => {
  return sortedImages.value[currentIndex.value] || null;
});

function nextImage() {
  currentIndex.value = (currentIndex.value + 1) % sortedImages.value.length;
}

function prevImage() {
  currentIndex.value =
    (currentIndex.value - 1 + sortedImages.value.length) %
    sortedImages.value.length;
}
</script>

<template>
  <div>
    <!-- Main carousel -->
    <div
      v-if="images.length > 0"
      class="carousel-main bg-light d-flex align-items-center justify-content-center mb-3"
    >
      <div v-if="currentImage" style="max-width: 100%; max-height: 400px">
        <img
          :src="currentImage.image_url"
          :alt="currentImage.alt_text || 'Horse image'"
          class="img-fluid"
          style="object-fit: cover"
        />
      </div>
    </div>

    <!-- Navigation -->
    <div
      v-if="images.length > 1"
      class="d-flex justify-content-between align-items-center"
    >
      <button class="btn btn-outline-secondary btn-sm" @click="prevImage">
        ← Előző
      </button>
      <small>{{ currentIndex + 1 }} / {{ images.length }}</small>
      <button class="btn btn-outline-secondary btn-sm" @click="nextImage">
        Következő →
      </button>
    </div>

    <!-- Fallback -->
    <div v-else class="alert alert-info">Nincs elérhető kép.</div>
  </div>
</template>

<style scoped>
.carousel-main {
  min-height: 400px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
