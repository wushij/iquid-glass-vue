export { default as LiquidGlass } from './components/LiquidGlass.vue'

export type {
  GlassContainerProps,
  GlassFilterProps,
  LiquidGlassProps,
  RefractionMode,
  ShaderOptions,
  Size,
  Vec2,
} from './types'

export {
  ACTIVATION_ZONE,
  DEFAULT_GLASS_SIZE,
  DEFAULT_LIQUID_GLASS_PROPS,
  EDGE_FADE_DISTANCE,
} from './constants'

export { isFirefox } from './utils/browser'
export { getMap } from './utils/get-map'
export {
  displacementMap,
  polarDisplacementMap,
  prominentDisplacementMap,
} from './utils/displacement-maps'

export { fragmentShaders } from './shader/fragment-shaders'
export type { FragmentShaderType } from './shader/fragment-shaders'
export { ShaderDisplacementGenerator } from './shader/shader-utils'

export {
  buildPositionStyles,
  buildTransformStyle,
  calcDirectionalScale,
  calcElasticTranslation,
  calcFadeInFactor,
  calcMouseOffset,
} from './utils/elastic-transform'

export { useMouseTracking } from './composables/useMouseTracking'
export type { UseMouseTrackingOptions } from './composables/useMouseTracking'

export { useGlassSize } from './composables/useGlassSize'

export { useElasticTransform } from './composables/useElasticTransform'
export type { UseElasticTransformOptions } from './composables/useElasticTransform'

export {
  generateShaderDisplacementMap,
  useShaderDisplacement,
} from './composables/useShaderDisplacement'
export type { UseShaderDisplacementOptions } from './composables/useShaderDisplacement'
