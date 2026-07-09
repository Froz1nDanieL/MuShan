<template>
  <section
    id="about"
    ref="rootRef"
    class="act-interests"
    data-depth-section
    :data-phase="phase"
    :data-active="activeId || 'none'"
    aria-labelledby="interests-title"
    @pointerleave="clearActive"
  >
    <div class="act-interests__stage">
      <header v-if="phase === 'title'" class="act-interests__head">
        <p class="act-interests__kicker">INNER DYNAMICS</p>
        <h2 id="interests-title" class="act-interests__title">
          Sound. Shape. Motion.
        </h2>
        <p class="act-interests__lede">
          Three quiet forces, shown briefly before the descent continues.
        </p>
      </header>

      <svg
        class="act-interests__route"
        viewBox="0 0 1200 620"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <marker
            id="interest-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M1 1 L8 5 L1 9" class="act-interests__route-arrow" />
          </marker>
        </defs>
        <path
          class="act-interests__route-line"
          pathLength="100"
          d="M128 404 C284 282 414 254 548 316 C696 386 836 326 1074 244"
          marker-end="url(#interest-arrow)"
        />
      </svg>

      <ol class="act-interests__nodes" aria-label="Personal interests">
        <li
          v-for="interest in interests"
          :key="interest.id"
          class="act-interests__node"
          :class="`act-interests__node--${interest.id}`"
          :style="nodeStyle(interest)"
          :data-focused="activeId === interest.id"
          @pointerenter="setActive(interest.id)"
          @focusin="setActive(interest.id)"
          @focusout="clearActive"
        >
          <article class="act-interests__node-shell">
            <button class="act-interests__node-button" type="button">
              <span class="act-interests__node-index">{{ interest.index }}</span>
              <span class="act-interests__node-title">{{ interest.title }}</span>
              <span class="act-interests__node-subtitle">{{ interest.subtitle }}</span>
              <span class="act-interests__node-line">{{ interest.line }}</span>
            </button>
          </article>
        </li>
      </ol>

      <div
        class="act-interests__hover-field"
        :data-active="activeId || 'none'"
        aria-hidden="true"
      >
        <div class="act-interests__hover-layer act-interests__hover-layer--music">
          <a
            v-for="name in musicNames"
            :key="name.label"
            class="act-interests__float act-interests__float--artist"
            :class="`act-interests__float--${name.id}`"
            :href="name.href"
            target="_blank"
            rel="noopener noreferrer"
            tabindex="-1"
          >
            {{ name.label }}
          </a>
        </div>

        <div class="act-interests__hover-layer act-interests__hover-layer--workout">
          <div class="act-interests__video-shell act-interests__video-shell--workout">
            <video
              class="act-interests__video act-interests__video--blurred"
              :src="workoutVideoSrc"
              muted
              loop
              playsinline
              autoplay
              preload="auto"
            />
          </div>
        </div>

        <div class="act-interests__hover-layer act-interests__hover-layer--basketball">
          <div class="act-interests__video-shell">
            <video
              v-if="basketballVideoSrc"
              class="act-interests__video"
              :src="basketballVideoSrc"
              muted
              loop
              playsinline
              autoplay
              preload="auto"
            />
            <div v-else class="act-interests__video-placeholder">
              <span />
              <span />
              <span />
              <p>video source pending</p>
            </div>
          </div>
        </div>
      </div>

      <p class="act-interests__footnote">
        A brief catalogue of private momentum.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { CSSProperties } from "vue";
import { ref } from "vue";

type InterestId = "music" | "workout" | "basketball";

type Interest = {
  id: InterestId;
  index: string;
  title: string;
  subtitle: string;
  line: string;
  x: number;
  y: number;
};

const rootRef = ref<HTMLElement | null>(null);
const activeId = ref<InterestId | null>(null);

withDefaults(
  defineProps<{
    phase?: Act3Phase;
  }>(),
  {
    phase: "interests",
  },
);

type Act3Phase = "title" | "interests";

const basketballVideoSrc = "/videos/basketball.mp4";
const workoutVideoSrc = "/videos/workout.mp4";

