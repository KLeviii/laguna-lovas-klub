<script setup>
import { ref } from 'vue'
import { formatPrice } from '@/utils/formatting'
import { useCart } from '@/composables/useCart'

const props = defineProps({
  product: {
    type: Object,
    required: true,
    validator: (value) => {
      return (
        value.id &&
        value.name &&
        typeof value.price_huf === 'number' &&
        typeof value.is_available === 'boolean'
      )
    }
  }
})

const { addToCart } = useCart()
const addedFeedback = ref(false)

function handleAddToCart(event) {
  event.preventDefault()
  event.stopPropagation()
  const success = addToCart(props.product)
  if (success) {
    addedFeedback.value = true
    setTimeout(() => { addedFeedback.value = false }, 1000)
  }
}

const canAddToCart = (product) => product.is_available && (product.stock || 0) > 0

// Handle image load error
const onImageError = (event) => {
  event.target.style.display = 'none'
}
</script>

<template>
  <router-link :to="`/webshop/${product.id}`" class="text-decoration-none">
    <div class="card h-100 shadow-sm border-0 product-card">
      <!-- Product Image -->
      <div class="position-relative bg-light overflow-hidden" style="height: 200px">
        <img
          v-if="product.image_url"
          :src="product.image_url"
          :alt="product.name"
          class="card-img-top w-100 h-100"
          style="object-fit: cover"
          loading="lazy"
          @error="onImageError"
        />
        <div v-else class="d-flex align-items-center justify-content-center h-100">
          <span class="text-muted small">Nincs kép</span>
        </div>
      </div>

      <!-- Card Body -->
      <div class="card-body d-flex flex-column">
        <h6 class="card-title text-truncate mb-2">{{ product.name }}</h6>
        <p
          class="card-text text-muted small flex-grow-1"
          style="overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical"
        >
          {{ product.description || 'Nincs leírás' }}
        </p>
      </div>

      <!-- Card Footer: Price & Cart -->
      <div class="card-footer bg-white border-top">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="fw-bold text-primary">{{ formatPrice(product.price_huf) }}</span>
          <span
            v-if="canAddToCart(product)"
            class="badge bg-success badges-sm"
          >
            Készleten
          </span>
          <span v-else class="badge bg-secondary badges-sm">
            Nincs készleten
          </span>
        </div>
        <button
          v-if="canAddToCart(product)"
          class="btn btn-sm btn-outline-primary w-100"
          :class="{ 'btn-success': addedFeedback }"
          @click="handleAddToCart"
        >
          <i :class="['bi', addedFeedback ? 'bi-check-lg' : 'bi-cart-plus']" class="me-1"></i>
          {{ addedFeedback ? 'Hozzáadva' : 'Kosárba' }}
        </button>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.product-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
}

.product-card:has(.badge.bg-secondary) {
  opacity: 0.75;
}

.product-card:has(.badge.bg-secondary):hover {
  transform: none;
}

.badges-sm {
  font-size: 0.75rem;
  padding: 0.35rem 0.65rem;
}

a {
  color: inherit;
}

a:hover {
  text-decoration: none;
}
</style>
