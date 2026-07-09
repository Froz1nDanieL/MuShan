<template>
  <div
    class="abyss-stage"
    :data-stage="stage"
    :data-slide-phase="currentPhase"
    :data-act3-phase="act3Phase"
    :data-depth-progress="presentationProgress.toFixed(2)"
    aria-live="polite"
  >
    <ClientOnly>
      <AbyssScene v-if="stage === 'sculpture' || stage === 'revealing-tip'" />
    </ClientOnly>

    <DepthStudyFrame :act="frameAct" :depth="frameDepth" fixed />
    <AbyssAmbientField
      v-if="stage !== 'sculpture'"
      :stage="stage"
      :phase="currentPhase"
    />

    <Transition name="act-one-fade">
      <XRayImageSection
        v-if="stage === 'sculpture'"
        key="act-01"
        class="home-xray abyss-stage__slide"
        image-src="/images/xray-img1.JPG"
        :radius="190"
        :glow="true"
      >
        <ActSculpture />
      </XRayImageSection>
    </Transition>

    <Transition name="slide-fade" mode="out-in">
      <section
        v-if="stage !== 'sculpture' && showActTitle"
        :key="`act-${frameAct}-title`"
        class="abyss-stage__slide abyss-stage__title-card"
        :aria-labelledby="`act-${frameAct}-title`"
      >
        <p class="abyss-stage__title-kicker">ACT {{ frameAct }}</p>
        <h1 :id="`act-${frameAct}-title`" class="abyss-stage__title">
          {{ currentTitle.title }}
        </h1>
        <p class="abyss-stage__title-subtitle">
          {{ currentTitle.subtitle }}
        </p>
      </section>

      <ActTip
        v-else-if="stage === 'tip'"
        key="act-02-content"
        :phase="act2Phase === 'submerged' ? 'submerged' : 'surface'"
      />

      <main
        v-else-if="stage === 'descending' && act3Phase === 'interests'"
        key="act-03-content"
        id="main-content"
        class="abyss-stage__slide"
      >
        <SectionsSectionAbout phase="interests" />
      </main>

      <main
        v-else-if="stage === 'underwater' && act4Phase !== 'title'"
        :key="`act-04-${act4Phase}`"
        class="abyss-stage__slide abyss-stage__slide--mass"
      >
        <SectionsSectionSkills
          :project-id="act4Phase"
          @select-project="setAct4Project"
        />
      </main>

      <ActContact
        v-else-if="stage === 'signal' && act5Phase === 'content'"
        key="act-05-content"
      />
    </Transition>

    <nav class="abyss-stage__nav" aria-label="Act navigation">
      <button
        v-for="item in navItems"
        :key="item.id"
        class="abyss-stage__dot"
        :class="{ 'abyss-stage__dot--active': item.active }"
        type="button"
        :aria-label="item.label"
        @click="goToAct(item.id)"
      >
        <span>{{ item.number }}</span>
      </button>
    </nav>

    <audio
      ref="bgmRef"
      class="abyss-stage__audio"
      src="/audios/bgm.mp3"
      loop
      preload="auto"
      autoplay
    />

    <button
      class="abyss-stage__music-toggle"
      :class="{
        'abyss-stage__music-toggle--on': musicEnabled,
        'abyss-stage__music-toggle--waiting': musicEnabled && !musicPlaying,
      }"
      type="button"
      :aria-pressed="musicEnabled"
      :aria-label="musicEnabled ? 'Turn background music off' : 'Turn background music on'"
      @click="toggleMusic"
    >
      <span class="abyss-stage__music-mark" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span>{{ musicEnabled ? "SOUND ON" : "SOUND OFF" }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { setPresentationProgress } from "~/composables/usePresentationDepth";
import { useSceneStage, type SceneStage } from "~/composables/useSceneStage";

type Act3Phase = "title" | "interests";
type ActPhase = "title" | "content";
type Act2Phase = "title" | "surface" | "submerged";
type Act4ProjectPhase = "formcarv" | "msen" | "tucang";
type Act4Phase = "title" | Act4ProjectPhase;
type NavAct = "sculpture" | "tip" | "descending" | "underwater" | "signal";

const { stage, enterReveal, setStage } = useSceneStage();
const act2Phase = ref<Act2Phase>("title");
const act3Phase = ref<Act3Phase>("title");
const act4Phase = ref<Act4Phase>("title");
const act5Phase = ref<ActPhase>("title");
const bgmRef = ref<HTMLAudioElement | null>(null);
const musicEnabled = ref(true);
const musicPlaying = ref(false);

let transitionLocked = false;
let wheelAccumulator = 0;
let unlockTimer = 0;
let wheelResetTimer = 0;
let inputPausedUntil = 0;
let touchStartY = 0;

const wheelThreshold = 240;
const titleLockDuration = 1250;
const contentLockDuration = 2050;
const stageLockDuration = 1450;
const bgmVolume = 0.32;

const stageDepth: Record<SceneStage, string> = {
  sculpture: "000M",
  "revealing-tip": "020M",
  tip: "020M",
  descending: "120M",
  underwater: "360M",
  signal: "900M",
};

const act4Depth: Record<Act4ProjectPhase, string> = {
  formcarv: "360M",
  msen: "420M",
  tucang: "520M",
};

const frameAct = computed(() => {
  switch (stage.value) {
    case "sculpture":
      return "01";
    case "revealing-tip":
    case "tip":
      return "02";
    case "descending":
      return "03";
    case "underwater":
      return "04";
    case "signal":
      return "05";
    default:
      return "01";
  }
});

const frameDepth = computed(() => {
  if (stage.value === "underwater" && act4Phase.value !== "title") {
    return act4Depth[act4Phase.value];
  }

  return stageDepth[stage.value];
});

const currentPhase = computed(() => {
  if (stage.value === "tip" || stage.value === "revealing-tip") {
    return act2Phase.value === "title" ? "title" : "content";
  }

  if (stage.value === "descending") {
    return act3Phase.value === "title" ? "title" : "content";
  }

  if (stage.value === "underwater") {
    return act4Phase.value;
  }

  if (stage.value === "signal") {
    return act5Phase.value;
  }

  return "content";
});

const presentationProgress = computed(() => {
  if (stage.value === "sculpture") return 0;
  if (stage.value === "revealing-tip") return 0.18;

  if (stage.value === "tip") {
    if (act2Phase.value === "title") return 0.18;
    if (act2Phase.value === "surface") return 0.22;
    return 0.32;
  }

  if (stage.value === "descending") {
    return act3Phase.value === "title" ? 0.4 : 0.46;
  }

  if (stage.value === "underwater") {
    if (act4Phase.value === "title") return 0.6;
    if (act4Phase.value === "formcarv") return 0.64;
    if (act4Phase.value === "msen") return 0.69;
    return 0.74;
  }

  if (stage.value === "signal") {
    return act5Phase.value === "title" ? 0.88 : 0.96;
  }

  return 0;
});

const actTitles = {
  "02": {
    title: "THE QUIET ORBIT",
    subtitle: "Surface first. Depth later.",
  },
  "03": {
    title: "Sound. Shape. Motion.",
    subtitle: "Three quiet forces, briefly observed.",
  },
  "04": {
    title: "THE MASS",
    subtitle: "What remains below the visible line.",
  },
  "05": {
    title: "THE CONTACT",
    subtitle: "Four channels held at depth.",
  },
} as const;

const currentTitle = computed(() => {
  const act = frameAct.value as keyof typeof actTitles;
  return actTitles[act] ?? actTitles["02"];
});

const showActTitle = computed(() => {
  if (stage.value === "revealing-tip") return true;
  if (stage.value === "tip") return act2Phase.value === "title";
  if (stage.value === "descending") return act3Phase.value === "title";
  if (stage.value === "underwater") return act4Phase.value === "title";
  if (stage.value === "signal") return act5Phase.value === "title";
  return false;
});

const navItems = computed(() => [
  {
    id: "sculpture" as const,
    number: "01",
    label: "Go to ACT 01",
    active: stage.value === "sculpture",
  },
  {
    id: "tip" as const,
    number: "02",
    label: "Go to ACT 02",
    active: stage.value === "revealing-tip" || stage.value === "tip",
  },
  {
    id: "descending" as const,
    number: "03",
    label: "Go to ACT 03",
    active: stage.value === "descending",
  },
  {
    id: "underwater" as const,
    number: "04",
    label: "Go to ACT 04",
    active: stage.value === "underwater",
  },
  {
    id: "signal" as const,
    number: "05",
    label: "Go to ACT 05",
    active: stage.value === "signal",
  },
]);

function lockTransition(duration = stageLockDuration) {
  transitionLocked = true;
  wheelAccumulator = 0;
  inputPausedUntil = performance.now() + duration + 260;
  window.clearTimeout(unlockTimer);
  unlockTimer = window.setTimeout(() => {
    transitionLocked = false;
  }, duration);
}

function inputIsPaused() {
  return transitionLocked || performance.now() < inputPausedUntil;
}

function goNext() {
  if (transitionLocked || stage.value === "revealing-tip") return;

  if (stage.value === "sculpture") {
    act2Phase.value = "title";
    enterReveal();
    lockTransition(950);
    return;
  }

  if (stage.value === "tip" && act2Phase.value === "title") {
    act2Phase.value = "surface";
    lockTransition(contentLockDuration);
    return;
  }

  if (stage.value === "tip" && act2Phase.value === "surface") {
    act2Phase.value = "submerged";
    lockTransition(contentLockDuration);
    return;
  }

  if (stage.value === "tip" && act2Phase.value === "submerged") {
    act3Phase.value = "title";
    setStage("descending");
    lockTransition(titleLockDuration);
    return;
  }

  if (stage.value === "descending" && act3Phase.value === "title") {
    act3Phase.value = "interests";
    lockTransition(contentLockDuration);
    return;
  }

  if (stage.value === "descending") {
    act4Phase.value = "title";
    setStage("underwater");
    lockTransition(titleLockDuration);
    return;
  }

  if (stage.value === "underwater" && act4Phase.value === "title") {
    act4Phase.value = "formcarv";
    lockTransition(contentLockDuration);
    return;
  }

  if (stage.value === "underwater" && act4Phase.value === "formcarv") {
    act4Phase.value = "msen";
    lockTransition(contentLockDuration);
    return;
  }

  if (stage.value === "underwater" && act4Phase.value === "msen") {
    act4Phase.value = "tucang";
    lockTransition(contentLockDuration);
    return;
  }

  if (stage.value === "underwater" && act4Phase.value === "tucang") {
    act5Phase.value = "title";
    setStage("signal");
    lockTransition(titleLockDuration);
    return;
  }

  if (stage.value === "signal" && act5Phase.value === "title") {
    act5Phase.value = "content";
    lockTransition(contentLockDuration);
  }
}

function goPrev() {
  if (transitionLocked || stage.value === "revealing-tip") return;

  if (stage.value === "signal" && act5Phase.value === "content") {
    act5Phase.value = "title";
    lockTransition(titleLockDuration);
    return;
  }

  if (stage.value === "signal") {
    act4Phase.value = "tucang";
    setStage("underwater");
    lockTransition(contentLockDuration);
    return;
  }

  if (stage.value === "underwater" && act4Phase.value === "tucang") {
    act4Phase.value = "msen";
    lockTransition(contentLockDuration);
    return;
  }

  if (stage.value === "underwater" && act4Phase.value === "msen") {
    act4Phase.value = "formcarv";
    lockTransition(contentLockDuration);
    return;
  }

  if (stage.value === "underwater" && act4Phase.value === "formcarv") {
    act4Phase.value = "title";
    lockTransition(titleLockDuration);
    return;
  }

  if (stage.value === "underwater") {
    act3Phase.value = "interests";
    setStage("descending");
    lockTransition(contentLockDuration);
    return;
  }

  if (stage.value === "descending" && act3Phase.value === "interests") {
    act3Phase.value = "title";
    lockTransition(titleLockDuration);
    return;
  }

  if (stage.value === "descending") {
    act2Phase.value = "submerged";
    setStage("tip");
    lockTransition(contentLockDuration);
    return;
  }

  if (stage.value === "tip" && act2Phase.value === "submerged") {
    act2Phase.value = "surface";
    lockTransition(contentLockDuration);
    return;
  }

  if (stage.value === "tip" && act2Phase.value === "surface") {
    act2Phase.value = "title";
    lockTransition(titleLockDuration);
    return;
  }

  if (stage.value === "tip") {
    setStage("sculpture");
    lockTransition(stageLockDuration);
  }
}

function goToAct(id: NavAct) {
  if (transitionLocked || stage.value === "revealing-tip") return;

  if (id === "tip") {
    act2Phase.value = "title";
    setStage("tip");
  } else {
    setStage(id);
  }

  if (id === "descending") {
    act3Phase.value = "title";
  }
  if (id === "underwater") {
    act4Phase.value = "title";
  }
  if (id === "signal") {
    act5Phase.value = "title";
  }

  lockTransition(titleLockDuration);
}

function setAct4Project(id: Act4ProjectPhase) {
  if (transitionLocked) return;
  act4Phase.value = id;
  lockTransition(contentLockDuration);
}

function onWheel(event: WheelEvent) {
  event.preventDefault();

  if (inputIsPaused()) {
    wheelAccumulator = 0;
    window.clearTimeout(wheelResetTimer);
    return;
  }

  wheelAccumulator += event.deltaY;
  window.clearTimeout(wheelResetTimer);
  wheelResetTimer = window.setTimeout(() => {
    wheelAccumulator = 0;
  }, 420);

  if (Math.abs(wheelAccumulator) < wheelThreshold) return;

  if (wheelAccumulator > 0) {
    goNext();
  } else {
    goPrev();
  }

  wheelAccumulator = 0;
}

function onKeydown(event: KeyboardEvent) {
  const nextKeys = ["ArrowDown", "ArrowRight", "PageDown", " "];
  const prevKeys = ["ArrowUp", "ArrowLeft", "PageUp"];
  const isNavigationKey = nextKeys.includes(event.key) || prevKeys.includes(event.key);

  if (inputIsPaused() && isNavigationKey) {
    event.preventDefault();
    return;
  }

  if (nextKeys.includes(event.key)) {
    event.preventDefault();
    goNext();
  }

  if (prevKeys.includes(event.key)) {
    event.preventDefault();
    goPrev();
  }
}

function onTouchStart(event: TouchEvent) {
  touchStartY = event.touches[0]?.clientY ?? 0;
}

function onTouchMove(event: TouchEvent) {
  if (inputIsPaused()) {
    event.preventDefault();
    return;
  }

  const currentY = event.touches[0]?.clientY ?? touchStartY;
  const delta = touchStartY - currentY;

  if (Math.abs(delta) < 96) return;

  event.preventDefault();
  if (delta > 0) {
    goNext();
  } else {
    goPrev();
  }
  touchStartY = currentY;
}

async function playMusic() {
  const audio = bgmRef.value;
  if (!audio || !musicEnabled.value) return;

  audio.volume = bgmVolume;
  audio.muted = false;

  try {
    await audio.play();
    musicPlaying.value = true;
  } catch {
    musicPlaying.value = false;
  }
}

function pauseMusic() {
  const audio = bgmRef.value;
  if (!audio) return;

  audio.pause();
  musicPlaying.value = false;
}

function toggleMusic() {
  musicEnabled.value = !musicEnabled.value;

  if (musicEnabled.value) {
    void playMusic();
    return;
  }

  pauseMusic();
}

function unlockMusicFromGesture() {
  if (!musicEnabled.value || musicPlaying.value) return;
  void playMusic();
}

watch(stage, (nextStage) => {
  if (nextStage === "tip") {
    transitionLocked = false;
  }
});

watch(
  presentationProgress,
  (progress) => {
    setPresentationProgress(progress);
  },
  { immediate: true, flush: "post" },
);

onMounted(() => {
  setPresentationProgress(presentationProgress.value);
  void playMusic();

  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("keydown", onKeydown);
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: false });
  window.addEventListener("pointerdown", unlockMusicFromGesture, { passive: true });
  window.addEventListener("keydown", unlockMusicFromGesture);
});

