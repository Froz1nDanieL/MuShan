<template>
  <section
    id="contact"
    class="act-contact"
    :data-stage="stage"
    data-depth-section
    aria-labelledby="signal-title"
  >
    <div class="act-contact__signal" aria-hidden="true">
      <span class="act-contact__signal-line" />
      <span class="act-contact__signal-pulse" />
    </div>

    <div class="act-contact__inner">
      <header class="act-contact__head">
        <div class="act-contact__meta">
          <span>ACT 05</span>
          <span class="act-contact__meta-rule" aria-hidden="true" />
          <span>THE SIGNAL</span>
          <span class="act-contact__depth">DEPTH 1,100M</span>
        </div>
        <h2 id="signal-title" class="act-contact__title">Send a signal.</h2>
        <p class="act-contact__lede">Let&rsquo;s build something with depth.</p>
      </header>

      <ul class="act-contact__channels">
        <li v-for="channel in channels" :key="channel.label">
          <a
            class="act-contact__channel"
            :href="channel.href"
            :target="channel.external ? '_blank' : undefined"
            :rel="channel.external ? 'noopener noreferrer' : undefined"
          >
            <span class="act-contact__channel-label">{{ channel.label }}</span>
            <span class="act-contact__channel-value">{{ channel.value }}</span>
          </a>
        </li>
      </ul>

      <footer class="act-contact__foot">
        <span>&copy; 2026 Mu Shan</span>
        <span>All rights reserved</span>
      </footer>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useSceneStage } from "~/composables/useSceneStage";

const { stage } = useSceneStage();

const channels = [
  {
    label: "Email",
    value: "hello@mushan.studio",
    href: "mailto:hello@mushan.studio",
    external: false,
  },
  {
    label: "GitHub",
    value: "@mushan",
    href: "https://github.com/mushan",
    external: true,
  },
  {
    label: "X",
    value: "@mushan",
    href: "https://x.com/mushan",
    external: true,
  },
  {
    label: "LinkedIn",
    value: "/in/mushan",
    href: "https://linkedin.com/in/mushan",
    external: true,
  },
];
</script>

<style lang="scss" scoped>
.act-contact {
  position: relative;
  display: flex;
  min-height: 120dvh;
  align-items: center;
  padding: 12rem clamp(1.25rem, 7vw, 7rem) 6rem;
  color: var(--abyss-fg);

  &__signal {
    position: absolute;
    top: 10vh;
    bottom: 10vh;
    left: clamp(1rem, 3.5vw, 3.5rem);
    width: 1px;
    overflow: hidden;
  }

  &__signal-line {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      transparent,
      var(--line-current-soft) 18%,
      var(--line-current-mid) 50%,
      var(--line-current-soft) 82%,
      transparent
    );
  }

  &__signal-pulse {
    position: absolute;
    left: -1px;
    width: 3px;
    height: 5rem;
    background: linear-gradient(180deg, transparent, var(--accent-current), transparent);
    box-shadow: 0 0 1rem color-mix(in srgb, var(--accent-current) 35%, transparent);
    animation: signal-rise 6s $ease-abyss infinite;
  }

  &__inner {
    width: min(100%, 90rem);
    margin: 0 auto;
  }

  &__head {
    margin-bottom: clamp(4rem, 8vw, 7rem);
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

  &__depth {
    margin-left: auto;
    font-variant-numeric: tabular-nums;
  }

  &__title {
    max-width: 9ch;
    margin-top: 2rem;
    font-size: clamp(4.25rem, 10vw, 10rem);
    font-weight: 300;
    line-height: 0.86;
    letter-spacing: -0.05em;
    color: var(--accent-current);
    text-wrap: balance;
  }

  &__lede {
    margin-top: 1.75rem;
    font-family: $font-sans;
    font-size: clamp(1rem, 1.4vw, 1.2rem);
    line-height: 1.7;
    color: var(--abyss-fg-muted);
  }

  &__channels {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0 clamp(2rem, 7vw, 7rem);
    margin: 0;
    padding: 0;
    border-top: 1px solid var(--line-current-mid);
    list-style: none;
  }

  &__channels li {
    border-bottom: 1px solid var(--line-current-soft);
  }

  &__channel {
    position: relative;
    display: grid;
    grid-template-columns: 8rem 1fr;
    gap: 1.5rem;
    padding: 1.5rem 0;
    color: var(--abyss-fg);
    isolation: isolate;
    transition:
      transform 600ms $ease-abyss,
      color 600ms $ease-abyss;

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: -1;
      background: linear-gradient(
        90deg,
        color-mix(in srgb, var(--accent-current) 10%, transparent),
        transparent
      );
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 700ms $ease-abyss;
    }

    &:hover {
      color: var(--accent-current);
      transform: translateX(0.5rem);
    }

    &:hover::before {
      transform: scaleX(1);
    }

    &:active {
      transform: translateX(0.5rem) scale(0.99);
    }

    &:focus-visible {
      outline: 2px solid var(--accent-current);
      outline-offset: 4px;
    }
  }

  &__channel-label {
    font-family: $font-display;
    font-size: clamp(1.6rem, 2.2vw, 2.4rem);
    font-weight: 300;
  }

  &__channel-value {
    align-self: center;
    justify-self: end;
    font-family: $font-mono;
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    color: var(--abyss-fg-muted);
  }

  &__foot {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 7rem;
    padding-top: 1.25rem;
    border-top: 1px solid var(--line-current-soft);
    font-family: $font-mono;
    font-size: 0.64rem;
    letter-spacing: 0.12em;
    color: var(--abyss-fg-subtle);
  }

  @media (max-width: 767px) {
    min-height: 110dvh;
    align-items: flex-start;
    padding: 9rem 1.25rem 4rem;

    &__signal {
      display: none;
    }

    &__depth {
      display: none;
    }

    &__channels {
      grid-template-columns: 1fr;
    }

    &__channel {
      grid-template-columns: 7rem 1fr;
    }

    &__channel-value {
      max-width: 12rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

@keyframes signal-rise {
  0% {
    transform: translateY(95vh);
    opacity: 0;
  }

  12%,
  82% {
    opacity: 0.9;
  }

  100% {
    transform: translateY(-8rem);
    opacity: 0;
  }
}
</style>
