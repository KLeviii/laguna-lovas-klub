<style scoped>
h5 {
  color: var(--bg-dark) !important;
}
.light h5 {
  color: var(--highlight) !important;
}
</style>

<template>
  <div class="card m-5 pt-0">
    <div class="card-header bg-primary text-center">
      <h5 class="mb-0">
        {{
          editingCompetitionId
            ? "Verseny szerkesztése"
            : "Új verseny felvétele"
        }}
      </h5>
    </div>
    <div class="card-body">
      <!-- Error Alert -->
      <div
        v-if="error"
        class="alert alert-danger alert-dismissible fade show"
        role="alert"
      >
        {{ error }}
        <button
          type="button"
          class="btn-close"
          aria-label="Close"
          @click="error = null"
        ></button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit">
        <!-- Verseny név -->
        <div class="mb-3">
          <label for="competitionName" class="form-label"
            >Verseny neve *</label
          >
          <input
            id="competitionName"
            v-model="competitionName"
            type="text"
            class="form-control"
            placeholder="pl. Magyar Bajnokság 2025"
            required
          />
        </div>

        <!-- Helyszín -->
        <div class="mb-3">
          <label for="competitionLocation" class="form-label"
            >Helyszín *</label
          >
          <input
            id="competitionLocation"
            v-model="competitionLocation"
            type="text"
            class="form-control"
            placeholder="pl. Budapest"
            required
          />
        </div>

        <!-- Dátumok -->
        <div class="row mb-3">
          <div class="col-md-6">
            <label for="startDate" class="form-label">Kezdő dátum *</label>
            <input
              id="startDate"
              v-model="startDate"
              type="date"
              class="form-control"
              required
            />
          </div>
          <div class="col-md-6">
            <label for="endDate" class="form-label">Záró dátum</label>
            <input
              id="endDate"
              v-model="endDate"
              type="date"
              class="form-control"
              :min="startDate"
            />
          </div>
        </div>

        <!-- Leírás -->
        <div class="mb-3">
          <label for="competitionDescription" class="form-label"
            >Leírás</label
          >
          <textarea
            id="competitionDescription"
            v-model="competitionDescription"
            class="form-control"
            rows="3"
            placeholder="Verseny leírása (opcionális)"
          ></textarea>
        </div>

        <!-- Kép upload section -->
        <div class="mb-3 p-3 border rounded bg-light">
          <h6 class="mb-3">Verseny kép</h6>

          <!-- Jelenlegi kép preview -->
          <div v-if="competitionImageUrl" class="mb-3">
            <p class="text-muted small mb-2">Jelenlegi kép:</p>
            <img
              :src="competitionImageUrl"
              :alt="competitionName || 'Verseny kép'"
              style="max-width: 150px; max-height: 150px; object-fit: cover"
              class="rounded"
            />
          </div>

          <!-- File input -->
          <div class="mb-2">
            <label for="competitionImageFile" class="form-label"
              >Képfájl kiválasztása</label
            >
            <input
              id="competitionImageFile"
              type="file"
              class="form-control"
              accept="image/*"
              @change="handleImageChange"
            />
            <small class="text-muted">Max. 50MB, JPG/PNG/WebP</small>
          </div>

          <!-- Upload progress -->
          <div v-if="uploadingImage" class="progress">
            <div
              class="progress-bar progress-bar-striped progress-bar-animated"
              role="progressbar"
              style="width: 100%"
            ></div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="d-flex gap-2">
          <button
            type="submit"
            class="btn btn-success"
            :disabled="loading || uploadingImage"
          >
            <span
              v-if="loading || uploadingImage"
              class="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            {{ editingCompetitionId ? "Mentés" : "Hozzáadás" }}
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            @click="handleCancel"
            :disabled="loading"
          >
            Mégse
          </button>
        </div>
      </form>

      <!-- Eredmények szekció (csak szerkesztéskor) -->
      <div v-if="editingCompetitionId" class="mt-5">
        <hr />
        <h5 class="mb-3">
          <i class="bi bi-trophy me-2"></i>Eredmények
        </h5>

        <!-- Meglévő eredmények -->
        <div v-if="results.length > 0" class="table-responsive mb-3">
          <table class="table table-sm">
            <thead class="table-light">
              <tr>
                <th>Versenyző</th>
                <th>Ló</th>
                <th>Szakág</th>
                <th>Helyezés</th>
                <th>Elismerés</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="result in results" :key="result.id">
                <td>{{ result.jockey_name }}</td>
                <td>{{ result.horse?.name || "—" }}</td>
                <td>{{ result.discipline }}</td>
                <td>
                  <span v-if="result.placement != null">
                    {{ result.placement }}. hely
                  </span>
                  <span v-else class="text-muted">—</span>
                </td>
                <td>{{ result.achievement || "—" }}</td>
                <td>
                  <button
                    class="btn btn-sm btn-outline-danger"
                    @click="confirmDeleteResult(result.id)"
                    :disabled="loading"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="text-muted fst-italic">
          Még nincsenek eredmények ehhez a versenyhez.
        </p>

        <!-- Új eredmény hozzáadása form -->
        <div class="card bg-light">
          <div class="card-body">
            <h6 class="card-title mb-3">Új eredmény hozzáadása</h6>
            <div class="row g-2">
              <div class="col-md-3">
                <input
                  v-model="newResult.jockey_name"
                  type="text"
                  class="form-control form-control-sm"
                  placeholder="Versenyző neve *"
                />
              </div>
              <div class="col-md-2">
                <select
                  v-model="newResult.horse_id"
                  class="form-select form-select-sm"
                >
                  <option :value="null">Ló (opcionális)</option>
                  <option
                    v-for="horse in horses"
                    :key="horse.id"
                    :value="horse.id"
                  >
                    {{ horse.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-2">
                <input
                  v-model="newResult.discipline"
                  type="text"
                  class="form-control form-control-sm"
                  placeholder="Szakág *"
                />
              </div>
              <div class="col-md-2">
                <input
                  v-model.number="newResult.placement"
                  type="number"
                  class="form-control form-control-sm"
                  placeholder="Helyezés"
                  min="1"
                />
              </div>
              <div class="col-md-2">
                <input
                  v-model="newResult.achievement"
                  type="text"
                  class="form-control form-control-sm"
                  placeholder="Elismerés"
                />
              </div>
              <div class="col-md-1">
                <button
                  type="button"
                  class="btn btn-sm btn-success w-100"
                  @click="handleAddResult"
                  :disabled="loading"
                >
                  <i class="bi bi-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useCompetitionForm } from "@/composables/useCompetitionForm.js";
import { fetchCompetitionById } from "@/services/competitionService.js";
import { fetchAllHorses } from "@/services/horseService.js";

const route = useRoute();

const {
  competitionName,
  competitionLocation,
  startDate,
  endDate,
  competitionDescription,
  competitionImageUrl,
  competitionImageFile,
  editingCompetitionId,
  loading,
  error,
  uploadingImage,
  clearCompetitionForm,
  loadCompetitionForEdit,
  saveCompetition,
  handleImageSelect,
  addResult,
  removeResult,
} = useCompetitionForm();

const results = ref([]);
const horses = ref([]);
const emit = defineEmits(["saved", "cancel"]);

const newResult = reactive({
  jockey_name: "",
  horse_id: null,
  discipline: "",
  placement: null,
  achievement: "",
});

function clearNewResult() {
  newResult.jockey_name = "";
  newResult.horse_id = null;
  newResult.discipline = "";
  newResult.placement = null;
  newResult.achievement = "";
}

onMounted(async () => {
  try {
    horses.value = await fetchAllHorses();
  } catch (err) {
    console.error("Error loading horses:", err);
  }

  const competitionId = route.params?.id;
  if (competitionId) {
    try {
      const competition = await fetchCompetitionById(competitionId);
      if (competition) {
        loadCompetitionForEdit(competition);
        results.value = competition.competition_results || [];
      }
    } catch (err) {
      error.value = "Nem sikerült betölteni a versenyt";
      console.error("Error loading competition for edit:", err);
    }
  }
});

function handleImageChange(event) {
  const file = event.target.files?.[0];
  if (file) {
    handleImageSelect(file);
  }
}

async function handleSubmit() {
  const success = await saveCompetition();
  if (success) {
    emit("saved");
  }
}

function handleCancel() {
  clearCompetitionForm();
  emit("cancel");
}

async function handleAddResult() {
  if (!newResult.jockey_name.trim()) {
    error.value = "A versenyző neve kötelező";
    return;
  }
  if (!newResult.discipline.trim()) {
    error.value = "A szakág kötelező";
    return;
  }

  const resultData = {
    competition_id: editingCompetitionId.value,
    jockey_name: newResult.jockey_name.trim(),
    horse_id: newResult.horse_id || null,
    discipline: newResult.discipline.trim(),
    placement: newResult.placement || null,
    achievement: newResult.achievement.trim() || null,
  };

  const created = await addResult(resultData);
  if (created) {
    // Find horse name for display
    const horse = newResult.horse_id
      ? horses.value.find((h) => h.id === newResult.horse_id)
      : null;
    results.value.push({
      ...created,
      horse: horse ? { id: horse.id, name: horse.name } : null,
    });
    clearNewResult();
  }
}

async function confirmDeleteResult(resultId) {
  if (!confirm("Biztosan szeretnéd törölni ezt az eredményt?")) {
    return;
  }

  const success = await removeResult(resultId);
  if (success) {
    results.value = results.value.filter((r) => r.id !== resultId);
  }
}

defineExpose({
  loadCompetitionForEdit,
});
</script>