onBeforeUnmount(() => {
  pauseMusic();
  window.clearTimeout(unlockTimer);
  window.clearTimeout(wheelResetTimer);
  window.removeEventListener("wheel", onWheel);
  window.removeEventListener("keydown", onKeydown);
  window.removeEventListener("touchstart", onTouchStart);
  window.removeEventListener("touchmove", onTouchMove);
  window.removeEventListener("pointerdown", unlockMusicFromGesture);
  window.removeEventListener("keydown", unlockMusicFromGesture);
});

useHead({
  title: "Mu Shan: Neo-Classical Abyss",
  meta: [
    {
      name: "description",
      content:
        "A neo-classical deep-sea exhibition hall. A personal portfolio rendered as a fixed-screen descent into an abyss.",
    },
  ],
});
</script>

<style lang="scss" scoped>
.abyss-stage {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100dvh;
  overflow: hidden;
  background: var(--abyss-bg, var(--color-museum-white));
  color: var(--abyss-fg, #18252c);
  transition:
    background 1100ms $ease-fluid,
    color 1100ms $ease-fluid;
}

.abyss-stage__slide {
  position: fixed;
  inset: 0;
  z-index: 4;
  width: 100vw;
  height: 100dvh;
  overflow: hidden;
}

.abyss-stage__slide--mass {
  display: grid;
  place-items: center;
}

.abyss-stage__title-card {
  z-index: 5;
  display: grid;
  place-items: center;
  padding: clamp(2rem, 5vw, 5rem);
  text-align: center;
  pointer-events: none;
}

.abyss-stage__title-card::before {
  content: "";
  position: absolute;
  inset: 15% 18%;
  z-index: -1;
  border-radius: 50%;
  background:
    radial-gradient(
      circle,
      color-mix(in srgb, var(--accent-current) 9%, transparent) 0%,
      transparent 58%
    );
  opacity: 0.68;
}

.abyss-stage__title-kicker {
  margin: 0 0 clamp(1rem, 2vh, 1.45rem);
  font-family: $font-mono;
  font-size: clamp(0.58rem, 0.76vw, 0.72rem);
  line-height: 1;
  letter-spacing: 0.34em;
  color: var(--abyss-fg-subtle);
}

.abyss-stage__title {
  max-width: min(72rem, 88vw);
  margin: 0;
  font-family: $font-display;
  font-size: clamp(4rem, 9.5vw, 11.5rem);
  font-weight: 300;
  line-height: 0.82;
  letter-spacing: -0.055em;
  color: color-mix(in srgb, var(--abyss-fg) 94%, var(--accent-current) 6%);
  text-rendering: geometricPrecision;
  text-wrap: balance;
}

.abyss-stage__title-subtitle {
  max-width: 34ch;
  margin: clamp(1.3rem, 2.5vh, 2rem) auto 0;
  font-family: $font-mono;
  font-size: clamp(0.72rem, 0.92vw, 0.92rem);
  line-height: 1.8;
  letter-spacing: 0.16em;
  color: var(--abyss-fg-muted);
}

.home-xray {
  min-height: 100dvh;

  :deep(.xray-image-section__image) {
    object-position: center 42%;
    filter: grayscale(1) contrast(1.55) brightness(1.1);
    mix-blend-mode: multiply;
    opacity: 0.82;
  }
}

.abyss-stage__nav {
  position: fixed;
  right: clamp(1.65rem, 2.75vw, 3rem);
  top: 50%;
  z-index: 14;
  display: grid;
  gap: 0.72rem;
  opacity: 0.48;
  transform: translateY(-50%);
  transition: opacity 700ms $ease-fluid;
}

.abyss-stage__nav:hover,
.abyss-stage__nav:focus-within {
  opacity: 0.9;
}

.abyss-stage__audio {
  display: none;
}

.abyss-stage__music-toggle {
  position: fixed;
  right: clamp(2.85rem, 4vw, 4.8rem);
  bottom: clamp(2.85rem, 4vw, 4.8rem);
  z-index: 16;
  display: inline-flex;
  align-items: center;
  gap: 0.62rem;
  min-width: 7.4rem;
  height: 2rem;
  justify-content: center;
  padding: 0 0.88rem;
  border: 1px solid color-mix(in srgb, var(--abyss-fg) 20%, transparent);
  border-radius: 999px;
  background:
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--abyss-bg) 70%, transparent),
      color-mix(in srgb, var(--abyss-bg) 44%, transparent)
    );
  color: color-mix(in srgb, var(--abyss-fg) 72%, transparent);
  cursor: pointer;
  font-family: $font-mono;
  font-size: clamp(0.54rem, 0.66vw, 0.64rem);
  line-height: 1;
  letter-spacing: 0.16em;
  opacity: 0.78;
  transition:
    border-color 700ms $ease-fluid,
    color 700ms $ease-fluid,
    opacity 700ms $ease-fluid,
    transform 700ms $ease-fluid,
    background 700ms $ease-fluid;
}

