import { computed, onUnmounted, ref, watch, type Ref } from 'vue'
import type { Vec2 } from '../types'
import { calcMouseOffset } from '../utils/elastic-transform'

export interface UseMouseTrackingOptions {
  mouseContainer: Ref<HTMLElement | null | undefined>
  glassRef: Ref<HTMLElement | null>
  globalMousePos?: Ref<Vec2 | undefined>
  mouseOffset?: Ref<Vec2 | undefined>
}

export function useMouseTracking(options: UseMouseTrackingOptions) {
  const internalGlobalMousePos = ref<Vec2>({ x: 0, y: 0 })
  const internalMouseOffset = ref<Vec2>({ x: 0, y: 0 })

  const useExternalTracking = computed(
    () => options.globalMousePos?.value !== undefined
      && options.mouseOffset?.value !== undefined,
  )

  const globalMousePos = computed<Vec2>(() =>
    options.globalMousePos?.value ?? internalGlobalMousePos.value,
  )

  const mouseOffset = computed<Vec2>(() =>
    options.mouseOffset?.value ?? internalMouseOffset.value,
  )

  let attachedContainer: HTMLElement | null = null

  function handleMouseMove(e: MouseEvent) {
    const container = options.mouseContainer.value || options.glassRef.value
    if (!container) {
      return
    }

    const rect = container.getBoundingClientRect()
    internalMouseOffset.value = calcMouseOffset(e, rect)
    internalGlobalMousePos.value = {
      x: e.clientX,
      y: e.clientY,
    }
  }

  function detach() {
    if (attachedContainer) {
      attachedContainer.removeEventListener('mousemove', handleMouseMove)
      attachedContainer = null
    }
  }

  function attach() {
    if (useExternalTracking.value) {
      detach()
      return
    }

    const container = options.mouseContainer.value || options.glassRef.value
    if (!container || container === attachedContainer) {
      return
    }

    detach()
    container.addEventListener('mousemove', handleMouseMove)
    attachedContainer = container
  }

  watch(
    [() => options.glassRef.value, () => options.mouseContainer.value, useExternalTracking],
    attach,
    { immediate: true },
  )

  onUnmounted(detach)

  return { globalMousePos, mouseOffset, useExternalTracking }
}
