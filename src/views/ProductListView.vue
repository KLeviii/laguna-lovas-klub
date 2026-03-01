<script setup>
import { onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useProducts } from '@/composables/useProducts'
import { useHead } from '@/composables/useHead'

useHead('Webshop', 'Laguna Lovasklub webshop — lovas felszerelések és kiegészítők.')
import ProductCard from '@/components/webshop/ProductCard.vue'
import ProductFilter from '@/components/webshop/ProductFilter.vue'

const { isAuthenticated } = useAuth()
const {
  products,
  categories,
  categoryFilter,
  loading,
  error,
  isEmpty,
  loadProducts,
  loadCategories,
  setProductCategory,
  clearProductFilter,
} = useProducts()

onMounted(() => {
  loadProducts()
  loadCategories()
})

</script>

<template>
  <div>
    <main>
      <div class="image-container">
        <div class="overlay"></div>
        <div class="text">Termékeink</div>
      </div>
      <section class="p-3 p-md-5">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="mb-0">Termékeink</h2>

          <!-- Admin button - only visible when logged in -->
          
          <router-link
            v-if="isAuthenticated"
            to="/admin/products"
            class="btn btn-primary"
          >
            <i class="bi bi-pencil-square me-2"></i>
            Webshop kezelése
          </router-link>
        </div>

        <!-- Filter -->
        <ProductFilter
          :categories="categories"
          :selected-category="categoryFilter"
          @select-category="setProductCategory"
          @clear-filter="clearProductFilter"
        />

        <!-- Loading -->
        <div v-if="loading" class="d-flex justify-content-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Betöltés...</span>
          </div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="alert alert-danger">
          <strong>Hiba:</strong> {{ error }}
          <button
            class="btn btn-sm btn-outline-danger mt-2"
            @click="loadProducts"
          >
            Újrapróbálkozás
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="isEmpty" class="alert alert-info text-center py-5">
          <h4>Nincsenek termékek az adatbázisban</h4>
          <p class="text-muted">Hamarosan lesz!</p>
        </div>

        <!-- Product Grid -->
        <div v-else class="row g-4">
          <div
            v-for="product in products"
            :key="product.id"
            class="col-12 col-md-6 col-lg-4"
          >
            <ProductCard :product="product" />
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
