<template>
  <div class="admin-category-list">
    <!-- Header with New button -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Kategóriák kezelése</h2>
      <button class="btn btn-primary" @click="$emit('create-category')">
        <i class="bi bi-plus-circle"></i> Új kategória hozzáadása
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
    <div v-if="!loading && categories.length === 0" class="alert alert-info" role="alert">
      Nincsenek kategóriák. Hozz létre egy újat!
    </div>

    <!-- Table -->
    <div v-if="!loading && categories.length > 0" class="table-responsive">
      <table class="table table-hover">
        <thead class="table-light">
          <tr class="text-center">
            <th>Név</th>
            <th>Slug</th>
            <th>Leírás</th>
            <th>Sorrend</th>
            <th>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cat in categories" :key="cat.id">
            <td class="fw-bold">{{ cat.name }}</td>
            <td class="text-muted">{{ cat.slug }}</td>
            <td class="text-muted">{{ cat.description || '—' }}</td>
            <td>{{ cat.display_order }}</td>
            <td>
              <button
                class="btn btn-sm btn-outline-primary me-2"
                @click="$emit('edit-category', cat)"
                title="Szerkesztés"
              >
                <i class="bi bi-pencil"></i> Szerkesztés
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="confirmDeleteCategory(cat.id, cat.name)"
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
import { ref, onMounted } from 'vue'
import { fetchProductCategories, deleteProductCategory } from '@/services/productService.js'

const categories = ref([])
const loading = ref(false)
const error = ref(null)

defineEmits(['edit-category', 'create-category'])

onMounted(() => {
  loadCategories()
})

async function loadCategories() {
  loading.value = true
  error.value = null
  try {
    categories.value = await fetchProductCategories()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

async function confirmDeleteCategory(categoryId, categoryName) {
  if (!confirm(`Biztosan szeretnéd törölni a(z) "${categoryName}" kategóriát? Ez a művelet nem visszavonható.`)) {
    return
  }

  try {
    await deleteProductCategory(categoryId)
    alert(`"${categoryName}" sikeresen törölve.`)
    await loadCategories()
  } catch (err) {
    alert('Hiba a törlés során. Próbáld meg később!')
  }
}

defineExpose({ loadCategories })
</script>

<style scoped>
.admin-category-list {
  padding: 1rem;
}

thead th {
  background-color: var(--bg-light) !important;
}

.table-hover tbody tr:hover {
  background-color: var(--bg-light);
}
</style>
