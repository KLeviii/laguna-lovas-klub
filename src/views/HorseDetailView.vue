<script setup>
import { useRoute, useRouter } from "vue-router";
import { onMounted } from "vue";
import { useHorses } from "@/composables/useHorses.js";
import HorseGallery from "@/components/horses/HorseGallery.vue";

const route = useRoute();
const router = useRouter();
const { selectedHorse, loading, error, loadHorseById } = useHorses();

onMounted(() => {
  loadHorseById(route.params.id);
});

function goBack() {
  router.back();
}
</script>

<template>
  <div>
    <main>
      <div class="image-container">
        <div class="overlay"></div>
        <div class="text">{{ selectedHorse?.name || "Ló részletei" }}</div>
      </div>
      <section class="p-5">
        <!-- Back Button -->
        <button class="btn btn-outline-secondary mb-4" @click="goBack">
          ← Vissza a listára
        </button>

        <!-- Loading -->
        <div v-if="loading" class="d-flex justify-content-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Betöltés...</span>
          </div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="alert alert-danger">
          <strong>Hiba:</strong> {{ error }}
        </div>

        <!-- Horse Detail -->
        <div v-else-if="selectedHorse" class="row">
          <!-- Images -->
          <div class="col-12 col-md-6 mb-4">
            <HorseGallery :images="selectedHorse.images || []" />
          </div>

          <!-- Info -->
          <div class="col-12 col-md-6">
            <h1>{{ selectedHorse.name }}</h1>

            <div class="mb-3">
              <strong>Nem:</strong>
              {{ selectedHorse.gender === "female" ? "Kanca (♀)" : "Mén (♂)" }}
            </div>

            <div class="mb-3">
              <strong>Születési év:</strong>
              {{ selectedHorse.birth_year || "Ismeretlen" }}
            </div>

            <div v-if="selectedHorse.is_available_for_sale" class="mb-3">
              <span class="badge bg-success">Eladó</span>
            </div>

            <!-- Description -->
            <div v-if="selectedHorse.description" class="mb-4">
              <strong>Leírás:</strong>
              <p>{{ selectedHorse.description }}</p>
            </div>

            <!-- Pedigree -->
            <div v-if="selectedHorse.sire || selectedHorse.dam" class="mb-4">
              <h4>Származása</h4>
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>Szerep</th>
                    <th>Név</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="selectedHorse.sire">
                    <td><strong>Apa (Sire)</strong></td>
                    <td>
                      <router-link :to="`/lovaink/${selectedHorse.sire.id}`">
                        {{ selectedHorse.sire.name }}
                      </router-link>
                    </td>
                  </tr>
                  <tr v-if="selectedHorse.dam">
                    <td><strong>Anya (Dam)</strong></td>
                    <td>
                      <router-link :to="`/lovaink/${selectedHorse.dam.id}`">
                        {{ selectedHorse.dam.name }}
                      </router-link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Not Found -->
        <div v-else class="alert alert-warning">
          <strong>Ló nem található.</strong>
        </div>
      </section>
    </main>
  </div>
</template>
