<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: "all", // 'all', 'available', 'unavailable'
  },
});

const emit = defineEmits(["update:modelValue"]);

const filters = [
  { value: "all", label: "Összes" },
  { value: "available", label: "Eladók" },
  { value: "unavailable", label: "Nem eladók" },
];

function handleClick(value) {
  emit("update:modelValue", value);
}
</script>

<template>
  <div class="btn-group mb-4" role="group">
    <button
      v-for="filter in filters"
      :key="filter.value"
      type="button"
      :class="[
        'btn',
        modelValue === filter.value ? 'btn-primary' : 'btn-outline-primary',
      ]"
      @click="handleClick(filter.value)"
    >
      {{ filter.label }}
    </button>
  </div>
</template>
