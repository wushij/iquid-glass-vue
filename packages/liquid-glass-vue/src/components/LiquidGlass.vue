<script setup lang="ts">
import { computed, getCurrentInstance, ref, toRef, useAttrs, type CSSProperties } from 'vue'
import type { LiquidGlassProps } from '../types'
import { useElasticTransform } from '../composables/useElasticTransform'
import { useGlassSize } from '../composables/useGlassSize'
import { useMouseTracking } from '../composables/useMouseTracking'
import { hasClickListener } from '../utils/listeners'
import GlassContainer from './GlassContainer.vue'

defineOptions({ name: 'LiquidGlass' })

const props = withDefaults(defineProps<LiquidGlassProps>(), {
  displacementScale: 70,
  blurAmount: 0.0625,
  saturation: 140,
  aberrationIntensity: 2,
  elasticity: 0.15,
  cornerRadius: 999,
  class: '',
  padding: '24px 32px',
  overLight: false,
  mode: 'standard',
  style: () => ({}),
})

const emit = defineEmits<{
  click: []
}>()

const attrs = useAttrs()
const instance = getCurrentInstance()
const glassContainerRef = ref<InstanceType<typeof GlassContainer> | null>(null)
const glassRef = computed(() => glassContainerRef.value?.el ?? null)

const isHovered = ref(false)
const isActive = ref(false)

const mouseContainerRef = computed(() => props.mouseContainer ?? null)

const { globalMousePos, mouseOffset } = useMouseTracking({
  mouseContainer: mouseContainerRef,
  glassRef,
  globalMousePos: toRef(props, 'globalMousePos'),
  mouseOffset: toRef(props, 'mouseOffset'),
})

const { glassSize } = useGlassSize(glassRef)

const clickable = computed(() => hasClickListener(attrs, instance))
const isActiveRef = computed(() => isActive.value)
const clickableRef = computed(() => clickable.value)
const styleRef = computed(() => props.style)
const elasticityRef = computed(() => props.elasticity)

const { baseStyle, positionStyles } = useElasticTransform({
  globalMousePos,
  glassRef,
  glassSize,
  elasticity: elasticityRef,
  isActive: isActiveRef,
  clickable: clickableRef,
  style: styleRef,
})

const layerStyle = computed((): CSSProperties => ({
  ...(positionStyles.value as CSSProperties),
  height: `${glassSize.value.height}px`,
  width: `${glassSize.value.width}px`,
  borderRadius: `${props.cornerRadius}px`,
  transform: baseStyle.value.transform,
  transition: baseStyle.value.transition,
}))

const borderBaseStyle = computed((): CSSProperties => ({
  ...layerStyle.value,
  pointerEvents: 'none',
  padding: '1.5px',
  WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
  WebkitMaskComposite: 'xor',
  maskComposite: 'exclude',
  boxShadow: '0 0 0 0.5px rgba(255, 255, 255, 0.5) inset, 0 1px 3px rgba(255, 255, 255, 0.25) inset, 0 1px 4px rgba(0, 0, 0, 0.35)',
}))

const borderLayer1Style = computed((): CSSProperties => ({
  ...borderBaseStyle.value,
  mixBlendMode: 'screen',
  opacity: 0.2,
  background: `linear-gradient(
    ${135 + mouseOffset.value.x * 1.2}deg,
    rgba(255, 255, 255, 0.0) 0%,
    rgba(255, 255, 255, ${0.12 + Math.abs(mouseOffset.value.x) * 0.008}) ${Math.max(10, 33 + mouseOffset.value.y * 0.3)}%,
    rgba(255, 255, 255, ${0.4 + Math.abs(mouseOffset.value.x) * 0.012}) ${Math.min(90, 66 + mouseOffset.value.y * 0.4)}%,
    rgba(255, 255, 255, 0.0) 100%
  )`,
}))

const borderLayer2Style = computed((): CSSProperties => ({
  ...borderBaseStyle.value,
  mixBlendMode: 'overlay',
  background: `linear-gradient(
    ${135 + mouseOffset.value.x * 1.2}deg,
    rgba(255, 255, 255, 0.0) 0%,
    rgba(255, 255, 255, ${0.32 + Math.abs(mouseOffset.value.x) * 0.008}) ${Math.max(10, 33 + mouseOffset.value.y * 0.3)}%,
    rgba(255, 255, 255, ${0.6 + Math.abs(mouseOffset.value.x) * 0.012}) ${Math.min(90, 66 + mouseOffset.value.y * 0.4)}%,
    rgba(255, 255, 255, 0.0) 100%
  )`,
}))

const hoverLayerBaseStyle = computed((): CSSProperties => ({
  ...(positionStyles.value as CSSProperties),
  height: `${glassSize.value.height}px`,
  width: `${glassSize.value.width + 1}px`,
  borderRadius: `${props.cornerRadius}px`,
  transform: baseStyle.value.transform,
  pointerEvents: 'none',
  transition: 'all 0.2s ease-out',
  mixBlendMode: 'overlay',
}))

const hoverLayer1Style = computed((): CSSProperties => ({
  ...hoverLayerBaseStyle.value,
  opacity: isHovered.value || isActive.value ? 0.5 : 0,
  backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 50%)',
}))

const hoverLayer2Style = computed((): CSSProperties => ({
  ...hoverLayerBaseStyle.value,
  opacity: isActive.value ? 0.5 : 0,
  backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 80%)',
}))

const hoverLayer3Style = computed((): CSSProperties => {
  const style = baseStyle.value as CSSProperties
  return {
    ...style,
    height: `${glassSize.value.height}px`,
    width: `${glassSize.value.width + 1}px`,
    borderRadius: `${props.cornerRadius}px`,
    position: style.position,
    top: style.top,
    left: style.left,
    pointerEvents: 'none',
    transition: 'all 0.2s ease-out',
    opacity: isHovered.value ? 0.4 : isActive.value ? 0.8 : 0,
    backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%)',
    mixBlendMode: 'overlay',
  }
})

function handleClick() {
  emit('click')
}
</script>

<template>
  <div
    class="bg-black transition-all duration-150 ease-in-out pointer-events-none"
    :class="overLight ? 'opacity-20' : 'opacity-0'"
    :style="layerStyle"
  />
  <div
    class="bg-black transition-all duration-150 ease-in-out pointer-events-none mix-blend-overlay"
    :class="overLight ? 'opacity-100' : 'opacity-0'"
    :style="layerStyle"
  />

  <GlassContainer
    ref="glassContainerRef"
    :class="props.class"
    :style="baseStyle"
    :corner-radius="props.cornerRadius"
    :displacement-scale="overLight ? displacementScale * 0.5 : displacementScale"
    :blur-amount="blurAmount"
    :saturation="saturation"
    :aberration-intensity="aberrationIntensity"
    :glass-size="glassSize"
    :padding="padding"
    :mouse-offset="mouseOffset"
    :active="isActive"
    :over-light="overLight"
    :mode="mode"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @mousedown="isActive = true"
    @mouseup="isActive = false"
    v-on="clickable ? { click: handleClick } : {}"
  >
    <slot />
  </GlassContainer>

  <span :style="borderLayer1Style" />

  <span :style="borderLayer2Style" />

  <template v-if="clickable">
    <div :style="hoverLayer1Style" />
    <div :style="hoverLayer2Style" />
    <div :style="hoverLayer3Style" />
  </template>
</template>
