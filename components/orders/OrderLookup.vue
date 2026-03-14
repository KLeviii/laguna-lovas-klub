<script setup>
import { ref, onMounted, computed } from 'vue'
import { useOrderLookup } from '~/composables/useOrderLookup'
import { formatPrice, formatDateTime, formatOrderStatus, formatPaymentStatus, formatShippingMethod } from '~/utils/formatting'
import OrderStatusBadge from './OrderStatusBadge.vue'

const route = useRoute()
const { order, loading, error, notFound, lookupOrder } = useOrderLookup()
const searchInput = ref('')

// Szállítási folyamat lépései
const SHIPPING_STEPS = [
  { key: 'pending', label: 'Rendelés fogadva', icon: 'bi-cart' },
  { key: 'confirmed', label: 'Fizetés megerősítve', icon: 'bi-credit-card' },
  { key: 'shipped', label: 'Szállítás alatt', icon: 'bi-truck' },
  { key: 'delivered', label: 'Kiszállítva', icon: 'bi-box-seam-fill' },
]

// Aktuális lépés indexe
const currentStepIndex = computed(() => {
  if (!order.value) return -1
  const statusIndex = SHIPPING_STEPS.findIndex(s => s.key === order.value.status)
  return statusIndex
})

// Teljes rendelésszám másolása
async function copyOrderId() {
  if (order.value?.id) {
    await navigator.clipboard.writeText(order.value.id)
  }
}

async function handleSearch() {
  await lookupOrder(searchInput.value)
}

onMounted(() => {
  const orderId = route.query.orderId
  if (orderId) {
    searchInput.value = orderId
    lookupOrder(orderId)
  }
})
</script>

