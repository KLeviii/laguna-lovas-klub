<script setup>
import { computed } from 'vue'
import { formatPrice } from '@/utils/formatting'

const MIN_GAP_PERCENT = 0.05

const props = defineProps({
  min: { type: Number, default: 0 },
  max: { type: Number, default: 500000 },
  modelValue: { type: Array, default: () => [0, 500000] },
})

const emit = defineEmits(['update:modelValue'])

const minGap = computed(() => Math.round((props.max - props.min) * MIN_GAP_PERCENT))

const minVal = computed({
  get: () => props.modelValue[0],
  set: (val) => {
    const v = Math.min(Number(val), props.modelValue[1] - minGap.value)
    emit('update:modelValue', [Math.max(v, props.min), props.modelValue[1]])
  },
})

const maxVal = computed({
  get: () => props.modelValue[1],
  set: (val) => {
    const v = Math.max(Number(val), props.modelValue[0] + minGap.value)
    emit('update:modelValue', [props.modelValue[0], Math.min(v, props.max)])
  },
})

const leftPercent = computed(() => {
  if (props.max === props.min) return 0
  return ((minVal.value - props.min) / (props.max - props.min)) * 100
})

const rightPercent = computed(() => {
  if (props.max === props.min) return 0
  return ((props.max - maxVal.value) / (props.max - props.min)) * 100
})
</script>

<template>
  <div class="price-range-slider">
    <div class="d-flex justify-content-between mb-2">
      <small class="text-muted fw-medium">{{ formatPrice(minVal) }}</small>
      <small class="text-muted fw-medium">{{ formatPrice(maxVal) }}</small>
    </div>
    <div class="slider-track-wrapper">
      <div class="slider-track"></div>
      <div
        class="slider-range"
        :style="{ left: leftPercent + '%', right: rightPercent + '%' }"
      ></div>
      <input
        type="range"
        class="slider-input"
        :min="min"
        :max="max"
        :step="100"
        v-model.number="minVal"
      />
      <input
        type="range"
        class="slider-input"
        :min="min"
        :max="max"
        :step="100"
        v-model.number="maxVal"
      />
    </div>
  </div>
</template>

<style scoped>
.price-range-slider {
  padding: 0 0.25rem;
}

.slider-track-wrapper {
  position: relative;
  height: 2rem;
}

.slider-track {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  height: 4px;
  background: var(--bs-gray-300);
  border-radius: 2px;
}

.slider-range {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 4px;
  background: var(--bs-primary);
  border-radius: 2px;
}

.slider-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  pointer-events: none;
  margin: 0;
}

.slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: #fff;
  border: 2px solid var(--bs-primary);
  border-radius: 50%;
  cursor: pointer;
  pointer-events: all;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
}

.slider-input::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: #fff;
  border: 2px solid var(--bs-primary);
  border-radius: 50%;
  cursor: pointer;
  pointer-events: all;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
}
</style>
