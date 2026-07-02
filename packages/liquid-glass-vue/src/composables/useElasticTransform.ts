import type { Ref } from 'vue'
import { computed } from 'vue'
import type { Size, Vec2 } from '../types'
import { TRANSFORM_TRANSITION } from '../constants'
import {
  buildPositionStyles,
  buildTransformStyle,
  calcDirectionalScale,
  calcElasticTranslation,
  calcFadeInFactor,
} from '../utils/elastic-transform'

export interface UseElasticTransformOptions {
  globalMousePos: Ref<Vec2>
  glassRef: Ref<HTMLElement | null>
  glassSize: Ref<Size>
  elasticity: Ref<number>
  isActive: Ref<boolean>
  clickable: Ref<boolean>
  style?: Ref<Record<string, string | number> | undefined>
}

export function useElasticTransform(options: UseElasticTransformOptions) {
  const transformStyle = computed(() => {
    const glassEl = options.glassRef.value
    if (!glassEl) {
      return buildTransformStyle({ x: 0, y: 0 }, 'scale(1)', options.isActive.value, options.clickable.value)
    }

    const glassRect = glassEl.getBoundingClientRect()
    const fadeInFactor = calcFadeInFactor(
      options.globalMousePos.value,
      glassRect,
      options.glassSize.value,
    )
    const translation = calcElasticTranslation(
      options.globalMousePos.value,
      glassRect,
      options.elasticity.value,
      fadeInFactor,
    )
    const directionalScale = calcDirectionalScale(
      options.globalMousePos.value,
      glassRect,
      options.glassSize.value,
      options.elasticity.value,
    )

    return buildTransformStyle(
      translation,
      directionalScale,
      options.isActive.value,
      options.clickable.value,
    )
  })

  const baseStyle = computed(() => ({
    ...(options.style?.value ?? {}),
    transform: transformStyle.value,
    transition: TRANSFORM_TRANSITION,
  }))

  const positionStyles = computed(() => buildPositionStyles(baseStyle.value))

  return { transformStyle, positionStyles, baseStyle }
}
