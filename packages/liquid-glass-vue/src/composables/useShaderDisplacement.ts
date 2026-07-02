import type { Ref } from 'vue'
import { ref, watch } from 'vue'
import type { RefractionMode, Size } from '../types'
import { fragmentShaders } from '../shader/fragment-shaders'
import { ShaderDisplacementGenerator } from '../shader/shader-utils'

export function generateShaderDisplacementMap(width: number, height: number): string {
  const generator = new ShaderDisplacementGenerator({
    width,
    height,
    fragment: fragmentShaders.liquidGlass,
  })

  const dataUrl = generator.updateShader()
  generator.destroy()

  return dataUrl
}

export interface UseShaderDisplacementOptions {
  mode: Ref<RefractionMode>
  glassSize: Ref<Size>
}

export function useShaderDisplacement(options: UseShaderDisplacementOptions) {
  const shaderMapUrl = ref('')

  watch(
    [() => options.mode.value, () => options.glassSize.value.width, () => options.glassSize.value.height],
    () => {
      if (options.mode.value !== 'shader') {
        return
      }

      shaderMapUrl.value = generateShaderDisplacementMap(
        options.glassSize.value.width,
        options.glassSize.value.height,
      )
    },
    { immediate: true },
  )

  return { shaderMapUrl }
}
