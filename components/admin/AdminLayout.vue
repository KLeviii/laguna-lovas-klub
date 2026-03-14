<template>
  <div class="admin-layout" :style="{ marginTop: headerOffset + 'px' }">
    <div class="admin-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const headerOffset = ref(0);

function updateHeaderOffset() {
  const mainHeader = document.getElementById("nav");
  headerOffset.value = mainHeader ? mainHeader.offsetHeight : 0;
}

onMounted(() => {
  updateHeaderOffset();
  window.addEventListener("resize", updateHeaderOffset);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateHeaderOffset);
});
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background-color: var(--bg-dark);
}

.admin-content {
  padding: 2rem;
}

@media (max-width: 576px) {
  .admin-content {
    padding: 1rem;
  }
}
</style>
