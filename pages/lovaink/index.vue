<script setup>
import { ref, watch, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useHorses } from '~/composables/useHorses.js'
import HorseCard from '~/components/horses/HorseCard.vue'
import HorseFilter from '~/components/horses/HorseFilter.vue'
import PaginationBar from '~/components/webshop/PaginationBar.vue'
import { usePageHead } from '~/composables/usePageHead'

import heroImg from '~/assets/img/cordocan.jpg'

usePageHead('Lovaink', 'A Laguna Lovasklub lovai — tenyésztés és versenyeztetés.')

const { isAuthenticated } = useAuth()
const {
  horses,
  loading,
  error,
  selectedCategories,
  ageMin,
  ageMax,
  sortBy,
  currentPage,
  totalPages,
  isEmpty,
  loadHorses,
  setCategories,
  setAgeRange,
  setSortBy,
  setPage,
} = useHorses()

const showMobileFilter = ref(false)

const sortOptions = [
  { value: 'name', label: 'Név szerint' },
  { value: 'age_asc', label: 'Kor: növekvő' },
  { value: 'age_desc', label: 'Kor: csökkenő' },
]

onMounted(async () => {
  await loadHorses()
})

watch(currentPage, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

function handleApplyFilters({ selectedCategories: cats, ageMin: min, ageMax: max }) {
  setCategories(cats)
  setAgeRange(min, max)
  showMobileFilter.value = false
}

function handleResetFilters() {
  setCategories([])
  setAgeRange(null, null)
  setSortBy('name')
  showMobileFilter.value = false
}

function handleSortChange(event) {
  setSortBy(event.target.value)
}

function handlePageChange(page) {
  setPage(page)
}
</script>

<template>
  <div>
    <main>
      <!-- Hero -->
      <section class="container-fluid px-3 px-md-5 pt-4">
        <div
          class="horses-hero position-relative overflow-hidden rounded-4"
          :style="{ backgroundImage: `url(${heroImg})` }"
        >
          <div class="hero-overlay d-flex align-items-end p-4 p-md-5">
            <div class="hero-text">
              <h1 class="display-6 fw-bold mb-1" style="color: #fff">Lovaink</h1>
              <p class="mb-0" style="color: rgba(255, 255, 255, 0.9)">Kiváló adottságú lovaink — eladó sportlovak és büszke versenylovaink</p>
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

          <!-- Sidebar -->
          <div class="col-lg-3">
            <!-- Desktop sticky -->
            <div class="d-none d-lg-block sticky-top" style="top: 90px; z-index: 10">
              <HorseFilter
                :selected-categories="selectedCategories"
                :age-min="ageMin"
                :age-max="ageMax"
                @apply-filters="handleApplyFilters"
                @reset-filters="handleResetFilters"
              />
            </div>

            <!-- Mobile collapsible -->
            <div class="d-lg-none" v-show="showMobileFilter">
              <div class="card card-body mb-3 border shadow-sm">
                <HorseFilter
                  :selected-categories="selectedCategories"
                  :age-min="ageMin"
                  :age-max="ageMax"
                  @apply-filters="handleApplyFilters"
                  @reset-filters="handleResetFilters"
                />
              </div>
            </div>
          </div>

          <!-- Main content -->
          <div class="col-lg-9">
            <!-- Header row -->
            <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
              <h2 class="fw-bold mb-0">Lovaink</h2>
              <div class="d-flex align-items-center gap-3">
                <div class="d-flex align-items-center gap-2">
                  <label class="text-muted small mb-0">Rendezés:</label>
                  <select
                    class="form-select form-select-sm fw-bold sort-select"
                    style="width: auto"
                    :value="sortBy"
                    @change="handleSortChange"
                  >
                    <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">
                      {{ opt.label }}
                    </option>
                  </select>
                </div>
                <NuxtLink
                  v-if="isAuthenticated"
                  to="/admin/horses"
                  class="btn btn-primary btn-sm"
                >
                  <i class="bi bi-pencil-square me-1"></i>Kezelés
                </NuxtLink>
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
              <button class="btn btn-sm btn-outline-danger mt-2 d-block" @click="loadHorses">
                Újrapróbálkozás
              </button>
            </div>

            <!-- Empty -->
            <div v-else-if="isEmpty" class="alert alert-info text-center py-5">
              <h4>Nincs találat</h4>
              <p class="text-muted">Próbáld módosítani a szűrőket.</p>
            </div>

            <!-- Horse grid -->
            <div v-else class="row g-4">
              <div
                v-for="horse in horses"
                :key="horse.id"
                class="col-12 col-md-6 col-xl-4"
              >
                <HorseCard :horse="horse" />
              </div>
            </div>

            <!-- Pagination -->
            <PaginationBar
              v-if="!loading && !isEmpty"
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
.horses-hero {
  background-attachment: fixed;
  background-position: 50% 60%;
  background-size: cover;
  min-height: 300px;
  width: 100%;
  height: 220px;
  position: relative;
  margin-top: 58px;
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
  .horses-hero {
    height: 160px;
  }
}
</style>
