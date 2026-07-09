<template>
  <div
    class="depth-study-frame"
    :class="{ 'depth-study-frame--fixed': fixed }"
    aria-hidden="true"
  >
    <span class="depth-study-frame__corner depth-study-frame__corner--tl" />
    <span class="depth-study-frame__corner depth-study-frame__corner--tr" />
    <span class="depth-study-frame__corner depth-study-frame__corner--bl" />
    <span class="depth-study-frame__corner depth-study-frame__corner--br" />

    <div class="depth-study-frame__label depth-study-frame__label--top-left">
      <span>D.C.</span>
      <span class="depth-study-frame__italic">Depth Study</span>
    </div>

    <div class="depth-study-frame__label depth-study-frame__label--top-right">
      ACT {{ normalizedAct }}
    </div>

    <div class="depth-study-frame__label depth-study-frame__label--bottom-left">
      <span>Depth</span>
      <strong>{{ normalizedDepth }}</strong>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    act: string | number;
    depth: string;
    fixed?: boolean;
  }>(),
  {
    act: "03",
    depth: "120M",
    fixed: false,
  },
);

const normalizedAct = computed(() => String(props.act).padStart(2, "0"));
const normalizedDepth = computed(() => props.depth.replace(/^DEPTH\s+/i, ""));
</script>

<style lang="scss" scoped>
.depth-study-frame {
  position: absolute;
  inset: clamp(0.8rem, 1.75vw, 1.85rem);
  z-index: 8;
  pointer-events: none;
  color: color-mix(in srgb, var(--abyss-fg, #dce7ea) 72%, transparent);

  &--fixed {
    position: fixed;
    z-index: 12;
  }

  &__corner {
    position: absolute;
    width: clamp(1rem, 1.45vw, 1.55rem);
    height: clamp(1rem, 1.45vw, 1.55rem);
    opacity: 0.62;
  }

  &__corner::before,
  &__corner::after {
    content: "";
    position: absolute;
    background: currentColor;
  }

  &__corner::before {
    width: 100%;
    height: 1px;
  }

  &__corner::after {
    width: 1px;
    height: 100%;
  }

  &__corner--tl {
    top: 0;
    left: 0;
  }

  &__corner--tl::before,
  &__corner--tl::after {
    top: 0;
    left: 0;
  }

  &__corner--tr {
    top: 0;
    right: 0;
  }

  &__corner--tr::before,
  &__corner--tr::after {
    top: 0;
    right: 0;
  }

  &__corner--bl {
    bottom: 0;
    left: 0;
  }

  &__corner--bl::before,
  &__corner--bl::after {
    bottom: 0;
    left: 0;
  }

  &__corner--br {
    right: 0;
    bottom: 0;
  }

  &__corner--br::before,
  &__corner--br::after {
    right: 0;
    bottom: 0;
  }

  &__label {
    position: absolute;
    display: inline-flex;
    align-items: center;
    gap: 0.7rem;
    font-family: $font-mono;
    font-size: clamp(0.56rem, 0.72vw, 0.68rem);
    line-height: 1;
    letter-spacing: 0.18em;
    white-space: nowrap;
    opacity: 0.72;
    text-rendering: geometricPrecision;
  }

  &__label--top-left {
    top: clamp(1rem, 1.8vw, 1.55rem);
    left: clamp(1rem, 1.8vw, 1.55rem);
  }

  &__label--top-right {
    top: clamp(1rem, 1.8vw, 1.55rem);
    right: clamp(1rem, 1.8vw, 1.55rem);
    letter-spacing: 0.22em;
  }

  &__label--bottom-left {
    bottom: clamp(1rem, 1.8vw, 1.55rem);
    left: clamp(1rem, 1.8vw, 1.55rem);
    align-items: baseline;
    gap: 0.78rem;
    letter-spacing: 0.12em;
  }

  &__label--bottom-left strong {
    font-family: $font-serif;
    font-size: clamp(0.95rem, 1.35vw, 1.45rem);
    font-weight: 300;
    letter-spacing: 0.03em;
    color: color-mix(in srgb, var(--accent-current, #a7e7ff) 70%, var(--abyss-fg, #dce7ea) 30%);
  }

  &__italic {
    font-family: $font-serif;
    font-style: italic;
    font-weight: 300;
    letter-spacing: 0.08em;
  }

  &__rule {
    width: clamp(1.5rem, 3vw, 3rem);
    height: 1px;
    background: currentColor;
    opacity: 0.42;
  }

  @media (max-width: 767px) {
    inset: 0.7rem;

    &__label {
      font-size: 0.52rem;
    }

    &__label--top-left {
      top: 1rem;
      left: 1rem;
    }

    &__label--top-right {
      top: 1rem;
      right: 1rem;
    }

    &__label--bottom-left {
      bottom: 1rem;
      left: 1rem;
    }
  }
}
</style>
