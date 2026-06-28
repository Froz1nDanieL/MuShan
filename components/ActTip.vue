<template>
  <section
    class="act-tip"
    :data-stage="stage"
    :style="stageVars"
    aria-labelledby="tip-title"
  >
    <IcebergTip />

    <div class="act-tip__inner">
      <header class="act-tip__meta">
        <span>ACT 02</span>
        <span class="act-tip__meta-rule" aria-hidden="true" />
        <span>THE TIP</span>
      </header>

      <h2 id="tip-title" class="act-tip__title">THE QUIET ORBIT</h2>
    </div>

    <div class="act-tip__columns" aria-label="Surface and submerged self">
      <article class="act-tip__panel act-tip__panel--surface">
        <div class="act-tip__panel-inner">
          <p class="act-tip__label">[ SURFACE ]</p>
          <ul class="act-tip__list" aria-label="External perception">
            <li>Aloof / 高冷</li>
            <li>Introverted / 内向</li>
          </ul>
          <p class="act-tip__statement">A silent facade.</p>
        </div>
      </article>

      <article class="act-tip__panel act-tip__panel--submerged">
        <div class="act-tip__panel-inner">
          <p class="act-tip__label">[ SUBMERGED ]</p>
          <ul class="act-tip__list" aria-label="Internal self">
            <li>Noise-Reduction / 主动降噪</li>
            <li>Internal Order / 内在秩序</li>
            <li>Raw Curiosity / 纯粹的好奇心</li>
          </ul>
          <p class="act-tip__statement">The mass is unseen.</p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useWindowSize } from "@vueuse/core";
import IcebergTip from "~/components/IcebergTip.vue";
import { useReducedMotion } from "~/composables/useReducedMotion";
import { useSceneStage } from "~/composables/useSceneStage";
import { useScrollDepth } from "~/composables/useScrollDepth";

const { stage } = useSceneStage();
const { scrollY } = useScrollDepth();
const reducedMotion = useReducedMotion();
const { height: viewportHeight } = useWindowSize({ initialHeight: 900 });

function clamp01(value: number) {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const progress = clamp01((value - edge0) / (edge1 - edge0 || 1));
  return progress * progress * (3 - 2 * progress);
}

const localScrollProgress = computed(() => {
  if (stage.value !== "descending") return 0;
  return scrollY.value / Math.max(1, viewportHeight.value);
});

const descentProgress = computed(() => {
  if (stage.value !== "descending") return 0;
  if (reducedMotion.value) return 1;
  return smoothstep(0.08, 1.08, localScrollProgress.value);
});

const stageVars = computed(() => {
  const progress = descentProgress.value;
  const exitProgress =
    stage.value === "descending"
      ? smoothstep(1.2, 1.48, localScrollProgress.value)
      : 0;
  const surfaceOpacity = (1 - smoothstep(0.04, 0.48, progress)) * (1 - exitProgress);
  const submergedOpacity = smoothstep(0.22, 0.66, progress) * (1 - exitProgress);
  const headingOpacity = (0.92 - progress * 0.08) * (1 - exitProgress * 0.72);

  return {
    "--tip-stage-opacity": (1 - exitProgress).toFixed(4),
    "--tip-stage-y": `${(-26 * exitProgress).toFixed(2)}px`,
    "--surface-copy-opacity": surfaceOpacity.toFixed(4),
    "--surface-copy-y": `${(-14 * progress).toFixed(2)}px`,
    "--submerged-copy-opacity": submergedOpacity.toFixed(4),
    "--submerged-copy-y": `${(22 - 22 * progress).toFixed(2)}px`,
    "--tip-heading-opacity": headingOpacity.toFixed(4),
  };
});
</script>

