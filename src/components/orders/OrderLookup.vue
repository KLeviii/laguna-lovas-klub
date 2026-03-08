<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useOrderLookup } from '@/composables/useOrderLookup'
import { formatPrice, formatDateTime, formatOrderStatus, formatPaymentStatus, formatShippingMethod } from '@/utils/formatting'
import OrderStatusBadge from './OrderStatusBadge.vue'

const route = useRoute()
const { order, loading, error, notFound, lookupOrder } = useOrderLookup()
const searchInput = ref('')

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
      <div class="card-header bg-white">
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h5 class="mb-0">
            <i class="bi bi-box-seam me-2"></i>Rendelés részletei
          </h5>
          <OrderStatusBadge :status="order.status" />
        </div>
      </div>
      <div class="card-body">
        <!-- Alapadatok -->
        <div class="row mb-3">
          <div class="col-sm-6 mb-2">
            <small class="text-muted d-block">Rendelés azonosító</small>
            <strong :title="order.id">{{ order.id?.slice(0, 8) }}...</strong>
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
