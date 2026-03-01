<script setup>
import { ref, computed, onMounted } from "vue";
import { fetchRacehorses, fetchAllHorses, setRacehorse } from "@/services/horseService.js";

const racehorses = ref([]);
const allHorses = ref([]);
const selectedAddId = ref("");
const loading = ref(false);
const actionLoading = ref(false);
const error = ref("");

const addOptions = computed(() =>
  allHorses.value.filter((h) => !racehorses.value.some((r) => r.id === h.id))
);

async function load() {
  loading.value = true;
  error.value = "";
  try {
    [racehorses.value, allHorses.value] = await Promise.all([
      fetchRacehorses(),
      fetchAllHorses({ include_pedigree_only: false }),
    ]);
    selectedAddId.value = addOptions.value[0]?.id || "";
  } catch (e) {
    error.value = e.message || "Betöltési hiba";
  } finally {
    loading.value = false;
  }
}

async function addRacehorse() {
  if (!selectedAddId.value) return;
  actionLoading.value = true;
  error.value = "";
  try {
    await setRacehorse(selectedAddId.value, true);
    await load();
  } catch (e) {
    error.value = e.message || "Hiba a hozzáadás során";
  } finally {
    actionLoading.value = false;
  }
}

async function removeRacehorse(id) {
  actionLoading.value = true;
  error.value = "";
  try {
    await setRacehorse(id, false);
    await load();
  } catch (e) {
    error.value = e.message || "Hiba az eltávolítás során";
  } finally {
    actionLoading.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
      <h2 class="mb-0">Aktív versenylovak</h2>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <!-- Add form -->
    <div class="card mb-4 p-3">
      <div class="row g-2 align-items-end">
        <div class="col">
          <label class="form-label mb-1 small">Versenyló hozzáadása</label>
          <select
            v-if="addOptions.length"
            v-model="selectedAddId"
            class="form-select"
          >
            <option v-for="h in addOptions" :key="h.id" :value="h.id">
              {{ h.name }} ({{ h.gender === 'male' ? '♂ Mén' : '♀ Kanca' }})
            </option>
          </select>
          <p v-else class="text-muted small mb-0 mt-1">
            Minden ló versenyló már.
          </p>
        </div>
        <div class="col-auto">
          <button
            class="btn btn-success"
            :disabled="actionLoading || !addOptions.length || !selectedAddId"
            @click="addRacehorse"
          >
            <span v-if="actionLoading" class="spinner-border spinner-border-sm me-1"></span>
            <i v-else class="bi bi-plus-circle me-1"></i>
            Hozzáadás
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Betöltés...</span>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="!racehorses.length" class="alert alert-info">
      Jelenleg nincsenek aktív versenylovak.
    </div>

    <!-- Table -->
    <div v-else class="table-responsive">
      <table class="table table-hover">
        <thead class="table-light text-center">
          <tr>
            <th class="d-none d-sm-table-cell">Kép</th>
            <th>Név</th>
            <th>Nem</th>
            <th class="d-none d-md-table-cell">Születési dátum</th>
            <th>Művelet</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="horse in racehorses" :key="horse.id">
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
              <span v-if="horse.gender === 'male'" class="badge bg-info">♂ Mén</span>
              <span v-else-if="horse.gender === 'female'" class="badge bg-warning">♀ Kanca</span>
              <span v-else class="badge bg-secondary">Ismeretlen</span>
            </td>
            <td class="d-none d-md-table-cell">{{ horse.birth_date ? horse.birth_date.slice(0, 4) : '—' }}</td>
            <td>
              <button
                class="btn btn-sm btn-outline-danger"
                :disabled="actionLoading"
                @click="removeRacehorse(horse.id)"
                title="Eltávolítás a versenylovak közül"
              >
                <i class="bi bi-x-circle me-1"></i>Eltávolítás
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<style scoped>
thead th {

  background-color: var(--bg-light);
}
</style>