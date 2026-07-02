import { onUnmounted, ref, watch, type Ref } from 'vue'
import type { Size } from '../types'
import { DEFAULT_GLASS_SIZE } from '../constants'

export function useGlassSize(target: Ref<HTMLElement | null>) {
  const glassSize = ref<Size>({ ...DEFAULT_GLASS_SIZE })

  let observer: ResizeObserver | null = null

  function updateSize(el: HTMLElement) {
    const rect = el.getBoundingClientRect()
    glassSize.value = { width: rect.width, height: rect.height }
  }

  watch(
    target,
    (el, _, onCleanup) => {
      observer?.disconnect()
      observer = null

      if (!el) {
        return
      }

      updateSize(el)
      if (typeof ResizeObserver === 'undefined') {
        return
      }

      observer = new ResizeObserver(() => updateSize(el))
      observer.observe(el)

      onCleanup(() => {
        observer?.disconnect()
        observer = null
      })
    },
    { immediate: true },
  )

  onUnmounted(() => {
    observer?.disconnect()
    observer = null
  })

  return { glassSize }
}
