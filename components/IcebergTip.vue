<template>
  <div
    class="iceberg-tip"
    :data-stage="stage"
    :data-phase="phase"
    :style="icebergVars"
    aria-hidden="true"
  >
    <svg
      class="iceberg-tip__visual"
      viewBox="0 0 1600 240"
      preserveAspectRatio="none"
      role="presentation"
    >
      <g class="iceberg-tip__surface">
        <path class="iceberg-tip__sea-line iceberg-tip__surface-line" d="M -60 226 H 1660" />
        <path class="iceberg-tip__base-line iceberg-tip__surface-line" d="M -60 216 H 1660" />
      </g>

      <g class="iceberg-tip__facets">
        <polygon
          class="iceberg-tip__facet iceberg-tip__facet--left"
          points="-60,216 236,210 438,190 604,151 706,66 690,216"
        />
        <polygon
          class="iceberg-tip__facet iceberg-tip__facet--core"
          points="706,66 798,119 872,101 974,174 918,216 690,216"
        />
        <polygon
          class="iceberg-tip__facet iceberg-tip__facet--right"
          points="872,101 974,174 1108,202 1290,213 918,216"
        />
      </g>

      <g class="iceberg-tip__outlines">
        <path
          class="iceberg-tip__outline iceberg-tip__outline--left"
          pathLength="100"
          d="M 706 66
             L 664 98
             L 604 151
             L 520 176
             L 438 190
             L 330 204
             L 236 210
             L 92 215
             L -60 216"
        />
        <path
          class="iceberg-tip__outline iceberg-tip__outline--right"
          pathLength="100"
          d="M 706 66
             L 748 94
             L 798 119
             L 872 101
             L 924 132
             L 974 174
             L 1108 202
             L 1290 213
             L 1660 216"
        />
      </g>

      <g class="iceberg-tip__sections">
        <path
          class="iceberg-tip__section-line iceberg-tip__section-line--primary"
          pathLength="100"
          d="M 706 66 L 662 132 L 690 216"
        />
        <path
          class="iceberg-tip__section-line"
          pathLength="100"
          d="M 706 66 L 798 119 L 872 101 L 918 216"
        />
        <path
          class="iceberg-tip__section-line iceberg-tip__section-line--secondary"
          pathLength="100"
          d="M 438 190 L 604 151 L 690 216"
        />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from "vue";
import { computed } from "vue";
import { useSceneStage } from "~/composables/useSceneStage";

const props = withDefaults(
  defineProps<{
    phase?: "surface" | "submerged";
  }>(),
  {
    phase: "surface",
  },
);

const { stage } = useSceneStage();

const icebergVars = computed<CSSProperties>(() => {
  const isSubmerged = props.phase === "submerged";

  return {
    "--iceberg-exit-opacity": isSubmerged ? "0.42" : "1",
    "--iceberg-exit-y": isSubmerged ? "-10px" : "0px",
    "--iceberg-blur": isSubmerged ? "5px" : "0px",
    "--iceberg-scale": isSubmerged ? "1.012" : "1",
  } as CSSProperties;
});
</script>

<style lang="scss" scoped>
.iceberg-tip {
  position: fixed;
  inset: 0;
  z-index: 0;
  width: 100vw;
  height: 100dvh;
  overflow: hidden;
  pointer-events: none;
  contain: layout paint;

  --iceberg-line: color-mix(
    in srgb,
    var(--abyss-fg, #263038) 54%,
    var(--color-cold-blue) 46%
  );
  --iceberg-sea: color-mix(
    in srgb,
    var(--abyss-fg, #263038) 24%,
    transparent
  );
  --iceberg-facet: color-mix(in srgb, var(--color-signal) 7%, transparent);
}

.iceberg-tip__visual {
  position: absolute;
  right: 0;
  bottom: 48.5dvh;
  left: 0;
  display: block;
  width: 100vw;
  height: clamp(9rem, 22dvh, 15rem);
  overflow: visible;
  opacity: var(--iceberg-exit-opacity);
  filter: blur(var(--iceberg-blur));
  transform: translate3d(0, var(--iceberg-exit-y), 0) scale(var(--iceberg-scale));
  transition:
    opacity 1100ms $ease-fluid,
    transform 1300ms $ease-fluid,
    filter 1300ms $ease-fluid;
  will-change: opacity, transform, filter;
}

.iceberg-tip__outline,
.iceberg-tip__section-line,
.iceberg-tip__base-line,
.iceberg-tip__sea-line {
  fill: none;
  vector-effect: non-scaling-stroke;
  stroke-linecap: round;
  stroke-linejoin: round;
  shape-rendering: geometricPrecision;
}

.iceberg-tip__surface-line,
.iceberg-tip__outline,
.iceberg-tip__section-line {
  animation-duration: 1200ms;
  animation-timing-function: $ease-fluid;
  animation-fill-mode: both;
}

.iceberg-tip__surface-line {
  transform-box: fill-box;
  transform-origin: 50% 50%;
  animation-name: iceberg-surface-reveal;
}

.iceberg-tip__outline,
.iceberg-tip__section-line {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation-name: iceberg-line-draw;
}

.iceberg-tip__outline {
  stroke: var(--iceberg-line);
  stroke-width: 1;
  opacity: 0.9;
}

.iceberg-tip__section-line {
  stroke: var(--iceberg-line);
  stroke-width: 0.78;
  opacity: 0.35;
  animation-delay: 220ms;
}

.iceberg-tip__section-line--primary {
  opacity: 0.48;
}

.iceberg-tip__section-line--secondary {
  opacity: 0.26;
}

.iceberg-tip__base-line {
  stroke: var(--iceberg-line);
  stroke-width: 0.88;
  opacity: 0.62;
}

.iceberg-tip__sea-line {
  stroke: var(--iceberg-sea);
  stroke-width: 0.76;
}

.iceberg-tip__facet {
  fill: var(--iceberg-facet);
  opacity: 0;
  animation: iceberg-facet-in 900ms $ease-fluid 520ms forwards;
}

.iceberg-tip__facet--left {
  --facet-opacity: 0.54;
}

.iceberg-tip__facet--right {
  --facet-opacity: 0.42;
}

.iceberg-tip__facet--core {
  --facet-opacity: 0.68;
}

@media (max-width: 1023px) {
  .iceberg-tip__visual {
    bottom: 48dvh;
    height: clamp(7.5rem, 18dvh, 11rem);
  }
}

@media (max-width: 767px) {
  .iceberg-tip__visual {
    bottom: 47.5dvh;
    height: clamp(6.4rem, 15dvh, 8.6rem);
  }

  .iceberg-tip__section-line--secondary,
  .iceberg-tip__facet--right {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .iceberg-tip__visual,
  .iceberg-tip__surface-line,
  .iceberg-tip__outline,
  .iceberg-tip__section-line,
  .iceberg-tip__facet {
    animation: none;
    transition: none;
    stroke-dashoffset: 0;
    will-change: auto;
  }

  .iceberg-tip__visual {
    opacity: var(--iceberg-exit-opacity);
  }
}

@keyframes iceberg-surface-reveal {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

@keyframes iceberg-line-draw {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes iceberg-facet-in {
  to {
    opacity: var(--facet-opacity, 0.54);
  }
}
</style>
