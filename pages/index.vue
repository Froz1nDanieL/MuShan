<template>
  <div class="abyss-stage">
    <!-- 1) TresJS · 全局深海场景 (固定) -->
    <ClientOnly>
      <AbyssScene v-if="stage === 'sculpture' || stage === 'revealing-tip'" />
    </ClientOnly>

    <!-- 2) 全局 HUD (深度 / 坐标 / Act 标号) -->
    <AbyssHud />

    <!-- 3) ACT 01 雕塑入口 -->
    <Transition name="fade">
      <XRayImageSection
        v-if="stage === 'sculpture'"
        class="home-xray"
        image-src="/images/xray-img1.JPG"
        :radius="190"
        :glow="true"
      >
        <ActSculpture />
      </XRayImageSection>
    </Transition>

    <!-- 4) ACT 02 冰山一角 -->
    <Transition name="surface-fade">
      <ActTip
        v-if="
          stage === 'revealing-tip' || stage === 'tip' || stage === 'descending'
        "
      />
    </Transition>

    <!-- 5) ACT 03 / 04 / 05 滚动叙事轨道 -->
    <main id="main-content" class="abyss-track" v-show="canScroll">
      <ActDescent />
      <SectionsSectionAbout />
      <SectionsSectionSkills />
      <SectionsSectionProjects />
      <SectionsSectionPhilosophy />
      <ActContact />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useSceneStage } from "~/composables/useSceneStage";
import { useScrollLock } from "~/composables/useScrollLock";
import { useScrollDirector } from "~/composables/useScrollDirector";

const { stage, canScroll } = useSceneStage();
useScrollLock();
useScrollDirector();

useHead({
  title: "Mu Shan: Neo-Classical Abyss",
  meta: [
    {
      name: "description",
      content:
        "A neo-classical deep-sea exhibition hall. A personal portfolio rendered as the descent into an abyss.",
    },
  ],
});
</script>

<style lang="scss" scoped>
.abyss-stage {
  position: relative;
  min-height: 100dvh;
  overflow-x: hidden;
}

.abyss-track {
  position: relative;
  z-index: 2;
  padding-top: 255dvh;
  pointer-events: auto;
}

.home-xray {
  min-height: 100dvh;

  // The source image has a light preview grid. This cold monochrome treatment
  // pushes it into the gallery surface and leaves only the sculptural relief.
  :deep(.xray-image-section__image) {
    object-position: center 42%;
    filter: grayscale(1) contrast(1.55) brightness(1.1);
    mix-blend-mode: multiply;
    opacity: 0.82;
  }
}

// ---------- Vue Transition ----------
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.9s $ease-fluid,
    transform 0.9s $ease-fluid;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

// ACT 02 keeps one-pixel SVG strokes on fixed pixel rows while drawing.
.surface-fade-enter-active,
.surface-fade-leave-active {
  transition: opacity 0.7s $ease-fluid;
}

.surface-fade-enter-from,
.surface-fade-leave-to {
  opacity: 0;
}

@media (max-width: 767px) {
  .abyss-track {
    padding-top: 270dvh;
  }
}
</style>
