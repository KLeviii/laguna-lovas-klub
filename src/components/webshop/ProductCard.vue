<script setup>
import { ref, computed } from 'vue'
import { formatPrice } from '@/utils/formatting'
import SkeletonImage from '@/components/SkeletonImage.vue'
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

const rating = computed(() => Number(props.product.rating) || 0)
const reviewCount = computed(() => props.product.review_count || 0)
const fullStars = computed(() => Math.floor(rating.value))
const emptyStars = computed(() => 5 - fullStars.value)

const onImageError = (event) => {
  event.target.style.display = 'none'
}
</script>

<template>
  <router-link :to="`/webshop/${product.id}`" class="text-decoration-none">
    <div class="card h-100 border product-card overflow-hidden pt-0">
      <!-- Image area with aspect ratio -->
      <div class="position-relative card-img-wrapper bg-light">
        <SkeletonImage
          v-if="product.image_url"
          :src="product.image_url"
          :alt="product.name"
          aspect-ratio="1/1"
          img-class="card-img-top w-100 h-100 product-img"
        />
        <div v-else class="d-flex align-items-center justify-content-center h-100">
          <span class="text-muted small">Nincs kép</span>
        </div>

        <!-- Hover overlay with action buttons -->
        <div class="card-overlay d-flex align-items-center justify-content-center gap-2">
          <span class="btn btn-light btn-sm rounded-circle overlay-btn p-2">
            <i class="bi bi-eye fs-6"></i>
          </span>
          <span class="btn btn-light btn-sm rounded-circle overlay-btn overlay-btn-delay p-2">
            <i class="bi bi-heart fs-6"></i>
          </span>
        </div>
      </div>

      <!-- Card body -->
      <div class="card-body d-flex flex-column p-3">
        <!-- Category label -->
        <small
          v-if="product.category?.name"
          class="text-primary fw-bold text-uppercase category-label mb-1"
        >
          {{ product.category.name }}
        </small>

        <!-- Product name -->
        <h6 class="card-title fw-bold mb-2 product-name">{{ product.name }}</h6>

        <!-- Star rating -->
        <div class="d-flex align-items-center gap-1 mb-3">
          <i
            v-for="n in fullStars"
            :key="'full-' + n"
            class="bi bi-star-fill star-gold"
          ></i>
          <i
            v-for="n in emptyStars"
            :key="'empty-' + n"
            class="bi bi-star star-empty"
          ></i>
          <small v-if="reviewCount > 0" class="text-muted ms-1">({{ reviewCount }} vélemény)</small>
        </div>

        <!-- Price + cart button -->
        <div class="mt-auto d-flex justify-content-between align-items-center">
          <span class="fw-bold fs-5 text-primary">{{ formatPrice(product.price_huf) }}</span>
          <button
            v-if="canAddToCart(product)"
            class="btn btn-cart rounded-3"
            :class="{ 'btn-cart-success': addedFeedback }"
            @click="handleAddToCart"
          >
            <i :class="['bi', addedFeedback ? 'bi-check-lg' : 'bi-cart-plus']"></i>
          </button>
          <span v-else class="badge bg-secondary small">Elfogyott</span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.product-card {
  border-radius: var(--radius-lg);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12) !important;
}

.product-card:has(.badge.bg-secondary) {
  opacity: 0.75;
}

.product-card:has(.badge.bg-secondary):hover {
  transform: none;
}

.card-img-wrapper {
  aspect-ratio: 1 / 1;
  overflow: hidden;
  position: relative;
}

.product-img {
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .product-img {
  transform: scale(1.1);
}

/* Hover overlay */
.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .card-overlay {
  opacity: 1;
}

.overlay-btn {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(1rem);
  transition: transform 0.3s ease, background 0.2s;
}

.product-card:hover .overlay-btn {
  transform: translateY(0);
}

.overlay-btn-delay {
  transition-delay: 0.05s;
}

.overlay-btn:hover {
  background: var(--bs-primary) !important;
  color: #fff !important;
}

/* Category label */
.category-label {
  font-size: 0.65rem;
  letter-spacing: 0.1em;
}

/* Product name */
.product-name {
  line-height: 1.3;
  transition: color 0.2s;
}

.product-card:hover .product-name {
  color: var(--bs-primary);
}

/* Stars */
.star-gold {
  color: #d4af37;
  font-size: 0.8rem;
}

.star-empty {
  color: var(--bs-gray-300);
  font-size: 0.8rem;
}

/* Cart button */
.btn-cart {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(var(--bs-primary-rgb), 0.1);
  color: var(--bs-primary);
  border: none;
  transition: background 0.2s, color 0.2s;
}

.btn-cart:hover {
  background: var(--bs-primary);
  color: #fff;
}

.btn-cart-success {
  background: var(--bs-success) !important;
  color: #fff !important;
}

a {
  color: inherit;
}

a:hover {
  text-decoration: none;
}
</style>
