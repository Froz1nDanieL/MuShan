<!--
  components/Debug/AbyssGradientDebug.vue

  调试用：右下角小窗，实时显示当前色阶 / ACT / 滚动进度。
  不会随滚动移动，颜色与背景一致，会随 --abyss-text-on-light 自动反转配色。
  默认 visible = false；需要时在 layout 或 page 显式打开：
    <AbyssGradientDebug :visible="import.meta.env.DEV" />
-->
<template>
  <div
    v-if="visible"
    class="abyss-debug"
    :data-text-light="textOnLight ? '1' : '0'"
  >
    <div class="abyss-debug__swatch" :style="{ background: rgb }" />
    <div class="abyss-debug__col">
      <div class="abyss-debug__act">{{ act }}</div>
      <div class="abyss-debug__label">{{ label }}</div>
      <div class="abyss-debug__hex">{{ hex }}</div>
      <div class="abyss-debug__bar">
        <div
          class="abyss-debug__bar-fill"
          :style="{ width: `${progress * 100}%` }"
        />
      </div>
      <div class="abyss-debug__pct">{{ (progress * 100).toFixed(1) }}%</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAbyssGradient } from '~/composables/useAbyssGradient'

withDefaults(defineProps<{ visible?: boolean }>(), { visible: false })

const { hex, rgb, act, label, progress, textOnLight } = useAbyssGradient()
</script>

<style scoped>
.abyss-debug {
  position: fixed;
  right: 14px;
  bottom: 14px;
  z-index: 70;
  display: flex;
  align-items: stretch;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 4px;
  font-family: ui-monospace, "JetBrains Mono", "Geist Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.02em;
  line-height: 1.35;
  pointer-events: none;
  user-select: none;
  background: rgba(255, 255, 255, 0.92);
  color: #07111A;
  border: 1px solid rgba(7, 17, 26, 0.12);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.abyss-debug[data-text-light="0"] {
  background: rgba(2, 4, 10, 0.78);
  color: #E6EEF2;
  border-color: rgba(230, 238, 242, 0.18);
}
.abyss-debug__swatch {
  width: 30px;
  height: 30px;
  border-radius: 2px;
  border: 1px solid currentColor;
  opacity: 0.95;
  flex-shrink: 0;
}
.abyss-debug__col {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 150px;
}
.abyss-debug__act { font-weight: 600; }
.abyss-debug__label { opacity: 0.7; }
.abyss-debug__hex { opacity: 0.65; font-size: 9.5px; }
.abyss-debug__bar {
  margin-top: 4px;
  height: 1.5px;
  background: rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}
.abyss-debug[data-text-light="0"] .abyss-debug__bar {
  background: rgba(230, 238, 242, 0.18);
}
.abyss-debug__bar-fill {
  position: absolute;
  inset: 0 auto 0 0;
  background: currentColor;
}
.abyss-debug__pct { font-size: 9px; opacity: 0.55; }
</style>
