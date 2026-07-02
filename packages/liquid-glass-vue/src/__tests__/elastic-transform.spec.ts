import { describe, expect, it } from 'vitest'
import { ACTIVATION_ZONE, MIN_DIRECTIONAL_SCALE } from '../constants'
import {
  buildTransformStyle,
  calcDirectionalScale,
  calcElasticTranslation,
  calcFadeInFactor,
} from '../utils/elastic-transform'
import type { Size, Vec2 } from '../types'

function makeRect(left: number, top: number, width: number, height: number): DOMRect {
  return {
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
    toJSON: () => ({}),
  } as DOMRect
}

describe('calcFadeInFactor', () => {
  const glassSize: Size = { width: 200, height: 80 }
  const glassRect = makeRect(100, 100, 200, 80)

  it('returns 0 when global mouse position is at origin', () => {
    expect(calcFadeInFactor({ x: 0, y: 0 }, glassRect, glassSize)).toBe(0)
  })

  it('returns 1 when mouse is at pill center', () => {
    expect(calcFadeInFactor({ x: 200, y: 140 }, glassRect, glassSize)).toBe(1)
  })

  it('returns 0 when mouse is outside activation zone', () => {
    const mouse: Vec2 = { x: 200, y: 100 + ACTIVATION_ZONE + 100 }
    expect(calcFadeInFactor(mouse, glassRect, glassSize)).toBe(0)
  })

  it('fades linearly within activation zone', () => {
    const halfZone = ACTIVATION_ZONE / 2
    const mouse: Vec2 = { x: 200, y: 140 + glassSize.height / 2 + halfZone }
    expect(calcFadeInFactor(mouse, glassRect, glassSize)).toBeCloseTo(0.5, 5)
  })
})

describe('calcDirectionalScale', () => {
  const glassSize: Size = { width: 200, height: 80 }
  const glassRect = makeRect(100, 100, 200, 80)

  it('returns scale(1) when mouse is at origin', () => {
    expect(calcDirectionalScale({ x: 0, y: 0 }, glassRect, glassSize, 0.15)).toBe('scale(1)')
  })

  it('returns scale(1) when mouse is outside activation zone', () => {
    const mouse: Vec2 = { x: 500, y: 500 }
    expect(calcDirectionalScale(mouse, glassRect, glassSize, 0.15)).toBe('scale(1)')
  })

  it('stretches toward mouse within activation zone', () => {
    const mouse: Vec2 = { x: 350, y: 140 }
    const result = calcDirectionalScale(mouse, glassRect, glassSize, 0.15)
    expect(result).toMatch(/^scaleX\(/)
    expect(result).toMatch(/scaleY\(/)
    expect(result).not.toBe('scale(1)')
  })

  it('clamps scale to minimum directional scale', () => {
    const mouse: Vec2 = { x: 250, y: 140 }
    const result = calcDirectionalScale(mouse, glassRect, glassSize, 0.15)
    const scaleXMatch = result.match(/scaleX\(([\d.]+)\)/)
    const scaleYMatch = result.match(/scaleY\(([\d.]+)\)/)
    expect(Number(scaleXMatch?.[1])).toBeGreaterThanOrEqual(MIN_DIRECTIONAL_SCALE)
    expect(Number(scaleYMatch?.[1])).toBeGreaterThanOrEqual(MIN_DIRECTIONAL_SCALE)
  })
})

describe('calcElasticTranslation', () => {
  const glassRect = makeRect(100, 100, 200, 80)

  it('translates toward mouse proportional to elasticity and fade-in', () => {
    const mouse: Vec2 = { x: 300, y: 140 }
    const result = calcElasticTranslation(mouse, glassRect, 0.15, 1)
    expect(result.x).toBeCloseTo(1.5, 5)
    expect(result.y).toBe(0)
  })

  it('returns zero translation when fade-in is 0', () => {
    const mouse: Vec2 = { x: 300, y: 140 }
    expect(calcElasticTranslation(mouse, glassRect, 0.15, 0)).toEqual({ x: 0, y: 0 })
  })
})

describe('buildTransformStyle', () => {
  it('applies active click scale when active and clickable', () => {
    const result = buildTransformStyle({ x: 5, y: -3 }, 'scaleX(1.1) scaleY(0.95)', true, true)
    expect(result).toBe('translate(calc(-50% + 5px), calc(-50% + -3px)) scale(0.96)')
  })

  it('uses directional scale when not active', () => {
    const result = buildTransformStyle({ x: 0, y: 0 }, 'scaleX(1.05) scaleY(1.02)', false, true)
    expect(result).toBe('translate(calc(-50% + 0px), calc(-50% + 0px)) scaleX(1.05) scaleY(1.02)')
  })
})
