<script setup>
import ProductCard from '@/components/webshop/ProductCard.vue'
import ProductFilter from '@/components/webshop/ProductFilter.vue'
import { useProducts } from '@/composables/useProducts.js'

const {
  products,
  categories,
  filteredProducts,
  selectedCategoryId,
  loading,
  error,
  setSelectedCategory
} = useProducts()
</script>

<template>
  <div>
    <main>
      <div class="image-container">
        <div class="overlay"></div>
        <div class="text">Webshop</div>
      </div>
      <section class="container py-5">
        <!-- Page Title -->
        <div class="mb-5">
          <h2 class="display-5 fw-bold mb-2">Termékeink</h2>
          <p class="text-muted">Válassz a termékeink közül</p>
        </div>

        <!-- Error Alert -->
        <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Hiba!</strong> {{ error }}
        </div>

        <!-- Loading Spinner -->
        <div v-if="loading && !error" class="text-center py-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Betöltés...</span>
          </div>
          <p class="text-muted mt-3">A termékek betöltődnek...</p>
        </div>

        <!-- No Products Message -->
        <div v-else-if="products.length === 0" class="alert alert-info" role="alert">
          <strong>Üres webshop!</strong> Nincs termék az adatbázisban.
        </div>

        <!-- Content: Filter + Products Grid -->
        <div v-else>
          <!-- Category Filter -->
          <ProductFilter
            :categories="categories"
            :selected-category-id="selectedCategoryId"
            @update:selectedCategoryId="setSelectedCategory"
          />

          <!-- Empty State for Category Filter -->
          <div v-if="filteredProducts.length === 0" class="alert alert-info">
            Erre a kategóriára nincs termék.
          </div>

          <!-- Products Grid -->
          <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            <div v-for="product in filteredProducts" :key="product.id" class="col">
              <ProductCard :product="product" />
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* Optional: Add subtle animations */
.row {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
