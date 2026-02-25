<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '@/composables/useCart'
import { formatPrice } from '@/utils/formatting'

const router = useRouter()
const { cartItems, cartItemCount, cartTotal, isCartEmpty } = useCart()

const showPopover = ref(false)

function goToCart() {
  showPopover.value = false
  router.push('/kosar')
}
</script>

<template>
  <div
    class="cart-icon-wrapper position-relative"
    @mouseenter="showPopover = true"
    @mouseleave="showPopover = false"
  >
    <button
      class="nav-item text-uppercase fw-bold nav-link px-4 btn-cart"
      @click="goToCart"
      aria-label="Kosár"
    >
      <i class="bi bi-cart3"></i>
      <span
        v-if="cartItemCount > 0"
        class="badge rounded-pill bg-danger cart-badge"
      >
        {{ cartItemCount }}
      </span>
    </button>

    <!-- Hover popover -->
    <div
      v-if="showPopover"
      class="cart-popover shadow-lg rounded p-3"
    >
      <template v-if="isCartEmpty">
        <p class="text-muted mb-0 small">A kosár üres</p>
      </template>
      <template v-else>
        <div
          v-for="(item, index) in cartItems.slice(0, 3)"
          :key="item.productId"
          class="d-flex justify-content-between align-items-center mb-2"
          :class="{ 'border-bottom pb-2': index < Math.min(cartItems.length, 3) - 1 }"
        >
          <span class="small text-truncate me-2" style="max-width: 140px;">
            {{ item.name }}
          </span>
          <span class="small text-muted text-nowrap">
            {{ item.quantity }} db
          </span>
        </div>
        <p
          v-if="cartItems.length > 3"
          class="text-muted small mb-2"
        >
          és {{ cartItems.length - 3 }} további...
        </p>
        <div class="border-top pt-2 d-flex justify-content-between align-items-center">
          <strong class="small">Összesen:</strong>
          <strong class="small text-primary">{{ formatPrice(cartTotal) }}</strong>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.cart-icon-wrapper {
  display: inline-block;
}

.btn-cart {
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
  color: var(--text) !important;
}

.btn-cart:hover {
  color: var(--primary) !important;
}

.cart-badge {
  position: absolute;
  top: 2px;
  right: 8px;
  font-size: 0.6rem;
  padding: 0.25em 0.5em;
}

.cart-popover {
  position: absolute;
  top: 100%;
  right: 0;
  width: 260px;
  background-color: var(--bg-light, #fff);
  border: 1px solid var(--border, #dee2e6);
  z-index: 1050;
}
</style>
