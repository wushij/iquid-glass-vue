# liquid-glass-vue

适用于 Vue 3 的 Apple 液态玻璃效果组件库。

仓库地址：[github.com/wushij/iquid-glass-vue](https://github.com/wushij/iquid-glass-vue)

在 Chromium 浏览器中实现边缘折射、磨砂、色散与液态弹性交互。

## 特性

- 正确的边缘弯曲与折射
- 四种折射模式：标准 / 极坐标 / 突出 / 着色器
- 磨砂玻璃背景（`backdrop-filter`）
- 鼠标弹性形变与动态边框高光
- 零运行时依赖（仅需 `vue` 作为对等依赖）
- 全量 TypeScript 编写

## 安装

```bash
pnpm add liquid-glass-vue
```

## 基本用法

```vue
<script setup lang="ts">
import { LiquidGlass } from 'liquid-glass-vue'
</script>

<template>
  <LiquidGlass>
    <div class="p-6">
      <h2>你的内容</h2>
      <p>液态玻璃效果</p>
    </div>
  </LiquidGlass>
</template>
```

## 按钮示例

```vue
<LiquidGlass
  :displacement-scale="64"
  :blur-amount="0.1"
  :saturation="130"
  :aberration-intensity="2"
  :elasticity="0.35"
  :corner-radius="100"
  padding="8px 16px"
  @click="handleClick"
>
  <span class="text-white font-medium">点我</span>
</LiquidGlass>
```

## 鼠标容器

在更大范围内跟随鼠标移动时，可指定 `mouse-container`：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { LiquidGlass } from 'liquid-glass-vue'

const containerRef = ref<HTMLElement | null>(null)
</script>

<template>
  <div ref="containerRef" class="w-full h-screen">
    <LiquidGlass
      :mouse-container="containerRef"
      :elasticity="0.3"
      :style="{ position: 'fixed', top: '50%', left: '50%' }"
    >
      <div class="p-6">玻璃在容器内跟随鼠标</div>
    </LiquidGlass>
  </div>
</template>
```

## 本地开发

```bash
# 安装依赖
pnpm install

# 构建组件库
pnpm build

# 运行测试
pnpm test

# 启动演示应用
cd apps/playground && pnpm dev
```

## 浏览器兼容性

| 浏览器 | 边缘折射 | 磨砂效果 |
|--------|----------|----------|
| Chrome / Edge | ✅ 完整 | ✅ |
| Safari | ⚠️ 部分 | ✅ |
| Firefox | ❌ 不支持 | ✅ |

## 许可证

MIT
