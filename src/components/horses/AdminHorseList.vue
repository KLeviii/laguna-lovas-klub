<template>
  <div class="admin-horse-list">
    <!-- Header with New button -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Lovak kezelése</h2>
      <button class="btn btn-primary" @click="goToCreate">
        <i class="bi bi-plus-circle"></i> Új ló hozzáadása
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
            <th>ID</th>
            <th>Kép</th>
            <th>Név</th>
            <th>Nem</th>
            <th>Születési év</th>
            <th>Eladásra kínálva</th>
            <th>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="horse in horses" :key="horse.id">
            <td class="fw-monospace text-muted" style="font-size: 0.9rem">
              {{ horse.id.substring(0, 8) }}
            </td>
            <td>
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
            <td>{{ horse.birth_date || "—" }}</td>
            <td>
              <span
                :class="horse.is_for_sale ? 'badge bg-success' : 'badge bg-danger'"
              >
                {{ horse.is_for_sale ? "Igen" : "Nem" }}
              </span>
            </td>
            <td>
              <button
                class="btn btn-sm btn-outline-primary me-2"
                @click="goToEdit(horse.id)"
                title="Szerkesztés"
              >
                <i class="bi bi-pencil"></i> Szerkesztés
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="confirmDelete(horse.id, horse.name)"
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
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useHorses } from "../../composables/useHorses.js";

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

.table-hover tbody tr:hover {
  background-color: var(--bg-light);
}
</style>
