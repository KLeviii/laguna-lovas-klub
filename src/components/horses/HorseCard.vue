<script setup>
defineProps({
  horse: {
    type: Object,
    required: true,
  },
})

const onImageError = (event) => {
  event.target.style.display = 'none'
}
</script>

<template>
  <router-link :to="`/lovaink/${horse.id}`" class="text-decoration-none">
    <div class="card h-100 shadow-sm border-0 horse-card">
      <!-- Horse Image -->
      <div class="position-relative bg-light overflow-hidden" style="height: 200px">
        <img
          v-if="horse.main_img_url"
          :src="horse.main_img_url"
          :alt="horse.name"
          class="card-img-top w-100 h-100"
          style="object-fit: cover"
          @error="onImageError"
        />
        <div v-else class="d-flex align-items-center justify-content-center h-100">
          <span class="text-muted small">Nincs kép</span>
        </div>
      </div>

      <!-- Card Body -->
      <div class="card-body d-flex flex-column">
        <h6 class="card-title text-truncate mb-2">{{ horse.name }}</h6>
        <p class="card-text text-muted small flex-grow-1">
          {{ horse.gender === 'female' ? '♀ Kanca' : '♂ Mén' }} •
          {{ horse.birth_date || '—' }}
        </p>
      </div>

      <!-- Card Footer: Availability -->
      <div class="card-footer bg-white border-top">
        <div class="d-flex justify-content-between align-items-center">
          <span
            v-if="horse.is_for_sale"
            class="badge bg-success badge-sm"
          >
            <i class="bi bi-tag me-1"></i>Eladó
          </span>
          <span v-else class="badge bg-secondary badge-sm">
            Nem eladó
          </span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.horse-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.horse-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
}

.badge-sm {
  font-size: 0.75rem;
  padding: 0.35rem 0.65rem;
}

a {
  color: inherit;
}

a:hover {
  text-decoration: none;
}
</style>
