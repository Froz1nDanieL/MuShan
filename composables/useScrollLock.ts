/**
 * useScrollLock
 * 雕塑 / 转场阶段：禁止滚动
 * tip 之后：放行
 * 与 Lenis 同步（不依赖 window.__lenis 是否存在）
 */
import { watch } from 'vue'
import { useSceneStage } from '~/composables/useSceneStage'

type LenisInstance = { stop: () => void; start: () => void }
type WindowWithLenis = Window & { __lenis?: LenisInstance }

function getLenis(): LenisInstance | null {
  if (typeof window === 'undefined') return null
  return (window as unknown as WindowWithLenis).__lenis ?? null
}

export function useScrollLock() {
  const { stage } = useSceneStage()

  function set(locked: boolean) {
    if (typeof document === 'undefined') return
    const html = document.documentElement
    if (locked) {
      html.classList.add('abyss-scroll-locked')
      html.style.overflow = 'hidden'
      getLenis()?.stop()
    } else {
      html.classList.remove('abyss-scroll-locked')
      html.style.overflow = ''
      getLenis()?.start()
    }
  }

  watch(stage, (s) => {
    const lock = s === 'sculpture' || s === 'revealing-tip'
    set(lock)
  }, { immediate: true })

  return { set }
}
