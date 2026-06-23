<template>
  <DepthSection
    id="projects"
    depth="640M"
    title="Selected work"
    stage="04"
    data-depth-section
  >
    <p class="projects__lede">Four systems, each built beyond its visible layer.</p>

    <ol class="projects__grid">
      <li v-for="project in projects" :key="project.id" class="projects__item">
        <article class="projects__article">
          <div class="projects__meta">
            <span>{{ project.id }}</span>
            <span>{{ project.year }}</span>
          </div>
          <h3 class="projects__name">{{ project.name }}</h3>
          <p class="projects__desc">{{ project.desc }}</p>
          <p class="projects__tag">{{ project.tag }}</p>
        </article>
      </li>
    </ol>
  </DepthSection>
</template>

<script setup lang="ts">
const projects = [
  {
    id: "P-001",
    name: "Nautilus Atlas",
    year: "2025",
    tag: "WebGL, editorial systems",
    desc: "A speculative maritime archive rendered with a scroll-directed film lens.",
  },
  {
    id: "P-002",
    name: "Halftone Press",
    year: "2024",
    tag: "Publishing, typography",
    desc: "An editorial publishing tool with a custom type engine and measured motion.",
  },
  {
    id: "P-003",
    name: "Plumb Line",
    year: "2024",
    tag: "Tooling, design systems",
    desc: "A token compiler that keeps code, CSS, and design primitives in agreement.",
  },
  {
    id: "P-004",
    name: "Slow Tide",
    year: "2023",
    tag: "Mobile, generative audio",
    desc: "A tide-aware meditation app with a calm interface and no notifications.",
  },
];
</script>

<style lang="scss" scoped>
.projects {
  &__lede {
    max-width: 40ch;
    margin-bottom: clamp(3rem, 7vw, 6rem);
    font-family: $font-sans;
    font-size: clamp(1rem, 1.4vw, 1.2rem);
    line-height: 1.75;
    color: var(--abyss-fg-muted);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: clamp(3rem, 8vw, 8rem) clamp(1.5rem, 4vw, 4rem);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__item {
    grid-column: span 7;

    &:nth-child(2) {
      grid-column: 8 / span 5;
      margin-top: 7rem;
    }

    &:nth-child(3) {
      grid-column: 2 / span 5;
    }

    &:nth-child(4) {
      grid-column: 7 / span 6;
      margin-top: 5rem;
    }
  }

  &__article {
    padding-top: 1.25rem;
    border-top: 1px solid var(--line-current-mid);
  }

  &__meta {
    display: flex;
    justify-content: space-between;
    font-family: $font-mono;
    font-size: 0.66rem;
    letter-spacing: 0.14em;
    color: var(--abyss-fg-subtle);
  }

  &__name {
    margin-top: 2.5rem;
    font-family: $font-display;
    font-size: clamp(2.5rem, 4.5vw, 5rem);
    font-weight: 300;
    line-height: 0.95;
    letter-spacing: -0.035em;
    color: var(--abyss-fg);
    text-wrap: balance;
  }

  &__desc {
    max-width: 44ch;
    margin-top: 1.35rem;
    font-family: $font-sans;
    font-size: 0.9rem;
    line-height: 1.75;
    color: var(--abyss-fg-muted);
  }

  &__tag {
    margin-top: 1.6rem;
    font-family: $font-mono;
    font-size: 0.65rem;
    letter-spacing: 0.12em;
    color: var(--accent-current);
  }

  @media (max-width: 767px) {
    &__grid {
      grid-template-columns: 1fr;
      gap: 4rem;
    }

    &__item,
    &__item:nth-child(2),
    &__item:nth-child(3),
    &__item:nth-child(4) {
      grid-column: 1;
      margin-top: 0;
    }
  }
}
</style>
