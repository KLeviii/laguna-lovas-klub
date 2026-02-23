<template>
  <div class="admin-competition-list">
    <!-- Header with New button -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Versenyek kezelése</h2>
      <button class="btn btn-primary" @click="goToCreate">
        <i class="bi bi-plus-circle"></i> Új verseny hozzáadása
      </button>
    </div>

    <!-- Loading spinner -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Betöltés...</span>
      </div>
    </div>

    <!-- Error message -->
    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <!-- Empty state -->
    <div v-if="!loading && isEmpty" class="alert alert-info" role="alert">
      Nincsenek versenyek. Hozz létre egy újat!
    </div>

    <!-- Table -->
    <div v-if="!loading && !isEmpty" class="table-responsive">
      <table class="table table-hover">
        <thead class="table-light">
          <tr class="text-center">
            <th>ID</th>
            <th>Kép</th>
            <th>Név</th>
            <th>Helyszín</th>
            <th>Dátum</th>
            <th>Eredmények</th>
            <th>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="comp in competitions" :key="comp.id">
            <td class="fw-monospace text-muted" style="font-size: 0.9rem">
              {{ comp.id.substring(0, 8) }}
            </td>
            <td>
              <img
                v-if="comp.image_url"
                :src="comp.image_url"
                :alt="comp.name"
                style="max-width: 50px; max-height: 50px; object-fit: cover"
              />
              <span v-else class="text-muted">—</span>
            </td>
            <td class="fw-bold">{{ comp.name }}</td>
            <td>{{ comp.location }}</td>
            <td>
              {{ formatDate(comp.start_date) }}
              <span
                v-if="comp.end_date && comp.end_date !== comp.start_date"
              >
                – {{ formatDate(comp.end_date) }}
              </span>
            </td>
            <td class="text-center">
              <span class="badge bg-info">
                {{ (comp.competition_results || []).length }}
              </span>
            </td>
            <td>
              <button
                class="btn btn-sm btn-outline-primary me-2"
                @click="goToEdit(comp.id)"
                title="Szerkesztés"
              >
                <i class="bi bi-pencil"></i> Szerkesztés
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="confirmDelete(comp.id, comp.name)"
                title="Törlés"
              >
                <i class="bi bi-trash"></i> Törlés
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { useCompetitions } from "@/composables/useCompetitions.js";
import { deleteCompetition } from "@/services/competitionService.js";
import { formatDate } from "@/utils/formatting";

const router = useRouter();
const { competitions, loading, error, isEmpty, loadCompetitions } =
  useCompetitions();

onMounted(() => {
  loadCompetitions();
});

function goToCreate() {
  router.push("/admin/competitions/new");
}

function goToEdit(id) {
  router.push(`/admin/competitions/${id}/edit`);
}

async function confirmDelete(id, name) {
  if (
    !confirm(
      `Biztosan szeretnéd törölni a(z) "${name}" versenyt? Ez a verseny összes eredményét is törli. Ez a művelet nem visszavonható.`
    )
  ) {
    return;
  }

  try {
    await deleteCompetition(id);
    alert(`"${name}" sikeresen törölve.`);
    loadCompetitions();
  } catch (err) {
    alert(`Hiba a törlés során: ${err.message}`);
  }
}
</script>

<style scoped>
.admin-competition-list {
  padding: 1rem;
}

thead th {
  background-color: var(--bg-light) !important;
}

.table-hover tbody tr:hover {
  background-color: var(--bg-light);
}
</style>
