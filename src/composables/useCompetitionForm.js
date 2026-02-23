import { ref } from "vue";
import {
  createCompetition,
  updateCompetition,
  createCompetitionResult,
  deleteCompetitionResult,
  uploadCompetitionImage,
} from "@/services/competitionService.js";

export function useCompetitionForm() {
  // Competition form state
  const competitionName = ref("");
  const competitionLocation = ref("");
  const startDate = ref("");
  const endDate = ref("");
  const competitionDescription = ref("");
  const competitionImageUrl = ref("");
  const competitionImageFile = ref(null);

  // Loading/error state
  const loading = ref(false);
  const error = ref(null);
  const uploadingImage = ref(false);

  // Track if editing
  const editingCompetitionId = ref(null);

  function clearCompetitionForm() {
    competitionName.value = "";
    competitionLocation.value = "";
    startDate.value = "";
    endDate.value = "";
    competitionDescription.value = "";
    competitionImageUrl.value = "";
    competitionImageFile.value = null;
    editingCompetitionId.value = null;
    error.value = null;
  }

  function loadCompetitionForEdit(competition) {
    competitionName.value = competition.name;
    competitionLocation.value = competition.location;
    startDate.value = competition.start_date || "";
    endDate.value = competition.end_date || "";
    competitionDescription.value = competition.description || "";
    competitionImageUrl.value = competition.image_url || "";
    competitionImageFile.value = null;
    editingCompetitionId.value = competition.id;
    error.value = null;
  }

  async function saveCompetition() {
    loading.value = true;
    error.value = null;

    try {
      if (!competitionName.value.trim()) {
        throw new Error("A verseny neve kötelező");
      }
      if (!competitionLocation.value.trim()) {
        throw new Error("A helyszín kötelező");
      }
      if (!startDate.value) {
        throw new Error("A kezdő dátum kötelező");
      }
      if (endDate.value && endDate.value < startDate.value) {
        throw new Error("A záró dátum nem lehet korábbi a kezdő dátumnál");
      }

      let imageUrl = competitionImageUrl.value;

      if (competitionImageFile.value) {
        uploadingImage.value = true;
        imageUrl = await uploadCompetitionImage(competitionImageFile.value);
      }

      const competitionData = {
        name: competitionName.value.trim(),
        location: competitionLocation.value.trim(),
        start_date: startDate.value,
        end_date: endDate.value || null,
        description: competitionDescription.value.trim() || null,
        image_url: imageUrl || null,
      };

      if (editingCompetitionId.value) {
        await updateCompetition(editingCompetitionId.value, competitionData);
      } else {
        await createCompetition(competitionData);
      }

      clearCompetitionForm();
      return true;
    } catch (err) {
      error.value = err.message;
      console.error("Error saving competition:", err);
      return false;
    } finally {
      loading.value = false;
      uploadingImage.value = false;
    }
  }

  function handleImageSelect(file) {
    if (!file) {
      competitionImageFile.value = null;
      return;
    }

    if (!file.type.startsWith("image/")) {
      error.value = "Csak képfájlok engedélyezettek";
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      error.value = "A fájl ne legyen nagyobb 50MB-nál";
      return;
    }

    competitionImageFile.value = file;
    error.value = null;
  }

  async function addResult(resultData) {
    loading.value = true;
    error.value = null;

    try {
      const created = await createCompetitionResult(resultData);
      return created;
    } catch (err) {
      error.value = err.message;
      console.error("Error adding result:", err);
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function removeResult(resultId) {
    loading.value = true;
    error.value = null;

    try {
      await deleteCompetitionResult(resultId);
      return true;
    } catch (err) {
      error.value = err.message;
      console.error("Error removing result:", err);
      return false;
    } finally {
      loading.value = false;
    }
  }

  return {
    // Form state
    competitionName,
    competitionLocation,
    startDate,
    endDate,
    competitionDescription,
    competitionImageUrl,
    competitionImageFile,
    editingCompetitionId,

    // State
    loading,
    error,
    uploadingImage,

    // Methods
    clearCompetitionForm,
    loadCompetitionForEdit,
    saveCompetition,
    handleImageSelect,
    addResult,
    removeResult,
  };
}
