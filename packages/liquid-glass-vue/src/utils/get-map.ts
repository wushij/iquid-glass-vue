import type { RefractionMode } from '../types'
import { displacementMap, polarDisplacementMap, prominentDisplacementMap } from './displacement-maps'

export function getMap(mode: RefractionMode, shaderMapUrl?: string): string {
  switch (mode) {
    case 'standard':
      return displacementMap
    case 'polar':
      return polarDisplacementMap
    case 'prominent':
      return prominentDisplacementMap
    case 'shader':
      return shaderMapUrl || displacementMap
    default:
      throw new Error(`Invalid mode: ${mode}`)
  }
}
