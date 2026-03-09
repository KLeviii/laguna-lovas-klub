<script setup>
defineProps({
  horse: {
    type: Object,
    required: true,
  },
})

function getAge(birth_date) {
  if (!birth_date) return '?'
  return new Date().getFullYear() - new Date(birth_date).getFullYear()
}

const onImageError = (event) => {
  event.target.style.display = 'none'
}
</script>

<template>
  <router-link :to="`/lovaink/${horse.id}`" class="text-decoration-none">
    <div class="card h-100 border horse-card overflow-hidden pt-0">

      <!-- Image area -->
      <div class="position-relative card-img-wrapper bg-light">
        <img
          v-if="horse.main_img_url"
          :src="horse.main_img_url"
          :alt="horse.name"
          class="card-img-top w-100 h-100 horse-img"
          loading="lazy"
          @error="onImageError"
        />
        <div v-else class="d-flex align-items-center justify-content-center h-100">
          <i class="bi bi-image text-muted fs-1 opacity-25"></i>
        </div>

        <!-- Badges top-left -->
        <div class="position-absolute top-0 start-0 p-2 d-flex flex-column gap-1">
          <span v-if="horse.is_for_sale" class="badge bg-success small-badge">
            <i class="bi bi-tag me-1"></i>Eladó
          </span>
          <span v-if="horse.is_racehorse" class="badge bg-primary small-badge">
            <i class="bi bi-trophy me-1"></i>Versenyló
          </span>
        </div>

        <!-- Hover overlay -->
        <div class="card-overlay d-flex align-items-center justify-content-center">
          <span class="btn btn-light btn-sm rounded-circle overlay-btn p-2">
            <i class="bi bi-eye fs-6"></i>
          </span>
        </div>
      </div>

      <!-- Card body -->
      <div class="card-body d-flex flex-column p-3">
        <!-- Gender label -->
        <small class="text-primary fw-bold text-uppercase gender-label mb-1">
          {{ horse.gender === 'female' ? 'Kanca' : 'Mén' }}
        </small>

        <!-- Horse name -->
        <h6 class="card-title fw-bold mb-2 horse-name">{{ horse.name }}</h6>

        <!-- Age + view button -->
        <div class="mt-auto d-flex justify-content-between align-items-center">
          <span class="text-muted small">{{ getAge(horse.birth_date) }} éves</span>
          <span class="btn-view d-flex align-items-center justify-content-center">
            <i class="bi bi-arrow-right"></i>
          </span>
        </div>
      </div>

    </div>
  </router-link>
</template>

<style scoped>
.horse-card {
  border-radius: var(--radius-lg);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.horse-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12) !important;
}

.card-img-wrapper {
  aspect-ratio: 4 / 3;
  overflow: hidden;
  position: relative;
}

.horse-img {
  object-fit: cover;
  transition: transform 0.5s ease;
}

.horse-card:hover .horse-img {
  transform: scale(1.08);
}

/* Hover overlay */
.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.horse-card:hover .card-overlay {
  opacity: 1;
}

.overlay-btn {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(1rem);
  transition: transform 0.3s ease, background 0.2s;
}

.horse-card:hover .overlay-btn {
  transform: translateY(0);
}

.overlay-btn:hover {
  background: var(--bs-primary) !important;
  color: #fff !important;
}

/* Gender label */
.gender-label {
  font-size: 0.65rem;
  letter-spacing: 0.1em;
}

/* Horse name */
.horse-name {
  line-height: 1.3;
  transition: color 0.2s;
}

.horse-card:hover .horse-name {
  color: var(--bs-primary);
}

/* View button */
.btn-view {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  background: rgba(var(--bs-primary-rgb), 0.1);
  color: var(--bs-primary);
  transition: background 0.2s, color 0.2s;
  cursor: pointer;
}

.horse-card:hover .btn-view {
  background: var(--bs-primary);
  color: #fff;
}

.small-badge {
  font-size: 0.7rem;
  padding: 0.3rem 0.55rem;
}

a {
  color: inherit;
}

a:hover {
  text-decoration: none;
}
</style>
