<template>
  <section
    :id="id"
    ref="root"
    class="depth-section"
    :data-depth="depth"
    :data-act="stage"
  >
    <div class="depth-section__measure" aria-hidden="true" />

    <div class="depth-section__inner">
      <header class="depth-section__head">
        <div class="depth-section__meta">
          <span>ACT {{ stage }}</span>
          <span class="depth-section__divider" aria-hidden="true" />
          <span>{{ depth }}</span>
        </div>
        <h2 class="depth-section__title">{{ title }}</h2>
      </header>

      <div class="depth-section__body">
        <slot />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";

withDefaults(
  defineProps<{
    id: string;
    index?: string;
    depth: string;
    title: string;
    stage: string;
  }>(),
  {
    index: "",
    stage: "04",
  },
);

const root = ref<HTMLElement | null>(null);
</script>

<style lang="scss" scoped>
.depth-section {
  position: relative;
  display: flex;
  min-height: 112dvh;
  align-items: center;
  padding: 11rem clamp(1.25rem, 7vw, 7rem) 9rem;
  color: var(--abyss-fg);

  &__measure {
    position: absolute;
    top: 15vh;
    bottom: 15vh;
    left: clamp(1rem, 3.5vw, 3.5rem);
    width: 1px;
    background: linear-gradient(
      180deg,
      transparent,
      var(--line-current-soft) 18%,
      var(--line-current-soft) 82%,
      transparent
    );
  }

  &__inner {
    width: min(100%, 90rem);
    margin: 0 auto;
  }

  &__head {
    display: flex;
    flex-direction: column;
    gap: 1.35rem;
    margin-bottom: clamp(3rem, 6vw, 5.5rem);
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    font-family: $font-mono;
    font-size: 0.66rem;
    letter-spacing: 0.2em;
    color: var(--abyss-fg-muted);
  }

  &__divider {
    width: 2.5rem;
    height: 1px;
    background: var(--line-current-mid);
  }

  &__title {
    max-width: 8ch;
    font-size: clamp(4rem, 9vw, 9rem);
    font-weight: 300;
    line-height: 0.86;
    letter-spacing: -0.045em;
    color: inherit;
    text-wrap: balance;
  }

  &__body {
    position: relative;
    width: 100%;
  }

  @media (max-width: 767px) {
    min-height: 100dvh;
    align-items: flex-start;
    padding: 8rem 1.25rem 6rem;

    &__measure {
      display: none;
    }

    &__title {
      font-size: clamp(3.5rem, 18vw, 5.5rem);
    }
  }
}
</style>
