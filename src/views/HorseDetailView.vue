<script setup>
import { useRoute, useRouter } from "vue-router";
import { onMounted, watch } from "vue";
import { useHorses } from "@/composables/useHorses.js";
import { formatDate } from "@/utils/formatting.js";
import HorseGallery from "@/components/horses/HorseGallery.vue";

const route = useRoute();
const router = useRouter();
const { selectedHorse, relatedHorses, loading, error, loadHorseById } = useHorses();

onMounted(() => loadHorseById(route.params.id));

watch(() => route.params.id, (id) => { if (id) loadHorseById(id) });

function goBack() {
  router.push("/lovaink");
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
            <h1 class="mb-3">{{ selectedHorse.name }}</h1>

            <!-- Gender + birth -->
            <div class="mb-3">
              <span class="badge bg-info p-2 me-2">
                {{ selectedHorse.gender === 'female' ? '♀ Kanca' : '♂ Mén' }}
              </span>
              <span v-if="selectedHorse.birth_date" class="text-muted">
                {{ formatDate(selectedHorse.birth_date) }}
              </span>
            </div>

            <!-- Availability -->
            <div class="mb-4">
              <span
                v-if="selectedHorse.is_for_sale"
                class="badge bg-success p-2"
              >
                <i class="bi bi-check-circle me-1"></i>
                Eladó
              </span>
              <span v-else class="badge bg-secondary p-2">
                <i class="bi bi-x-circle me-1"></i>
                Nem eladó
              </span>
            </div>

            <!-- Description -->
            <div v-if="selectedHorse.description" class="mb-4">
              <h4>Leírás</h4>
              <p class="text-muted">{{ selectedHorse.description }}</p>
            </div>

            <!-- Pedigree -->
            <div v-if="selectedHorse.sire || selectedHorse.dam" class="mb-4">
              <h4>Származása</h4>
              <table class="table table-sm">
                <tbody>
                  <tr v-if="selectedHorse.sire">
                    <td><strong>Fedeztetőmén</strong></td>
                    <td>
                      <router-link :to="`/lovaink/${selectedHorse.sire.id}`">
                        {{ selectedHorse.sire.name }}
                      </router-link>
                    </td>
                  </tr>
                  <tr v-if="selectedHorse.dam">
                    <td><strong>Anyakanca</strong></td>
                    <td>
                      <router-link :to="`/lovaink/${selectedHorse.dam.id}`">
                        {{ selectedHorse.dam.name }}
                      </router-link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Contact Info -->
            <div class="alert alert-info">
              <strong>Érdeklődéshez:</strong>
              <p class="mb-0 mt-2">
                Kérjük, vedd fel velünk a kapcsolatot az elérhetőségeink segítségével!
              </p>
            </div>
          </div>
        </div>

        <!-- Not Found -->
        <div v-else class="alert alert-warning">
          <strong>Ló nem található.</strong>
        </div>

        <!-- Related Horses (same gender) -->
        <div v-if="selectedHorse && relatedHorses.length > 0" class="mt-5 pt-5 border-top">
          <h3 class="mb-4">
            <i class="bi bi-heart me-2"></i>
            Hasonló lovaink
          </h3>
          <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            <div
              v-for="horse in relatedHorses"
              :key="horse.id"
              class="col"
            >
              <div class="card h-100 shadow-sm related-horse-card">
                <!-- Image -->
                <div class="related-horse-image bg-light overflow-hidden">
                  <img
                    v-if="horse.main_img_url"
                    :src="horse.main_img_url"
                    :alt="horse.name"
                    class="card-img-top w-100 h-100"
                    style="object-fit: cover"
                  />
                  <div v-else class="d-flex align-items-center justify-content-center h-100">
                    <span class="text-muted small">Nincs kép</span>
                  </div>
                </div>

                <!-- Body -->
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title flex-grow-1">{{ horse.name }}</h5>
                  <p class="text-muted small mb-3">
                    {{ horse.gender === 'female' ? '♀ Kanca' : '♂ Mén' }}
                    <span v-if="horse.birth_date"> • {{ formatDate(horse.birth_date) }}</span>
                  </p>
                  <router-link
                    :to="`/lovaink/${horse.id}`"
                    class="btn btn-sm btn-outline-primary"
                  >
                    Részletek
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.image-container {
  position: relative;
  height: 300px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: bold;
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 300"><rect fill="%23333" width="1200" height="300"/></svg>');
}

.image-container .overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  object-fit: contain;
}

.image-container .text {
  position: relative;
  z-index: 2;
}

.related-horse-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.related-horse-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2) !important;
}

.related-horse-image {
  width: 100%;
  height: 200px;
}
</style>
