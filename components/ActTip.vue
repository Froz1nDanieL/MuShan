<template>
  <section
    class="act-tip"
    :data-stage="stage"
    :data-phase="phase"
    :style="stageVars"
    aria-label="Surface and submerged self"
  >
    <IcebergTip :phase="phase" />

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
import IcebergTip from "~/components/IcebergTip.vue";
import { useSceneStage } from "~/composables/useSceneStage";

const { stage } = useSceneStage();

const props = withDefaults(
  defineProps<{
    phase?: "surface" | "submerged";
  }>(),
  {
    phase: "surface",
  },
);

const stageVars = computed(() => {
  const isSubmerged = props.phase === "submerged";

  return {
    "--tip-stage-opacity": "1",
    "--tip-stage-y": "0px",
    "--surface-copy-opacity": isSubmerged ? "0" : "0.94",
    "--surface-copy-y": isSubmerged ? "-18px" : "0px",
    "--submerged-copy-opacity": isSubmerged ? "0.96" : "0",
    "--submerged-copy-y": isSubmerged ? "0px" : "18px",
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

  &__columns {
    position: absolute;
    inset: 0;
    z-index: 2;
    width: min(92rem, calc(100vw - clamp(3rem, 13vw, 13rem)));
    margin: 0 auto;
  }

  &__panel {
    position: absolute;
    width: min(34rem, 40vw);
    transition:
      opacity 1200ms $ease-fluid,
      transform 1200ms $ease-fluid,
      color 1200ms $ease-fluid;
    will-change: opacity, transform;
  }

  &__panel--surface {
    top: clamp(8.6rem, 17.5vh, 12.8rem);
    left: clamp(1rem, 4vw, 4.6rem);
    color: var(--abyss-fg-muted, rgba(24, 37, 44, 0.66));
    opacity: var(--surface-copy-opacity);
    transform: translate3d(0, var(--surface-copy-y), 0);
  }

  &__panel--submerged {
    right: clamp(1rem, 4vw, 4.6rem);
    bottom: clamp(6.8rem, 13vh, 9.8rem);
    color: color-mix(in srgb, var(--abyss-fg, #e6eef2) 94%, var(--color-ice) 6%);
    opacity: var(--submerged-copy-opacity);
    transform: translate3d(0, var(--submerged-copy-y), 0);
  }

  &__label {
    margin-bottom: clamp(1.15rem, 2.4vh, 1.8rem);
    font-family: $font-mono;
    font-size: clamp(0.7rem, 0.9vw, 0.86rem);
    font-weight: 400;
    line-height: 1;
    letter-spacing: 0.28em;
    color: currentColor;
    opacity: 0.62;
  }

  &__list {
    display: grid;
    gap: clamp(0.72rem, 1.5vh, 1.05rem);
    padding: 0;
    margin: 0;
    list-style: none;
    font-family: $font-serif;
    font-size: clamp(1.85rem, 2.45vw, 2.8rem);
    font-weight: 300;
    line-height: 1.16;
    letter-spacing: 0.025em;
  }

  &__statement {
    margin-top: clamp(1.35rem, 3vh, 2.2rem);
    font-family: $font-mono;
    font-size: clamp(0.78rem, 0.98vw, 0.98rem);
    font-weight: 300;
    line-height: 1.7;
    letter-spacing: 0.12em;
    color: currentColor;
    opacity: 0.72;
  }

  @media (prefers-reduced-motion: no-preference) {
    &[data-phase="surface"] &__panel--surface .act-tip__panel-inner {
      animation: surface-breath 7.2s $ease-fluid infinite alternate;
    }
  }

  @media (max-width: 1023px) {
    &__columns {
      width: calc(100vw - 3rem);
    }

    &__panel {
      width: min(27rem, 44vw);
    }
  }

  @media (max-width: 767px) {
    padding: 1.25rem;

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
      top: clamp(6.8rem, 14vh, 8.5rem);
      left: 0;
    }

    &__panel--submerged {
      right: 0;
      bottom: clamp(3rem, 8vh, 4.8rem);
      text-align: right;
    }

    &__list {
      font-size: clamp(1.24rem, 5.6vw, 1.72rem);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &,
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
