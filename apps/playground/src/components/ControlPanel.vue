<script setup lang="ts">
import { computed } from 'vue'
import { Github } from 'lucide-vue-next'
import SliderControl from './SliderControl.vue'

export type RefractionMode = 'standard' | 'polar' | 'prominent' | 'shader'
export type ActiveTab = 'userInfo' | 'logOut'

export interface GlassControls {
  mode: RefractionMode
  displacementScale: number
  blurAmount: number
  saturation: number
  aberrationIntensity: number
  elasticity: number
  cornerRadius: number
  overLight: boolean
}

const activeTab = defineModel<ActiveTab>('activeTab', { required: true })
const userInfo = defineModel<GlassControls>('userInfo', { required: true })
const logout = defineModel<GlassControls>('logout', { required: true })

const modes: { value: RefractionMode, label: string }[] = [
  { value: 'standard', label: '标准' },
  { value: 'polar', label: '极坐标' },
  { value: 'prominent', label: '突出' },
  { value: 'shader', label: '着色器（实验性）' },
]

const currentControls = computed(() =>
  activeTab.value === 'userInfo' ? userInfo.value : logout.value,
)

function setMode(mode: RefractionMode) {
  if (activeTab.value === 'userInfo') {
    userInfo.value = { ...userInfo.value, mode }
  }
  else {
    logout.value = { ...logout.value, mode }
  }
}

function updateCurrent<K extends keyof GlassControls>(key: K, value: GlassControls[K]) {
  if (activeTab.value === 'userInfo') {
    userInfo.value = { ...userInfo.value, [key]: value }
  }
  else {
    logout.value = { ...logout.value, [key]: value }
  }
}

function formatCornerRadius(value: number) {
  return value === 999 ? '全圆角' : `${value}px`
}
</script>

<template>
  <aside class="control-panel md:col-span-1 md:col-start-1 row-start-1 flex flex-col min-h-0 max-h-[42vh] md:max-h-none border-b md:border-b-0 md:border-r border-white/10">
    <!-- 顶部：标题 + 切换（始终可见） -->
    <div class="shrink-0 p-4 md:p-5 border-b border-white/10 space-y-3">
      <div class="flex items-center justify-between gap-2">
        <h2 class="text-base font-bold text-white truncate">
          液态玻璃演示
        </h2>
        <a
          href="https://github.com/wushij/iquid-glass-vue"
          target="_blank"
          rel="noopener noreferrer"
          class="shrink-0 text-white/50 hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          title="在 GitHub 上查看"
        >
          <Github class="w-4 h-4" />
        </a>
      </div>

      <div class="flex gap-1 p-1 bg-black/30 rounded-lg">
        <button
          type="button"
          class="flex-1 px-2 py-2 text-xs md:text-sm font-medium rounded-md transition-all whitespace-nowrap"
          :class="activeTab === 'userInfo'
            ? 'bg-blue-500 text-white shadow-md'
            : 'text-white/75 hover:text-white hover:bg-white/10'"
          @click="activeTab = 'userInfo'"
        >
          用户卡片
        </button>
        <button
          type="button"
          class="flex-1 px-2 py-2 text-xs md:text-sm font-medium rounded-md transition-all whitespace-nowrap"
          :class="activeTab === 'logOut'
            ? 'bg-blue-500 text-white shadow-md'
            : 'text-white/75 hover:text-white hover:bg-white/10'"
          @click="activeTab = 'logOut'"
        >
          退出按钮
        </button>
      </div>

      <p class="text-amber-300/80 text-[11px] leading-snug">
        建议用 Chrome / Edge 查看完整效果
      </p>
    </div>

    <!-- 参数区：独立滚动 -->
    <div class="scrollbar-panel flex-1 overflow-y-auto p-4 md:p-5 space-y-6 min-h-0">
      <div>
        <span class="block text-sm font-semibold text-white/90 mb-2">折射模式</span>
        <div class="space-y-1.5">
          <label
            v-for="item in modes"
            :key="`${activeTab}-${item.value}`"
            class="flex items-center gap-2.5 text-sm text-white/90 cursor-pointer py-0.5"
          >
            <input
              type="radio"
              :name="`${activeTab}-mode`"
              :value="item.value"
              :checked="currentControls.mode === item.value"
              class="w-4 h-4 accent-blue-500 shrink-0"
              @change="setMode(item.value)"
            >
            {{ item.label }}
          </label>
        </div>
      </div>

      <SliderControl
        label="位移强度"
        :model-value="currentControls.displacementScale"
        :min="0"
        :max="200"
        :step="1"
        value-class="text-blue-300"
        hint="边缘扭曲强度"
        @update:model-value="updateCurrent('displacementScale', $event)"
      />

      <SliderControl
        label="模糊程度"
        :model-value="currentControls.blurAmount"
        :min="0"
        :max="1"
        :step="0.01"
        value-class="text-green-300"
        :format-value="(v) => v.toFixed(1)"
        hint="背景磨砂程度"
        @update:model-value="updateCurrent('blurAmount', $event)"
      />

      <SliderControl
        label="饱和度"
        :model-value="currentControls.saturation"
        :min="100"
        :max="300"
        :step="10"
        value-class="text-purple-300"
        :format-value="(v) => `${v}%`"
        hint="背景色彩饱和度"
        @update:model-value="updateCurrent('saturation', $event)"
      />

      <SliderControl
        label="色散强度"
        :model-value="currentControls.aberrationIntensity"
        :min="0"
        :max="20"
        :step="1"
        value-class="text-cyan-300"
        hint="红绿蓝通道分离"
        @update:model-value="updateCurrent('aberrationIntensity', $event)"
      />

      <SliderControl
        label="弹性"
        :model-value="currentControls.elasticity"
        :min="0"
        :max="1"
        :step="0.05"
        value-class="text-orange-300"
        :format-value="(v) => v.toFixed(2)"
        hint="向光标延伸程度"
        @update:model-value="updateCurrent('elasticity', $event)"
      />

      <SliderControl
        label="圆角"
        :model-value="currentControls.cornerRadius"
        :min="0"
        :max="100"
        :step="1"
        value-class="text-pink-300"
        :format-value="formatCornerRadius"
        hint="玻璃圆角大小"
        @update:model-value="updateCurrent('cornerRadius', $event)"
      />

      <label class="flex items-start gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          :checked="currentControls.overLight"
          class="w-4 h-4 mt-0.5 accent-blue-500 shrink-0"
          @change="updateCurrent('overLight', ($event.target as HTMLInputElement).checked)"
        >
        <span class="text-sm text-white/90 leading-snug">
          浅色背景模式（明亮背景下加深玻璃）
        </span>
      </label>
    </div>
  </aside>
</template>
