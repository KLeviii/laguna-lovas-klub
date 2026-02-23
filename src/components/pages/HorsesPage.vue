<script setup>
import { onMounted } from "vue";
import { useAuth } from "@/composables/useAuth";
import { useHorses } from "@/composables/useHorses.js";
import HorseCard from "@/components/horses/HorseCard.vue";
import HorseFilter from "@/components/horses/HorseFilter.vue";

const { isAuthenticated } = useAuth();
const {
  horses,
  loading,
  error,
  filterStatus,
  isEmpty,
  loadHorses,
  setFilterStatus,
} = useHorses();

onMounted(() => {
  // Admins see all horses, guests see only available horses
  loadHorses(!isAuthenticated.value);
});
</script>

<template>
  <div>
    <main>
      <div class="image-container">
        <div class="overlay"></div>
        <div class="text">Lovaink</div>
      </div>
      <section class="p-3 p-md-5">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="mb-0">Lovaink</h2>

          <!-- Admin gomb - csak bejelentkezve látható -->
          <router-link
            v-if="isAuthenticated"
            to="/admin/horses"
            class="btn btn-primary"
          >
            <i class="bi bi-pencil-square me-2"></i>
            Lovak kezelése
          </router-link>
        </div>

        <!-- Filter -->
        <HorseFilter
          :model-value="filterStatus"
          @update:model-value="setFilterStatus"
        />

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
            @click="loadHorses"
          >
            Újrapróbálkozás
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="isEmpty" class="alert alert-info text-center py-5">
          <h4>Nincs ló az adatbázisban</h4>
          <p class="text-muted">Hamarosan lesz!</p>
        </div>

        <!-- Horse Grid -->
        <div v-else class="row g-4">
          <div
            v-for="horse in horses"
            :key="horse.id"
            class="col-12 col-md-6 col-lg-4"
          >
            <HorseCard :horse="horse" />
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped></style>
