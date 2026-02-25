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
        {{ editingProductId ? "Termék szerkesztése" : "Új termék felvétele" }}
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
        <!-- Kategória -->
        <div class="mb-3">
          <label for="productCategory" class="form-label">Kategória *</label>
          <select
            id="productCategory"
            v-model="selectedCategoryId"
            class="form-select me-3"
            required
          >
            <option :value="null">Válassz kategóriát...</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <!-- Termék név -->
        <div class="mb-3">
          <label for="productName" class="form-label">Termék neve *</label>
          <input
            id="productName"
            v-model="productName"
            type="text"
            class="form-control"
            placeholder="pl. Nyereg"
            required
          />
        </div>

        <!-- Termék leírás -->
        <div class="mb-3">
          <label for="productDescription" class="form-label">Leírás</label>
          <textarea
            id="productDescription"
            v-model="productDescription"
            class="form-control"
            rows="3"
            placeholder="Termék leírása (opcionális)"
          ></textarea>
        </div>

        <!-- Ár -->
        <div class="mb-3">
          <label for="productPrice" class="form-label">Ár (HUF) *</label>
          <div class="input-group">
            <input
              id="productPrice"
              v-model="productPrice"
              type="number"
              class="form-control"
              placeholder="0"
              min="0"
              required
            />
            <span class="input-group-text">Ft</span>
          </div>
          <small v-if="formattedPrice" class="text-muted">
            Formázott: {{ formattedPrice }} Ft
          </small>
        </div>

        <!-- Készlet -->
        <div class="mb-3">
          <label for="productStock" class="form-label">Készlet (db)</label>
          <input
            id="productStock"
            v-model.number="productStock"
            type="number"
            class="form-control"
            placeholder="0"
            min="0"
          />
        </div>

        <!-- Elérhetőség (readonly, stock alapján) -->
        <div class="mb-3">
          <span v-if="productStock > 0" class="badge bg-success">
            <i class="bi bi-check-circle me-1"></i>Elérhető
          </span>
          <span v-else class="badge bg-secondary">
            <i class="bi bi-x-circle me-1"></i>Nem elérhető (készlet: 0)
          </span>
        </div>

        <!-- Kép upload section -->
        <div class="mb-3 p-3 border rounded bg-light">
          <h6 class="mb-3">Termék kép</h6>

          <!-- Jelenlegi kép preview -->
          <div v-if="productImageUrl" class="mb-3">
            <p class="text-muted small mb-2">Jelenlegi kép:</p>
            <img
              :src="productImageUrl"
              :alt="productName || 'Termék kép'"
              style="max-width: 150px; max-height: 150px; object-fit: cover"
              class="rounded"
            />
          </div>

          <!-- File input -->
          <div class="mb-2">
            <label for="productImageFile" class="form-label"
              >Képfájl kiválasztása</label
            >
            <input
              id="productImageFile"
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
            {{ editingProductId ? "Mentés" : "Hozzáadás" }}
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
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useProductForm } from "@/composables/useProductForm.js";
import { fetchProductCategories, fetchProductById } from "@/services/productService.js";

const route = useRoute();

const {
  productName,
  productDescription,
  productPrice,
  selectedCategoryId,
  isProductAvailable,
  productImageUrl,
  productImageFile,
  productStock,
  formattedPrice,
  editingProductId,
  loading,
  error,
  uploadingImage,
  clearProductForm,
  loadProductForEdit,
  saveProduct,
  handleImageSelect,
} = useProductForm();

const categories = ref([]);
const emit = defineEmits(["saved", "cancel"]);

// Load categories on mount + load product if editing
onMounted(async () => {
  try {
    categories.value = await fetchProductCategories();
  } catch (err) {
    console.error("Error loading categories:", err);
  }

  // If route has an id param, load the product for editing
  const productId = route.params?.id;
  if (productId) {
    try {
      const product = await fetchProductById(productId);
      if (product) {
        loadProductForEdit(product);
      }
    } catch (err) {
      error.value = "Nem sikerült betölteni a terméket";
      console.error("Error loading product for edit:", err);
    }
  }
});

const handleImageChange = (event) => {
  const file = event.target.files?.[0];
  if (file) {
    handleImageSelect(file);
  }
};

const handleSubmit = async () => {
  const success = await saveProduct();
  if (success) {
    emit("saved");
  }
};

const handleCancel = () => {
  clearProductForm();
  emit("cancel");
};

// Expose for parent component
defineExpose({
  loadProductForEdit,
});
</script>
