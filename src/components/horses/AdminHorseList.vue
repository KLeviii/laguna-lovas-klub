<template>
  <div class="admin-horse-list">
    <!-- Header with New button -->
    <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
      <h2 class="mb-0">Lovak kezelése</h2>
      <button class="btn btn-primary btn-sm" @click="goToCreate">
        <i class="bi bi-plus-circle me-1"></i>Új ló
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
      Nincsenek lovak. Hozz létre egy újat!
    </div>

    <!-- Table -->
    <div v-if="!loading && !isEmpty" class="table-responsive">
      <table class="table table-hover">
        <thead class="table-light">
          <tr class="text-center">
            <th class="d-none d-md-table-cell">ID</th>
            <th class="d-none d-sm-table-cell">Kép</th>
            <th>Név</th>
            <th>Nem</th>
            <th class="d-none d-md-table-cell">Születési dátum</th>
            <th class="d-none d-lg-table-cell">Eladó</th>
            <th>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="horse in horses" :key="horse.id">
            <td class="fw-monospace text-muted d-none d-md-table-cell" style="font-size: 0.9rem">
              {{ horse.id.substring(0, 8) }}
            </td>
            <td class="d-none d-sm-table-cell">
              <img
                v-if="horse.main_img_url"
                :src="horse.main_img_url"
                :alt="horse.name"
                style="max-width: 50px; max-height: 50px; object-fit: cover"
              />
              <span v-else class="text-muted">—</span>
            </td>
            <td class="fw-bold">{{ horse.name }}</td>
            <td>
              <span v-if="horse.gender === 'male'" class="badge bg-info">
                ♂ Mén
              </span>
              <span
                v-else-if="horse.gender === 'female'"
                class="badge bg-warning"
              >
                ♀ Kanca
              </span>
              <span v-else class="badge bg-secondary">Ismeretlen</span>
            </td>
            <td class="d-none d-md-table-cell">{{ formatDate(horse.birth_date) }}</td>
            <td class="d-none d-lg-table-cell">
              <span
                :class="horse.is_for_sale ? 'badge bg-success' : 'badge bg-danger'"
              >
                {{ horse.is_for_sale ? "Igen" : "Nem" }}
              </span>
            </td>
            <td>
              <div class="btn-group btn-group-sm">
                <button
                  class="btn btn-outline-primary"
                  @click="goToEdit(horse.id)"
                  title="Szerkesztés"
                >
                  <i class="bi bi-pencil"></i>
                  <span class="d-none d-lg-inline ms-1">Szerkesztés</span>
                </button>
                <button
                  class="btn btn-outline-danger"
                  @click="confirmDelete(horse.id, horse.name)"
                  title="Törlés"
                >
                  <i class="bi bi-trash"></i>
                  <span class="d-none d-lg-inline ms-1">Törlés</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useHorses } from "../../composables/useHorses.js";
import { formatDate } from "@/utils/formatting.js";

const router = useRouter();
const { horses, loading, error, isEmpty, loadHorses, deleteHorse } = useHorses();

// Load all horses (without filters) when component mounts
onMounted(() => {
  loadHorses(false); // false = show all horses, not just available ones
});

function goToCreate() {
  router.push("/admin/horses/new");
}

function goToEdit(horseId) {
  router.push(`/admin/horses/${horseId}/edit`);
}

async function confirmDelete(horseId, horseName) {
  if (
    !confirm(
      `Biztosan szeretnéd törölni a(z) "${horseName}" lovat? Ez a művelet nem visszavonható.`,
    )
  ) {
    return;
  }

  const success = await deleteHorse(horseId);
  if (success) {
    alert(`"${horseName}" sikeresen törölve.`);
    error.value = null; // Clear error after successful delete reload
  } else {
    alert(error.value || "Hiba a törlés során. Próbáld meg később!");
  }
}
</script>

<style scoped>
.admin-horse-list {
  padding: 1rem;
}

thead th {
  background-color: var(--bg-light) !important;
}

.table-hover tbody tr:hover {
  background-color: var(--bg-light);
}
</style>
