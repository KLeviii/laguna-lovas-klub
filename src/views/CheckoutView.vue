<script setup>
import { ref, computed } from 'vue'
import { useCart } from '@/composables/useCart'
import { formatPrice } from '@/utils/formatting'
import { useHead } from '@/composables/useHead'

useHead('Pénztár')

const { cartItems, cartItemCount, cartTotal, isCartEmpty } = useCart()

const SHIPPING_OPTIONS = [
  {
    id: 'magyar_posta',
    name: 'Magyar Posta (MPL)',
    description: 'Házhozszállítás, 2–3 munkanap',
    price_huf: 1490,
    icon: 'bi-envelope-fill'
  },
  {
    id: 'sajat_szallitas',
    name: 'Saját szállítás',
    description: 'Cég általi kiszállítás, 5–7 munkanap',
    price_huf: 2000,
    icon: 'bi-truck'
  }
]

const PAYMENT_OPTIONS = [
  {
    id: 'simple_pay',
    name: 'SimplePay',
    description: 'Biztonságos online bankkártyás fizetés – OTP Mobil Kft.',
    icon: 'bi-credit-card-2-front-fill'
  }
]

const selectedShipping = ref('magyar_posta')
const selectedPayment = ref('simple_pay')

const selectedShippingOption = computed(() =>
  SHIPPING_OPTIONS.find(o => o.id === selectedShipping.value)
)

const grandTotal = computed(() =>
  cartTotal.value + (selectedShippingOption.value?.price_huf ?? 0)
)
</script>

<template>
  <div>
    <main>
      <section class="p-3 p-md-5" style="padding-top: 100px !important;">
        <!-- Empty cart -->
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

            <!-- Shipping method -->
            <div class="card shadow-sm mb-4 pt-0">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="bi bi-truck me-2"></i>Szállítási mód
                </h5>
              </div>
              <div class="card-body">
                <div v-for="option in SHIPPING_OPTIONS" :key="option.id" class="mb-2">
                  <input
                    type="radio"
                    :id="`shipping-${option.id}`"
                    name="shipping"
                    :value="option.id"
                    v-model="selectedShipping"
                    class="visually-hidden"
                  />
                  <label
                    :for="`shipping-${option.id}`"
                    class="d-flex align-items-center justify-content-between p-3 rounded border w-100"
                    :class="selectedShipping === option.id ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary-subtle'"
                    style="cursor: pointer;"
                  >
                    <div class="d-flex align-items-center gap-3">
                      <i
                        :class="`bi ${option.icon} fs-4`"
                        :style="selectedShipping === option.id ? 'color: var(--bs-primary)' : 'color: #6c757d'"
                      ></i>
                      <div>
                        <div class="fw-semibold">{{ option.name }}</div>
                        <small :style="selectedShipping === option.id ? 'color: var(--bs-body-bg)' : ''" :class="{ 'text-muted': selectedShipping !== option.id }">{{ option.description }}</small>
                      </div>
                    </div>
                    <span class="fw-bold text-nowrap ms-3">{{ formatPrice(option.price_huf) }}</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Payment method -->
            <div class="card shadow-sm mb-4 pt-0">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="bi bi-wallet2 me-2"></i>Fizetési mód
                </h5>
              </div>
              <div class="card-body">
                <div v-for="option in PAYMENT_OPTIONS" :key="option.id" class="mb-2">
                  <input
                    type="radio"
                    :id="`payment-${option.id}`"
                    name="payment"
                    :value="option.id"
                    v-model="selectedPayment"
                    class="visually-hidden"
                  />
                  <label
                    :for="`payment-${option.id}`"
                    class="d-flex align-items-center p-3 rounded border w-100"
                    :class="selectedPayment === option.id ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary-subtle'"
                    style="cursor: pointer;"
                  >
                    <i
                      :class="`bi ${option.icon} fs-4 me-3`"
                      :style="selectedPayment === option.id ? 'color: var(--bs-primary)' : 'color: #6c757d'"
                    ></i>
                    <div>
                      <div class="fw-semibold">{{ option.name }}</div>
                      <small :style="selectedPayment === option.id ? 'color: var(--bs-body-bg)' : ''" :class="{ 'text-muted': selectedPayment !== option.id }">{{ option.description }}</small>
                    </div>
                  </label>
                </div>
                <small class="text-muted d-block mt-2">
                  <i class="bi bi-shield-lock me-1"></i>
                  A megrendelés után az OTP SimplePay biztonságos fizetési oldalára lesz átirányítva.
                </small>
              </div>
            </div>

            <router-link to="/kosar" class="btn btn-outline-secondary">
              <i class="bi bi-arrow-left me-1"></i>
              Vissza a kosárhoz
            </router-link>
          </div>

          <!-- Right column: order summary -->
          <div class="col-12 col-lg-5">
            <div class="card shadow-sm pt-0">
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
                    <small class="text-muted">{{ item.quantity }} × {{ formatPrice(item.price_huf) }}</small>
                  </div>
                  <span class="fw-bold">{{ formatPrice(item.price_huf * item.quantity) }}</span>
                </div>

                <div class="d-flex justify-content-between mt-3 mb-1">
                  <span>Termékek ({{ cartItemCount }} db):</span>
                  <span>{{ formatPrice(cartTotal) }}</span>
                </div>

                <div class="d-flex justify-content-between mb-2">
                  <span>Szállítás:</span>
                  <span>{{ formatPrice(selectedShippingOption?.price_huf ?? 0) }}</span>
                </div>

                <hr />

                <div class="d-flex justify-content-between">
                  <strong class="fs-5">Végösszeg:</strong>
                  <strong class="fs-5 text-primary">{{ formatPrice(grandTotal) }}</strong>
                </div>

                <button class="btn btn-primary w-100 mt-4" disabled>
                  <i class="bi bi-credit-card me-1"></i>
                  Tovább a fizetéshez
                </button>
                <small class="text-muted d-block text-center mt-2">
                  A fizetési funkció hamarosan elérhető lesz.
                </small>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
