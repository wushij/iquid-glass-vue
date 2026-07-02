<script setup lang="ts">
const props = defineProps<{
  label: string
  modelValue: number
  min: number
  max: number
  step: number
  hint?: string
  valueClass?: string
  formatValue?: (value: number) => string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

function displayValue(value: number) {
  return props.formatValue ? props.formatValue(value) : String(value)
}

function onInput(event: Event) {
  emit('update:modelValue', Number((event.target as HTMLInputElement).value))
}
</script>

<template>
  <div>
    <span class="block text-sm font-semibold text-white/90 mb-3">{{ label }}</span>
    <div class="mb-2">
      <span class="text-xl font-mono" :class="valueClass ?? 'text-blue-300'">
        {{ displayValue(modelValue) }}
      </span>
    </div>
    <input
      type="range"
      class="w-full"
      :min="min"
      :max="max"
      :step="step"
      :value="modelValue"
      @input="onInput"
    >
    <p v-if="hint" class="text-xs text-white/50 mt-2">
      {{ hint }}
    </p>
  </div>
</template>
