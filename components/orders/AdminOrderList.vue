<script setup>
import { ref, onMounted } from 'vue'
import { useOrders } from '~/composables/useOrders.js'
import { formatDateTime, formatPrice, formatPaymentStatus, formatShippingMethod, formatOrderStatus } from '~/utils/formatting.js'
import OrderStatusBadge from './OrderStatusBadge.vue'

const {
  orders,
  loading,
  error,
  unreadCount,
  isEmpty,
  loadOrders,
  markAsRead,
  markAsUnread,
  changeStatus,
  loadOrderDetail,
} = useOrders()

const ALL_STATUSES = [
  { value: 'pending', label: 'Feldolgozás alatt' },
  { value: 'confirmed', label: 'Visszaigazolva' },
  { value: 'shipped', label: 'Szállítás alatt' },
  { value: 'delivered', label: 'Kiszállítva' },
  { value: 'cancelled', label: 'Törölve' },
]

function availableStatuses(currentStatus) {
  return ALL_STATUSES.filter((s) => s.value !== currentStatus)
}

const orderDetails = ref({})
const detailLoading = ref({})

async function toggleDetail(id) {
  if (orderDetails.value[id]) return
  detailLoading.value[id] = true
  const detail = await loadOrderDetail(id)
  if (detail) {
    orderDetails.value[id] = detail
  }
  detailLoading.value[id] = false
}

function onAccordionOpen(order) {
  if (!order.is_read) {
    markAsRead(order.id)
  }
  toggleDetail(order.id)
}

