<template>
  <section
    id="skills"
    class="project-study"
    :data-project="activeProject.id"
    data-depth-section
    aria-label="Project study"
  >
    <span class="project-study__ghost-index" aria-hidden="true">
      {{ activeProject.index }}
    </span>

    <svg
      class="project-study__field-lines"
      viewBox="0 0 1200 560"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M92 330 C 280 228, 420 392, 594 286 S 884 184, 1110 304" />
      <path d="M152 456 H1048" />
    </svg>

    <Transition name="project-study-fade" mode="out-in">
      <article :key="activeProject.id" class="project-study__article">
        <div class="project-study__copy">
          <p class="project-study__eyebrow">
            <span>PROJECT {{ activeProject.index }}</span>
            <span>{{ activeProject.depth }}</span>
          </p>

          <h2 class="project-study__name">{{ activeProject.name }}</h2>
          <p class="project-study__subtitle">{{ activeProject.subtitle }}</p>
          <p class="project-study__summary">{{ activeProject.summary }}</p>

          <div class="project-study__intent">
            <span>Study</span>
            <p>{{ activeProject.intent }}</p>
          </div>

          <dl class="project-study__facts">
            <div>
              <dt>Interface</dt>
              <dd>{{ activeProject.interface }}</dd>
            </div>
            <div>
              <dt>System</dt>
              <dd>{{ activeProject.system }}</dd>
            </div>
            <div>
              <dt>Focus</dt>
              <dd>{{ activeProject.focus }}</dd>
            </div>
          </dl>
        </div>

        <div class="project-study__visual" aria-hidden="true">
          <div class="project-study__media-slot"></div>
        </div>
      </article>
    </Transition>

    <nav class="project-study__nav" aria-label="Project sequence">
      <button
        v-for="project in projects"
        :key="project.id"
        class="project-study__nav-item"
        :class="{ 'is-active': project.id === activeProject.id }"
        type="button"
        :aria-label="`Show ${project.name}`"
        :aria-current="project.id === activeProject.id ? 'step' : undefined"
        @click="emit('selectProject', project.id)"
      >
        <span>{{ project.index }}</span>
        <strong>{{ project.name }}</strong>
      </button>
    </nav>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";

type ProjectId = "formcarv" | "msen" | "tucang";

type ProjectStudy = {
  id: ProjectId;
  index: string;
  name: string;
  depth: string;
  subtitle: string;
  summary: string;
  intent: string;
  interface: string;
  system: string;
  focus: string;
};

const props = withDefaults(
  defineProps<{
    projectId?: ProjectId;
  }>(),
  {
    projectId: "formcarv",
  },
);

const emit = defineEmits<{
  selectProject: [id: ProjectId];
}>();

const projects: ProjectStudy[] = [
  {
    id: "formcarv",
    index: "01",
    name: "Form-Carv",
    depth: "360M",
    subtitle: "Form through repetition",
    summary:
      "A mobile training record for exercises, sets, history and body metrics. It treats fitness less like noise and more like a precise record of change.",
    intent:
      "Turn repeated physical work into a calm interface where progress can be reviewed without performance theatre.",
    interface: "Flutter mobile app",
    system: "Spring Boot, PostgreSQL, MyBatis-Plus, Sa-Token",
    focus: "exercise library, workout history, body metrics",
  },
  {
    id: "msen",
    index: "02",
    name: "MS-EN",
    depth: "420M",
    subtitle: "Language under pressure",
    summary:
      "A language learning system for vocabulary, reading, translation and writing correction. It reorganizes scattered learning work into one slower instrument.",
    intent:
      "Make language practice feel structured, traceable and less fragmented across memory, reading and writing.",
    interface: "Nuxt 4, Vue 3, Pinia, Ant Design Vue",
    system: "Spring Boot, Spring AI, DeepSeek, Redis, MySQL",
    focus: "word memory, article reading, essay correction",
  },
  {
    id: "tucang",
    index: "03",
    name: "TuCang",
    depth: "520M",
    subtitle: "Images held in orbit",
    summary:
      "A visual archive space for image upload, search, AI generation and collection analysis. It gives image assets a place to be stored, found and studied.",
    intent:
      "Build an image system that moves from storage to retrieval to visual generation without losing order.",
    interface: "Vue 3, Vite, Pinia, Ant Design Vue",
    system: "Spring Boot, COS, Elasticsearch, RabbitMQ, WebSocket",
    focus: "picture spaces, AI generation, search, analysis",
  },
];

