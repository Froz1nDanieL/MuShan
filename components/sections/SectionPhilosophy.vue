<template>
  <DepthSection
    id="philosophy"
    depth="900M"
    title="Principles"
    stage="04"
    data-depth-section
  >
    <p class="philosophy__lede">Three principles that hold when the decoration is gone.</p>

    <ol class="philosophy__list">
      <li v-for="(note, i) in notes" :key="note.title" class="philosophy__note">
        <span class="philosophy__index">{{ String(i + 1).padStart(2, "0") }}</span>
        <h3 class="philosophy__title">{{ note.title }}</h3>
        <p class="philosophy__body">{{ note.body }}</p>
      </li>
    </ol>
  </DepthSection>
</template>

<script setup lang="ts">
const notes = [
  {
    title: "The surface is a translation.",
    body: "Every interface models an underlying idea. The strongest ones make that idea easier to understand without pretending to replace it.",
  },
  {
    title: "Restraint is an active choice.",
    body: "A line removed is a decision. A shorter motion is a judgment. Clarity comes from knowing what the work can leave out.",
  },
  {
    title: "Performance is respect.",
    body: "A page should arrive on time, respond without ceremony, and leave cleanly. Speed is part of the experience, not a final optimization.",
  },
];
</script>

<style lang="scss" scoped>
.philosophy {
  &__lede {
    max-width: 42ch;
    margin-bottom: clamp(3.5rem, 8vw, 7rem);
    font-family: $font-sans;
    font-size: clamp(1rem, 1.4vw, 1.2rem);
    line-height: 1.75;
    color: var(--abyss-fg-muted);
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: clamp(4rem, 8vw, 7rem);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__note {
    display: grid;
    grid-template-columns: 3rem minmax(16rem, 1.4fr) minmax(16rem, 0.8fr);
    gap: clamp(1.5rem, 4vw, 4rem);
    align-items: start;
    max-width: 78rem;
    padding-top: 1.4rem;
    border-top: 1px solid var(--line-current-mid);

    &:nth-child(2) {
      margin-left: 8vw;
    }

    &:nth-child(3) {
      margin-left: 3vw;
    }
  }

  &__index {
    font-family: $font-mono;
    font-size: 0.66rem;
    letter-spacing: 0.16em;
    color: var(--accent-current);
  }

  &__title {
    max-width: 14ch;
    font-family: $font-display;
    font-size: clamp(2rem, 3.4vw, 3.8rem);
    font-weight: 300;
    font-style: italic;
    line-height: 1.03;
    letter-spacing: -0.025em;
    color: var(--abyss-fg);
    text-wrap: balance;
  }

  &__body {
    max-width: 42ch;
    font-family: $font-sans;
    font-size: 0.9rem;
    line-height: 1.8;
    color: var(--abyss-fg-muted);
    text-wrap: pretty;
  }

  @media (max-width: 767px) {
    &__note {
      grid-template-columns: 2.5rem 1fr;

      &:nth-child(2),
      &:nth-child(3) {
        margin-left: 0;
      }
    }

    &__body {
      grid-column: 2;
    }
  }
}
</style>
