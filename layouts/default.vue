<template>
  <div class="abyss-app">
    <div class="abyss-grain" aria-hidden="true" />

    <div class="abyss-smooth">
      <slot />
    </div>

    <AbyssGradientDebug :visible="showDebug" />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from "vue";
import { applyAbyssGradient } from "~/composables/useAbyssGradient";
import { usePresentationDepth } from "~/composables/usePresentationDepth";
import { updateScrollDepth } from "~/composables/useScrollDepth";
import AbyssGradientDebug from "~/components/Debug/AbyssGradientDebug.vue";

const { progress } = usePresentationDepth();
const route = useRoute();

const showDebug = computed(
  () => import.meta.env.DEV && route.query.debug === "gradient",
);

function onResize() {
  applyPresentationDepth();
}

function applyPresentationDepth(nextProgress = progress.value) {
  if (typeof window === "undefined") return;

  const depthProgress = Math.min(1, Math.max(0, nextProgress));
  const root = document.documentElement;

  root.style.setProperty("--scroll-y", "0");
  root.style.setProperty("--depth-progress", depthProgress.toFixed(4));
  root.style.setProperty("--surface-progress", Math.max(0, depthProgress - 0.2).toFixed(4));
  root.style.setProperty("--viewport-h", `${window.innerHeight}px`);
  root.style.setProperty("--fog-opacity", Math.min(1, depthProgress * 0.82).toFixed(4));
  root.style.setProperty(
    "--particle-opacity",
    Math.max(0, (depthProgress - 0.42) * 1.12).toFixed(4),
  );
  root.style.setProperty("--ocean-opacity", Math.min(1, depthProgress).toFixed(4));
  root.style.setProperty(
    "--grain-opacity",
    (0.024 + depthProgress * 0.026).toFixed(4),
  );

  applyAbyssGradient(depthProgress);
  updateScrollDepth(depthProgress, 0, 1);
}

watch(progress, (nextProgress) => {
  applyPresentationDepth(nextProgress);
});

onMounted(() => {
  if (typeof window === "undefined") return;

  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  document.documentElement.classList.add("abyss-presentation-mode");
  applyPresentationDepth();

  window.addEventListener("resize", onResize, { passive: true });
});

onBeforeUnmount(() => {
  if (typeof document === "undefined") return;
  document.documentElement.classList.remove("abyss-presentation-mode");
  window.removeEventListener("resize", onResize);
});
</script>

<style lang="scss" scoped>
.abyss-app {
  position: relative;
  width: 100vw;
  height: 100dvh;
  overflow: hidden;
  background: var(--abyss-bg, var(--color-void));
  color: var(--abyss-fg, var(--color-frost));
}

.abyss-smooth {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
