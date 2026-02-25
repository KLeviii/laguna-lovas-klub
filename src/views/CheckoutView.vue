<script setup>
import { useCart } from '@/composables/useCart'
import { formatPrice } from '@/utils/formatting'

const { cartItems, cartItemCount, cartTotal, isCartEmpty } = useCart()
</script>

<template>
  <div>
    <main>
      <div class="image-container">
        <div class="overlay"></div>
        <div class="text">
          <i class="bi bi-credit-card me-2"></i>Pénztár
        </div>
      </div>

      <section class="p-3 p-md-5">
        <!-- Empty cart redirect -->
        <div v-if="isCartEmpty" class="text-center py-5">
          <i class="bi bi-cart-x" style="font-size: 4rem; color: var(--text-muted, #6c757d);"></i>
          <h3 class="mt-3">A kosár üres</h3>
          <p class="text-muted">Adj hozzá termékeket a kosárhoz a rendelés előtt.</p>
          <router-link to="/webshop" class="btn btn-primary mt-2">
            <i class="bi bi-shop me-1"></i>
            Vissza a webshopba
          </router-link>
        </div>

        <div v-else class="row">
          <!-- Left column: forms -->
          <div class="col-12 col-lg-7 mb-4">
            <!-- Shipping -->
            <div class="card shadow-sm mb-4">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="bi bi-truck me-2"></i>Szállítási adatok
                </h5>
              </div>
              <div class="card-body">
                <div class="alert alert-info mb-0">
                  <i class="bi bi-info-circle me-1"></i>
                  <strong>Hamarosan elérhető!</strong>
                  <p class="mb-0 mt-1">A szállítási opciók beállítása folyamatban van.</p>
                </div>
              </div>
            </div>

            <!-- Payment -->
            <div class="card shadow-sm mb-4">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="bi bi-wallet2 me-2"></i>Fizetési mód
                </h5>
              </div>
              <div class="card-body">
                <div class="alert alert-info mb-0">
                  <i class="bi bi-info-circle me-1"></i>
                  <strong>Hamarosan elérhető!</strong>
                  <p class="mb-0 mt-1">A fizetési módok beállítása folyamatban van.</p>
                </div>
              </div>
            </div>

            <router-link to="/kosar" class="btn btn-outline-secondary">
              <i class="bi bi-arrow-left me-1"></i>
              Vissza a kosárhoz
            </router-link>
          </div>

          <!-- Right column: order summary -->
          <div class="col-12 col-lg-5">
            <div class="card shadow-sm">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="bi bi-receipt me-2"></i>Rendelés összesítő
                </h5>
              </div>
              <div class="card-body">
                <div
                  v-for="item in cartItems"
                  :key="item.productId"
                  class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom"
                >
                  <div>
                    <span class="fw-semibold">{{ item.name }}</span>
                    <br />
                    <small class="text-muted">{{ item.quantity }} x {{ formatPrice(item.price_huf) }}</small>
                  </div>
                  <span class="fw-bold">{{ formatPrice(item.price_huf * item.quantity) }}</span>
                </div>

                <div class="d-flex justify-content-between mt-3 mb-2">
                  <span>Termékek összesen:</span>
                  <span>{{ cartItemCount }} db</span>
                </div>

                <hr />

                <div class="d-flex justify-content-between">
                  <strong class="fs-5">Végösszeg:</strong>
                  <strong class="fs-5 text-primary">{{ formatPrice(cartTotal) }}</strong>
                </div>

                <button class="btn btn-primary w-100 mt-4" disabled>
                  <i class="bi bi-bag-check me-1"></i>
                  Megrendelés elküldése
                </button>
                <small class="text-muted d-block text-center mt-2">
                  A megrendelés funkció hamarosan elérhető lesz.
                </small>
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
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.image-container .text {
  position: relative;
  z-index: 2;
}
</style>
