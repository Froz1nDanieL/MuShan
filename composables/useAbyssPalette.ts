/**
 * useAbyssPalette
 * 统一对外暴露主题色，对应 CSS Variables。
 * 之所以走 ref + 函数读 getter，是为了让 3D 组件 (Three.js Color) 与
 * 2D 组件 (CSS) 都能直接拿到与 design token 一致的值。
 */
import { ref, onMounted } from 'vue'

function readVar(name: string, fallback: string) {
  if (typeof window === 'undefined') return fallback
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v || fallback
}

const voidColor = ref('#02040A')
const abyss = ref('#04080F')
const depth = ref('#07111A')
const frost = ref('#E6EEF2')
const ice = ref('#D8E6EC')
const glacier = ref('#AEBFC8')
const steel = ref('#6F8492')
const marble = ref('#C9CED1')
const stone = ref('#8D959A')
const signal = ref('#A7E7FF')
const cyan = ref('#6FBED3')

export function useAbyssPalette() {
  onMounted(() => {
    voidColor.value = readVar('--color-void', '#02040A')
    abyss.value = readVar('--color-abyss', '#04080F')
    depth.value = readVar('--color-depth', '#07111A')
    frost.value = readVar('--color-frost', '#E6EEF2')
    ice.value = readVar('--color-ice', '#D8E6EC')
    glacier.value = readVar('--color-glacier', '#AEBFC8')
    steel.value = readVar('--color-steel-blue', '#6F8492')
    marble.value = readVar('--color-marble', '#C9CED1')
    stone.value = readVar('--color-stone', '#8D959A')
    signal.value = readVar('--color-signal', '#A7E7FF')
    cyan.value = readVar('--color-cyan-dim', '#6FBED3')
  })

  return {
    voidColor,
    abyss,
    depth,
    frost,
    ice,
    glacier,
    steel,
    marble,
    stone,
    signal,
    cyan,
  }
}
