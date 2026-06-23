/**
 * useScrollDirector
 * 把 Lenis 的滚动与 ScrollTrigger 同步；并对 5 段内容区块
 * 启用 ScrollTrigger.batch 做入 / 离场动画（与 3D 场景独立）。
 */
import { onMounted, onBeforeUnmount, watch, type WatchStopHandle } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useSceneStage } from '~/composables/useSceneStage'

export function useScrollDirector() {
  let ctx: gsap.Context | null = null
  let stopWatch: WatchStopHandle | null = null
  const { canScroll } = useSceneStage()

  function init() {
    if (typeof window === 'undefined') return
    gsap.registerPlugin(ScrollTrigger)

    // 让 GSAP 的 ticker 跟随 Lenis 的 RAF（保持一帧一致性）
    ctx = gsap.context(() => {
      // 内容区块入 / 离场：每段 [data-depth-section] 在进入视口时浮起，离开时淡出
      gsap.utils.toArray<HTMLElement>('[data-depth-section]').forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.4,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 75%',
              end: 'bottom 25%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      })
    })
  }

  onMounted(() => {
    // 等待 layout 中的 Lenis 初始化完（onMounted 已晚于 layout 的 onMounted，但保险起见下一帧）
    stopWatch = watch(
      canScroll,
      (ready) => {
        if (!ready) return
        requestAnimationFrame(() => {
          if (!ctx) init()
          ScrollTrigger.refresh()
        })
      },
      { immediate: true },
    )
  })

  onBeforeUnmount(() => {
    ctx?.revert()
    ctx = null
    stopWatch?.()
    stopWatch = null
  })
}
