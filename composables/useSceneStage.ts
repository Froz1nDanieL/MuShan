/**
 * useSceneStage
 * 5 幕 + 2 段转场，全站唯一真相源。
 *
 *   sculpture    →  ACT 01   初始：古典雕塑入口
 *   revealing-tip→  转场     点击后 1.8-2.8s 的丝滑过渡
 *   tip          →  ACT 02   冰山一角首屏，等待用户滚动
 *   descending   →  ACT 03   滚动下潜中
 *   underwater   →  ACT 04   深海内容展示
 *   signal       →  ACT 05   深海信号联系入口
 *
 * 重要约束（来自规格）：
 *   - 点击只负责 sculpture → revealing-tip
 *   - revealing-tip 自动完成 → tip
 *   - tip 后才允许滚动下潜
 *   - 滚动不直接 skip 中间任何阶段
 */
import { ref, computed, readonly } from 'vue'

export type SceneStage =
  | 'sculpture'
  | 'revealing-tip'
  | 'tip'
  | 'descending'
  | 'underwater'
  | 'signal'

export const STAGE_ORDER: readonly SceneStage[] = [
  'sculpture',
  'revealing-tip',
  'tip',
  'descending',
  'underwater',
  'signal',
] as const

// 单例：所有组件读同一份状态
const stage = ref<SceneStage>('sculpture')
const canScroll = computed(() => stage.value === 'tip' || stage.value === 'descending' || stage.value === 'underwater' || stage.value === 'signal')
const isTransitioning = computed(() => stage.value === 'revealing-tip')

export function useSceneStage() {
  function setStage(next: SceneStage) {
    if (stage.value === next) return
    stage.value = next
  }

  /** 用户点击雕塑 / 引导文字 */
  function enterReveal() {
    if (stage.value !== 'sculpture') return
    setStage('revealing-tip')
  }

  /** 转场动画完成时由 orchestrator 调用 */
  function finishReveal() {
    if (stage.value !== 'revealing-tip') return
    setStage('tip')
  }

  /** 滚动从 0 推进到 0.001 时由 ScrollTrigger 调用一次 */
  function enterDescending() {
    if (stage.value === 'tip') setStage('descending')
  }

  /** 下潜到 ~0.45 时进入水下 */
  function enterUnderwater() {
    if (stage.value === 'descending' || stage.value === 'tip') {
      setStage('underwater')
    }
  }

  /** 抵达最深处 */
  function enterSignal() {
    setStage('signal')
  }

  /** 内部：完全回到起点（仅用于调试 / 404 兜底） */
  function reset() {
    setStage('sculpture')
  }

  return {
    stage: readonly(stage),
    canScroll: readonly(canScroll),
    isTransitioning: readonly(isTransitioning),
    enterReveal,
    finishReveal,
    enterDescending,
    enterUnderwater,
    enterSignal,
    reset,
  }
}
