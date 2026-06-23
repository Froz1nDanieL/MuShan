<template>
  <section class="not-found">
    <div class="not-found__inner">
      <p class="not-found__label">Error 404</p>
      <h1 class="not-found__title">This page is below the charted depth.</h1>
      <p class="not-found__lede">
        The route could not be found. Return home to continue.
      </p>
      <button class="btn" type="button" @click="goHome">Return home</button>
    </div>
  </section>
</template>

<script setup lang="ts">
const router = useRouter();
const goHome = () => router.push("/");

useHead({ title: "404 / Mu Shan" });
</script>

<style lang="scss" scoped>
.not-found {
  display: flex;
  min-height: 100dvh;
  align-items: center;
  padding: 6rem 6vw;
  background: var(--color-void);
  color: var(--color-frost);

  &__inner {
    width: min(100%, 44rem);
  }

  &__label {
    font-family: $font-mono;
    font-size: 0.68rem;
    letter-spacing: 0.2em;
    color: var(--color-glacier);
  }

  &__title {
    margin: 1.5rem 0;
    font-family: $font-display;
    font-size: clamp(3rem, 7vw, 6.5rem);
    font-weight: 300;
    line-height: 0.95;
    letter-spacing: -0.04em;
    color: var(--color-frost);
    text-wrap: balance;
  }

  &__lede {
    max-width: 46ch;
    margin-bottom: 2.5rem;
    font-family: $font-sans;
    font-size: 1rem;
    line-height: 1.7;
    color: var(--color-ice);
  }
}

.btn {
  padding: 0.85rem 1.4rem;
  border: 1px solid $line-mid;
  border-radius: 999px;
  background: transparent;
  color: var(--color-frost);
  font-family: $font-sans;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 600ms $ease-abyss,
    border-color 600ms $ease-abyss,
    background-color 600ms $ease-abyss;

  &:hover {
    transform: translateY(-2px);
    border-color: $line-strong;
    background: rgba(230, 238, 242, 0.06);
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid var(--color-signal);
    outline-offset: 4px;
  }
}
</style>
