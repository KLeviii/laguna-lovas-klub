<script setup>
import { ref, watch, computed } from 'vue'
import PriceRangeSlider from './PriceRangeSlider.vue'

const props = defineProps({
  categories: { type: Array, default: () => [] },
  selectedCategories: { type: Array, default: () => [] },
  priceRange: { type: Array, default: () => [0, 500000] },
  priceMin: { type: Number, default: 0 },
  priceMax: { type: Number, default: 500000 },
})

const emit = defineEmits(['apply-filters', 'reset-filters', 'update:selectedCategories', 'update:priceRange'])

const localCategories = ref([...props.selectedCategories])
const localPriceRange = ref([...props.priceRange])

watch(() => props.selectedCategories, (val) => {
  localCategories.value = [...val]
})

watch(() => props.priceRange, (val) => {
  localPriceRange.value = [...val]
})

function toggleCategory(categoryId) {
  const idx = localCategories.value.indexOf(categoryId)
  if (idx === -1) {
    localCategories.value.push(categoryId)
  } else {
    localCategories.value.splice(idx, 1)
  }
}

function isCategorySelected(categoryId) {
  return localCategories.value.includes(categoryId)
}

function applyFilters() {
  emit('update:selectedCategories', [...localCategories.value])
  emit('update:priceRange', [...localPriceRange.value])
  emit('apply-filters')
}

const hasActiveFilters = computed(() => {
  return localCategories.value.length > 0 ||
    localPriceRange.value[0] !== props.priceMin ||
    localPriceRange.value[1] !== props.priceMax
})

function resetFilters() {
  localCategories.value = []
  localPriceRange.value = [props.priceMin, props.priceMax]
  emit('reset-filters')
}
</script>

<template>
  <div>
    <!-- Sidebar heading -->
    <h5 class="fw-bold mb-4 d-flex align-items-center gap-2">
      <i class="bi bi-funnel text-primary"></i>
      Szűrés
    </h5>

    <!-- Categories (multi-select) -->
    <div class="mb-4">
      <h6 class="text-uppercase text-muted small fw-bold mb-3 letter-spacing-wide">Kategóriák</h6>
      <div class="d-flex flex-column gap-1">
        <button
          v-for="category in categories"
          :key="category.id"
          type="button"
          class="btn btn-sm text-start d-flex justify-content-between align-items-center rounded-3 px-3 py-2 category-btn"
          :class="isCategorySelected(category.id) ? 'category-btn-active' : 'category-btn-inactive'"
          @click="toggleCategory(category.id)"
        >
          <span>{{ category.name }}</span>
          <i v-if="isCategorySelected(category.id)" class="bi bi-check-lg text-primary"></i>
        </button>
      </div>
    </div>

    <!-- Price Range -->
    <div class="mb-4 pt-3 border-top">
      <h6 class="text-uppercase text-muted small fw-bold mb-3 letter-spacing-wide">Ár tartomány</h6>
      <PriceRangeSlider
        :min="priceMin"
        :max="priceMax"
        v-model="localPriceRange"
      />
    </div>

    <!-- Action buttons -->
    <div class="d-flex flex-column gap-2">
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
        <i class="bi bi-x-lg me-1"></i>
        Szűrők törlése
      </button>
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

[data-bs-theme="dark"] .category-btn-active,
:root[data-bs-theme="dark"] .category-btn-active {
  background-color: var(--bs-card-bg, #212529);
}
</style>
