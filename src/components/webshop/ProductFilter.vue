<script setup>
defineProps({
  categories: {
    type: Array,
    required: true,
    default: () => [],
  },
  selectedCategory: {
    type: [String, null],
    default: null,
  },
})

const emit = defineEmits(['select-category', 'clear-filter'])

const selectCategory = (categoryId) => {
  emit('select-category', categoryId)
}

const clearFilter = () => {
  emit('clear-filter')
}
</script>

<template>
  <div class="mb-5">
    <h6 class="mb-3 fw-bold">Kategória:</h6>
    <div class="d-flex flex-wrap gap-2">
      <!-- "Összes" (All) Button -->
      <button
        type="button"
        class="btn btn-sm"
        :class="selectedCategory === null ? 'btn-primary' : 'btn-outline-primary'"
        @click="clearFilter"
      >
        Összes
      </button>

      <!-- Category Buttons -->
      <button
        v-for="category in categories"
        :key="category.id"
        type="button"
        class="btn btn-sm"
        :class="
          selectedCategory === category.id
            ? 'btn-primary'
            : 'btn-outline-primary'
        "
        @click="selectCategory(category.id)"
      >
        {{ category.name }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.btn {
  border-radius: 0.25rem;
}
</style>