const projectById: Record<ProjectId, ProjectStudy> = {
  formcarv: projects[0] as ProjectStudy,
  msen: projects[1] as ProjectStudy,
  tucang: projects[2] as ProjectStudy,
};

const activeProject = computed<ProjectStudy>(() => projectById[props.projectId]);
</script>

<style lang="scss" scoped>
.project-study {
  position: relative;
  width: min(84vw, 82rem);
  min-height: min(68dvh, 42rem);
  margin: 0 auto;
  color: var(--abyss-fg);
  isolation: isolate;

  &__ghost-index {
    position: absolute;
    top: 48%;
    left: 50%;
    z-index: -2;
    font-family: $font-serif;
    font-size: clamp(15rem, 29vw, 30rem);
    font-weight: 300;
    line-height: 0.75;
    letter-spacing: -0.08em;
    color: color-mix(in srgb, var(--abyss-fg) 3.8%, transparent);
    pointer-events: none;
    transform: translate(-50%, -50%);
  }

  &__field-lines {
    position: absolute;
    inset: 5% 0 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    fill: none;
    stroke: color-mix(in srgb, var(--line-current-mid) 28%, transparent);
    stroke-width: 1;
    stroke-linecap: round;
    vector-effect: non-scaling-stroke;
    opacity: 0.34;
    pointer-events: none;
  }

  &__field-lines path:nth-child(1),
  &__field-lines path:nth-child(2) {
    stroke-dasharray: 4 18;
  }

  &__field-lines path:nth-child(3),
  &__field-lines path:nth-child(4) {
    opacity: 0.35;
  }

  &__article {
    display: grid;
    grid-template-columns: minmax(0, 1.08fr) minmax(18rem, 0.78fr);
    gap: clamp(3rem, 6.4vw, 7rem);
    align-items: center;
    min-height: clamp(25rem, 58dvh, 36rem);
  }

  &__copy {
    max-width: 43rem;
  }

  &__eyebrow {
    display: flex;
    flex-wrap: wrap;
    gap: 0.7rem 1.15rem;
    margin: 0 0 clamp(1.2rem, 2.4vh, 1.8rem);
    font-family: $font-mono;
    font-size: clamp(0.56rem, 0.72vw, 0.68rem);
    letter-spacing: 0.18em;
    color: var(--abyss-fg-subtle);
    text-transform: uppercase;
  }

  &__eyebrow span:first-child {
    color: var(--accent-current);
  }

  &__name {
    margin: 0;
    font-family: $font-serif;
    font-size: clamp(3.8rem, 7.8vw, 8.4rem);
    font-weight: 300;
    line-height: 0.84;
    letter-spacing: -0.055em;
    color: color-mix(in srgb, var(--abyss-fg) 94%, var(--accent-current) 6%);
    text-wrap: balance;
  }

  &__subtitle {
    max-width: 16ch;
    margin: clamp(1rem, 2vh, 1.4rem) 0 0;
    font-family: $font-serif;
    font-size: clamp(1.35rem, 2.2vw, 2.6rem);
    font-style: italic;
    font-weight: 300;
    line-height: 1.12;
    color: color-mix(in srgb, var(--accent-current) 54%, var(--abyss-fg) 46%);
  }

  &__summary {
    max-width: 48ch;
    margin: clamp(1.35rem, 2.6vh, 2rem) 0 0;
    font-family: $font-sans;
    font-size: clamp(0.9rem, 1vw, 1.05rem);
    line-height: 1.72;
    color: var(--abyss-fg-muted);
    text-wrap: pretty;
  }

  &__intent {
    display: grid;
    grid-template-columns: 5.6rem minmax(0, 1fr);
    gap: clamp(1.25rem, 2.2vw, 2rem);
    max-width: 42rem;
    margin-top: clamp(1.5rem, 3vh, 2.35rem);
    padding-top: clamp(1.15rem, 2.3vh, 1.7rem);
    border-top: 1px solid color-mix(in srgb, var(--line-current-mid) 45%, transparent);
  }

  &__intent span {
    font-family: $font-mono;
    font-size: clamp(0.54rem, 0.64vw, 0.62rem);
    letter-spacing: 0.18em;
    color: var(--accent-current);
    text-transform: uppercase;
  }

  &__intent p {
    margin: 0;
    font-family: $font-serif;
    font-size: clamp(1rem, 1.26vw, 1.25rem);
    font-style: italic;
    line-height: 1.55;
    color: var(--abyss-fg-muted);
  }

  &__facts {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: clamp(1rem, 2vw, 2rem);
    max-width: 48rem;
    margin: clamp(1.5rem, 3vh, 2.3rem) 0 0;
  }

  &__facts div {
    min-width: 0;
    padding-top: 0.85rem;
    border-top: 1px solid color-mix(in srgb, var(--line-current-mid) 34%, transparent);
  }

  &__facts dt {
    margin: 0 0 0.62rem;
    font-family: $font-mono;
    font-size: clamp(0.52rem, 0.62vw, 0.6rem);
    letter-spacing: 0.17em;
    color: var(--abyss-fg-subtle);
    text-transform: uppercase;
  }

  &__facts dd {
    margin: 0;
    font-family: $font-sans;
    font-size: clamp(0.72rem, 0.82vw, 0.86rem);
    line-height: 1.55;
    color: var(--abyss-fg-muted);
  }

  &__visual {
    position: relative;
    display: grid;
    justify-items: center;
    align-content: center;
    min-height: clamp(20rem, 50dvh, 34rem);
  }

  &__media-slot {
    position: relative;
    width: min(100%, 28rem);
    aspect-ratio: 4 / 3;
    opacity: 0.52;
  }

  &__media-slot::before,
  &__media-slot::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  &__media-slot::before {
    border-top: 1px solid color-mix(in srgb, var(--line-current-mid) 20%, transparent);
    border-bottom: 1px solid color-mix(in srgb, var(--line-current-mid) 12%, transparent);
    transform: skewY(-3deg);
  }

  &__media-slot::after {
    inset: 16% 10%;
    background:
      linear-gradient(
        90deg,
        transparent,
        color-mix(in srgb, var(--line-current-mid) 12%, transparent),
        transparent
      );
    opacity: 0.4;
  }

  &__nav {
    position: absolute;
    left: 0;
    right: 0;
    bottom: clamp(0.2rem, 1vh, 0.9rem);
    display: flex;
    justify-content: center;
    gap: clamp(1rem, 2.4vw, 2.6rem);
  }

  &__nav-item {
    display: inline-grid;
    grid-template-columns: auto auto;
    gap: 0.75rem;
    align-items: baseline;
    padding: 0.45rem 0;
    border: 0;
    border-bottom: 1px solid transparent;
    background: transparent;
    color: var(--abyss-fg-subtle);
    cursor: pointer;
    font-family: $font-mono;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    transition:
      color 760ms $ease-fluid,
      border-color 760ms $ease-fluid,
      opacity 760ms $ease-fluid,
      transform 760ms $ease-fluid;
  }

  &__nav-item span {
    font-size: clamp(0.52rem, 0.62vw, 0.6rem);
  }

  &__nav-item strong {
    font-size: clamp(0.58rem, 0.72vw, 0.72rem);
    font-weight: 400;
  }

  &__nav-item:hover,
  &__nav-item:focus-visible,
  &__nav-item.is-active {
    color: var(--abyss-fg);
    border-color: color-mix(in srgb, var(--accent-current) 48%, transparent);
  }

  &__nav-item.is-active {
    transform: translateY(-0.12rem);
  }

  &__nav-item:focus-visible {
    outline: 1px solid var(--accent-current);
    outline-offset: 0.35rem;
  }

  @media (max-width: 980px) {
    width: min(88vw, 48rem);

    &__article {
      grid-template-columns: 1fr;
      gap: clamp(2rem, 4vh, 3rem);
      min-height: auto;
    }

    &__visual {
      min-height: 16rem;
      opacity: 0.8;
    }

    &__media-slot {
      width: min(72%, 22rem);
    }

    &__facts {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    &__nav {
      position: relative;
      bottom: auto;
      margin-top: 2rem;
      flex-wrap: wrap;
    }
  }

  @media (max-width: 680px) {
    width: min(86vw, 34rem);

    &__ghost-index {
      font-size: clamp(12rem, 55vw, 18rem);
    }

    &__name {
      font-size: clamp(3.2rem, 16vw, 5rem);
    }

    &__intent {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }

    &__visual {
      display: none;
    }
  }
}

.project-study-fade-enter-active,
.project-study-fade-leave-active {
  transition:
    opacity 900ms $ease-fluid,
    transform 960ms $ease-fluid,
    filter 960ms $ease-fluid;
}

.project-study-fade-enter-from,
.project-study-fade-leave-to {
  opacity: 0;
    filter: blur(2.6px);
  transform: translate3d(0, 0.9rem, 0);
}

@media (prefers-reduced-motion: reduce) {
  .project-study-fade-enter-active,
  .project-study-fade-leave-active,
  .project-study * {
    transition-duration: 1ms;
    animation-duration: 1ms;
  }
}
</style>