<style lang="scss" scoped>
.act-tip {
  position: fixed;
  inset: 0;
  z-index: 4;
  min-height: 100dvh;
  overflow: hidden;
  padding: clamp(2rem, 5vw, 4.5rem) clamp(1.25rem, 7vw, 7rem);
  background: transparent;
  color: var(--abyss-fg, #18252c);
  opacity: var(--tip-stage-opacity);
  transform: translate3d(0, var(--tip-stage-y), 0);
  pointer-events: none;
  transition:
    opacity 900ms $ease-fluid,
    transform 900ms $ease-fluid;

  &__inner {
    position: absolute;
    top: clamp(2rem, 5vw, 4.5rem);
    left: 50%;
    z-index: 2;
    width: min(90rem, calc(100vw - clamp(2.5rem, 14vw, 14rem)));
    transform: translateX(-50%);
    opacity: var(--tip-heading-opacity);
    transition: opacity 1100ms $ease-fluid;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    font-family: $font-mono;
    font-size: 0.66rem;
    font-weight: 400;
    line-height: 1;
    letter-spacing: 0.2em;
    color: var(--abyss-fg-muted, rgba(24, 37, 44, 0.48));
  }

  &__meta-rule {
    width: 2.5rem;
    height: 1px;
    background: var(--line-current-mid, rgba(38, 48, 56, 0.26));
  }

  &__title {
    width: min(30rem, 38vw);
    margin-top: clamp(1.8rem, 4.2vh, 3.4rem);
    font-family: $font-display;
    font-size: clamp(2.3rem, 5vw, 5.6rem);
    font-weight: 300;
    line-height: 0.94;
    letter-spacing: 0.145em;
    color: color-mix(in srgb, var(--abyss-fg, #18252c) 88%, transparent);
    text-rendering: geometricPrecision;
  }

  &__columns {
    position: absolute;
    inset: 0;
    z-index: 2;
    width: min(90rem, calc(100vw - clamp(2.5rem, 14vw, 14rem)));
    margin: 0 auto;
  }

  &__panel {
    position: absolute;
    width: min(24rem, 32vw);
    transition:
      opacity 1200ms $ease-fluid,
      transform 1200ms $ease-fluid,
      color 1200ms $ease-fluid;
    will-change: opacity, transform;
  }

  &__panel--surface {
    top: clamp(24rem, 43vh, 31rem);
    left: 0;
    color: var(--abyss-fg-muted, rgba(24, 37, 44, 0.66));
    opacity: var(--surface-copy-opacity);
    transform: translate3d(0, var(--surface-copy-y), 0);
  }

  &__panel--submerged {
    right: 0;
    bottom: clamp(5.5rem, 13vh, 9rem);
    color: color-mix(in srgb, var(--abyss-fg, #e6eef2) 94%, var(--color-ice) 6%);
    opacity: var(--submerged-copy-opacity);
    transform: translate3d(0, var(--submerged-copy-y), 0);
  }

  &__label {
    margin-bottom: clamp(1rem, 2.2vh, 1.6rem);
    font-family: $font-mono;
    font-size: clamp(0.6rem, 0.78vw, 0.72rem);
    font-weight: 400;
    line-height: 1;
    letter-spacing: 0.28em;
    color: currentColor;
    opacity: 0.62;
  }

  &__list {
    display: grid;
    gap: clamp(0.58rem, 1.3vh, 0.9rem);
    padding: 0;
    margin: 0;
    list-style: none;
    font-family: $font-serif;
    font-size: clamp(1.18rem, 1.55vw, 1.72rem);
    font-weight: 300;
    line-height: 1.18;
    letter-spacing: 0.035em;
  }

  &__statement {
    margin-top: clamp(1.2rem, 2.8vh, 2rem);
    font-family: $font-mono;
    font-size: clamp(0.72rem, 0.86vw, 0.86rem);
    font-weight: 300;
    line-height: 1.7;
    letter-spacing: 0.12em;
    color: currentColor;
    opacity: 0.72;
  }

  &[data-stage="revealing-tip"] &__panel--submerged {
    opacity: 0;
  }

  @media (prefers-reduced-motion: no-preference) {
    &[data-stage="revealing-tip"] &__panel--surface .act-tip__panel-inner,
    &[data-stage="tip"] &__panel--surface .act-tip__panel-inner {
      animation: surface-breath 7.2s $ease-fluid infinite alternate;
    }
  }

  @media (max-width: 1023px) {
    &__columns {
      width: calc(100vw - 3rem);
    }

    &__panel {
      width: min(19rem, 38vw);
    }
  }

  @media (max-width: 767px) {
    padding: 1.25rem;

    &__inner {
      top: 2rem;
      width: calc(100vw - 2.5rem);
    }

    &__meta {
      font-size: 0.55rem;
      letter-spacing: 0.24em;
    }

    &__title {
      font-size: clamp(1.95rem, 10vw, 3.6rem);
      letter-spacing: 0.11em;
      width: min(19rem, 78vw);
    }

    &__columns {
      top: 0;
      bottom: 0;
      width: calc(100vw - 2.5rem);
    }

    &__panel {
      width: min(100%, 24rem);
    }

    &__panel--surface,
    &__panel--submerged {
      right: auto;
      left: auto;
      bottom: auto;
    }

    &__panel--surface {
      top: clamp(19rem, 44vh, 24rem);
      left: 0;
    }

    &__panel--submerged {
      right: 0;
      bottom: clamp(2.5rem, 9vh, 4rem);
      text-align: right;
    }

    &__list {
      font-size: clamp(1rem, 5vw, 1.32rem);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    & {
      transition: none;
    }

    &__inner,
    &__panel {
      transition: none;
      will-change: auto;
    }
  }
}

@keyframes surface-breath {
  0% {
    opacity: 0.58;
  }
  100% {
    opacity: 0.94;
  }
}
</style>
