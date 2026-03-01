<script setup>
import { ref, onMounted, computed } from 'vue'
import { useCart } from '@/composables/useCart'
import { formatPrice } from '@/utils/formatting'
import { fetchRelatedProducts, fetchAllProducts } from '@/services/productService'
import ProductCard from '@/components/webshop/ProductCard.vue'
import { useHead } from '@/composables/useHead'

useHead('Kosár')

const { cartItems, cartItemCount, cartTotal, isCartEmpty, updateQuantity, removeFromCart, clearCart } = useCart()

const recommendedProducts = ref([])
const loadingRecommended = ref(false)

const cartCategoryIds = computed(() => {
  const ids = new Set()
  cartItems.value.forEach((item) => {
    if (item.categoryId) ids.add(item.categoryId)
  })
  return [...ids]
})

const cartProductIds = computed(() =>
  cartItems.value.map((item) => item.productId)
)

async function loadRecommendations() {
  loadingRecommended.value = true
  try {
    let products = []

    if (cartCategoryIds.value.length > 0) {
      const promises = cartCategoryIds.value.map((catId) =>
        fetchRelatedProducts(catId, null, 4)
      )
      const results = await Promise.all(promises)
      products = results.flat()
    }

    // Filter out items already in cart
    products = products.filter((p) => !cartProductIds.value.includes(p.id))

    // If not enough, fetch some general available products
    if (products.length < 4) {
      const allProducts = await fetchAllProducts({ available_only: true })
      const extras = allProducts.filter(
        (p) =>
          !cartProductIds.value.includes(p.id) &&
          !products.some((rp) => rp.id === p.id)
      )
      products = [...products, ...extras]
    }

    // Deduplicate and limit to 4
    const seen = new Set()
    recommendedProducts.value = products.filter((p) => {
      if (seen.has(p.id)) return false
      seen.add(p.id)
      return true
    }).slice(0, 4)
  } catch {
    recommendedProducts.value = []
  } finally {
    loadingRecommended.value = false
  }
}

onMounted(loadRecommendations)
</script>

<template>
  <div>
    <main>
      <section class="p-3 p-md-5" style="padding-top: 100px !important;">
        <!-- Empty cart -->
        <div v-if="isCartEmpty" class="text-center py-5">
          <i class="bi bi-cart-x" style="font-size: 4rem; color: var(--text-muted, #6c757d);"></i>
          <h3 class="mt-3">A kosár üres</h3>
          <p class="text-muted">Még nem adtál hozzá terméket a kosárhoz.</p>
          <router-link to="/webshop" class="btn btn-primary mt-2">
            <i class="bi bi-shop me-1"></i>
            Vissza a webshopba
          </router-link>
        </div>

        <!-- Cart content -->
        <div v-else>
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="mb-0">Kosár tartalma</h2>
            <button class="btn btn-outline-danger btn-sm" @click="clearCart">
              <i class="bi bi-trash me-1"></i>Kosár ürítése
            </button>
          </div>

          <!-- Cart items -->
          <div class="table-responsive">
            <table class="table align-middle">
              <thead>
                <tr>
                  <th scope="col" style="width: 80px;"></th>
                  <th scope="col">Termék</th>
                  <th scope="col" class="text-center">Egységár</th>
                  <th scope="col" class="text-center" style="width: 160px;">Mennyiség</th>
                  <th scope="col" class="text-end">Részösszeg</th>
                  <th scope="col" style="width: 50px;"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in cartItems" :key="item.productId">
                  <!-- Image -->
                  <td>
                    <img
                      v-if="item.image_url"
                      :src="item.image_url"
                      :alt="item.name"
                      class="rounded"
                      style="width: 60px; height: 60px; object-fit: cover;"
                      loading="lazy"
                    />
                    <div
                      v-else
                      class="bg-light rounded d-flex align-items-center justify-content-center"
                      style="width: 60px; height: 60px;"
                    >
                      <i class="bi bi-image text-muted"></i>
                    </div>
                  </td>

                  <!-- Name -->
                  <td>
                    <router-link
                      :to="`/webshop/${item.productId}`"
                      class="text-decoration-none fw-semibold"
                    >
                      {{ item.name }}
                    </router-link>
                  </td>

                  <!-- Unit price -->
                  <td class="text-center text-muted">
                    {{ formatPrice(item.price_huf) }}
                  </td>

                  <!-- Quantity -->
                  <td class="text-center">
                    <div class="input-group input-group-sm justify-content-center">
                      <button
                        class="btn btn-outline-secondary"
                        @click="updateQuantity(item.productId, item.quantity - 1)"
                      >−</button>
                      <input
                        type="number"
                        class="form-control text-center"
                        style="max-width: 60px;"
                        :value="item.quantity"
                        :min="1"
                        :max="item.stock"
                        @change="updateQuantity(item.productId, parseInt($event.target.value) || 1)"
                      />
                      <button
                        class="btn btn-outline-secondary"
                        @click="updateQuantity(item.productId, item.quantity + 1)"
                        :disabled="item.quantity >= item.stock"
                      >+</button>
                    </div>
                  </td>

                  <!-- Subtotal -->
                  <td class="text-end fw-bold text-primary">
                    {{ formatPrice(item.price_huf * item.quantity) }}
                  </td>

                  <!-- Remove -->
                  <td>
                    <button
                      class="btn btn-sm btn-outline-danger"
                      @click="removeFromCart(item.productId)"
                      title="Eltávolítás"
                    >
                      <i class="bi bi-x-lg"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Summary -->
          <div class="row justify-content-end mt-4">
            <div class="col-12 col-md-5 col-lg-4">
              <div class="card shadow-sm">
                <div class="card-body">
                  <h5 class="card-title mb-3">Összesítés</h5>
                  <div class="d-flex justify-content-between mb-2">
                    <span>Termékek:</span>
                    <span>{{ cartItemCount }} db</span>
                  </div>
                  <hr />
                  <div class="d-flex justify-content-between mb-3">
                    <strong>Végösszeg:</strong>
                    <strong class="text-primary fs-5">{{ formatPrice(cartTotal) }}</strong>
                  </div>
                  <router-link to="/penztar" class="btn btn-primary w-100">
                    <i class="bi bi-credit-card me-1"></i>
                    Tovább a pénztárhoz
                  </router-link>
                  <router-link to="/webshop" class="btn btn-outline-secondary w-100 mt-2">
                    <i class="bi bi-arrow-left me-1"></i>
                    Vásárlás folytatása
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recommended products -->
        <div v-if="recommendedProducts.length > 0" class="mt-5 pt-5 border-top">
          <h3 class="mb-4">
            <i class="bi bi-stars me-2"></i>
            Ajánlott termékek
          </h3>
          <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            <div
              v-for="product in recommendedProducts"
              :key="product.id"
              class="col"
            >
              <ProductCard :product="product" />
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* Hide number input arrows */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
