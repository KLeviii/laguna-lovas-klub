<template>
  <div class="card mt-4">
    <div class="card-header bg-primary text-white">
      <h5 class="mb-0">
        {{ editingProductId ? 'Termék szerkesztése' : 'Új termék' }}
      </h5>
    </div>
    <div class="card-body">
      <!-- Error Alert -->
      <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
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
            class="form-select"
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

        <!-- Elérhetőség -->
        <div class="mb-3 form-check">
          <input
            id="productAvailable"
            v-model="isProductAvailable"
            type="checkbox"
            class="form-check-input"
          />
          <label for="productAvailable" class="form-check-label">
            Elérhető
          </label>
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
            <label for="productImageFile" class="form-label">Képfájl kiválasztása</label>
            <input
              id="productImageFile"
              type="file"
              class="form-control"
              accept="image/*"
              @change="handleImageChange"
            />
            <small class="text-muted">Max. 5MB, JPG/PNG/WebP</small>
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
            <span v-if="loading || uploadingImage" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            {{ editingProductId ? 'Mentés' : 'Hozzáadás' }}
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
import { ref, onMounted } from 'vue'
import { useProductForm } from '@/composables/useProductForm.js'
import { fetchProductCategories } from '@/services/productService.js'

const {
  productName,
  productDescription,
  productPrice,
  selectedCategoryId,
  isProductAvailable,
  productImageUrl,
  productImageFile,
  formattedPrice,
  editingProductId,
  loading,
  error,
  uploadingImage,
  clearProductForm,
  loadProductForEdit,
  saveProduct,
  handleImageSelect,
} = useProductForm()

const categories = ref([])
const emit = defineEmits(['saved', 'cancel'])

// Load categories on mount
onMounted(async () => {
  try {
    categories.value = await fetchProductCategories()
  } catch (err) {
    console.error('Error loading categories:', err)
  }
})

const handleImageChange = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    handleImageSelect(file)
  }
}

const handleSubmit = async () => {
  const success = await saveProduct()
  if (success) {
    emit('saved')
  }
}

const handleCancel = () => {
  clearProductForm()
  emit('cancel')
}

// Expose for parent component
defineExpose({
  loadProductForEdit,
})
</script>
