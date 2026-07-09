<template>
  <section
    :id="id"
    ref="root"
    class="depth-section"
    :data-depth="depth"
    :data-act="stage"
  >
    <div class="depth-section__inner">
      <header v-if="showTitle" class="depth-section__head">
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
    showTitle?: boolean;
  }>(),
  {
    index: "",
    stage: "04",
    showTitle: true,
  },
);

const root = ref<HTMLElement | null>(null);
</script>

<style lang="scss" scoped>
.depth-section {
  position: relative;
  display: flex;
  min-height: 100dvh;
  align-items: center;
  padding: clamp(7rem, 12vh, 9rem) clamp(1.25rem, 7vw, 7rem)
    clamp(5.5rem, 10vh, 7rem);
  color: var(--abyss-fg);

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
    padding: 7rem 1.25rem 5.5rem;

    &__title {
      font-size: clamp(3.5rem, 18vw, 5.5rem);
    }
  }
}
</style>