<template>
  <div>
    <!-- Keresőform -->
    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <h3 class="card-title mb-3">
          <i class="bi bi-search me-2"></i>Rendelés nyomon követése
        </h3>
        <p class="text-muted mb-3">
          Add meg a rendelés azonosítódat, hogy megtekinthesd a rendelésed állapotát.
        </p>
        <form @submit.prevent="handleSearch">
          <div class="input-group">
            <input
              v-model="searchInput"
              type="text"
              class="form-control"
              placeholder="Rendelés azonosító (pl. a1b2c3d4-...)"
              :disabled="loading"
            />
            <button class="btn btn-primary" type="submit" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-1" role="status"></span>
              <i v-else class="bi bi-search me-1"></i>
              Keresés
            </button>
          </div>
        </form>

        <!-- Hibaüzenet -->
        <div v-if="error" class="alert alert-danger mt-3 mb-0">
          <i class="bi bi-exclamation-triangle me-2"></i>{{ error }}
        </div>

        <!-- Nem található -->
        <div v-if="notFound" class="alert alert-warning mt-3 mb-0">
          <i class="bi bi-info-circle me-2"></i>Nem találtunk rendelést ezzel az azonosítóval.
        </div>
      </div>
    </div>

    <!-- Eredmény kártya -->
    <div v-if="order" class="card shadow-sm">
      <!-- Szállítási folyamat vizuális megjelenítése -->
      <div class="card-header bg-white">
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h5 class="mb-0">
            <i class="bi bi-box-seam me-2"></i>Rendelés részletei
          </h5>
          <OrderStatusBadge :status="order.status" />
        </div>
      </div>
      
      <!-- Vizuális csomag követés -->
      <div class="card-body ">
        <div class="shipping-progress">
          <div class="progress-steps">
            <div 

              v-for="(step, index) in SHIPPING_STEPS" 
              :key="step.key"
              class="progress-step ms-0 ps-0"
              :class="{ 
                'completed': index <= currentStepIndex,
                'active': index === currentStepIndex,
                'cancelled': order.status === 'cancelled'
              }"
              
            >
              <div class="step-icon">
                <i :class="['bi', step.icon]"></i>
              </div>
              <div class="step-label ms-0 ps-0">{{ step.label }}</div>
              <div v-if="index < SHIPPING_STEPS.length - 1" class="step-connector"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="card-body">
        <!-- Alapadatok -->
        <div class="row mb-3">
          <div class="col-sm-6 mb-2">
            <small class="text-muted d-block">Rendelés azonosító</small>
            <strong :title="order.id">{{ order.id?.slice(0, 8) }}...</strong>
            <button 
              class="btn btn-sm btn-link p-0 ms-1" 
              @click="copyOrderId"
              title="Másolás"
            >
              <i class="bi bi-clipboard"></i>
            </button>
          </div>
          <div class="col-sm-6 mb-2">
            <small class="text-muted d-block">Dátum</small>
            <strong>{{ formatDateTime(order.created_at) }}</strong>
          </div>
          <div class="col-sm-6 mb-2">
            <small class="text-muted d-block">Fizetési állapot</small>
            <span
              class="badge"
              :class="{
                'bg-success': order.payment_status === 'paid',
                'bg-danger': order.payment_status === 'failed',
                'bg-secondary': order.payment_status === 'pending',
                'bg-warning text-dark': order.payment_status === 'refunded',
              }"
            >
              {{ formatPaymentStatus(order.payment_status) }}
            </span>
          </div>
          <div class="col-sm-6 mb-2">
            <small class="text-muted d-block">Végösszeg</small>
            <strong class="text-primary">{{ formatPrice(order.total_amount_huf) }}</strong>
          </div>
        </div>

        <!-- Szállítási adatok -->
        <h6 class="mt-3 mb-2">
          <i class="bi bi-truck me-1"></i>Szállítási adatok
        </h6>
        <div class="bg-light rounded p-3 mb-3">
          <div class="mb-1"><strong>{{ order.shipping_name }}</strong></div>
          <div>{{ order.shipping_zip }} {{ order.shipping_city }}, {{ order.shipping_address }}</div>
          <div class="mt-1">
            <small class="text-muted">Szállítási mód:</small>
            {{ formatShippingMethod(order.shipping_method) }}
          </div>
        </div>

        <!-- Tételek -->
        <h6 class="mt-3 mb-2">
          <i class="bi bi-bag me-1"></i>Tételek
        </h6>
        <div v-if="order.order_items?.length" class="table-responsive">
          <table class="table table-sm align-middle mb-0">
            <thead>
              <tr>
                <th>Termék</th>
                <th class="text-center">Mennyiség</th>
                <th class="text-end">Egységár</th>
                <th class="text-end">Összeg</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in order.order_items" :key="item.id">
                <td>{{ item.product_name }}</td>
                <td class="text-center">{{ item.quantity }} db</td>
                <td class="text-end">{{ formatPrice(item.unit_price_huf) }}</td>
                <td class="text-end">{{ formatPrice(item.unit_price_huf * item.quantity) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="text-muted mb-0">Nincs tételinformáció.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shipping-progress {
  padding: 1rem 0;
}

.progress-steps {
  display: flex;
  justify-content: space-evenly;
  align-items: flex-start;
  position: relative;
  
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
}

.progress-step:last-child {
  flex: 1;
}

.step-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: #6c757d;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

.step-label {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  text-align: center;
  color: #6c757d;
  font-weight: 500;
  max-width: 80px;
}

.step-connector {
  position: absolute;
  top: 25px;
  left: 50%;
  width: 100%;
  height: 3px;
  background-color: #e9ecef;
  z-index: 1;
}

/* Completed step */
.progress-step.completed .step-icon {
  background-color: var(--bs-success);
  color: white;
}

.progress-step.completed .step-label {
  color: var(--bs-success);
}

.progress-step.completed .step-connector {
  background-color: var(--bs-success);
}

/* Active step */
.progress-step.active .step-icon {
  background-color: var(--bs-primary);
  color: white;
  box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.25);
}

.progress-step.active .step-label {
  color: var(--bs-primary);
  font-weight: 600;
}

/* Cancelled state */
.progress-step.cancelled .step-icon {
  background-color: var(--bs-danger);
  color: white;
}

.progress-step.cancelled .step-label {
  color: var(--bs-danger);
}

@media (max-width: 576px) {
  .step-icon {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .step-label {
    font-size: 0.65rem;
    max-width: 60px;
  }
  
  .step-connector {
    top: 20px;
  }
}
</style>

