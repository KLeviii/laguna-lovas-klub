<template>
  <div class="alert alert-danger" role="alert" aria-live="assertive">
    {{ message }}
    <button
      v-if="retryFn"
      class="btn btn-outline-danger btn-sm ms-2"
      @click="retryFn"
    >
      Újrapróbálás
    </button>
  </div>
</template>

<script setup>
/**
 * ErrorAlert — Reusable error alert component.
 * Displays an error message with optional retry button.
 * Uses aria-live="assertive" to announce errors to screen readers.
 */
defineProps({
  message: {
    type: String,
    required: true
  },
  retryFn: {
    type: Function,
    default: null
  }
})
</script>
