<template>
  <section class="act-descent" data-depth-section aria-labelledby="descent-title">
    <div class="act-descent__inner">
      <div class="act-descent__meta">
        <span>ACT 03</span>
        <span class="act-descent__meta-rule" aria-hidden="true" />
        <span>INNER DYNAMICS</span>
      </div>

      <div class="act-descent__content">
        <h2 id="descent-title" class="act-descent__title">
          Sound, shape, and motion briefly surface.
        </h2>
        <p class="act-descent__lede">
          Three quiet forces appear before the project mass.
        </p>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.act-descent {
  position: relative;
  display: flex;
  min-height: 125dvh;
  align-items: center;
  padding: 10rem clamp(1.25rem, 7vw, 7rem);
  color: var(--abyss-fg);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    width: 1px;
    height: 30vh;
    background: linear-gradient(180deg, var(--line-current-mid), transparent);
  }

  &__inner {
    width: min(100%, 90rem);
    margin: 0 auto;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    font-family: $font-mono;
    font-size: 0.66rem;
    letter-spacing: 0.2em;
    color: var(--abyss-fg-muted);
  }

  &__meta-rule {
    width: 2.5rem;
    height: 1px;
    background: var(--line-current-mid);
  }

  &__content {
    width: min(48rem, 72vw);
    margin: 24vh 0 0 auto;
  }

  &__title {
    font-size: clamp(3.8rem, 8vw, 8rem);
    font-weight: 300;
    line-height: 0.92;
    letter-spacing: -0.045em;
    color: inherit;
    text-wrap: balance;
  }

  &__lede {
    margin-top: 1.75rem;
    max-width: 34ch;
    font-family: $font-sans;
    font-size: clamp(0.95rem, 1.2vw, 1.08rem);
    line-height: 1.65;
    color: var(--abyss-fg-muted);
  }

  @media (max-width: 767px) {
    min-height: 112dvh;
    align-items: flex-start;
    padding: 8rem 1.25rem 6rem;

    &::before {
      left: 1.25rem;
      height: 18vh;
    }

    &__content {
      width: 100%;
      margin-top: 30vh;
    }

    &__title {
      font-size: clamp(3.5rem, 17vw, 5.5rem);
    }
  }
}
</style>
