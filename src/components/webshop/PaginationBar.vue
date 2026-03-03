<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
})

const emit = defineEmits(['page-change'])

const visiblePages = computed(() => {
  const total = props.totalPages
  const current = props.currentPage
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const pages = []
  pages.push(1)
  if (current > 3) pages.push('...')
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  if (current < total - 2) pages.push('...')
  pages.push(total)
  return pages
})

function goToPage(page) {
  if (page === '...' || page === props.currentPage) return
  emit('page-change', page)
}
</script>

<template>
  <nav v-if="totalPages > 1" aria-label="Termék lapozás" class="mt-4">
    <ul class="pagination justify-content-center gap-1 mb-0">
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <button
          class="page-link pagination-btn"
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
        >
          <i class="bi bi-chevron-left"></i>
        </button>
      </li>
      <li
        v-for="(page, idx) in visiblePages"
        :key="idx"
        class="page-item"
        :class="{ active: page === currentPage, disabled: page === '...' }"
      >
        <button
          class="page-link pagination-btn"
          :class="{ 'active-page': page === currentPage }"
          @click="goToPage(page)"
          :disabled="page === '...'"
        >
          {{ page }}
        </button>
      </li>
      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <button
          class="page-link pagination-btn"
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
        >
          <i class="bi bi-chevron-right"></i>
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.pagination-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem !important;
  font-weight: 600;
  border: 1px solid var(--bs-gray-300);
  color: var(--bs-body-color);
  background: transparent;
}

.pagination-btn:hover:not(:disabled):not(.active-page) {
  background: var(--bs-primary);
  color: #fff;
  border-color: var(--bs-primary);
}

.active-page {
  background: var(--bs-primary) !important;
  color: #fff !important;
  border-color: var(--bs-primary) !important;
}
</style>
