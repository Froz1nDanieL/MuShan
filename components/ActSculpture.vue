<template>
  <section class="act-sculpture" aria-labelledby="face-title">
    <h1
      id="face-title"
      class="act-sculpture__identity"
      aria-label="Daniel Chan"
    >
      <span
        class="act-sculpture__name-rail act-sculpture__name-rail--left"
        aria-hidden="true"
      >
        Daniel
      </span>
      <span
        class="act-sculpture__name-rail act-sculpture__name-rail--right"
        aria-hidden="true"
      >
        Chan
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
    display: block;
    width: clamp(14rem, 22vw, 29rem);
    font-family:
      "Monsieur La Doulaise",
      "Bickham Script Pro 3",
      "Bickham Script Pro",
      "Snell Roundhand",
      "Edwardian Script ITC",
      "Palace Script MT",
      "Pinyon Script",
      "Great Vibes",
      "Allura",
      "Zapfino",
      "Brush Script MT",
      cursive;
    font-size: clamp(4.75rem, 8.7vw, 10.6rem);
    font-weight: 400;
    line-height: 0.64;
    letter-spacing: -0.025em;
    color: color-mix(in srgb, var(--abyss-fg) 82%, var(--color-cold-stone) 18%);
    white-space: nowrap;
    text-rendering: geometricPrecision;
    font-kerning: normal;
    font-variant-caps: normal;
    font-feature-settings:
      "kern" 1,
      "liga" 1,
      "dlig" 1,
      "salt" 1,
      "calt" 1,
      "swsh" 1;
    -webkit-font-smoothing: antialiased;
    opacity: 0;
    font-synthesis: none;
    -webkit-text-stroke: 0.006em rgba(2, 4, 10, 0.08);
    text-shadow:
      0 0.012em 0 rgba(255, 255, 255, 0.42),
      0 -0.008em 0 rgba(2, 4, 10, 0.12),
      0 0.2em 1.3em rgba(184, 193, 198, 0.13);
    animation: name-reveal 1.15s $ease-abyss 180ms forwards;

    &--left {
      right: calc(50% + clamp(12.4rem, 17.4vw, 19.6rem));
      transform: translateY(-50%);
      text-align: right;
    }

    &--right {
      left: calc(50% + clamp(12.4rem, 17.4vw, 19.6rem));
      transform: translateY(-50%);
      text-align: left;
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
      width: min(38vw, 9rem);
      font-size: clamp(2.45rem, 12vw, 4rem);
      letter-spacing: -0.03em;
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
    opacity: 0.86;
  }
}

@media (prefers-reduced-motion: reduce) {
  .act-sculpture__name-rail {
    opacity: 0.86;
    animation: none;
  }
}
</style>