const interests: Interest[] = [
  {
    id: "music",
    index: "01",
    title: "Music",
    subtitle: "Sound",
    line: "rhythm makes the dark legible",
    x: 22,
    y: 58,
  },
  {
    id: "workout",
    index: "02",
    title: "Workout",
    subtitle: "Shape",
    line: "repetition turns pressure into form",
    x: 50,
    y: 40,
  },
  {
    id: "basketball",
    index: "03",
    title: "Basketball",
    subtitle: "Motion",
    line: "space is read before it is named",
    x: 78,
    y: 58,
  },
];

const musicNames = [
  {
    id: "wonder",
    label: "Stevie Wonder",
    href: "https://en.wikipedia.org/wiki/Stevie_Wonder",
  },
  {
    id: "bowie",
    label: "David Bowie",
    href: "https://en.wikipedia.org/wiki/David_Bowie",
  },
  {
    id: "caesar",
    label: "Daniel Caesar",
    href: "https://en.wikipedia.org/wiki/Daniel_Caesar",
  },
  {
    id: "travis",
    label: "Travis Scott",
    href: "https://en.wikipedia.org/wiki/Travis_Scott",
  },
  {
    id: "kanye",
    label: "Kanye West",
    href: "https://en.wikipedia.org/wiki/Kanye_West",
  },
  {
    id: "boniver",
    label: "Bon Iver",
    href: "https://en.wikipedia.org/wiki/Bon_Iver",
  },
];

function setActive(id: InterestId) {
  activeId.value = id;
}

function clearActive() {
  activeId.value = null;
}

function nodeStyle(interest: Interest): CSSProperties {
  return {
    "--node-x": `${interest.x}%`,
    "--node-y": `${interest.y}%`,
  } as CSSProperties;
}
</script>

