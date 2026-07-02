<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { LogOut } from 'lucide-vue-next'
import { LiquidGlass } from 'liquid-glass-vue'
import ControlPanel, { type ActiveTab, type GlassControls } from './components/ControlPanel.vue'

const activeTab = ref<ActiveTab>('userInfo')
const containerRef = ref<HTMLElement | null>(null)
const scroll = ref(0)
const demoRect = ref({ left: 0, width: 0 })

const userInfo = ref<GlassControls>({
  mode: 'standard',
  displacementScale: 100,
  blurAmount: 0.5,
  saturation: 140,
  aberrationIntensity: 2,
  elasticity: 0,
  cornerRadius: 32,
  overLight: false,
})

const logout = ref<GlassControls>({
  mode: 'standard',
  displacementScale: 64,
  blurAmount: 0.1,
  saturation: 130,
  aberrationIntensity: 2,
  elasticity: 0.35,
  cornerRadius: 100,
  overLight: false,
})

const scrollingOverBrightSection = computed(() => scroll.value > 230 && scroll.value < 500)

const userInfoOverLight = computed(() => scrollingOverBrightSection.value || userInfo.value.overLight)
const logoutOverLight = computed(() => scrollingOverBrightSection.value || logout.value.overLight)

/** 演示区内水平 40%，left 按演示区实际位置换算为 fixed 像素 */
const glassLeft = computed(() => `${demoRect.value.left + demoRect.value.width * 0.4}px`)

const userInfoGlassStyle = computed(() => ({
  position: 'fixed' as const,
  top: '25%',
  left: glassLeft.value,
}))

const logoutGlassStyle = computed(() => ({
  position: 'fixed' as const,
  top: '20%',
  left: glassLeft.value,
}))

function syncDemoRect() {
  const el = containerRef.value
  if (!el)
    return
  const { left, width } = el.getBoundingClientRect()
  demoRect.value = { left, width }
}

let resizeObserver: ResizeObserver | null = null

function handleScroll(event: Event) {
  requestAnimationFrame(() => {
    scroll.value = (event.target as HTMLElement).scrollTop
  })
}

function handleLogoutClick() {
  console.log('已退出登录')
}

onMounted(() => {
  syncDemoRect()
  window.addEventListener('resize', syncDemoRect)
  resizeObserver = new ResizeObserver(syncDemoRect)
})

watch(containerRef, (el) => {
  resizeObserver?.disconnect()
  if (el && resizeObserver)
    resizeObserver.observe(el)
  syncDemoRect()
}, { immediate: true })

onUnmounted(() => {
  window.removeEventListener('resize', syncDemoRect)
  resizeObserver?.disconnect()
})
</script>

<template>
  <div class="grid grid-cols-1 grid-rows-2 md:grid-rows-1 md:grid-cols-3 shadow-2xl w-full max-w-5xl mx-auto md:my-10 h-screen md:max-h-[calc(100vh-5rem)] md:rounded-3xl overflow-hidden">
    <ControlPanel
      v-model:active-tab="activeTab"
      v-model:user-info="userInfo"
      v-model:logout="logout"
    />

    <div
      ref="containerRef"
      class="flex-1 relative overflow-auto min-h-0 md:min-h-screen md:col-span-2 md:col-start-2 row-start-2 md:row-start-1 scrollbar-demo"
      @scroll="handleScroll"
    >
      <div class="w-full min-h-[200vh] absolute top-0 left-0 pb-96 mb-96">
        <img
          src="https://picsum.photos/2000/2000"
          alt="背景图片"
          class="w-full h-96 object-cover"
        >
        <div id="bright-section" class="flex flex-col gap-2">
          <h2 class="text-2xl font-semibold my-5 text-center">
            示例标题
          </h2>
          <p class="px-10">
            向下滚动页面，观察液态玻璃在明暗背景上的不同表现。<br>
            将鼠标移近玻璃边缘，可看到弹性形变与边缘折射效果。<br>
            左侧面板可实时调节位移、模糊、饱和度、色散与弹性等参数。<br>
            切换「用户信息卡片」与「退出登录按钮」可对比两种典型用法。<br>
            在浅色文字区域滚动时，会自动启用浅色背景模式。<br>
            建议使用 Chrome 或 Edge 浏览器以获得完整视觉效果。
          </p>
        </div>
        <img
          src="https://picsum.photos/1200/1200"
          alt="背景图片"
          class="w-full h-80 object-cover my-10"
        >
        <img
          src="https://picsum.photos/1400/1300"
          alt="背景图片"
          class="w-full h-72 object-cover my-10"
        >
        <img
          src="https://picsum.photos/1100/1200"
          alt="背景图片"
          class="w-full h-96 object-cover my-10 mb-96"
        >
      </div>

      <LiquidGlass
        v-if="activeTab === 'userInfo'"
        :displacement-scale="userInfo.displacementScale"
        :blur-amount="userInfo.blurAmount"
        :saturation="userInfo.saturation"
        :aberration-intensity="userInfo.aberrationIntensity"
        :elasticity="userInfo.elasticity"
        :corner-radius="userInfo.cornerRadius"
        :mouse-container="containerRef"
        :over-light="userInfoOverLight"
        :mode="userInfo.mode"
        :style="userInfoGlassStyle"
      >
        <div class="w-72 text-shadow-lg">
          <h3 class="text-xl font-semibold mb-4">
            用户信息
          </h3>
          <div class="space-y-3">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-black/10 backdrop-blur rounded-full flex items-center justify-center text-white font-semibold">
                张
              </div>
              <div>
                <p class="font-medium">
                  张三
                </p>
                <p class="text-sm text-white">
                  前端工程师
                </p>
              </div>
            </div>
            <div class="pt-2 space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-white">邮箱：</span>
                <span class="text-sm">zhangsan@example.com</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-white">所在地：</span>
                <span class="text-sm">上海</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-white">加入时间：</span>
                <span class="text-sm">2023 年 3 月</span>
              </div>
            </div>
          </div>
        </div>
      </LiquidGlass>

      <LiquidGlass
        v-else
        :displacement-scale="logout.displacementScale"
        :blur-amount="logout.blurAmount"
        :saturation="logout.saturation"
        :aberration-intensity="logout.aberrationIntensity"
        :elasticity="logout.elasticity"
        :corner-radius="logout.cornerRadius"
        :mouse-container="containerRef"
        :over-light="logoutOverLight"
        :mode="logout.mode"
        padding="8px 16px"
        :style="logoutGlassStyle"
        @click="handleLogoutClick"
      >
        <h3 class="text-lg font-medium flex items-center gap-2">
          退出登录
          <LogOut class="w-5 h-5" />
        </h3>
      </LiquidGlass>
    </div>
  </div>
</template>