.abyss-stage__music-toggle:hover {
  border-color: color-mix(in srgb, var(--accent-current) 46%, transparent);
  color: color-mix(in srgb, var(--abyss-fg) 92%, var(--accent-current) 8%);
  opacity: 1;
  transform: translateY(-1px);
}

.abyss-stage__music-toggle:focus-visible {
  outline: 1px solid var(--accent-current);
  outline-offset: 0.35rem;
}

.abyss-stage__music-toggle--on {
  border-color: color-mix(in srgb, var(--accent-current) 32%, transparent);
}

.abyss-stage__music-toggle--waiting {
  opacity: 0.58;
}

.abyss-stage__music-mark {
  display: inline-flex;
  align-items: end;
  gap: 2px;
  width: 0.75rem;
  height: 0.72rem;
}

.abyss-stage__music-mark span {
  display: block;
  width: 1px;
  height: 45%;
  background: currentColor;
  opacity: 0.7;
  transform-origin: bottom;
}

.abyss-stage__music-mark span:nth-child(2) {
  height: 82%;
}

.abyss-stage__music-mark span:nth-child(3) {
  height: 58%;
}

.abyss-stage__music-toggle--on .abyss-stage__music-mark span {
  animation: music-meter 1.8s $ease-fluid infinite alternate;
}

