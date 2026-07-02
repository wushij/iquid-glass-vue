import type { ShaderOptions, Vec2 } from '../types'
import { EDGE_FADE_DISTANCE } from '../constants'

export class ShaderDisplacementGenerator {
  private canvas: HTMLCanvasElement
  private context: CanvasRenderingContext2D
  private canvasDPI = 1

  constructor(private options: ShaderOptions) {
    this.canvas = document.createElement('canvas')
    this.canvas.width = options.width * this.canvasDPI
    this.canvas.height = options.height * this.canvasDPI
    this.canvas.style.display = 'none'

    const context = this.canvas.getContext('2d')
    if (!context) {
      throw new Error('Could not get 2D context')
    }
    this.context = context
  }

  updateShader(mousePosition?: Vec2): string {
    const w = this.options.width * this.canvasDPI
    const h = this.options.height * this.canvasDPI

    let maxScale = 0
    const rawValues: number[] = []

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const uv: Vec2 = { x: x / w, y: y / h }

        const pos = this.options.fragment(uv, mousePosition)
        const dx = pos.x * w - x
        const dy = pos.y * h - y

        maxScale = Math.max(maxScale, Math.abs(dx), Math.abs(dy))
        rawValues.push(dx, dy)
      }
    }

    if (maxScale > 0) {
      maxScale = Math.max(maxScale, 1)
    }
    else {
      maxScale = 1
    }

    const imageData = this.context.createImageData(w, h)
    const data = imageData.data

    let rawIndex = 0
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const dx = rawValues[rawIndex++]!
        const dy = rawValues[rawIndex++]!

        const edgeDistance = Math.min(x, y, w - x - 1, h - y - 1)
        const edgeFactor = Math.min(1, edgeDistance / EDGE_FADE_DISTANCE)

        const smoothedDx = dx * edgeFactor
        const smoothedDy = dy * edgeFactor

        const r = smoothedDx / maxScale + 0.5
        const g = smoothedDy / maxScale + 0.5

        const pixelIndex = (y * w + x) * 4
        data[pixelIndex] = Math.max(0, Math.min(255, r * 255))
        data[pixelIndex + 1] = Math.max(0, Math.min(255, g * 255))
        data[pixelIndex + 2] = Math.max(0, Math.min(255, g * 255))
        data[pixelIndex + 3] = 255
      }
    }

    this.context.putImageData(imageData, 0, 0)
    return this.canvas.toDataURL()
  }

  destroy(): void {
    this.canvas.remove()
  }

  getScale(): number {
    return this.canvasDPI
  }
}
