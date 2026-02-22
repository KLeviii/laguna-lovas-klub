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
    <div class="card-header bg-primary text-white">
      <h5 class="mb-0">
        {{ editingCategoryId ? "Kategória szerkesztése" : "Új kategória felvétele" }}
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
        <!-- Kategória név -->
        <div class="mb-3">
          <label for="categoryName" class="form-label">Kategória neve *</label>
          <input
            id="categoryName"
            v-model="categoryName"
            type="text"
            class="form-control"
            placeholder="pl. Nyeregfelszerelés"
            required
          />
        </div>

        <!-- Slug -->
        <div class="mb-3">
          <label for="categorySlug" class="form-label"
            >Slug (URL-barát) *</label
          >
          <input
            id="categorySlug"
            v-model="categorySlug"
            type="text"
            class="form-control"
            placeholder="pl. nyeregfelszereles"
            required
          />
          <small class="text-muted">Kisbetűk, számok és kötőjel csak</small>
        </div>

        <!-- Leírás -->
        <div class="mb-3">
          <label for="categoryDescription" class="form-label">Leírás</label>
          <textarea
            id="categoryDescription"
            v-model="categoryDescription"
            class="form-control"
            rows="3"
            placeholder="Kategória leírása (opcionális)"
          ></textarea>
        </div>

        <!-- Display Order -->
        <div class="mb-3">
          <label for="categoryDisplayOrder" class="form-label"
            >Megjelenítési sorrend</label
          >
          <input
            id="categoryDisplayOrder"
            v-model.number="categoryDisplayOrder"
            type="number"
            class="form-control"
            min="0"
            placeholder="0"
          />
          <small class="text-muted">Kisebb szám = előbb jelenik meg</small>
        </div>

        <!-- Action Buttons -->
        <div class="d-flex gap-2">
          <button type="submit" class="btn btn-success" :disabled="loading">
            <span
              v-if="loading"
              class="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            {{ editingCategoryId ? "Mentés" : "Hozzáadás" }}
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
    </div>
  </div>
</template>

<script setup>
import { useProductForm } from "@/composables/useProductForm.js";

const {
  categoryName,
  categorySlug,
  categoryDescription,
  categoryDisplayOrder,
  editingCategoryId,
  loading,
  error,
  clearCategoryForm,
  loadCategoryForEdit,
  saveCategory,
} = useProductForm();

const emit = defineEmits(["saved", "cancel"]);

const handleSubmit = async () => {
  const success = await saveCategory();
  if (success) {
    emit("saved");
  }
};

const handleCancel = () => {
  clearCategoryForm();
  emit("cancel");
};

// Expose for parent component
defineExpose({
  loadCategoryForEdit,
});
</script>
