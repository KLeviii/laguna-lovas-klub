<script setup>
import { ref } from 'vue'

const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  alt: {
    type: String,
    default: '',
  },
  aspectRatio: {
    type: String,
    default: '16/9',
  },
  imgClass: {
    type: String,
    default: '',
  },
})

const isLoaded = ref(false)

function onLoad() {
  isLoaded.value = true
}
</script>

<template>
  <div class="skeleton-image-wrapper" :style="{ aspectRatio: props.aspectRatio }">
    <!-- Skeleton placeholder -->
    <div
      v-show="!isLoaded"
      class="placeholder-wave w-100 h-100 skeleton-fill"
    >
      <span class="placeholder w-100 h-100 d-block"></span>
    </div>

    <!-- Actual image -->
    <img
      v-show="isLoaded"
      :src="src"
      :alt="alt"
      :class="imgClass"
      @load="onLoad"
    />
  </div>
</template>

<style scoped>
.skeleton-image-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.skeleton-fill {
  position: absolute;
  inset: 0;
}

img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
</style>
