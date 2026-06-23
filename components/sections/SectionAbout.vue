<template>
  <DepthSection
    id="about"
    depth="120M"
    title="About"
    stage="03"
    data-depth-section
  >
    <div class="about__grid">
      <div class="about__primary">
        <p class="about__lede">
          I build interfaces, tools, and systems where aesthetics and function meet.
        </p>
        <p class="about__body">
          The work follows one rule: what is shown should remain a faithful trace
          of what is real. Surfaces are considered, structures stay honest, and
          depth survives in every artifact.
        </p>
      </div>

      <dl class="about__plate">
        <div class="about__plate-row">
          <dt class="about__plate-label">Discipline</dt>
          <dd class="about__plate-value">Interface design, frontend engineering</dd>
        </div>
        <div class="about__plate-row">
          <dt class="about__plate-label">Based in</dt>
          <dd class="about__plate-value">Nanjing, China</dd>
        </div>
        <div class="about__plate-row">
          <dt class="about__plate-label">In practice since</dt>
          <dd class="about__plate-value">2018</dd>
        </div>
        <div class="about__plate-row">
          <dt class="about__plate-label">Current focus</dt>
          <dd class="about__plate-value">Immersive web systems</dd>
        </div>
      </dl>
    </div>
  </DepthSection>
</template>

<style lang="scss" scoped>
.about {
  &__grid {
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) minmax(18rem, 0.8fr);
    gap: clamp(3rem, 9vw, 9rem);
    align-items: start;
  }

  &__lede {
    max-width: 25ch;
    font-family: $font-display;
    font-size: clamp(2rem, 3.6vw, 3.8rem);
    font-style: italic;
    font-weight: 300;
    line-height: 1.16;
    letter-spacing: -0.025em;
    color: var(--abyss-fg);
    text-wrap: balance;
  }

  &__body {
    max-width: 52ch;
    margin-top: 2rem;
    font-family: $font-sans;
    font-size: 0.95rem;
    line-height: 1.8;
    color: var(--abyss-fg-muted);
    text-wrap: pretty;
  }

  &__plate {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin: 0;
    padding: 1.25rem 0 0;
    border-top: 1px solid var(--line-current-mid);
  }

  &__plate-row {
    display: grid;
    grid-template-columns: 8.5rem 1fr;
    gap: 1rem;
    padding: 0.9rem 0;
    border-bottom: 1px solid var(--line-current-soft);
    font-family: $font-mono;
    font-size: 0.68rem;
    letter-spacing: 0.07em;
  }

  &__plate-label,
  &__plate-value {
    margin: 0;
  }

  &__plate-label {
    color: var(--abyss-fg-subtle);
  }

  &__plate-value {
    line-height: 1.55;
    color: var(--abyss-fg);
  }

  @media (max-width: 900px) {
    &__grid {
      grid-template-columns: 1fr;
      gap: 3rem;
    }

    &__plate-row {
      grid-template-columns: 7.5rem 1fr;
    }
  }
}
</style>
