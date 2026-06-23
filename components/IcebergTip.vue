<template>
  <div ref="rootRef" class="iceberg-tip" aria-hidden="true">
    <svg
      ref="svgRef"
      class="iceberg-tip__visual"
      viewBox="0 0 1600 240"
      preserveAspectRatio="none"
      role="presentation"
    >
      <!-- Three almost-transparent planes create depth without texture or filters. -->
      <g class="iceberg-tip__facets">
        <polygon
          class="iceberg-tip__facet iceberg-tip__facet--left"
          points="-40,218 292,209 494,181 636,135 720,56 690,216"
        />
        <polygon
          class="iceberg-tip__facet iceberg-tip__facet--core"
          points="720,56 802,120 858,106 946,175 888,216 690,216"
        />
        <polygon
          class="iceberg-tip__facet iceberg-tip__facet--right"
          points="858,106 946,175 1038,195 1154,207 888,216"
        />
      </g>

      <!-- Full-width lines reveal with one cheap centre-origin scale transform. -->
      <g class="iceberg-tip__surface">
        <path
          class="iceberg-tip__base-line iceberg-tip__surface-line"
          d="M -40 218 H 1640"
        />
        <path
          class="iceberg-tip__sea-line iceberg-tip__surface-line"
          d="M -40 227 H 1640"
        />
      </g>

      <!--
        Both paths begin at the summit and draw at the same time.
        This removes the old deterministic left-to-right completion lag.
      -->
      <g class="iceberg-tip__outlines">
        <path
          class="iceberg-tip__outline iceberg-tip__outline--left"
          pathLength="100"
          d="M 720 56
             L 678 92
             L 636 135
             L 570 158
             L 494 181
             L 402 199
             L 292 209
             L 148 215
             L -40 218"
        />
        <path
          class="iceberg-tip__outline iceberg-tip__outline--right"
          pathLength="100"
          d="M 720 56
             L 758 88
             L 802 120
             L 858 106
             L 904 134
             L 946 175
             L 1038 195
             L 1154 207
             L 1324 215
             L 1640 218"
        />
      </g>

      <!-- Sparse, continuous architectural section lines above sea level only. -->
      <g class="iceberg-tip__sections">
        <path
          class="iceberg-tip__section-line iceberg-tip__section-line--primary"
          pathLength="100"
          d="M 720 56 L 684 112 L 690 216"
        />
        <path
          class="iceberg-tip__section-line"
          pathLength="100"
          d="M 720 56 L 802 120 L 858 106 L 888 216"
        />
        <path
          class="iceberg-tip__section-line iceberg-tip__section-line--secondary"
          pathLength="100"
          d="M 494 181 L 636 135 L 690 216"
        />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const props = withDefaults(
  defineProps<{
    /** Plays the summit-to-edges reveal when ACT 02 mounts. */
    autoPlay?: boolean;
    /** Fades and lifts the SVG as the visitor starts descending. */
    scrollOut?: boolean;
    /** Scroll distance, in CSS pixels, used for the surface exit. */
    scrollOutDistance?: number;
  }>(),
  {
    autoPlay: true,
    scrollOut: true,
    scrollOutDistance: 560,
  },
);

const rootRef = ref<HTMLElement | null>(null);
const svgRef = ref<SVGSVGElement | null>(null);

let animationContext: gsap.Context | null = null;
let entranceTimeline: gsap.core.Timeline | null = null;

