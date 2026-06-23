<template>
  <DepthSection
    id="skills"
    depth="360M"
    title="The mass"
    stage="04"
    data-depth-section
  >
    <p class="skills__lede">
      Four disciplines trained together, because the work gets stronger when the
      seams disappear.
    </p>

    <ul class="skills__grid">
      <li
        v-for="(group, i) in groups"
        :key="group.title"
        class="skills__group"
        :data-size="group.size"
      >
        <span class="skills__group-index">{{ String(i + 1).padStart(2, "0") }}</span>
        <h3 class="skills__group-title">{{ group.title }}</h3>
        <ul class="skills__group-items">
          <li v-for="item in group.items" :key="item" class="skills__item">
            {{ item }}
          </li>
        </ul>
      </li>
    </ul>
  </DepthSection>
</template>

<script setup lang="ts">
const groups = [
  {
    title: "Frontend engineering",
    size: "wide",
    items: ["Vue 3 and Nuxt 3", "TypeScript", "SCSS and CSS variables", "GSAP and Lenis", "TresJS and WebGL"],
  },
  {
    title: "Interface design",
    size: "narrow",
    items: ["Editorial layout", "Motion systems", "Token architecture", "Design engineering"],
  },
  {
    title: "Backend systems",
    size: "narrow",
    items: ["Node.js and Bun", "Edge functions", "Postgres and SQLite", "Static generation"],
  },
  {
    title: "Product thinking",
    size: "wide",
    items: ["Information architecture", "Narrative design", "Interaction polish", "Constraints as craft"],
  },
];
</script>

<style lang="scss" scoped>
.skills {
  &__lede {
    max-width: 42ch;
    margin-bottom: clamp(3rem, 6vw, 5rem);
    font-family: $font-sans;
    font-size: clamp(1rem, 1.4vw, 1.2rem);
    line-height: 1.75;
    color: var(--abyss-fg-muted);
    text-wrap: pretty;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: clamp(1.5rem, 3vw, 3rem);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__group {
    grid-column: span 5;
    min-height: 16rem;
    padding: 1.35rem 0 2rem;
    border-top: 1px solid var(--line-current-mid);

    &[data-size="wide"] {
      grid-column: span 7;
    }
  }

  &__group-index {
    display: block;
    margin-bottom: 2.5rem;
    font-family: $font-mono;
    font-size: 0.66rem;
    letter-spacing: 0.16em;
    color: var(--accent-current);
  }

  &__group-title {
    max-width: 13ch;
    font-family: $font-display;
    font-size: clamp(2rem, 3vw, 3.3rem);
    font-weight: 300;
    line-height: 1;
    letter-spacing: -0.025em;
    color: var(--abyss-fg);
    text-wrap: balance;
  }

  &__group-items {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1.25rem;
    max-width: 38rem;
    margin: 2rem 0 0;
    padding: 0;
    list-style: none;
  }

  &__item {
    font-family: $font-sans;
    font-size: 0.82rem;
    line-height: 1.6;
    color: var(--abyss-fg-muted);
  }

  @media (max-width: 767px) {
    &__grid {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    &__group,
    &__group[data-size="wide"] {
      grid-column: 1;
      min-height: auto;
    }
  }
}
</style>
