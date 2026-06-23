/**
 * useAbyssGradient
 * 滚动驱动的色阶过渡系统。
 *
 * 视觉叙事：冷白展厅 → 冰面 → 下潜 → 深海 → 信号 → 深渊
 * 严格按 6 段停靠点过渡，与 design token 一一对应：
 *
 *   0.00  #F3F6F7  Cold White Art Gallery   ACT 01 / THE FACE
 *   0.20  #E9F0F2  Ice White Sea Surface    ACT 02 / THE TIP
 *   0.40  #CFE3EA  Light Cold Blue          ACT 03 / THE DESCENT
 *   0.60  #23465A  Deep Sea Blue            ACT 04 / THE MASS
 *   0.80  #071A26  Deep Sea Black-Blue      ACT 05 / THE SIGNAL
 *   1.00  #02040A  Abyss Black              ACT 05 / ABYSS
 *
 * 颜色在 RGB 空间线性插值，6 段之间完全无台阶。
 * 文本前景色根据背景亮度自动反转（亮度 > 140 → 深字；否则 → 浅字）。
 *
 * 调用流程：
 *   layouts/default.vue 的 RAF 循环 ──▶ applyAbyssGradient(progress)
 *                                          │
 *                                          ├─ 写入 --abyss-bg / --abyss-fg
 *                                          ├─ 写入 --abyss-progress
 *                                          └─ 触发 reactive 状态更新
 *   任何组件 ──▶ useAbyssGradient() ──▶ 订阅 hex/act/label/progress
 */
import { ref, readonly, onMounted, onBeforeUnmount } from 'vue'

// =============================================================
//  停靠点常量
// =============================================================

export const ABYSS_STOPS = [
  { at: 0.0, hex: '#F3F6F7', act: 'ACT 01 / THE FACE',   label: 'Cold White Art Gallery' },
  { at: 0.2, hex: '#E9F0F2', act: 'ACT 02 / THE TIP',     label: 'Ice White Sea Surface' },
  { at: 0.4, hex: '#CFE3EA', act: 'ACT 03 / THE DESCENT', label: 'Light Cold Blue' },
  { at: 0.6, hex: '#23465A', act: 'ACT 04 / THE MASS',    label: 'Deep Sea Blue' },
  { at: 0.8, hex: '#071A26', act: 'ACT 05 / THE SIGNAL',  label: 'Deep Sea Black-Blue' },
  { at: 1.0, hex: '#02040A', act: 'ACT 05 / ABYSS',       label: 'Abyss Black' },
] as const

// 文本前景色：浅底用深字，深底用浅字
const FG_ON_LIGHT = '#07111A'
const FG_ON_DARK = '#E6EEF2'
// 触发前景色翻转的亮度阈值（Rec.709 加权）
const LUMA_THRESHOLD = 140

// =============================================================
//  纯函数 (可独立单元测试 / 组件预读)
// =============================================================

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v
}

function hexToRgb(hex: string): [number, number, number] {
  const m = hex.replace('#', '')
  return [
    parseInt(m.slice(0, 2), 16),
    parseInt(m.slice(2, 4), 16),
    parseInt(m.slice(4, 6), 16),
  ]
}

function rgbToHex(r: number, g: number, b: number) {
  return (
    '#' +
    [r, g, b]
      .map(v => v.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  )
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function relativeLuminance(r: number, g: number, b: number) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * 给定 0~1 的滚动进度，返回当前色阶完整描述。
 * 在相邻两个停靠点之间做 RGB 线性插值。
 */
export function resolveAbyssStop(progress: number) {
  const p = clamp01(progress)
  for (let i = 0; i < ABYSS_STOPS.length - 1; i++) {
    const a = ABYSS_STOPS[i]
    const b = ABYSS_STOPS[i + 1]
    if (p <= b.at) {
      const span = b.at - a.at || 1
      const t = (p - a.at) / span
      const [ar, ag, ab] = hexToRgb(a.hex)
      const [br, bg, bb] = hexToRgb(b.hex)
      const r = Math.round(lerp(ar, br, t))
      const g = Math.round(lerp(ag, bg, t))
      const bl = Math.round(lerp(ab, bb, t))
      const luma = relativeLuminance(r, g, bl)
      return {
        rgb: `rgb(${r}, ${g}, ${bl})`,
        hex: rgbToHex(r, g, bl),
        act: t < 0.5 ? a.act : b.act,
        label: t < 0.5 ? a.label : b.label,
        /** 浅色背景 → 文字用深色；深色背景 → 文字用浅色 */
        textOnLight: luma > LUMA_THRESHOLD,
      }
    }
  }
  const last = ABYSS_STOPS[ABYSS_STOPS.length - 1]
  return {
    rgb: last.hex,
    hex: last.hex,
    act: last.act,
    label: last.label,
    textOnLight: false,
  }
}

// =============================================================
//  Singleton 响应式状态
// =============================================================

const _hex = ref<string>(ABYSS_STOPS[0].hex)
const _rgb = ref<string>(ABYSS_STOPS[0].hex)
const _act = ref<string>(ABYSS_STOPS[0].act)
const _label = ref<string>(ABYSS_STOPS[0].label)
const _textOnLight = ref<boolean>(true)
const _progress = ref<number>(0)

let _lastApplied = -1
let _refCount = 0

/**
 * 写入 CSS 变量 + 触发响应式更新。
 * 供 layouts/default.vue 的 RAF 循环按帧调用。
 * 同一帧内 progress 变化 < 0.0008 时跳过写入，避免抖动。
 */
export function applyAbyssGradient(progress: number) {
  if (typeof window === 'undefined') return
  const p = clamp01(progress)
  if (Math.abs(p - _lastApplied) < 0.0008) return
  _lastApplied = p

  const r = resolveAbyssStop(p)

  _hex.value = r.hex
  _rgb.value = r.rgb
  _act.value = r.act
  _label.value = r.label
  _textOnLight.value = r.textOnLight
  _progress.value = p

  const root = document.documentElement
  const fg = r.textOnLight ? FG_ON_LIGHT : FG_ON_DARK
  root.style.setProperty('--abyss-bg', r.rgb)
  root.style.setProperty('--abyss-fg', fg)
  root.style.setProperty('--abyss-progress', p.toFixed(4))
  root.style.setProperty('--abyss-text-on-light', r.textOnLight ? '1' : '0')
}

/**
 * 在组件里订阅当前色阶状态。
 * 不负责驱动 — 真正的写入由 layouts/default.vue 的 RAF 循环调用 applyAbyssGradient。
 * 这里只保证组件挂载时能立刻读到当前 CSS 变量，避免刷新后短暂显示默认色。
 */
export function useAbyssGradient() {
  onMounted(() => {
    _refCount++
    if (typeof window === 'undefined') return
    const v = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        '--abyss-progress'
      )
    )
    if (!Number.isNaN(v)) applyAbyssGradient(v)
  })
  onBeforeUnmount(() => {
    _refCount = Math.max(0, _refCount - 1)
  })
  return {
    hex: readonly(_hex),
    rgb: readonly(_rgb),
    act: readonly(_act),
    label: readonly(_label),
    progress: readonly(_progress),
    textOnLight: readonly(_textOnLight),
  }
}
