<template>
  <aside class="hud" :data-stage="stage" aria-label="Descent status">
    <span class="hud__corner hud__corner--tl" aria-hidden="true" />
    <span class="hud__corner hud__corner--tr" aria-hidden="true" />
    <span class="hud__corner hud__corner--bl" aria-hidden="true" />
    <span class="hud__corner hud__corner--br" aria-hidden="true" />

    <div class="hud__brand">
      <span class="hud__id">M.S.</span>
      <span>Depth study</span>
    </div>

    <div class="hud__act">{{ actLabel }}</div>

    <div class="hud__depth">
      <span class="hud__depth-label">Depth</span>
      <span class="hud__depth-value">{{ displayDepth }}</span>
      <span class="hud__depth-unit">m</span>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useScrollDepth } from "~/composables/useScrollDepth";
import { useSceneStage } from "~/composables/useSceneStage";

const { depth } = useScrollDepth();
const { stage } = useSceneStage();

const displayDepth = computed(() => Math.round(depth.value * 1100));

const actLabel = computed(() => {
  switch (stage.value) {
    case "sculpture":
      return "ACT 01 / THE FACE";
    case "revealing-tip":
    case "tip":
      return "ACT 02 / THE TIP";
    case "descending":
      return "ACT 03 / INNER DYNAMICS";
    case "underwater":
      return "ACT 04 / THE MASS";
    case "signal":
      return "ACT 05 / THE CONTACT";
    default:
      return "";
  }
});
</script>

<style lang="scss" scoped>
.hud {
  position: fixed;
  inset: clamp(1rem, 3.4vw, 3.25rem);
  z-index: 3;
  color: var(--abyss-fg);
  pointer-events: none;
  opacity: 0;
  transition:
    opacity 800ms $ease-abyss,
    color 180ms $ease-abyss;

  &[data-stage="underwater"],
  &[data-stage="signal"] {
    opacity: 1;
  }

  &__corner {
    position: absolute;
    width: 1.2rem;
    height: 1.2rem;
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

  &__brand,
  &__act {
    position: absolute;
    top: 1.4rem;
    display: flex;
    gap: 0.75rem;
    align-items: center;
    font-family: $font-mono;
    font-size: 0.64rem;
    letter-spacing: 0.16em;
    color: var(--abyss-fg-muted);
  }

  &__brand {
    left: 1.4rem;
  }

  &__id {
    color: var(--abyss-fg);
  }

  &__act {
    right: 1.4rem;
    color: var(--accent-current);
  }

  &__depth {
    position: absolute;
    bottom: 1.4rem;
    left: 1.4rem;
    display: grid;
    grid-template-columns: auto auto auto;
    gap: 0.55rem;
    align-items: baseline;
    font-family: $font-mono;
    font-variant-numeric: tabular-nums;
  }

  &__depth-label {
    margin-right: 0.5rem;
    font-size: 0.62rem;
    letter-spacing: 0.18em;
    color: var(--abyss-fg-subtle);
  }

  &__depth-value {
    min-width: 4ch;
    font-size: clamp(1rem, 1.8vw, 1.4rem);
    color: var(--abyss-fg);
  }

  &__depth-unit {
    font-size: 0.62rem;
    letter-spacing: 0.16em;
    color: var(--abyss-fg-muted);
  }

  @media (max-width: 767px) {
    &__brand {
      display: none;
    }

    &__act {
      right: 1rem;
      max-width: 11rem;
      text-align: right;
    }

    &__depth {
      bottom: 1rem;
      left: 1rem;
    }
  }
}
</style>