.abyss-stage__music-toggle--on .abyss-stage__music-mark span:nth-child(2) {
  animation-delay: 140ms;
}

.abyss-stage__music-toggle--on .abyss-stage__music-mark span:nth-child(3) {
  animation-delay: 280ms;
}

.abyss-stage__dot {
  display: grid;
  width: 2.35rem;
  height: 1.25rem;
  place-items: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--abyss-fg-subtle);
  cursor: pointer;
  font-family: $font-mono;
  font-size: 0.56rem;
  letter-spacing: 0.12em;
  opacity: 0.54;
  transition:
    color 700ms $ease-fluid,
    opacity 700ms $ease-fluid,
    transform 700ms $ease-fluid;
}

.abyss-stage__dot::after {
  content: "";
  display: block;
  width: 1.35rem;
  height: 1px;
  margin-top: 0.24rem;
  background: currentColor;
  transform: scaleX(0.34);
  transition: transform 700ms $ease-fluid;
}

.abyss-stage__dot--active {
  color: var(--abyss-fg);
  opacity: 0.9;
  transform: translateX(-0.18rem);
}

.abyss-stage__dot--active::after {
  transform: scaleX(1);
}

.abyss-stage__dot:focus-visible {
  outline: 1px solid var(--accent-current);
  outline-offset: 0.35rem;
}

