<script setup>
import { computed } from 'vue'
import { formatOrderStatus } from '~/utils/formatting'

const props = defineProps({
  status: { type: String, required: true },
})

const STATUS_CLASSES = {
  pending: 'bg-warning text-dark',
  confirmed: 'bg-info text-dark',
  shipped: 'bg-primary',
  delivered: 'bg-success',
  cancelled: 'bg-danger',
}

const badgeClass = computed(() => STATUS_CLASSES[props.status] || 'bg-secondary')
</script>

<template>
  <span class="badge" :class="badgeClass">{{ formatOrderStatus(status) }}</span>
</template>
