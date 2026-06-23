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

    <div class="act-sculpture__content">
      <p class="act-sculpture__kicker">A study in first impressions</p>
      <h1 id="face-title" class="act-sculpture__title">The visible self.</h1>
      <p class="act-sculpture__lede">
        What appears first is only an outline. The deeper self waits beneath the
        surface.
      </p>
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

  &__content {
    position: absolute;
    left: clamp(2rem, 8vw, 8rem);
    top: 50%;
    transform: translateY(-50%);
    width: min(48rem, calc(100vw - 2.5rem));
    pointer-events: auto;
  }

  &__kicker {
    margin-bottom: 1rem;
    font-family: $font-sans;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--abyss-fg-muted);
  }

  &__title {
    max-width: 8ch;
    font-size: clamp(3.4rem, 7.3vw, 7.8rem);
    line-height: 0.88;
    letter-spacing: -0.045em;
    color: inherit;
    text-wrap: balance;
  }

  &__lede {
    margin-top: 1.4rem;
    max-width: 28ch;
    font-family: $font-sans;
    font-size: clamp(0.95rem, 1.2vw, 1.08rem);
    line-height: 1.6;
    color: var(--abyss-fg-muted);
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    gap: 0.85rem;
    margin-top: 2.25rem;
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

    &__content {
      left: 1.25rem;
      right: 1.25rem;
      top: 50%;
      bottom: auto;
      transform: translateY(-50%);
      width: auto;
    }

    &__title {
      max-width: 10ch;
      font-size: clamp(3.25rem, 16vw, 5.25rem);
    }

    &__lede {
      max-width: 32ch;
    }
  }
}
</style>
