<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  selectedCategories: { type: Array, default: () => [] },
  ageMin: { type: Number, default: null },
  ageMax: { type: Number, default: null },
})

const emit = defineEmits(['apply-filters', 'reset-filters'])

const localCategories = ref([...props.selectedCategories])
const localAgeMin = ref(props.ageMin)
const localAgeMax = ref(props.ageMax)

watch(() => props.selectedCategories, (val) => { localCategories.value = [...val] })
watch(() => props.ageMin, (val) => { localAgeMin.value = val })
watch(() => props.ageMax, (val) => { localAgeMax.value = val })

const categories = [
  { value: 'available', label: 'Eladó lovak' },
  { value: 'racehorse', label: 'Versenylovak' },
]

function toggleCategory(value) {
  const idx = localCategories.value.indexOf(value)
  if (idx === -1) {
    localCategories.value.push(value)
  } else {
    localCategories.value.splice(idx, 1)
  }
}

function isCategorySelected(value) {
  return localCategories.value.includes(value)
}

function applyFilters() {
  emit('apply-filters', {
    selectedCategories: [...localCategories.value],
    ageMin: localAgeMin.value || null,
    ageMax: localAgeMax.value || null,
  })
}

function resetFilters() {
  localCategories.value = []
  localAgeMin.value = null
  localAgeMax.value = null
  emit('reset-filters')
}

const hasActiveFilters = computed(() =>
  localCategories.value.length > 0 ||
  (localAgeMin.value !== null && localAgeMin.value !== '') ||
  (localAgeMax.value !== null && localAgeMax.value !== '')
)
</script>

<template>
  <div>
    <!-- Heading -->
    <h5 class="fw-bold mb-4 d-flex align-items-center gap-2">
      <i class="bi bi-funnel text-primary"></i>
      Szűrés
    </h5>

    <!-- Kategória (multi-select) -->
    <div class="mb-4">
      <h6 class="text-uppercase text-muted small fw-bold mb-3 letter-spacing-wide">Kategóriák</h6>
      <div class="d-flex flex-column gap-1">
        <button
          v-for="cat in categories"
          :key="cat.value"
          type="button"
          class="btn btn-sm text-start d-flex justify-content-between align-items-center rounded-3 px-3 py-2 category-btn"
          :class="isCategorySelected(cat.value) ? 'category-btn-active' : 'category-btn-inactive'"
          @click="toggleCategory(cat.value)"
        >
          <span>{{ cat.label }}</span>
          <i v-if="isCategorySelected(cat.value)" class="bi bi-check-lg text-primary"></i>
        </button>
      </div>
    </div>

    <!-- Életkor -->
    <div class="mb-4 pt-3 border-top">
      <h6 class="text-uppercase text-muted small fw-bold mb-3 letter-spacing-wide">Életkor (év)</h6>
      <div class="d-flex gap-2">
        <input
          v-model.number="localAgeMin"
          type="number"
          class="form-control form-control-sm"
          placeholder="Min"
          min="0"
          max="50"
        />
        <input
          v-model.number="localAgeMax"
          type="number"
          class="form-control form-control-sm"
          placeholder="Max"
          min="0"
          max="50"
        />
      </div>
    </div>

    <!-- Gombok -->
    <div class="d-flex flex-column gap-2 mb-4">
      <button
        class="btn btn-primary w-100 fw-bold rounded-3 py-2 shadow-sm"
        @click="applyFilters"
      >
        Szűrők alkalmazása
      </button>
      <button
        class="btn btn-outline-secondary w-100 rounded-3 py-2"
        :disabled="!hasActiveFilters"
        @click="resetFilters"
      >
        <i class="bi bi-x-lg me-1"></i>Szűrők törlése
      </button>
    </div>

    <!-- Segítségre van szüksége? -->
    <div class="pt-3 border-top">
      <div class="p-3 rounded-3 help-box">
        <h6 class="fw-bold mb-2 help-title">
          <i class="bi bi-headset me-2"></i>Segítségre van szüksége?
        </h6>
        <p class="small mb-3 text-muted">
          Szakértőink segítenek kiválasztani az Önnek legmegfelelőbb lovat céljai eléréséhez.
        </p>
        <NuxtLink
          to="/kapcsolat"
          class="btn btn-secondary btn-sm w-100 fw-bold rounded-3"
          style="--bs-btn-color: #fff; --bs-btn-hover-color: #fff; --bs-btn-active-color: #fff;"
        >
          Tanácsadás kérése
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.letter-spacing-wide {
  letter-spacing: 0.08em;
}

.category-btn {
  border: none !important;
  transition: background-color 0.15s;
}

.category-btn-inactive {
  background-color: var(--bs-body-bg);
  color: var(--bs-body-color);
}

.category-btn-inactive:hover {
  background-color: var(--bs-tertiary-bg);
  color: var(--bs-body-color);
}

.category-btn-active {
  background-color: var(--bs-card-bg, var(--bs-body-bg));
  color: var(--bs-primary);
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

[data-bs-theme="dark"] .category-btn-active {
  background-color: var(--bs-card-bg, #212529);
}

.help-box {
  background-color: rgba(var(--bs-secondary-rgb), 0.08);
  border: 1px solid rgba(var(--bs-secondary-rgb), 0.25);
}

.help-title {
  color: var(--bs-secondary);
}

</style>
