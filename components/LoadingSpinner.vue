<template>
  <div class="d-flex justify-content-center py-5" aria-live="polite">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">{{ label }}</span>
    </div>
  </div>
</template>

<script setup>
/**
 * LoadingSpinner — Reusable loading indicator component.
 * Replaces repeated inline spinner markup across views.
 * Includes aria-live for screen reader announcements.
 */
defineProps({
  label: {
    type: String,
    default: 'Betöltés...'
  }
})
</script>
