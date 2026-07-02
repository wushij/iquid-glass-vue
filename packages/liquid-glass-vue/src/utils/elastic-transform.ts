import type { Size, Vec2 } from '../types'
import {
  ACTIVATION_ZONE,
  ACTIVE_CLICK_SCALE,
  ELASTIC_TRANSLATION_FACTOR,
  MIN_DIRECTIONAL_SCALE,
  STRETCH_DISTANCE,
  STRETCH_SCALE_X_FACTOR,
  STRETCH_SCALE_Y_COMPRESS,
} from '../constants'

export function calcMouseOffset(event: MouseEvent, rect: DOMRect): Vec2 {
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  return {
    x: ((event.clientX - centerX) / rect.width) * 100,
    y: ((event.clientY - centerY) / rect.height) * 100,
  }
}

export function calcFadeInFactor(
  globalMousePos: Vec2,
  glassRect: DOMRect,
  glassSize: Size,
): number {
  if (!globalMousePos.x || !globalMousePos.y) {
    return 0
  }

  const pillCenterX = glassRect.left + glassRect.width / 2
  const pillCenterY = glassRect.top + glassRect.height / 2
  const pillWidth = glassSize.width
  const pillHeight = glassSize.height

  const edgeDistanceX = Math.max(0, Math.abs(globalMousePos.x - pillCenterX) - pillWidth / 2)
  const edgeDistanceY = Math.max(0, Math.abs(globalMousePos.y - pillCenterY) - pillHeight / 2)
  const edgeDistance = Math.sqrt(edgeDistanceX * edgeDistanceX + edgeDistanceY * edgeDistanceY)

  return edgeDistance > ACTIVATION_ZONE ? 0 : 1 - edgeDistance / ACTIVATION_ZONE
}

export function calcDirectionalScale(
  globalMousePos: Vec2,
  glassRect: DOMRect,
  glassSize: Size,
  elasticity: number,
): string {
  if (!globalMousePos.x || !globalMousePos.y) {
    return 'scale(1)'
  }

  const pillCenterX = glassRect.left + glassRect.width / 2
  const pillCenterY = glassRect.top + glassRect.height / 2
  const pillWidth = glassSize.width
  const pillHeight = glassSize.height

  const deltaX = globalMousePos.x - pillCenterX
  const deltaY = globalMousePos.y - pillCenterY

  const edgeDistanceX = Math.max(0, Math.abs(deltaX) - pillWidth / 2)
  const edgeDistanceY = Math.max(0, Math.abs(deltaY) - pillHeight / 2)
  const edgeDistance = Math.sqrt(edgeDistanceX * edgeDistanceX + edgeDistanceY * edgeDistanceY)

  if (edgeDistance > ACTIVATION_ZONE) {
    return 'scale(1)'
  }

  const fadeInFactor = 1 - edgeDistance / ACTIVATION_ZONE

  const centerDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  if (centerDistance === 0) {
    return 'scale(1)'
  }

  const normalizedX = deltaX / centerDistance
  const normalizedY = deltaY / centerDistance

  const stretchIntensity = Math.min(centerDistance / STRETCH_DISTANCE, 1) * elasticity * fadeInFactor

  const scaleX = 1 + Math.abs(normalizedX) * stretchIntensity * STRETCH_SCALE_X_FACTOR - Math.abs(normalizedY) * stretchIntensity * STRETCH_SCALE_Y_COMPRESS
  const scaleY = 1 + Math.abs(normalizedY) * stretchIntensity * STRETCH_SCALE_X_FACTOR - Math.abs(normalizedX) * stretchIntensity * STRETCH_SCALE_Y_COMPRESS

  return `scaleX(${Math.max(MIN_DIRECTIONAL_SCALE, scaleX)}) scaleY(${Math.max(MIN_DIRECTIONAL_SCALE, scaleY)})`
}

export function calcElasticTranslation(
  globalMousePos: Vec2,
  glassRect: DOMRect,
  elasticity: number,
  fadeInFactor: number,
): Vec2 {
  const pillCenterX = glassRect.left + glassRect.width / 2
  const pillCenterY = glassRect.top + glassRect.height / 2

  return {
    x: (globalMousePos.x - pillCenterX) * elasticity * ELASTIC_TRANSLATION_FACTOR * fadeInFactor,
    y: (globalMousePos.y - pillCenterY) * elasticity * ELASTIC_TRANSLATION_FACTOR * fadeInFactor,
  }
}

export function buildTransformStyle(
  translation: Vec2,
  directionalScale: string,
  isActive: boolean,
  hasClick: boolean,
): string {
  const scalePart = isActive && hasClick ? `scale(${ACTIVE_CLICK_SCALE})` : directionalScale
  return `translate(calc(-50% + ${translation.x}px), calc(-50% + ${translation.y}px)) ${scalePart}`
}

export interface PositionStyles {
  position: string
  top: string
  left: string
}

export function buildPositionStyles(
  style: Record<string, string | number> = {},
): PositionStyles {
  return {
    position: String(style.position ?? 'relative'),
    top: String(style.top ?? '50%'),
    left: String(style.left ?? '50%'),
  }
}
