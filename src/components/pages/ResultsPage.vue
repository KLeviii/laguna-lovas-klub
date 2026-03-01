<script setup>
import { ref, onMounted } from "vue";
import { useAuth } from "@/composables/useAuth";
import { useCompetitions } from "@/composables/useCompetitions.js";
import { fetchRacehorses } from "@/services/horseService.js";
import { formatDate } from "@/utils/formatting.js";
import { useHead } from "@/composables/useHead";

useHead("Eredményeink", "Laguna Lovasklub versenyeredményei és díjai.");

const { isAuthenticated } = useAuth();
const { loading, error, isEmpty, competitionsByYear, stats, loadCompetitions } =
  useCompetitions();
const racehorsesCount = ref(0);
function placementBadgeClass(placement) {
  if (placement === 1) return "bg-warning text-dark";
  if (placement === 2) return "bg-secondary";
  if (placement === 3) return "bg-danger";
  return "bg-primary";
}

onMounted(async () => {
  await loadCompetitions();
  const racehorses = await fetchRacehorses().catch(() => []);
  racehorsesCount.value = racehorses.length;
});
</script>

<template>
  <div>
    <main>
      <div class="image-container">
        <div class="overlay"></div>
        <div class="text">Eredményeink</div>
      </div>

      <!-- Statisztikák -->
      <section class="p-3 p-md-4">
        <div>
          <div class="row justify-content-center">
            <div class="col-12 col-md-4 mb-4">
              <div class="card">
                <div class="d-flex justify-content-center align-items-center">
                  <i class="bi bi-person-fill fs-1 me-2"></i>
                  <h3 class="m-2">{{ stats.uniqueJockeys }}</h3>
                </div>
                <h3 class="text-center mt-3">Aktív versenyző</h3>
              </div>
            </div>
            <div class="col-12 col-md-4 mb-4">
              <div class="card">
                <div class="d-flex justify-content-center align-items-center">
                  <i class="bi bi-lightning-fill fs-1 me-2"></i>
                  <h3 class="m-2">{{ racehorsesCount }}</h3>
                </div>
                <h3 class="text-center mt-3">Aktív versenyló</h3>
              </div>
            </div>
            <div class="col-12 col-md-4 mb-4">
              <div class="card">
                <div class="d-flex justify-content-center align-items-center">
                  <i class="bi bi-award-fill fs-1 me-2"></i>
                  <h3 class="m-2">{{ stats.totalPlacements }}</h3>
                </div>
                <h3 class="text-center mt-3">Elért helyezés</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Versenyeredmények -->
      <section class="p-3 p-md-5">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="mb-0">Versenyeredmények</h2>
          <router-link
            v-if="isAuthenticated"
            to="/admin/competitions"
            class="btn btn-primary"
          >
            <i class="bi bi-pencil-square me-2"></i>
            Versenyek kezelése
          </router-link>
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
            class="btn btn-sm btn-outline-danger mt-2 d-block"
            @click="loadCompetitions"
          >
            Újrapróbálkozás
          </button>
        </div>

        <!-- Üres állapot -->
        <div v-else-if="isEmpty" class="alert alert-info text-center py-5">
          <h4>Még nincsenek versenyeredmények</h4>
          <p class="text-muted">Hamarosan frissítjük!</p>
        </div>

        <!-- Évek szerinti accordion -->
        <div v-else>
          <div
            v-for="(yearGroup, groupIndex) in competitionsByYear"
            :key="yearGroup.year"
            class="accordion mb-3"
            :id="'accordion-year-' + yearGroup.year"
          >
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button
                  class="accordion-button"
                  :class="{ collapsed: groupIndex !== 0 }"
                  type="button"
                  data-bs-toggle="collapse"
                  :data-bs-target="'#collapse-year-' + yearGroup.year"
                  :aria-expanded="groupIndex === 0 ? 'true' : 'false'"
                  :aria-controls="'collapse-year-' + yearGroup.year"
                >
                  {{ yearGroup.year }}
                  <span class="badge bg-primary ms-2">
                    {{ yearGroup.competitions.length }} verseny
                  </span>
                </button>
              </h2>
              <div
                :id="'collapse-year-' + yearGroup.year"
                class="accordion-collapse collapse"
                :class="{ show: groupIndex === 0 }"
                :data-bs-parent="'#accordion-year-' + yearGroup.year"
              >
                <div class="accordion-body p-0">
                  <!-- Versenyenkénti belső accordion -->
                  <div
                    class="accordion accordion-flush"
                    :id="'accordion-comps-' + yearGroup.year"
                  >
                    <div
                      v-for="comp in yearGroup.competitions"
                      :key="comp.id"
                      class="accordion-item"
                    >
                      <h2 class="accordion-header">
                        <button
                          class="accordion-button collapsed ps-4"
                          type="button"
                          data-bs-toggle="collapse"
                          :data-bs-target="'#collapse-comp-' + comp.id"
                          aria-expanded="false"
                          :aria-controls="'collapse-comp-' + comp.id"
                        >
                          <div class="d-flex flex-column">
                            <span class="fw-bold">{{ comp.name }}</span>
                            <small class="">
                              <i class="bi bi-geo-alt me-1"></i
                              >{{ comp.location }}
                              &nbsp;|&nbsp;
                              <i class="bi bi-calendar me-1"></i
                              >{{ formatDate(comp.start_date) }}
                              <span
                                v-if="
                                  comp.end_date &&
                                  comp.end_date !== comp.start_date
                                "
                              >
                                &nbsp;–&nbsp;{{ formatDate(comp.end_date) }}
                              </span>
                            </small>
                          </div>
                        </button>
                      </h2>
                      <div
                        :id="'collapse-comp-' + comp.id"
                        class="accordion-collapse collapse"
                        :data-bs-parent="'#accordion-comps-' + yearGroup.year"
                      >
                        <div class="accordion-body ps-4">
                          <!-- Verseny kép -->
                          <img
                            v-if="comp.image_url"
                            :src="comp.image_url"
                            :alt="comp.name"
                            class="img-fluid rounded mb-3"
                            style="
                              max-height: 200px;
                              object-fit: cover;
                              width: 100%;
                            "
                            loading="lazy"
                          />

                          <!-- Leírás -->
                          <p v-if="comp.description" class="text-muted mb-3">
                            {{ comp.description }}
                          </p>

                          <!-- Nincs eredmény -->
                          <p
                            v-if="
                              !comp.competition_results ||
                              comp.competition_results.length === 0
                            "
                            class="text-muted fst-italic"
                          >
                            Ehhez a versenyhez még nem rögzítettünk
                            eredményeket.
                          </p>

                          <!-- Eredmények táblázat -->
                          <div v-else class="table-responsive">
                            <table class="table table-sm">
                              <thead>
                                <tr class="text-center">
                                  <th>Helyezés</th>
                                  <th>Versenyző</th>
                                  <th>Ló</th>
                                  <th>Szakág</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr
                                  v-for="result in comp.competition_results"
                                  :key="result.id"
                                >
                                  <td>
                                    <span
                                      v-if="result.placement != null"
                                      class="badge"
                                      :class="
                                        placementBadgeClass(result.placement)
                                      "
                                    >
                                      {{ result.placement }}. hely
                                    </span>
                                    <span v-else class="text-muted">—</span>
                                  </td>
                                  <td>{{ result.jockey_name || "—" }}</td>
                                  <td>{{ result.horse?.name || "—" }}</td>
                                  <td>{{ result.discipline || "—" }}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
.accordion-button.show small i{
  color: var(--bg) !important;
}
</style>
