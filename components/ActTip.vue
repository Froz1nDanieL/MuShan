<template>
  <section class="act-tip" :data-stage="stage" aria-labelledby="tip-title">
    <IcebergTip
      :auto-play="true"
      :scroll-out="true"
      :scroll-out-distance="560"
    />

    <header class="act-tip__meta">
      <span>ACT 02</span>
      <span class="act-tip__meta-rule" aria-hidden="true" />
      <span>THE TIP</span>
      <span class="act-tip__level">SEA LEVEL 000M</span>
    </header>

    <div class="act-tip__content">
      <h2 id="tip-title" class="act-tip__title">
        <span>The tip</span>
        <span class="act-tip__title-italic">of the iceberg.</span>
      </h2>
      <p class="act-tip__lede">What you see first is only the surface.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import IcebergTip from "~/components/IcebergTip.vue";
import { useSceneStage } from "~/composables/useSceneStage";

const { stage } = useSceneStage();
</script>

<style lang="scss" scoped>
.act-tip {
  position: fixed;
  inset: 0;
  z-index: 4;
  min-height: 100dvh;
  padding: clamp(2rem, 5vw, 4.5rem) clamp(1.25rem, 6vw, 6rem);
  color: var(--abyss-fg, #18252c);
  pointer-events: none;

  &__meta {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    font-family: $font-mono;
    font-size: 0.66rem;
    letter-spacing: 0.2em;
    color: var(--abyss-fg-muted);
    transition:
      opacity 900ms $ease-abyss,
      transform 900ms $ease-abyss;
  }

  &__meta-rule {
    width: 2.5rem;
    height: 1px;
    background: var(--line-current-mid);
  }

  &__level {
    margin-left: auto;
    font-variant-numeric: tabular-nums;
  }

  &__content {
    position: absolute;
    z-index: 1;
    left: clamp(1.25rem, 6vw, 6rem);
    bottom: clamp(3rem, 10vh, 8rem);
    width: min(52rem, calc(100vw - 2.5rem));
    transition:
      opacity 1100ms $ease-abyss,
      transform 1100ms $ease-abyss;
  }

  &__title {
    display: flex;
    flex-direction: column;
    gap: 0.1em;
    max-width: 9ch;
    font-size: clamp(3.5rem, 8.5vw, 8.8rem);
    font-weight: 300;
    line-height: 0.9;
    letter-spacing: -0.045em;
    color: inherit;
    text-wrap: balance;
  }

  &__title-italic {
    padding-bottom: 0.08em;
    font-style: italic;
    color: var(--accent-current);
  }

  &__lede {
    margin-top: 1.5rem;
    max-width: 34ch;
    font-family: $font-sans;
    font-size: clamp(0.95rem, 1.2vw, 1.08rem);
    line-height: 1.65;
    color: var(--abyss-fg-muted);
  }

  &[data-stage="revealing-tip"] &__meta,
  &[data-stage="revealing-tip"] &__content {
    opacity: 0;
    transform: translateY(1.25rem);
  }

  &[data-stage="descending"] &__meta,
  &[data-stage="descending"] &__content {
    opacity: 0;
    transform: translateY(-1.25rem);
  }

  &[data-stage="tip"] &__meta,
  &[data-stage="tip"] &__content {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 767px) {
    padding: 1.25rem;

    &__level {
      display: none;
    }

    &__content {
      left: 1.25rem;
      bottom: 3rem;
    }

    &__title {
      font-size: clamp(3.1rem, 15vw, 5.25rem);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &__meta,
    &__content {
      transition: none;
    }
  }
}
</style>
