<template>
  <div class="abyss-scene" aria-hidden="true">
    <TresCanvas v-bind="canvasConfig" window-size>
      <TresPerspectiveCamera
        :position="cameraPosition"
        :fov="50"
        :near="0.1"
        :far="80"
      />

      <TresFog :color="fogColor" :near="1" :far="22" />

      <!-- ACT 01 only. WebGL is unmounted as soon as ACT 02 begins. -->
      <Sculpture
        :visible="showSculpture"
        :scale="sculptureScale"
        :position-y="sculptureY"
        :opacity="sculptureOpacity"
        :wire-opacity="sculptureWireOpacity"
        :rim-intensity="sculptureRim"
      />
    </TresCanvas>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { TresCanvas } from "@tresjs/core";
import { useDevicePixelRatio } from "@vueuse/core";
import { gsap } from "gsap";
import { useAbyssGradient } from "~/composables/useAbyssGradient";
import { useSceneStage } from "~/composables/useSceneStage";
import Sculpture from "~/components/three/ContourSculpture.vue";

const { pixelRatio } = useDevicePixelRatio();
const { stage, finishReveal } = useSceneStage();
const { rgb: gradientRgb } = useAbyssGradient();

const clearColor = ref("#F3F6F7");
const fogColor = ref("#F3F6F7");
const cameraPosition: [number, number, number] = [0, 0, 6];

const showSculpture = computed(
  () => stage.value === "sculpture" || stage.value === "revealing-tip",
);
const sculptureScale = ref(1);
const sculptureY = ref(0);
const sculptureOpacity = ref(1);
const sculptureWireOpacity = ref(0.22);
const sculptureRim = ref(0.6);

const canvasConfig = computed(() => ({
  clearColor: clearColor.value,
  alpha: true,
  antialias: true,
  powerPreference: "high-performance" as const,
  dpr: Math.min(pixelRatio.value, 1.75),
}));

watch(
  gradientRgb,
  (rgb) => {
    clearColor.value = rgb;
    fogColor.value = rgb;
  },
  { immediate: true },
);

let revealTimeline: gsap.core.Timeline | null = null;

watch(
  stage,
  (currentStage) => {
    if (currentStage !== "revealing-tip") return;

    revealTimeline?.kill();
    revealTimeline = gsap
      .timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: finishReveal,
      })
      .to(sculptureScale, { value: 0.58, duration: 1.35 }, 0)
      .to(sculptureY, { value: 1.45, duration: 1.35 }, 0)
      .to(sculptureOpacity, { value: 0, duration: 1.05 }, 0.12)
      .to(sculptureWireOpacity, { value: 0, duration: 0.9 }, 0.16)
      .to(sculptureRim, { value: 0, duration: 1 }, 0.14)
      .to(clearColor, { value: "#E9F0F2", duration: 0.9 }, 0.35)
      .to(fogColor, { value: "#E9F0F2", duration: 0.9 }, 0.35);
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  revealTimeline?.kill();
  revealTimeline = null;
});
</script>

<style lang="scss" scoped>
.abyss-scene {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: var(--abyss-bg, var(--color-museum-white));
}
</style>
