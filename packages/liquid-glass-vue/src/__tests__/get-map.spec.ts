import { describe, expect, it } from 'vitest'
import {
  displacementMap,
  polarDisplacementMap,
  prominentDisplacementMap,
} from '../utils/displacement-maps'
import { getMap } from '../utils/get-map'

describe('getMap', () => {
  it('returns standard displacement map', () => {
    expect(getMap('standard')).toBe(displacementMap)
  })

  it('returns polar displacement map', () => {
    expect(getMap('polar')).toBe(polarDisplacementMap)
  })

  it('returns prominent displacement map', () => {
    expect(getMap('prominent')).toBe(prominentDisplacementMap)
  })

  it('returns shader map url when provided', () => {
    const shaderUrl = 'data:image/png;base64,shader-test'
    expect(getMap('shader', shaderUrl)).toBe(shaderUrl)
  })

  it('falls back to standard map for shader mode without url', () => {
    expect(getMap('shader')).toBe(displacementMap)
  })
})
