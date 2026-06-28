<template>
  <section class="act-sculpture" aria-labelledby="face-title">
    <div class="act-sculpture__frame" aria-hidden="true">
      <span class="act-sculpture__corner act-sculpture__corner--tl" />
      <span class="act-sculpture__corner act-sculpture__corner--tr" />
      <span class="act-sculpture__corner act-sculpture__corner--bl" />
      <span class="act-sculpture__corner act-sculpture__corner--br" />
    </div>

    <header class="act-sculpture__meta">
      <span>ACT 01</span>
      <span class="act-sculpture__meta-rule" aria-hidden="true" />
      <span>THE FACE</span>
    </header>

    <h1
      id="face-title"
      class="act-sculpture__identity"
      aria-label="Daniel Chan"
    >
      <span
        class="act-sculpture__name-rail act-sculpture__name-rail--left"
        aria-hidden="true"
      >
        <span>D</span>
        <span>A</span>
        <span>N</span>
        <span>I</span>
        <span>E</span>
        <span>L</span>
      </span>
      <span
        class="act-sculpture__name-rail act-sculpture__name-rail--right"
        aria-hidden="true"
      >
        <span>C</span>
        <span>H</span>
        <span>A</span>
        <span>N</span>
      </span>
    </h1>

    <div class="act-sculpture__content">
      <button class="act-sculpture__cta" type="button" @click="reveal">
        <span class="act-sculpture__cta-label">What lies beneath</span>
        <span class="act-sculpture__cta-arrow" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.2"
          >
            <line x1="3" y1="12" x2="20" y2="12" />
            <polyline points="14,6 20,12 14,18" />
          </svg>
        </span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useSceneStage } from "~/composables/useSceneStage";

const { enterReveal } = useSceneStage();

function reveal() {
  enterReveal();
}
</script>

<style lang="scss" scoped>
.act-sculpture {
  position: fixed;
  inset: 0;
  z-index: 4;
  min-height: 100dvh;
  padding: clamp(2rem, 5vw, 4.5rem) clamp(1.25rem, 6vw, 6rem);
  color: var(--abyss-fg, #18252c);
  pointer-events: none;

  &__frame {
    position: absolute;
    inset: clamp(1rem, 3.4vw, 3.25rem);
    pointer-events: none;
  }

  &__corner {
    position: absolute;
    width: 1.35rem;
    height: 1.35rem;
    border-color: var(--line-current-mid);
    border-style: solid;
    border-width: 0;

    &--tl {
      top: 0;
      left: 0;
      border-top-width: 1px;
      border-left-width: 1px;
    }

    &--tr {
      top: 0;
      right: 0;
      border-top-width: 1px;
      border-right-width: 1px;
    }

    &--bl {
      bottom: 0;
      left: 0;
      border-bottom-width: 1px;
      border-left-width: 1px;
    }

    &--br {
      right: 0;
      bottom: 0;
      border-right-width: 1px;
      border-bottom-width: 1px;
    }
  }

  &__meta {
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
    font-family: $font-mono;
    font-size: 0.66rem;
    letter-spacing: 0.2em;
    color: var(--abyss-fg-muted);
  }

  &__meta-rule {
    width: 2.5rem;
    height: 1px;
    background: var(--line-current-mid);
  }

  &__identity {
    position: absolute;
    inset: 0;
    z-index: 1;
    margin: 0;
    pointer-events: none;
  }

  &__name-rail {
    position: absolute;
    top: 50%;
    display: flex;
    justify-content: space-between;
    width: clamp(19rem, 27vw, 38rem);
    font-family:
      "Bodoni 72",
      "Bodoni MT",
      "Cormorant Garamond",
      "Noto Serif SC",
      "Songti SC",
      serif;
    font-size: clamp(3.55rem, 6.9vw, 8.15rem);
    font-weight: 500;
    line-height: 0.82;
    letter-spacing: 0;
    color: color-mix(in srgb, var(--abyss-fg) 94%, var(--color-cold-stone) 6%);
    white-space: nowrap;
    text-rendering: geometricPrecision;
    font-kerning: normal;
    font-variant-caps: normal;
    font-feature-settings:
      "kern" 1,
      "liga" 1,
      "calt" 0;
    -webkit-font-smoothing: antialiased;
    opacity: 0;
    text-shadow:
      0 0.014em 0 rgba(255, 255, 255, 0.38),
      0 -0.01em 0 rgba(2, 4, 10, 0.1);
    animation: name-reveal 1.15s $ease-abyss 180ms forwards;

    &--left {
      right: calc(50% + clamp(12.65rem, 18vw, 20.5rem));
      transform: translateY(-50%);
    }

    &--right {
      left: calc(50% + clamp(12.65rem, 18vw, 20.5rem));
      transform: translateY(-50%);
    }

    span {
      display: block;
      transform: scaleX(1.08);
      transform-origin: center;
    }
  }

  &__content {
    position: absolute;
    top: calc(50% + clamp(11.5rem, 25vh, 16rem));
    left: 50%;
    z-index: 3;
    transform: translateX(-50%);
    width: max-content;
    pointer-events: auto;
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    gap: 0.85rem;
    margin-top: 1.5rem;
    padding: 0.5rem 0;
    border: 0;
    background: transparent;
    color: var(--abyss-fg);
    font-family: $font-sans;
    font-size: 0.84rem;
    font-weight: 500;
    letter-spacing: 0.06em;
    cursor: pointer;
    position: relative;
    transition: color 600ms $ease-abyss;

    &-label {
      position: relative;

      &::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: -0.3rem;
        height: 1px;
        background: currentColor;
        transform: scaleX(0.35);
        transform-origin: left;
        transition: transform 600ms $ease-abyss;
      }
    }

    &-arrow {
      display: inline-flex;
      align-items: center;
      width: 1.6rem;
      height: 0.8rem;
      color: currentColor;
      transition: transform 600ms $ease-abyss;

      svg {
        width: 100%;
        height: 100%;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
    }

    &:hover {
      .act-sculpture__cta-label::after {
        transform: scaleX(1);
      }
      .act-sculpture__cta-arrow {
        transform: translateX(0.45rem);
      }
    }

    &:active {
      transform: translateY(0);
    }

    &:focus-visible {
      outline: 1px solid var(--accent-current);
      outline-offset: 6px;
    }
  }

  @media (max-width: 767px) {
    padding: 1.25rem;

    &__name-rail {
      top: 47%;
      width: min(35vw, 7.5rem);
      font-size: clamp(1.16rem, 6.2vw, 1.92rem);
      text-shadow:
        0 0.014em 0 rgba(255, 255, 255, 0.36),
        0 -0.01em 0 rgba(2, 4, 10, 0.06);

      &--left {
        left: 1.2rem;
        right: auto;
        transform: translateY(-50%);
      }

      &--right {
        left: auto;
        right: 1.2rem;
        transform: translateY(-50%);
      }
    }

    &__content {
      top: auto;
      bottom: clamp(2.4rem, 9vh, 4rem);
      left: 50%;
      width: max-content;
    }
  }
}

@keyframes name-reveal {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .act-sculpture__name-rail {
    opacity: 1;
    animation: none;
  }
}
</style>
