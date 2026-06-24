<template>
  <div class="abyss-app">
    <!-- 全局噪点 (固定层) -->
    <div class="abyss-grain" aria-hidden="true" />

    <!-- Lenis 平滑滚动根 -->
    <div ref="smoothRoot" class="abyss-smooth">
      <slot />
    </div>

    <!-- 调试面板 (仅开发环境) -->
    <AbyssGradientDebug :visible="showDebug" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from "vue";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { applyAbyssGradient } from "~/composables/useAbyssGradient";
import { updateScrollDepth } from "~/composables/useScrollDepth";
import { useSceneStage } from "~/composables/useSceneStage";
import AbyssGradientDebug from "~/components/Debug/AbyssGradientDebug.vue";

const smoothRoot = ref<HTMLElement | null>(null);
const {
  stage,
  enterDescending,
  enterUnderwater,
  enterSignal,
} = useSceneStage();
let lenis: Lenis | null = null;
let rafId = 0;

// 仅在开发环境显示色阶调试面板
const route = useRoute();
const showDebug = computed(
  () => import.meta.env.DEV && route.query.debug === "gradient",
);

// 将 scroll 进度写入 CSS Variable，供 TresJS / SCSS 实时读取
function writeScrollVars() {
  if (typeof window === "undefined") return;
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight || 1;
  const progress = Math.min(1, Math.max(0, y / max));

  // Narrative stage changes no longer depend on a persistent WebGL scene.
  if (stage.value === "tip" && progress > 0.001) {
    enterDescending();
  }
  if (
    (stage.value === "tip" || stage.value === "descending") &&
    progress > 0.45
  ) {
    enterUnderwater();
  }
  if (stage.value !== "signal" && progress > 0.92) {
    enterSignal();
  }
  const narrativeProgress =
    stage.value === "sculpture"
      ? 0
      : stage.value === "revealing-tip"
        ? 0.12
        : stage.value === "tip"
          ? 0.2
          : 0.2 + progress * 0.8;
  const root = document.documentElement;
  root.style.setProperty("--scroll-y", String(y));
  root.style.setProperty("--depth-progress", progress.toFixed(4));
  root.style.setProperty(
    "--surface-progress",
    Math.max(0, (narrativeProgress - 0.2) / 0.8).toFixed(4),
  );
  root.style.setProperty("--viewport-h", `${window.innerHeight}px`);
  // 越深雾越浓、浮游生物越显
  const fog = Math.min(1, progress * 1.2);
  const particle = Math.max(0, (progress - 0.15) * 1.4);
  const ocean = Math.max(0, progress * 0.95);
  root.style.setProperty("--fog-opacity", fog.toFixed(4));
  root.style.setProperty("--particle-opacity", particle.toFixed(4));
  root.style.setProperty("--ocean-opacity", ocean.toFixed(4));
  applyAbyssGradient(narrativeProgress);
  updateScrollDepth(progress, y, max);
}

watch(stage, () => {
  writeScrollVars();
});

onMounted(() => {
  if (typeof window === "undefined") return;

  // 先强制回到顶部，避免刷新时停留在底部
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  gsap.registerPlugin(ScrollTrigger);

  lenis = new Lenis({
    duration: 1.4,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.4,
  });

  // 默认从 sculpture 阶段开始时锁定 Lenis
  lenis.stop();

  lenis.on("scroll", ScrollTrigger.update);

  const raf = (time: number) => {
    lenis?.raf(time);
    writeScrollVars();
    rafId = requestAnimationFrame(raf);
  };
  rafId = requestAnimationFrame(raf);

  // 把 Lenis 暴露给需要控制滚动的组件 (例如点击锚点 / 暂停滚动)
  (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

  writeScrollVars();
  window.addEventListener("resize", writeScrollVars, { passive: true });
});

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId);
  lenis?.destroy();
  lenis = null;
  window.removeEventListener("resize", writeScrollVars);
});
</script>

<style lang="scss" scoped>
.abyss-app {
  position: relative;
  min-height: 100dvh;
  // 背景与文字前景由 useAbyssGradient 注入的 CSS 变量驱动
  background: var(--abyss-bg, var(--color-void));
  color: var(--abyss-fg, var(--color-frost));
}

.abyss-smooth {
  position: relative;
  z-index: 1;
}
</style>
