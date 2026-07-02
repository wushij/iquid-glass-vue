export interface Vec2 {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export type RefractionMode = 'standard' | 'polar' | 'prominent' | 'shader'

export interface LiquidGlassProps {
  /** 位移强度 */
  displacementScale?: number
  /** 磨砂程度（0~1） */
  blurAmount?: number
  /** 背景饱和度（%） */
  saturation?: number
  /** 色散强度 */
  aberrationIntensity?: number
  /** 液态弹性（0 = 刚性） */
  elasticity?: number
  /** 圆角（px） */
  cornerRadius?: number
  /** 外部全局鼠标坐标（手动控制） */
  globalMousePos?: Vec2
  /** 外部鼠标偏移（手动控制） */
  mouseOffset?: Vec2
  /** 鼠标追踪容器（默认组件自身） */
  mouseContainer?: HTMLElement | null
  /** 额外 class */
  class?: string
  /** CSS padding */
  padding?: string
  /** 行内样式 */
  style?: Record<string, string | number>
  /** 浅色背景模式 */
  overLight?: boolean
  /** 折射模式 */
  mode?: RefractionMode
}

export interface GlassFilterProps {
  id: string
  displacementScale: number
  aberrationIntensity: number
  width: number
  height: number
  mode: RefractionMode
  shaderMapUrl?: string
}

export interface GlassContainerProps {
  class?: string
  style?: Record<string, string | number>
  displacementScale?: number
  blurAmount?: number
  saturation?: number
  aberrationIntensity?: number
  mouseOffset?: Vec2
  active?: boolean
  overLight?: boolean
  cornerRadius?: number
  padding?: string
  glassSize?: Size
  mode?: RefractionMode
}

export interface ShaderOptions {
  width: number
  height: number
  fragment: (uv: Vec2, mouse?: Vec2) => Vec2
  mousePosition?: Vec2
}
