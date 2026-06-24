<template>
  <section
    ref="sectionRef"
    class="xray-image-section"
    :class="{
      'xray-image-section--active': isActive && imageReady && isHomeRoute,
    }"
    :style="sectionStyle"
  >
    <div class="xray-image-section__normal">
      <slot />
    </div>

    <div
      v-if="isHomeRoute"
      class="xray-image-section__reveal"
      aria-hidden="true"
    >
      <img
        class="xray-image-section__image"
        :src="imageSrc"
        alt=""
        draggable="false"
        decoding="async"
        loading="eager"
        fetchpriority="low"
        @load="handleImageLoad"
        @error="handleImageError"
      />
    </div>

    <div
      v-if="glow && isHomeRoute"
      class="xray-image-section__glow"
      aria-hidden="true"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const props = withDefaults(
  defineProps<{
    imageSrc: string;
    radius?: number;
    glow?: boolean;
  }>(),
  {
    radius: 180,
    glow: true,
  },
);

const route = useRoute();
const sectionRef = ref<HTMLElement | null>(null);
const imageReady = ref(false);
const isActive = ref(false);

const isHomeRoute = computed(() => route.path === "/");
const sectionStyle = computed(() => ({
  "--r": `${Math.max(72, props.radius)}px`,
}));

let currentX = 0;
let currentY = 0;
let targetX = 0;
let targetY = 0;
let lastClientX: number | null = null;
let lastClientY: number | null = null;
let animationFrame = 0;
let reduceMotion = false;
let finePointer = true;
let resizeObserver: ResizeObserver | null = null;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

function writeLensPosition() {
  const section = sectionRef.value;
  if (!section) return;

  section.style.setProperty("--x", `${currentX.toFixed(2)}px`);
  section.style.setProperty("--y", `${currentY.toFixed(2)}px`);
}

function animateLens() {
  animationFrame = 0;

  if (reduceMotion) {
    currentX = targetX;
    currentY = targetY;
  } else {
    currentX += (targetX - currentX) * 0.135;
    currentY += (targetY - currentY) * 0.135;
  }

  writeLensPosition();

  const stillMoving =
    Math.abs(targetX - currentX) > 0.08 ||
    Math.abs(targetY - currentY) > 0.08;

  if (stillMoving) {
    animationFrame = requestAnimationFrame(animateLens);
  }
}

function requestLensFrame() {
  if (!animationFrame) {
    animationFrame = requestAnimationFrame(animateLens);
  }
}

function setTargetFromClientPoint(clientX: number, clientY: number) {
  const section = sectionRef.value;
  if (!section) return;

  const bounds = section.getBoundingClientRect();
  lastClientX = clientX;
  lastClientY = clientY;
  targetX = clamp(clientX - bounds.left, 0, bounds.width);
  targetY = clamp(clientY - bounds.top, 0, bounds.height);

  requestLensFrame();
}

function handlePointerMove(event: PointerEvent) {
  if (event.pointerType === "mouse" || event.pointerType === "pen") {
    isActive.value = true;
  }

  setTargetFromClientPoint(event.clientX, event.clientY);
}

function handlePointerEnter(event: PointerEvent) {
  isActive.value = true;
  setTargetFromClientPoint(event.clientX, event.clientY);
}

function handlePointerLeave() {
  if (finePointer) isActive.value = false;
}

function handleTouchMove(event: TouchEvent) {
  const touch = event.touches[0];
  if (!touch) return;

  isActive.value = true;
  setTargetFromClientPoint(touch.clientX, touch.clientY);
}

function syncLensToSection() {
  const section = sectionRef.value;
  if (!section) return;

  const bounds = section.getBoundingClientRect();

  if (lastClientX !== null && lastClientY !== null) {
    targetX = clamp(lastClientX - bounds.left, 0, bounds.width);
    targetY = clamp(lastClientY - bounds.top, 0, bounds.height);
  } else {
    targetX = bounds.width * 0.5;
    targetY = bounds.height * 0.5;
    currentX = targetX;
    currentY = targetY;
    writeLensPosition();
  }

  requestLensFrame();
}

function handleImageLoad() {
  imageReady.value = true;
}

function handleImageError() {
  imageReady.value = false;
}

onMounted(() => {
  if (!isHomeRoute.value) return;

  const section = sectionRef.value;
  if (!section) return;

  reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;

  // Touch-only devices retain a quiet, centred lens until the user moves it.
  isActive.value = !finePointer;
  syncLensToSection();

  section.addEventListener("pointermove", handlePointerMove, {
    passive: true,
  });
  section.addEventListener("pointerenter", handlePointerEnter, {
    passive: true,
  });
  section.addEventListener("pointerleave", handlePointerLeave, {
    passive: true,
  });
  section.addEventListener("touchmove", handleTouchMove, {
    passive: true,
  });

  resizeObserver = new ResizeObserver(syncLensToSection);
  resizeObserver.observe(section);
});

onBeforeUnmount(() => {
  const section = sectionRef.value;

  if (section) {
    section.removeEventListener("pointermove", handlePointerMove);
    section.removeEventListener("pointerenter", handlePointerEnter);
    section.removeEventListener("pointerleave", handlePointerLeave);
    section.removeEventListener("touchmove", handleTouchMove);
  }

  resizeObserver?.disconnect();
  resizeObserver = null;

  if (animationFrame) cancelAnimationFrame(animationFrame);
  animationFrame = 0;
});
</script>

<style scoped>
.xray-image-section {
  --x: 50%;
  --y: 50%;
  --r: 180px;

  position: relative;
  isolation: isolate;
  overflow: hidden;
}

.xray-image-section__normal {
  position: relative;
  z-index: 0;
  min-height: inherit;
}

.xray-image-section__reveal,
.xray-image-section__glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 420ms cubic-bezier(0.22, 1, 0.36, 1);
}

.xray-image-section__reveal {
  z-index: 1;
  overflow: hidden;
  -webkit-mask-image: radial-gradient(
    circle var(--r) at var(--x) var(--y),
    black 0%,
    black 38%,
    rgb(0 0 0 / 0.75) 55%,
    rgb(0 0 0 / 0.35) 72%,
    rgb(0 0 0 / 0.08) 90%,
    transparent 100%
  );
  mask-image: radial-gradient(
    circle var(--r) at var(--x) var(--y),
    black 0%,
    black 38%,
    rgb(0 0 0 / 0.75) 55%,
    rgb(0 0 0 / 0.35) 72%,
    rgb(0 0 0 / 0.08) 90%,
    transparent 100%
  );
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
}

.xray-image-section__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
}

.xray-image-section__glow {
  z-index: 2;
  background: radial-gradient(
    circle calc(var(--r) + 24px) at var(--x) var(--y),
    transparent calc(var(--r) - 3px),
    rgb(223 249 255 / 0.18) var(--r),
    rgb(167 231 255 / 0.08) calc(var(--r) + 5px),
    transparent calc(var(--r) + 24px)
  );
}

.xray-image-section--active .xray-image-section__reveal {
  opacity: 1;
}

.xray-image-section--active .xray-image-section__glow {
  opacity: 0.72;
}

@media (max-width: 767px) {
  .xray-image-section {
    --r: min(34vw, 142px) !important;
  }

  .xray-image-section__glow {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .xray-image-section__reveal,
  .xray-image-section__glow {
    transition: none;
  }
}

@media (prefers-reduced-transparency: reduce) {
  .xray-image-section__glow {
    display: none;
  }
}
</style>