<style lang="scss" scoped>
.act-interests {
  position: relative;
  display: flex;
  min-height: 100dvh;
  align-items: center;
  overflow: hidden;
  color: var(--abyss-fg);

  &__stage {
    position: relative;
    width: min(100%, 92rem);
    min-height: 100dvh;
    margin: 0 auto;
    padding: clamp(5.4rem, 9vh, 7rem) clamp(2.2rem, 7vw, 7.6rem)
      clamp(4.5rem, 8vh, 6.5rem);
    isolation: isolate;
  }

  &__stage::before {
    content: "";
    position: absolute;
    inset: 13% 9% 10%;
    z-index: -2;
    border-radius: 50%;
    background:
      radial-gradient(
        circle at 50% 45%,
        color-mix(in srgb, var(--accent-current) 12%, transparent) 0%,
        transparent 48%
      ),
      radial-gradient(
        circle at 18% 68%,
        color-mix(in srgb, var(--color-ice) 12%, transparent) 0%,
        transparent 38%
      );
    opacity: 0.5;
    filter: saturate(0.7);
    pointer-events: none;
  }

  &__head {
    position: absolute;
    top: clamp(5.4rem, 9vh, 7rem);
    left: clamp(2.2rem, 7vw, 7.6rem);
    z-index: 4;
    display: grid;
    justify-items: start;
    max-width: 24rem;
    margin: 0;
    text-align: left;
    pointer-events: none;
    transition:
      top 1000ms $ease-fluid,
      left 1000ms $ease-fluid,
      max-width 1000ms $ease-fluid,
      transform 1000ms $ease-fluid,
      opacity 900ms $ease-fluid;
  }

  &__kicker {
    font-family: $font-mono;
    font-size: clamp(0.58rem, 0.68vw, 0.72rem);
    line-height: 1;
    letter-spacing: 0.28em;
    color: var(--abyss-fg-subtle);
  }

  &__title {
    margin-top: clamp(1rem, 2vh, 1.5rem);
    font-family: $font-display;
    font-size: clamp(2.5rem, 4.2vw, 5.1rem);
    font-weight: 300;
    line-height: 0.9;
    letter-spacing: -0.045em;
    color: color-mix(in srgb, var(--abyss-fg) 92%, var(--color-cold-blue) 8%);
    text-wrap: balance;
    transition:
      font-size 1000ms $ease-fluid,
      line-height 1000ms $ease-fluid,
      letter-spacing 1000ms $ease-fluid;
  }

  &__lede {
    max-width: 26ch;
    margin-top: clamp(0.85rem, 2vh, 1.25rem);
    font-family: $font-sans;
    font-size: clamp(0.86rem, 0.96vw, 1rem);
    line-height: 1.7;
    color: var(--abyss-fg-muted);
    text-wrap: pretty;
    transition: opacity 800ms $ease-fluid;
  }

  &[data-phase="title"] &__head {
    top: 50%;
    left: 50%;
    justify-items: center;
    max-width: min(58rem, 84vw);
    text-align: center;
    transform: translate3d(-50%, -50%, 0);
  }

  &[data-phase="title"] &__title {
    font-size: clamp(4.4rem, 9.2vw, 10.5rem);
    line-height: 0.84;
    letter-spacing: -0.055em;
  }

  &[data-phase="title"] &__lede {
    max-width: 34ch;
    opacity: 0.72;
  }

  &[data-phase="interests"] &__head {
    opacity: 0;
    visibility: hidden;
    transform: translate3d(0, -18px, 0);
    pointer-events: none;
  }

  &__route {
    position: absolute;
    inset: clamp(5.2rem, 8.5vh, 6.8rem) clamp(2rem, 4.5vw, 5rem)
      clamp(4.7rem, 8vh, 6rem);
    z-index: 1;
    overflow: visible;
    pointer-events: none;
    opacity: 1;
    transition:
      opacity 900ms $ease-fluid,
      transform 1000ms $ease-fluid;
  }

  &__route-line,
  &__route-arrow {
    vector-effect: non-scaling-stroke;
    stroke: color-mix(in srgb, var(--abyss-fg) 46%, var(--color-cold-blue) 54%);
    stroke-width: 0.95;
    stroke-linecap: round;
    stroke-linejoin: round;
    opacity: 0.32;
  }

  &__route-line {
    stroke-dasharray: 1.4 5.4;
  }

  &__route-arrow {
    fill: none;
  }

  &__nodes {
    position: absolute;
    inset: clamp(5.2rem, 8.5vh, 6.8rem) clamp(2rem, 4.5vw, 5rem)
      clamp(4.7rem, 8vh, 6rem);
    z-index: 5;
    margin: 0;
    padding: 0;
    list-style: none;
    opacity: 1;
    transform: translate3d(0, 0, 0);
    pointer-events: none;
    transition:
      opacity 900ms $ease-fluid,
      transform 1000ms $ease-fluid;
  }

  &[data-phase="title"] &__route,
  &[data-phase="title"] &__nodes,
  &[data-phase="title"] &__footnote {
    opacity: 0;
    transform: translate3d(0, 18px, 0);
    pointer-events: none;
  }

  &[data-phase="title"] &__nodes {
    visibility: hidden;
  }

  &__node {
    position: absolute;
    top: var(--node-y);
    left: var(--node-x);
    width: min(22rem, 25vw);
    transform: translate3d(-50%, -50%, 0);
    transform-origin: center;
    pointer-events: auto;
    transition:
      transform 900ms $ease-fluid,
      opacity 900ms $ease-fluid,
      filter 900ms $ease-fluid;
  }

  &[data-active]:not([data-active="none"]) &__node:not([data-focused="true"]) {
    opacity: 0.22;
    filter: saturate(0.48) blur(0.1px);
    transform: translate3d(-50%, -50%, 0) scale(0.68);
  }

  &__node[data-focused="true"] {
    z-index: 8;
    transform: translate3d(-50%, -50%, 0) scale(1.34);
  }

  &__node-shell {
    position: relative;
    min-height: 9.8rem;
    isolation: isolate;
  }

  &__node-shell::before {
    content: "";
    position: absolute;
    inset: -1.6rem -1.25rem;
    z-index: -2;
    border-radius: 999px;
    background:
      radial-gradient(
        circle,
        color-mix(in srgb, var(--color-ice) 12%, transparent) 0%,
        transparent 58%
      );
    opacity: 0;
    transform: scale(0.86);
    transition:
      opacity 900ms $ease-fluid,
      transform 900ms $ease-fluid;
  }

  &__node[data-focused="true"] &__node-shell::before {
    opacity: 1;
    transform: scale(1);
  }

  &__node-button {
    position: relative;
    z-index: 2;
    display: grid;
    width: 100%;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    text-align: left;
    cursor: default;
  }

  &__node-button::before {
    content: "";
    width: clamp(4.5rem, 8vw, 8rem);
    height: 1px;
    margin-bottom: 1rem;
    background: linear-gradient(90deg, currentColor, transparent);
    opacity: 0.38;
    transform: scaleX(0.58);
    transform-origin: left;
    transition:
      opacity 700ms $ease-fluid,
      transform 700ms $ease-fluid;
  }

  &__node[data-focused="true"] &__node-button::before {
    opacity: 0.76;
    transform: scaleX(1);
  }

  &__node-button:focus-visible {
    outline: 1px solid color-mix(in srgb, var(--accent-current) 58%, transparent);
    outline-offset: 0.9rem;
  }

  &__node-index {
    font-family: $font-mono;
    font-size: 0.58rem;
    line-height: 1;
    letter-spacing: 0.22em;
    color: var(--accent-current);
    opacity: 0.7;
  }

  &__node-title {
    margin-top: 0.55rem;
    font-family: $font-display;
    font-size: clamp(2.85rem, 4.35vw, 5.65rem);
    font-weight: 300;
    line-height: 0.84;
    letter-spacing: -0.055em;
    color: var(--abyss-fg);
    text-rendering: geometricPrecision;
  }

  &__node-subtitle {
    margin-top: 0.72rem;
    font-family: $font-serif;
    font-size: clamp(1.1rem, 1.6vw, 1.7rem);
    font-style: italic;
    line-height: 1.1;
    letter-spacing: 0.03em;
    color: var(--abyss-fg-muted);
  }

  &__node-line {
    max-width: 24ch;
    margin-top: 0.9rem;
    font-family: $font-sans;
    font-size: clamp(0.78rem, 0.86vw, 0.9rem);
    line-height: 1.65;
    color: var(--abyss-fg-muted);
    text-wrap: pretty;
  }

  &__hover-field {
    position: fixed;
    inset: 0;
    z-index: 2;
    opacity: 0;
    transition:
      opacity 850ms $ease-fluid;
    pointer-events: none;
  }

  &[data-phase="interests"] &__hover-field:not([data-active="none"]) {
    opacity: 1;
  }

  &[data-phase="interests"] &__hover-field[data-active="music"] {
    pointer-events: auto;
  }

  &__hover-layer {
    position: absolute;
    inset: 0;
    opacity: 0;
    transform: scale(1.012);
    pointer-events: none;
    transition:
      opacity 850ms $ease-fluid,
      transform 1100ms $ease-fluid;
  }

  &__hover-field[data-active="music"] &__hover-layer--music,
  &__hover-field[data-active="workout"] &__hover-layer--workout,
  &__hover-field[data-active="basketball"] &__hover-layer--basketball {
    opacity: 1;
    transform: scale(1);
  }

  &__hover-field[data-active="music"] &__hover-layer--music {
    pointer-events: auto;
  }

  &__hover-layer--music::before {
    content: "";
    position: absolute;
    inset: 8% 10%;
    background:
      radial-gradient(
        ellipse at 28% 55%,
        color-mix(in srgb, var(--color-ice) 10%, transparent) 0%,
        transparent 42%
      ),
      radial-gradient(
        ellipse at 74% 30%,
        color-mix(in srgb, var(--accent-current) 8%, transparent) 0%,
        transparent 36%
      );
    opacity: 0.7;
  }

  &__hover-layer--basketball {
    background:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--color-deep-sea) 16%, transparent),
        color-mix(in srgb, var(--color-abyss) 32%, transparent)
      );
  }

  &__hover-layer--workout {
    background:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--color-depth-blue) 10%, transparent),
        color-mix(in srgb, var(--color-deep-sea) 28%, transparent)
      );
  }

  &__float {
    position: absolute;
    font-family: $font-serif;
    font-weight: 300;
    font-style: italic;
    line-height: 1;
    color: color-mix(in srgb, var(--abyss-fg) 72%, var(--accent-current) 28%);
    opacity: 0.72;
    text-decoration: none;
    white-space: nowrap;
    pointer-events: auto;
    transition:
      color 600ms $ease-fluid,
      opacity 600ms $ease-fluid,
      transform 800ms $ease-fluid;
  }

  &__float:hover {
    color: color-mix(in srgb, var(--abyss-fg) 92%, var(--accent-current) 8%);
    opacity: 0.96;
  }

  &__float--artist {
    font-family:
      "Snell Roundhand",
      "Zapfino",
      "Palace Script MT",
      "Edwardian Script ITC",
      "Bickham Script Pro",
      "Cormorant Garamond",
      cursive;
    font-size: clamp(2.15rem, 3.25vw, 4.05rem);
    font-weight: 400;
    line-height: 0.82;
    letter-spacing: -0.045em;
    text-shadow: 0 0 22px color-mix(in srgb, var(--color-museum-white) 20%, transparent);
  }

  &__float--principle {
    font-family: $font-mono;
    font-size: clamp(0.82rem, 1.08vw, 1rem);
    font-style: normal;
    letter-spacing: 0.12em;
    color: color-mix(in srgb, var(--abyss-fg) 48%, transparent);
  }

  &__float--wonder {
    top: 18%;
    right: 11%;
    color: color-mix(in srgb, var(--abyss-fg) 78%, var(--color-signal) 22%);
    transform: rotate(7deg);
  }

  &__float--bowie {
    top: 32%;
    left: 9%;
    color: color-mix(in srgb, var(--abyss-fg) 82%, var(--color-ice) 18%);
    transform: rotate(-9deg);
  }

  &__float--caesar {
    right: 18%;
    bottom: 15%;
    color: color-mix(in srgb, var(--abyss-fg) 80%, var(--color-cold-blue) 20%);
    transform: rotate(-5deg);
  }

  &__float--travis {
    left: 15%;
    bottom: 18%;
    color: color-mix(in srgb, var(--abyss-fg) 78%, var(--color-cyan-dim) 22%);
    transform: rotate(8deg);
  }

  &__float--kanye {
    top: 52%;
    right: 7%;
    color: color-mix(in srgb, var(--abyss-fg) 82%, var(--color-glacier) 18%);
    transform: rotate(-11deg);
  }

  &__float--boniver {
    top: 14%;
    left: 31%;
    color: color-mix(in srgb, var(--abyss-fg) 84%, var(--color-frost-white) 16%);
    transform: rotate(-4deg);
  }

  &__float--slow {
    top: 18%;
    left: 16%;
    transform: rotate(-5deg);
  }

  &__float--weight {
    top: 31%;
    right: 12%;
    transform: rotate(7deg);
  }

  &__float--repeat {
    left: 14%;
    bottom: 23%;
    transform: rotate(3deg);
  }

  &__float--quiet {
    right: 23%;
    bottom: 15%;
    transform: rotate(-8deg);
  }

  &__video-shell {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100dvh;
    overflow: hidden;
    border: 0;
    background:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--color-cold-blue) 10%, transparent),
        color-mix(in srgb, var(--color-deep-sea) 40%, transparent)
      );
    opacity: 0.32;
    transform: scale(1);
  }

  &__video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(1) contrast(1.12) brightness(0.78);
    opacity: 0.82;
  }

  &__video--blurred {
    transform: scale(1.055);
    filter: grayscale(1) contrast(1.08) brightness(0.72) blur(10px);
    opacity: 0.68;
  }

  &__video-shell--workout {
    opacity: 0.38;
  }

  &__video-placeholder {
    position: relative;
    display: grid;
    width: 100%;
    height: 100%;
    place-items: center;
    overflow: hidden;
  }

  &__video-placeholder span {
    position: absolute;
    left: 8%;
    right: 8%;
    height: 1px;
    background: color-mix(in srgb, var(--color-ice) 18%, transparent);
  }

  &__video-placeholder span:nth-child(1) {
    top: 31%;
  }

  &__video-placeholder span:nth-child(2) {
    top: 50%;
  }

  &__video-placeholder span:nth-child(3) {
    top: 69%;
  }

  &__video-placeholder p {
    font-family: $font-mono;
    font-size: clamp(0.7rem, 1vw, 0.9rem);
    letter-spacing: 0.22em;
    color: color-mix(in srgb, var(--color-ice) 44%, transparent);
  }

  &__footnote {
    position: absolute;
    right: clamp(3rem, 7.5vw, 8rem);
    bottom: clamp(3.8rem, 6.5vh, 5.2rem);
    z-index: 4;
    font-family: $font-mono;
    font-size: 0.58rem;
    letter-spacing: 0.18em;
    color: var(--abyss-fg-subtle);
    pointer-events: none;
    opacity: 0.58;
    transition:
      opacity 900ms $ease-fluid,
      transform 1000ms $ease-fluid;
  }

  @media (prefers-reduced-motion: no-preference) {
    &__route-line {
      animation: interest-route-breathe 8s $ease-fluid infinite alternate;
    }

    &__hover-field[data-active="music"] &__float--artist {
      animation: interest-float 7.5s $ease-fluid infinite alternate;
    }

    &__hover-field[data-active="workout"] &__video-shell,
    &__hover-field[data-active="basketball"] &__video-shell {
      animation: interest-video-drift 8s $ease-fluid infinite alternate;
    }
  }

  @media (max-width: 1023px) {
    min-height: auto;

    &__stage {
      min-height: auto;
      padding: 6.5rem 1.35rem 5rem;
    }

    &__head {
      position: relative;
      top: auto;
      left: auto;
      justify-items: center;
      margin: 0;
      text-align: center;
      transform: none;
    }

    &[data-phase="title"] &__head {
      justify-items: center;
      max-width: 34rem;
      text-align: center;
      transform: none;
    }

    &[data-phase="interests"] &__head {
      position: absolute;
      opacity: 0;
      visibility: hidden;
    }

    &__route {
      display: none;
    }

    &__nodes {
      position: relative;
      inset: auto;
      display: grid;
      gap: 2.45rem;
      margin-top: 0;
      padding-top: 2rem;
    }

    &__node {
      position: relative;
      top: auto;
      left: auto;
      width: min(100%, 35rem);
      transform: none;
    }

    &__node[data-focused="true"] {
      transform: scale(1.08);
    }

    &[data-active]:not([data-active="none"]) &__node:not([data-focused="true"]) {
      opacity: 0.38;
      transform: scale(0.9);
    }

    &__hover-field {
      opacity: 0;
    }

    &__video-shell {
      width: 100vw;
      height: 100dvh;
    }

    &__footnote {
      position: relative;
      right: auto;
      bottom: auto;
      margin-top: 3rem;
    }
  }

  @media (max-width: 640px) {
    &__title {
      font-size: clamp(3.1rem, 16vw, 5.6rem);
    }

    &__node-title {
      font-size: clamp(3.2rem, 18vw, 5.2rem);
    }

    &__hover-field {
      opacity: 0;
    }

    &[data-phase="interests"] &__hover-field:not([data-active="none"]) {
      opacity: 0.48;
    }
  }
}

@keyframes interest-route-breathe {
  from {
    opacity: 0.32;
    stroke-dashoffset: 0;
  }

  to {
    opacity: 0.58;
    stroke-dashoffset: -8;
  }
}

@keyframes interest-float {
  from {
    translate: 0 0;
  }

  to {
    translate: 0 -10px;
  }
}

@keyframes interest-video-drift {
  from {
    transform: scale(1);
  }

  to {
    transform: scale(1.018);
  }
}
</style>
