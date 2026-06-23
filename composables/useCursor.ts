/**
 * useCursor
 * 全局指针位置（归一化 -1~1），供 Three.js / 视差组件读取。
 * 仅追踪指针，不做任何 DOM 副作用。
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

const x = ref(0)
const y = ref(0)
let raf = 0
let tx = 0
let ty = 0

function tick() {
  x.value += (tx - x.value) * 0.12
  y.value += (ty - y.value) * 0.12
  raf = requestAnimationFrame(tick)
}

export function useCursor() {
  onMounted(() => {
    if (typeof window === 'undefined') return
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1
      ty = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)
    onBeforeUnmount(() => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    })
  })
  return { x, y }
}
