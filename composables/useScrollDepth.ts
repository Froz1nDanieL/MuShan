/**
 * useScrollDepth
 * 读取当前滚动深度 (0 ~ 1)，由 layouts/default.vue 持续写入
 * CSS 变量 --depth-progress。这里包一层响应式 ref 便于组件直接消费。
 */
import { ref, readonly } from 'vue'

const depth = ref(0)
const scrollY = ref(0)
const max = ref(1)

export function updateScrollDepth(nextDepth: number, nextScrollY: number, nextMax: number) {
  depth.value = Math.min(1, Math.max(0, nextDepth))
  scrollY.value = Math.max(0, nextScrollY)
  max.value = Math.max(1, nextMax)
}

export function useScrollDepth() {
  return {
    depth: readonly(depth),
    scrollY: readonly(scrollY),
    max: readonly(max),
  }
}
