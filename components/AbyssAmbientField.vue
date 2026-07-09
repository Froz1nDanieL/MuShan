<template>
  <div
    class="abyss-ambient-field"
    :data-stage="stage"
    :data-phase="phase"
    aria-hidden="true"
  >
    <span class="abyss-ambient-field__light abyss-ambient-field__light--left" />
    <span class="abyss-ambient-field__light abyss-ambient-field__light--right" />
    <span
      v-for="bubble in bubbles"
      :key="bubble"
      class="abyss-ambient-field__bubble"
      :class="`abyss-ambient-field__bubble--${bubble}`"
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    stage?: string;
    phase?: string;
  }>(),
  {
    stage: "tip",
    phase: "content",
  },
);

const bubbles = Array.from({ length: 8 }, (_, index) => index + 1);
</script>

<style lang="scss" scoped>
.abyss-ambient-field {
  position: fixed;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
  mix-blend-mode: screen;
  opacity: 0.74;
  --ambient-light-opacity: 0.18;
  transition: opacity 1100ms $ease-fluid;

  &[data-stage="revealing-tip"],
  &[data-stage="tip"] {
    opacity: 0.26;
    --ambient-light-opacity: 0.045;
  }

  &[data-stage="descending"] {
    opacity: 0.42;
    --ambient-light-opacity: 0.08;
  }

  &[data-stage="underwater"],
  &[data-stage="signal"] {
    opacity: 0.72;
    --ambient-light-opacity: 0.18;
  }

  &__light {
    position: absolute;
    top: -16vh;
    width: clamp(16rem, 26vw, 34rem);
    height: 72vh;
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--color-signal, #a7e7ff) 14%, transparent),
      transparent 72%
    );
    opacity: var(--ambient-light-opacity);
    transform-origin: top center;
    filter: blur(0.4px);
  }

  &[data-stage="tip"][data-phase="content"] {
    --ambient-light-opacity: 0.06;
  }

  &__light--left {
    left: 18vw;
    transform: rotate(14deg);
  }

  &__light--right {
    right: 8vw;
    opacity: calc(var(--ambient-light-opacity) * 0.62);
    transform: rotate(-19deg);
  }

  &__bubble {
    position: absolute;
    width: var(--bubble-size);
    height: var(--bubble-size);
    border: 1px solid color-mix(in srgb, var(--color-ice, #e6eef2) 42%, transparent);
    border-radius: 50%;
    opacity: 0;
    transform: translate3d(0, 110vh, 0);
  }

  &[data-stage="revealing-tip"] &__bubble,
  &[data-stage="tip"] &__bubble,
  &[data-stage="descending"] &__bubble {
    display: none;
  }

  &__bubble--1 {
    --bubble-size: 0.28rem;
    left: 7vw;
    animation-delay: -3s;
    animation-duration: 18s;
  }

  &__bubble--2 {
    --bubble-size: 0.42rem;
    left: 16vw;
    animation-delay: -9s;
    animation-duration: 24s;
  }

  &__bubble--3 {
    --bubble-size: 0.22rem;
    left: 28vw;
    animation-delay: -15s;
    animation-duration: 21s;
  }

  &__bubble--4 {
    --bubble-size: 0.52rem;
    left: 38vw;
    animation-delay: -6s;
    animation-duration: 29s;
  }

  &__bubble--5 {
    --bubble-size: 0.26rem;
    left: 51vw;
    animation-delay: -12s;
    animation-duration: 20s;
  }

  &__bubble--6 {
    --bubble-size: 0.38rem;
    left: 61vw;
    animation-delay: -18s;
    animation-duration: 31s;
  }

  &__bubble--7 {
    --bubble-size: 0.24rem;
    left: 70vw;
    animation-delay: -4s;
    animation-duration: 23s;
  }

  &__bubble--8 {
    --bubble-size: 0.46rem;
    left: 82vw;
    animation-delay: -11s;
    animation-duration: 27s;
  }

  @media (prefers-reduced-motion: no-preference) {
    &__bubble {
      animation-name: abyss-bubble-rise;
      animation-timing-function: $ease-fluid;
      animation-iteration-count: infinite;
    }
  }

  @media (prefers-reduced-motion: reduce), (max-width: 767px) {
    &__bubble {
      display: none;
    }

    &__light {
      opacity: 0.08;
    }
  }
}

@keyframes abyss-bubble-rise {
  0% {
    opacity: 0;
    transform: translate3d(0, 108vh, 0) scale(0.72);
  }

  14% {
    opacity: 0.16;
  }

  72% {
    opacity: 0.09;
  }

  100% {
    opacity: 0;
    transform: translate3d(clamp(-1.2rem, -1.4vw, -0.4rem), -12vh, 0) scale(1);
  }
}
</style>
