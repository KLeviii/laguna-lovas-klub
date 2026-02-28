<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, watch } from 'vue'
import { useProducts } from '@/composables/useProducts.js'
import { useCart } from '@/composables/useCart'
import { formatPrice } from '@/utils/formatting'
import { useHead } from '@/composables/useHead'

const route = useRoute()
const router = useRouter()
const { selectedProduct, relatedProducts, loading, error, loadProductById } = useProducts()
const { addToCart } = useCart()

const selectedQty = ref(1)
const addedFeedback = ref(false)

watch(selectedProduct, (product) => {
  if (product) {
    useHead(product.name, product.description || 'Termék részletei — Laguna Lovasklub webshop.')
  }
})

onMounted(() => {
  loadProductById(route.params.id)
})

function goBack() {
  router.back()
}

function handleAddToCart() {
  if (!selectedProduct.value) return
  const success = addToCart(selectedProduct.value, selectedQty.value)
  if (success) {
    addedFeedback.value = true
    setTimeout(() => { addedFeedback.value = false }, 1500)
  }
}

function canAddToCart(product) {
  return product && product.is_available && (product.stock || 0) > 0
}
</script>

<template>
  <div>
    <main>
      <div class="image-container">
        <div class="overlay"></div>
        <div class="text">{{ selectedProduct?.name || 'Termék részletei' }}</div>
      </div>

      <section class="p-3 p-md-5">
        <!-- Back Button -->
        <button class="btn btn-outline-secondary mb-4" @click="goBack">
          ← Vissza a termékekhez
        </button>

        <!-- Loading -->
        <div v-if="loading" class="d-flex justify-content-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Betöltés...</span>
          </div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="alert alert-danger">
          <strong>Hiba:</strong> {{ error }}
        </div>

        <!-- Product Detail -->
        <div v-else-if="selectedProduct" class="row">
          <!-- Image -->
          <div class="col-12 col-md-6 mb-4">
            <div v-if="selectedProduct.image_url" class="product-image-container">
              <img
                :src="selectedProduct.image_url"
                :alt="selectedProduct.name"
                class="img-fluid rounded shadow-sm"
              />
            </div>
            <div v-else class="alert alert-info">
              Nincs kép elérhető
            </div>
          </div>

          <!-- Info -->
          <div class="col-12 col-md-6">
            <h1 class="mb-3">{{ selectedProduct.name }}</h1>

            <!-- Category -->
            <div v-if="selectedProduct.category" class="mb-3">
              <span class="badge bg-primary">
                {{ selectedProduct.category.name }}
              </span>
            </div>

            <!-- Price -->
            <div class="mb-3">
              <p class="text-muted">Ár:</p>
              <h3 class="text-success fw-bold">
                {{ formatPrice(selectedProduct.price_huf) }}
              </h3>
            </div>

            <!-- Availability / Stock indicator -->
            <div class="mb-4">
              <span
                v-if="(selectedProduct.stock || 0) >= 10"
                class="badge bg-success p-2"
              >
                <i class="bi bi-check-circle me-1"></i>
                Készleten
              </span>
              <span
                v-else-if="(selectedProduct.stock || 0) > 0"
                class="badge bg-warning text-dark p-2"
              >
                <i class="bi bi-exclamation-triangle me-1"></i>
                Alacsony készlet: {{ selectedProduct.stock }} db
              </span>
              <span v-else class="badge bg-secondary p-2">
                <i class="bi bi-x-circle me-1"></i>
                Nincs készleten
              </span>
            </div>

            <!-- Description -->
            <div v-if="selectedProduct.description" class="mb-4">
              <h4>Leírás</h4>
              <p class="text-muted">{{ selectedProduct.description }}</p>
            </div>

            <!-- Stock & Add to Cart -->
            <div v-if="canAddToCart(selectedProduct)" class="mb-4">
              <div class="d-flex align-items-center gap-3">
                <div class="input-group" style="max-width: 140px;">
                  <button
                    class="btn btn-outline-secondary"
                    @click="selectedQty = Math.max(1, selectedQty - 1)"
                  >−</button>
                  <input
                    type="number"
                    class="form-control text-center"
                    v-model.number="selectedQty"
                    :min="1"
                    :max="selectedProduct.stock"
                  />
                  <button
                    class="btn btn-outline-secondary"
                    @click="selectedQty = Math.min(selectedProduct.stock, selectedQty + 1)"
                  >+</button>
                </div>
                <button
                  class="btn btn-primary"
                  :class="{ 'btn-success': addedFeedback }"
                  @click="handleAddToCart"
                >
                  <i :class="['bi', addedFeedback ? 'bi-check-lg' : 'bi-cart-plus']" class="me-1"></i>
                  {{ addedFeedback ? 'Hozzáadva!' : 'Kosárba' }}
                </button>
              </div>
            </div>
            <div v-else class="alert alert-secondary">
              <i class="bi bi-x-circle me-1"></i>
              Jelenleg nincs készleten
            </div>
          </div>
        </div>

        <!-- Not Found -->
        <div v-else class="alert alert-warning">
          <strong>Termék nem található.</strong>
        </div>

        <!-- Related Products -->
        <div v-if="selectedProduct && relatedProducts.length > 0" class="mt-5 pt-5 border-top">
          <h3 class="mb-4">
            <i class="bi bi-box me-2"></i>
            Hasonló termékek
          </h3>
          <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            <div
              v-for="product in relatedProducts"
              :key="product.id"
              class="col"
            >
              <div class="card h-100 shadow-sm product-card">
                <!-- Image -->
                <div v-if="product.image_url" class="product-card-image">
                  <img
                    :src="product.image_url"
                    :alt="product.name"
                    class="card-img-top w-100 h-100"
                    style="object-fit: cover"
                  />
                </div>
                <div v-else class="product-card-image d-flex align-items-center justify-content-center">
                  <span class="text-muted">Nincs kép</span>
                </div>

                <!-- Body -->
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title flex-grow-1">{{ product.name }}</h5>

                  <!-- Price -->
                  <p class="text-primary fw-bold mb-2">
                    {{ formatPrice(product.price_huf) }}
                  </p>

                  <!-- Availability -->
                  <div class="mb-3">
                    <span
                      v-if="product.is_available"
                      class="badge bg-success"
                    >
                      Elérhető
                    </span>
                    <span v-else class="badge bg-secondary">
                      Nem elérhető
                    </span>
                  </div>

                  <!-- View Button -->
                  <router-link
                    :to="`/webshop/${product.id}`"
                    class="btn btn-sm btn-outline-primary"
                  >
                    Részletek
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.image-container {
  position: relative;
  height: 300px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: bold;
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 300"><rect fill="%23333" width="1200" height="300"/></svg>');
}

.image-container .overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.image-container .text {
  position: relative;
  z-index: 2;
}

.product-image-container {
  width: 100%;
  max-width: 500px;
}

.product-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2) !important;
}

.product-card:has(.badge.bg-secondary) {
  opacity: 0.75;
}

.product-card:has(.badge.bg-secondary):hover {
  transform: none;
}

.product-card-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background-color: #f5f5f5;
}
</style>