onMounted(() => {
  loadOrders()
})
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3>
        <i class="bi bi-box-seam me-2"></i>Rendelések
        <span v-if="unreadCount > 0" class="badge bg-danger ms-2">
          {{ unreadCount }} új
        </span>
      </h3>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Betöltés...</span>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="alert alert-danger">
      <i class="bi bi-exclamation-triangle me-2"></i>{{ error }}
      <button class="btn btn-sm btn-outline-danger ms-3" @click="loadOrders">
        Újrapróbálkozás
      </button>
    </div>

    <!-- Empty -->
    <div v-else-if="isEmpty" class="alert alert-info">
      <i class="bi bi-info-circle me-2"></i>Nincsenek beérkezett rendelések.
    </div>

    <div v-else>
      <!-- Desktop table: visible md+ -->
      <div class="table-responsive d-none d-md-block">
        <table class="table table-hover align-middle">
          <thead>
            <tr class="text-center">
              <th>Státusz</th>
              <th>Olvasott</th>
              <th>Vevő</th>
              <th>Email</th>
              <th>Összeg</th>
              <th>Fizetés</th>
              <th>Szállítás</th>
              <th>Dátum</th>
              <th>Műveletek</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="order in orders"
              :key="order.id"
              :class="{ 'fw-bold': !order.is_read }"
            >
              <td class="text-center">
                <OrderStatusBadge :status="order.status" />
              </td>
              <td class="text-center">
                <span
                  class="badge"
                  :class="order.is_read ? 'bg-secondary' : 'bg-success'"
                >
                  {{ order.is_read ? 'Olvasott' : 'Új' }}
                </span>
              </td>
              <td>{{ order.customer_name }}</td>
              <td>
                <a :href="'mailto:' + order.customer_email">{{ order.customer_email }}</a>
              </td>
              <td class="text-end text-nowrap">{{ formatPrice(order.total_amount_huf) }}</td>
              <td class="text-center">
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
              </td>
              <td class="text-center text-nowrap">
                <small>{{ formatShippingMethod(order.shipping_method) }}</small>
              </td>
              <td class="text-nowrap">{{ formatDateTime(order.created_at) }}</td>
              <td>
                <div class="d-flex gap-1 align-items-center">
                  <!-- Status dropdown -->
                  <div class="dropdown">
                    <button
                      class="btn btn-sm btn-outline-primary dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      title="Állapot módosítása"
                    >
                      <i class="bi bi-arrow-repeat"></i>
                    </button>
                    <ul class="dropdown-menu">
                      <li v-for="s in availableStatuses(order.status)" :key="s.value">
                        <button class="dropdown-item" @click="changeStatus(order.id, s.value)">
                          {{ s.label }}
                        </button>
                      </li>
                    </ul>
                  </div>

                  <!-- Read/unread toggle -->
                  <button
                    v-if="!order.is_read"
                    class="btn btn-sm btn-outline-success"
                    title="Megjelölés olvasottként"
                    @click="markAsRead(order.id)"
                  >
                    <i class="bi bi-check2"></i>
                  </button>
                  <button
                    v-if="order.is_read"
                    class="btn btn-sm btn-outline-warning"
                    title="Megjelölés olvasatlanként"
                    @click="markAsUnread(order.id)"
                  >
                    <i class="bi bi-envelope"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Accordion: detail view (always visible, main view on mobile) -->
      <div class="accordion mt-3" id="orderAccordion">
        <div
          v-for="order in orders"
          :key="'detail-' + order.id"
          class="accordion-item"
        >
          <h2 class="accordion-header">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              :data-bs-target="'#order-' + order.id"
              :class="{ 'fw-bold': !order.is_read }"
              @click="onAccordionOpen(order)"
            >
              <OrderStatusBadge :status="order.status" />
              <span class="badge me-2 ms-2" :class="order.is_read ? 'bg-secondary' : 'bg-success'">
                {{ order.is_read ? 'Olvasott' : 'Új' }}
              </span>
              {{ order.customer_name }} — {{ formatPrice(order.total_amount_huf) }}
              <small class="text-muted ms-auto me-3">{{ formatDateTime(order.created_at) }}</small>
            </button>
          </h2>
          <div :id="'order-' + order.id" class="accordion-collapse collapse">
            <div class="accordion-body">
              <!-- Vevő adatok -->
              <div class="mb-2">
                <strong>Vevő:</strong> {{ order.customer_name }}
                (<a :href="'mailto:' + order.customer_email">{{ order.customer_email }}</a>)
              </div>
              <div v-if="order.customer_phone" class="mb-2">
                <strong>Telefon:</strong>
                <a :href="'tel:' + order.customer_phone">{{ order.customer_phone }}</a>
              </div>

              <!-- Szállítás -->
              <div class="mb-2">
                <strong>Szállítási cím:</strong>
                {{ order.shipping_name }}, {{ order.shipping_zip }} {{ order.shipping_city }}, {{ order.shipping_address }}
              </div>
              <div class="mb-2">
                <strong>Szállítási mód:</strong> {{ formatShippingMethod(order.shipping_method) }}
              </div>

              <!-- Fizetés -->
              <div class="mb-2">
                <strong>Fizetési állapot:</strong>
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

              <!-- Összeg -->
              <div class="mb-2">
                <strong>Végösszeg:</strong>
                <span class="text-primary fw-bold">{{ formatPrice(order.total_amount_huf) }}</span>
              </div>

              <!-- Megjegyzés -->
              <div v-if="order.notes" class="mb-2">
                <strong>Megjegyzés:</strong>
                <p class="mb-0" style="white-space: pre-wrap;">{{ order.notes }}</p>
              </div>

              <!-- Tételek (on-demand) -->
              <hr />
              <h6>Tételek</h6>
              <div v-if="detailLoading[order.id]" class="text-center py-2">
                <div class="spinner-border spinner-border-sm" role="status">
                  <span class="visually-hidden">Betöltés...</span>
                </div>
              </div>
              <div v-else-if="orderDetails[order.id]?.order_items?.length">
                <ul class="list-group list-group-flush">
                  <li
                    v-for="item in orderDetails[order.id].order_items"
                    :key="item.id"
                    class="list-group-item d-flex justify-content-between align-items-center px-0"
                  >
                    <span>{{ item.product_name }} <small class="text-muted">× {{ item.quantity }}</small></span>
                    <span>{{ formatPrice(item.unit_price_huf * item.quantity) }}</span>
                  </li>
                </ul>
              </div>
              <p v-else class="text-muted mb-0">Nincs tételinformáció.</p>

              <!-- Műveletek -->
              <hr />
              <div class="d-flex flex-wrap gap-2">
                <!-- Állapotváltó dropdown -->
                <div class="dropdown">
                  <button
                    class="btn btn-sm btn-outline-primary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    <i class="bi bi-arrow-repeat me-1"></i>Állapot módosítása
                  </button>
                  <ul class="dropdown-menu">
                    <li v-for="s in availableStatuses(order.status)" :key="s.value">
                      <button class="dropdown-item" @click="changeStatus(order.id, s.value)">
                        {{ s.label }}
                      </button>
                    </li>
                  </ul>
                </div>

                <!-- Olvasottság -->
                <button
                  v-if="order.is_read"
                  class="btn btn-sm btn-outline-warning"
                  @click="markAsUnread(order.id)"
                >
                  <i class="bi bi-envelope me-1"></i>Olvasatlannak jelölés
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 767.98px) {
  .accordion-button {
    flex-wrap: wrap;
    gap: 0.25rem;
    font-size: 0.85rem;
    padding: 0.6rem 0.75rem;
  }

  .accordion-button small {
    width: 100%;
    margin-left: 0 !important;
    margin-top: 0.25rem;
  }

  .accordion-body {
    font-size: 0.9rem;
    padding: 0.75rem;
  }
}
</style>