onMounted(() => {
  const root = rootRef.value;
  const svg = svgRef.value;
  if (!root || !svg) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Reduced motion and no-autoplay retain the finished static artwork.
  if (reduceMotion || !props.autoPlay) return;

  gsap.registerPlugin(ScrollTrigger);

  animationContext = gsap.context(() => {
    const surfaceLines = svg.querySelectorAll<SVGPathElement>(
      ".iceberg-tip__surface-line",
    );
    const outlinePaths = svg.querySelectorAll<SVGPathElement>(
      ".iceberg-tip__outline",
    );
    const sectionLines = svg.querySelectorAll<SVGPathElement>(
      ".iceberg-tip__section-line",
    );
    const facets = svg.querySelectorAll<SVGPolygonElement>(
      ".iceberg-tip__facet",
    );

    // No getTotalLength calls. pathLength=100 makes every outline deterministic.
    gsap.set(svg, {
      opacity: 0,
      y: 10,
      willChange: "transform,opacity",
    });
    gsap.set(surfaceLines, {
      scaleX: 0,
      transformOrigin: "50% 50%",
      transformBox: "fill-box",
      willChange: "transform",
    });
    gsap.set(outlinePaths, {
      strokeDasharray: "100 100",
      strokeDashoffset: 100,
      willChange: "stroke-dashoffset",
    });
    gsap.set(sectionLines, { opacity: 0, y: 5 });
    gsap.set(facets, { opacity: 0 });

    entranceTimeline = gsap.timeline({
      delay: 0.16,
      onComplete: () => {
        gsap.set(svg, { clearProps: "transform,opacity,willChange" });
        gsap.set(surfaceLines, {
          clearProps: "transform,transformOrigin,transformBox,willChange",
        });
        gsap.set(outlinePaths, {
          clearProps: "strokeDasharray,strokeDashoffset,willChange",
        });
        gsap.set(sectionLines, { clearProps: "transform,opacity" });
        gsap.set(facets, { clearProps: "opacity" });
      },
    });

    entranceTimeline
      .to(
        svg,
        {
          opacity: 1,
          y: 0,
          duration: 0.72,
          ease: "power3.out",
        },
        0,
      )
      .to(
        surfaceLines,
        {
          scaleX: 1,
          duration: 1.05,
          ease: "power3.inOut",
        },
        0,
      )
      .to(
        outlinePaths,
        {
          strokeDashoffset: 0,
          duration: 1.35,
          ease: "power2.inOut",
        },
        0.1,
      )
      .to(
        facets,
        {
          opacity: (index) => [0.72, 1, 0.58][index] ?? 0.6,
          duration: 0.78,
          ease: "power2.out",
        },
        0.72,
      )
      .to(
        sectionLines,
        {
          opacity: (index) => [0.48, 0.34, 0.26][index] ?? 0.3,
          y: 0,
          duration: 0.62,
          ease: "power3.out",
        },
        0.86,
      );

    if (!props.scrollOut) return;

    const exitTween = gsap.to(root, {
      opacity: 0,
      yPercent: -8,
      paused: true,
      ease: "none",
    });

    ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: () => `+=${props.scrollOutDistance}`,
      animation: exitTween,
      scrub: 0.65,
      invalidateOnRefresh: true,
    });
  }, root);
});

onBeforeUnmount(() => {
  entranceTimeline?.kill();
  entranceTimeline = null;
  animationContext?.revert();
  animationContext = null;
});
</script>

<style scoped>
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
    var(--abyss-fg, #263038) 56%,
    #8dafc0
  );
  --iceberg-sea: color-mix(
    in srgb,
    var(--abyss-fg, #263038) 25%,
    transparent
  );
  --iceberg-facet: color-mix(in srgb, #a7e7ff 6%, transparent);
}

.iceberg-tip__visual {
  position: absolute;
  right: 0;
  bottom: 50dvh;
  left: 0;
  display: block;
  width: 100vw;
  height: clamp(9rem, 22dvh, 15rem);
  overflow: visible;
}

.iceberg-tip__outline,
.iceberg-tip__section-line,
.iceberg-tip__base-line,
.iceberg-tip__sea-line {
  fill: none;
  vector-effect: non-scaling-stroke;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.iceberg-tip__outline {
  stroke: var(--iceberg-line);
  stroke-width: 1.05;
  opacity: 0.9;
}

.iceberg-tip__section-line {
  stroke: var(--iceberg-line);
  stroke-width: 0.78;
  opacity: 0.34;
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
  opacity: 0.64;
}

.iceberg-tip__sea-line {
  stroke: var(--iceberg-sea);
  stroke-width: 0.76;
}

.iceberg-tip__facet {
  fill: var(--iceberg-facet);
}

.iceberg-tip__facet--left {
  opacity: 0.72;
}

.iceberg-tip__facet--right {
  opacity: 0.58;
}

@media (max-width: 1023px) {
  .iceberg-tip__visual {
    bottom: 52dvh;
    height: clamp(7.5rem, 18dvh, 11rem);
  }
}

@media (max-width: 767px) {
  .iceberg-tip__visual {
    bottom: 54dvh;
    height: clamp(6rem, 14.5dvh, 8.25rem);
  }

  .iceberg-tip__section-line--secondary,
  .iceberg-tip__facet--right {
    display: none;
  }

  .iceberg-tip__outline {
    stroke-width: 0.94;
  }
}

@media (prefers-reduced-motion: reduce) {
  .iceberg-tip,
  .iceberg-tip__visual {
    transform: none !important;
    opacity: 1 !important;
    will-change: auto !important;
  }
}
</style>
