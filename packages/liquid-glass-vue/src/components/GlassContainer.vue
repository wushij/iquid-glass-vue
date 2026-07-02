<script setup lang="ts">
import { computed, getCurrentInstance, ref, toRef, useAttrs, type CSSProperties } from 'vue'
import type { GlassContainerProps, RefractionMode, Size } from '../types'
import { useShaderDisplacement } from '../composables/useShaderDisplacement'
import { isFirefox } from '../utils/browser'
import { hasClickListener } from '../utils/listeners'
import GlassFilter from './GlassFilter.vue'

const props = withDefaults(defineProps<GlassContainerProps>(), {
  class: '',
  displacementScale: 25,
  blurAmount: 12,
  saturation: 180,
  aberrationIntensity: 2,
  active: false,
  overLight: false,
  cornerRadius: 999,
  padding: '24px 32px',
  glassSize: () => ({ width: 270, height: 69 }),
  mode: 'standard' as RefractionMode,
})

const emit = defineEmits<{
  mouseenter: []
  mouseleave: []
  mousedown: []
  mouseup: []
  click: []
}>()

const rootRef = ref<HTMLDivElement | null>(null)
const instance = getCurrentInstance()
const filterId = `glass-filter-${instance ? instance.uid : Math.random().toString(36).slice(2, 9)}`

const modeRef = toRef(props, 'mode')
const glassSizeRef = toRef(props, 'glassSize') as unknown as import('vue').Ref<Size>

const { shaderMapUrl } = useShaderDisplacement({
  mode: modeRef,
  glassSize: glassSizeRef,
})

const attrs = useAttrs()
const isClickable = computed(() => hasClickListener(attrs, instance))

const backdropStyle = computed(() => ({
  filter: isFirefox ? undefined : `url(#${filterId})`,
  backdropFilter: `blur(${(props.overLight ? 12 : 4) + props.blurAmount * 32}px) saturate(${props.saturation}%)`,
}))

const rootClass = computed(() => [
  'relative',
  props.class,
  { active: props.active, 'cursor-pointer': isClickable.value },
])

const glassStyle = computed((): CSSProperties => ({
  borderRadius: `${props.cornerRadius}px`,
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '24px',
  padding: props.padding,
  overflow: 'hidden',
  transition: 'all 0.2s ease-in-out',
  boxShadow: props.overLight
    ? '0px 16px 70px rgba(0, 0, 0, 0.75)'
    : '0px 12px 40px rgba(0, 0, 0, 0.25)',
}))

const warpStyle = computed((): CSSProperties => ({
  ...backdropStyle.value,
  position: 'absolute',
  inset: 0,
}))

const contentStyle = computed((): CSSProperties => ({
  position: 'relative',
  zIndex: 1,
  font: '500 20px/1 system-ui',
  textShadow: props.overLight ? '0px 2px 12px rgba(0, 0, 0, 0)' : '0px 2px 12px rgba(0, 0, 0, 0.4)',
}))

function handleClick() {
  emit('click')
}

defineExpose({ el: rootRef })
</script>

<template>
  <div
    ref="rootRef"
    :class="rootClass"
    :style="props.style"
    v-on="isClickable ? { click: handleClick } : {}"
  >
    <GlassFilter
      :id="filterId"
      :mode="props.mode"
      :displacement-scale="props.displacementScale"
      :aberration-intensity="props.aberrationIntensity"
      :width="props.glassSize.width"
      :height="props.glassSize.height"
      :shader-map-url="shaderMapUrl"
    />

    <div
      class="glass"
      :style="glassStyle"
      @mouseenter="emit('mouseenter')"
      @mouseleave="emit('mouseleave')"
      @mousedown="emit('mousedown')"
      @mouseup="emit('mouseup')"
    >
      <span
        class="glass__warp"
        :style="warpStyle"
      />

      <div
        class="transition-all duration-150 ease-in-out text-white"
        :style="contentStyle"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
