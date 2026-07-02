import type { RefractionMode, Size } from './types'

export const ACTIVATION_ZONE = 200

export const DEFAULT_GLASS_SIZE: Size = { width: 270, height: 69 }

export const EDGE_FADE_DISTANCE = 2

export const DEFAULT_LIQUID_GLASS_PROPS = {
  displacementScale: 70,
  blurAmount: 0.0625,
  saturation: 140,
  aberrationIntensity: 2,
  elasticity: 0.15,
  cornerRadius: 999,
  padding: '24px 32px',
  mode: 'standard' as RefractionMode,
  overLight: false,
  class: '',
} as const

export const TRANSFORM_TRANSITION = 'all ease-out 0.2s'

export const STRETCH_DISTANCE = 300

export const STRETCH_SCALE_X_FACTOR = 0.3

export const STRETCH_SCALE_Y_COMPRESS = 0.15

export const MIN_DIRECTIONAL_SCALE = 0.8

export const ELASTIC_TRANSLATION_FACTOR = 0.1

export const ACTIVE_CLICK_SCALE = 0.96
