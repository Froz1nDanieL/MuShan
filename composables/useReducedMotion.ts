/**
 * useReducedMotion
 * 包装 motion/动效时的统一降级开关。避免每个组件都重复监听 media query。
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

const reduced = ref(false)
let mq: MediaQueryList | null = null

function update() {
  if (!mq) return
  reduced.value = mq.matches
}

export function useReducedMotion() {
  onMounted(() => {
    if (typeof window === 'undefined') return
    mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    update()
    mq.addEventListener('change', update)
  })
  onBeforeUnmount(() => {
    mq?.removeEventListener('change', update)
    mq = null
  })
  return reduced
}
