<script setup>
import { onMounted, watch, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useProducts } from '@/composables/useProducts'
import { useHead } from '@/composables/useHead'

import ProductCard from '@/components/webshop/ProductCard.vue'
import ProductFilter from '@/components/webshop/ProductFilter.vue'
import PaginationBar from '@/components/webshop/PaginationBar.vue'

import heroImg from '@/assets/img/kecskemet.jpg'

useHead('Webshop', 'Laguna Lovasklub webshop — lovas felszerelések és kiegészítők.')

const { isAuthenticated } = useAuth()
const {
  categories,
  loading,
  error,
  loadCategories,
  // Paginated
  paginatedProducts,
  currentPage,
  totalPages,
  sortBy,
  priceRangeMin,
  priceRangeMax,
  categoryFilters,
  loadPriceRange,
  loadProductsPaginated,
  setPage,
  setSortBy,
  setPriceRange,
  setCategoryFilters,
  resetAllFilters,
  isPaginatedEmpty,
} = useProducts()

const priceRange = ref([0, 500000])
const selectedCategories = ref([])
const showMobileFilter = ref(false)

const sortOptions = [
  { value: 'name', label: 'Név szerint' },
  { value: 'price_asc', label: 'Ár: növekvő' },
  { value: 'price_desc', label: 'Ár: csökkenő' },
  { value: 'newest', label: 'Legújabbak' },
]

onMounted(async () => {
  await Promise.all([loadCategories(), loadPriceRange()])
  priceRange.value = [priceRangeMin.value, priceRangeMax.value]
  await loadProductsPaginated()
})

watch(currentPage, () => {
  loadProductsPaginated()
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

function handleApplyFilters() {
  setCategoryFilters(selectedCategories.value)
  setPriceRange(priceRange.value[0], priceRange.value[1])
  loadProductsPaginated()
  showMobileFilter.value = false
}

function handleResetFilters() {
  selectedCategories.value = []
  priceRange.value = [priceRangeMin.value, priceRangeMax.value]
  resetAllFilters()
  loadProductsPaginated()
  showMobileFilter.value = false
}

function handleSortChange(event) {
  setSortBy(event.target.value)
  loadProductsPaginated()
}

function handlePageChange(page) {
  setPage(page)
}
</script>

<template>
  <div>
    <main>
      <!-- Hero Header Card -->
      <section class="container-fluid px-3 px-md-5 pt-4">
        <div class="webshop-hero position-relative overflow-hidden rounded-4">
          <img
            :src="heroImg"
            alt="Laguna Lovasklub Webshop"
            class="w-100 hero-img"
          />
          <div class="hero-overlay d-flex align-items-end p-4 p-md-5">
            <div class="hero-text">
              <h1 class="display-6 fw-bold mb-1" style="color: #fff">Termékeink</h1>
              <p class="mb-0" style="color: rgba(255, 255, 255, 0.9)">Prémium lovas felszerelések és kiegészítők</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Main layout -->
      <section class="container-fluid px-3 px-md-5 py-4">
        <div class="row">
          <!-- Mobile filter toggle -->
          <div class="d-lg-none mb-3">
            <button
              class="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2"
              @click="showMobileFilter = !showMobileFilter"
            >
              <i class="bi bi-funnel"></i>
              Szűrők
              <i :class="showMobileFilter ? 'bi-chevron-up' : 'bi-chevron-down'" class="bi ms-auto"></i>
            </button>
          </div>

          <!-- Sidebar (desktop: sticky, mobile: collapsible) -->
          <div class="col-lg-3">
            <!-- Desktop sidebar -->
            <div class="d-none d-lg-block sticky-top" style="top: 90px; z-index: 10">
              <ProductFilter
                :categories="categories"
                :selected-categories="selectedCategories"
                :price-range="priceRange"
                :price-min="priceRangeMin"
                :price-max="priceRangeMax"
                v-model:selectedCategories="selectedCategories"
                v-model:priceRange="priceRange"
                @apply-filters="handleApplyFilters"
                @reset-filters="handleResetFilters"
              />
            </div>

            <!-- Mobile collapsible filter -->
            <div class="d-lg-none" v-show="showMobileFilter">
              <div class="card card-body mb-3 border shadow-sm">
                <ProductFilter
                  :categories="categories"
                  :selected-categories="selectedCategories"
                  :price-range="priceRange"
                  :price-min="priceRangeMin"
                  :price-max="priceRangeMax"
                  v-model:selectedCategories="selectedCategories"
                  v-model:priceRange="priceRange"
                  @apply-filters="handleApplyFilters"
                  @reset-filters="handleResetFilters"
                />
              </div>
            </div>
          </div>

          <!-- Main content -->
          <div class="col-lg-9">
            <!-- Header row: title + sort + admin -->
            <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
              <h2 class="fw-bold mb-0">Termékeink</h2>
              <div class="d-flex align-items-center gap-3">
                <div class="d-flex align-items-center gap-2">
                  <label class="text-muted small mb-0">Rendezés:</label>
                  <select
                    class="form-select form-select-sm fw-bold sort-select"
                    style="width: auto"
                    :value="sortBy"
                    @change="handleSortChange"
                  >
                    <option
                      v-for="opt in sortOptions"
                      :key="opt.value"
                      :value="opt.value"
                    >
                      {{ opt.label }}
                    </option>
                  </select>
                </div>
                <router-link
                  v-if="isAuthenticated"
                  to="/admin/products"
                  class="btn btn-primary btn-sm"
                >
                  <i class="bi bi-pencil-square me-1"></i>
                  Kezelés
                </router-link>
              </div>
            </div>

            <!-- Loading -->
            <div v-if="loading" class="d-flex justify-content-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Betöltés...</span>
              </div>
            </div>

            <!-- Error -->
            <div v-else-if="error" class="alert alert-danger">
              <strong>Hiba:</strong> {{ error }}
              <button
                class="btn btn-sm btn-outline-danger mt-2"
                @click="loadProductsPaginated"
              >
                Újrapróbálkozás
              </button>
            </div>

            <!-- Empty State -->
            <div v-else-if="isPaginatedEmpty" class="alert alert-info text-center py-5">
              <h4>Nincs találat</h4>
              <p class="text-muted">Próbáld módosítani a szűrőket.</p>
            </div>

            <!-- Product Grid -->
            <div v-else class="row g-4">
              <div
                v-for="product in paginatedProducts"
                :key="product.id"
                class="col-12 col-md-6 col-xl-4"
              >
                <ProductCard :product="product" />
              </div>
            </div>

            <!-- Pagination -->
            <PaginationBar
              v-if="!loading && !isPaginatedEmpty"
              :current-page="currentPage"
              :total-pages="totalPages"
              @page-change="handlePageChange"
            />
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.webshop-hero {
  min-height: 300px;
  height: 220px;
  position: relative;
  margin-top: 58px;
}

.hero-img {
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to right, rgba(1, 4, 14, 0.6) 0%, transparent 25%, transparent 75%, rgba(1, 4, 14, 0.6) 100%),
    linear-gradient(to bottom, rgba(13, 110, 253, 0.05) 0%, rgba(13, 110, 253, 0.35) 100%);
}

.hero-text {
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3);
}

.sort-select {
  color: var(--bs-body-color);
  background-color: var(--bs-body-bg);
  border: 1px solid var(--bs-border-color);
}

.sort-select option {
  color: var(--bs-body-color);
  background-color: var(--bs-body-bg);
}

@media (max-width: 767.98px) {
  .webshop-hero {
    height: 160px;
  }
}
</style>