.act-one-fade-enter-active,
.act-one-fade-leave-active {
  transition: opacity 620ms $ease-fluid;
}

.act-one-fade-enter-from,
.act-one-fade-leave-to {
  opacity: 0;
}

.act-one-fade-enter-to,
.act-one-fade-leave-from {
  opacity: 1;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition:
    opacity 950ms $ease-fluid,
    transform 1100ms $ease-fluid,
    filter 1100ms $ease-fluid;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  filter: blur(2.8px);
  transform: translate3d(0, 8px, 0) scale(0.994);
}

@media (prefers-reduced-motion: reduce) {
  .act-one-fade-enter-active,
  .act-one-fade-leave-active,
  .slide-fade-enter-active,
  .slide-fade-leave-active,
  .abyss-stage,
  .abyss-stage__dot,
  .abyss-stage__dot::after {
    transition-duration: 1ms;
  }
}

@media (max-width: 767px) {
  .abyss-stage__title {
    font-size: clamp(3.2rem, 16vw, 6.6rem);
  }

  .abyss-stage__title-subtitle {
    font-size: 0.68rem;
  }

  .abyss-stage__nav {
    right: 1rem;
    gap: 0.5rem;
  }

  .abyss-stage__dot {
    width: 2rem;
  }

  .abyss-stage__music-toggle {
    right: 1.35rem;
    bottom: 1.35rem;
    min-width: 6.8rem;
    height: 1.85rem;
    padding: 0 0.72rem;
  }
}

@keyframes music-meter {
  from {
    transform: scaleY(0.45);
    opacity: 0.42;
  }

  to {
    transform: scaleY(1);
    opacity: 0.9;
  }
}
</style>
