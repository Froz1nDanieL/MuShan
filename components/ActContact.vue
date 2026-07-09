<template>
  <section
    id="contact"
    class="act-contact"
    :data-stage="stage"
    data-depth-section
    aria-label="Contact transmission channels"
  >
    <p class="act-contact__status" aria-live="polite">
      {{ statusMessage }}
    </p>

    <div class="act-contact__field" aria-hidden="true">
      <span class="act-contact__field-line act-contact__field-line--horizontal" />
      <span class="act-contact__field-line act-contact__field-line--vertical" />
      <span class="act-contact__field-ring act-contact__field-ring--outer" />
      <span class="act-contact__field-ring act-contact__field-ring--middle" />
      <span class="act-contact__field-ring act-contact__field-ring--inner" />
      <span class="act-contact__field-core" />
    </div>

    <div class="act-contact__inner">
      <p class="act-contact__kicker">Transmission terminal</p>

      <div class="act-contact__nodes" aria-label="Contact methods">
        <article
          v-for="(channel, index) in channels"
          :key="channel.id"
          class="act-contact__node"
          :class="[
            `act-contact__node--${channel.id}`,
            { 'act-contact__node--copied': copiedId === channel.id },
          ]"
          :style="{ '--node-index': index }"
        >
          <button
            class="act-contact__channel"
            type="button"
            :aria-label="`Copy ${channel.label}: ${channel.value}`"
            @click="copyChannel(channel)"
          >
            <span class="act-contact__channel-meta">
              <span>{{ channel.code }}</span>
              <span>{{ copiedId === channel.id ? "COPIED" : "COPY" }}</span>
            </span>
            <span class="act-contact__channel-label">{{ channel.label }}</span>
            <span class="act-contact__channel-value">{{ channel.value }}</span>
          </button>

          <a
            v-if="channel.href"
            class="act-contact__action"
            :href="channel.href"
            :aria-label="`${channel.actionLabel} ${channel.value}`"
          >
            {{ channel.actionLabel }}
          </a>
        </article>
      </div>

      <footer class="act-contact__foot" aria-label="Contact note">
        <span>Four channels held at depth.</span>
        <span>Copy a channel, then surface when ready.</span>
      </footer>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { useSceneStage } from "~/composables/useSceneStage";

type ContactChannel = {
  id: "email" | "phone" | "qq" | "wechat";
  code: string;
  label: string;
  value: string;
  copyValue: string;
  href?: string;
  actionLabel?: string;
};

const { stage } = useSceneStage();

const channels: ContactChannel[] = [
  {
    id: "email",
    code: "CH 01",
    label: "Email",
    value: "daniel_rap_spear@163.com",
    copyValue: "daniel_rap_spear@163.com",
    href: "mailto:daniel_rap_spear@163.com",
    actionLabel: "MAIL",
  },
  {
    id: "phone",
    code: "CH 02",
    label: "Phone",
    value: "+86 13533924519",
    copyValue: "+86 13533924519",
    href: "tel:+8613533924519",
    actionLabel: "CALL",
  },
  {
    id: "qq",
    code: "CH 03",
    label: "QQ",
    value: "1759470244",
    copyValue: "1759470244",
  },
  {
    id: "wechat",
    code: "CH 04",
    label: "WeChat",
    value: "Froz1n_DanieL",
    copyValue: "Froz1n_DanieL",
  },
];

const copiedId = ref<ContactChannel["id"] | null>(null);
let copiedTimer: ReturnType<typeof window.setTimeout> | undefined;

const statusMessage = computed(() => {
  if (!copiedId.value) return "Contact terminal ready.";
  const copiedChannel = channels.find((channel) => channel.id === copiedId.value);
  return copiedChannel ? `${copiedChannel.label} copied.` : "Copied.";
});

async function copyChannel(channel: ContactChannel) {
  try {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(channel.copyValue);
      } catch {
        copyWithFallback(channel.copyValue);
      }
    } else {
      copyWithFallback(channel.copyValue);
    }

    copiedId.value = channel.id;
    window.clearTimeout(copiedTimer);
    copiedTimer = window.setTimeout(() => {
      copiedId.value = null;
    }, 1800);
  } catch {
    copiedId.value = null;
  }
}

function copyWithFallback(value: string) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-999px";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

onBeforeUnmount(() => {
  window.clearTimeout(copiedTimer);
});
</script>

<style lang="scss" scoped>
.act-contact {
  position: relative;
  display: grid;
  min-height: 100dvh;
  place-items: center;
  overflow: hidden;
  padding: clamp(5.2rem, 9vh, 7.5rem) clamp(2rem, 7vw, 7rem)
    clamp(5.6rem, 9vh, 7.8rem);
  color: var(--abyss-fg);
  isolation: isolate;

  &::before {
    content: "";
    position: absolute;
    inset: 10% 9% 9%;
    z-index: -2;
    background:
      radial-gradient(
        circle at 50% 48%,
        color-mix(in srgb, var(--accent-current) 9%, transparent) 0%,
        transparent 28%
      ),
      radial-gradient(
        circle at 16% 80%,
        color-mix(in srgb, var(--color-depth-blue, #23465a) 12%, transparent) 0%,
        transparent 34%
      );
    opacity: 0.64;
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background:
      linear-gradient(
        90deg,
        transparent 0%,
        color-mix(in srgb, var(--line-current-soft) 48%, transparent) 50%,
        transparent 100%
      ),
      linear-gradient(
        180deg,
        transparent 0%,
        color-mix(in srgb, var(--line-current-soft) 34%, transparent) 50%,
        transparent 100%
      );
    opacity: 0.22;
    mask-image: radial-gradient(circle at center, black 0 30%, transparent 62%);
    pointer-events: none;
  }

  &__status {
    position: fixed;
    width: 1px;
    height: 1px;
    margin: -1px;
    clip: rect(0 0 0 0);
    overflow: hidden;
    white-space: nowrap;
  }

  &__field {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 0;
    width: clamp(18rem, 34vw, 35rem);
    aspect-ratio: 1;
    transform: translate(-50%, -50%);
    pointer-events: none;
    opacity: 0;
    animation: contact-core-in 1100ms $ease-abyss forwards;
  }

  &__field-line {
    position: absolute;
    top: 50%;
    left: 50%;
    background: color-mix(in srgb, var(--line-current-mid) 48%, transparent);
    transform: translate(-50%, -50%);
  }

  &__field-line--horizontal {
    width: 118%;
    height: 1px;
  }

  &__field-line--vertical {
    width: 1px;
    height: 118%;
  }

  &__field-ring,
  &__field-core {
    position: absolute;
    border-radius: 999px;
    transform: translate(-50%, -50%);
  }

  &__field-ring {
    top: 50%;
    left: 50%;
    border: 1px solid color-mix(in srgb, var(--line-current-mid) 24%, transparent);
  }

  &__field-ring--outer {
    width: 100%;
    height: 100%;
    opacity: 0.22;
    animation: contact-ring-breathe 7s $ease-fluid infinite alternate;
  }

  &__field-ring--middle {
    width: 63%;
    height: 63%;
    opacity: 0.26;
  }

  &__field-ring--inner {
    width: 28%;
    height: 28%;
    opacity: 0.34;
  }

  &__field-core {
    top: 50%;
    left: 50%;
    width: 0.48rem;
    height: 0.48rem;
    background: color-mix(in srgb, var(--accent-current) 58%, var(--abyss-fg) 42%);
    box-shadow: 0 0 1.15rem color-mix(in srgb, var(--accent-current) 24%, transparent);
  }

  &__inner {
    position: relative;
    z-index: 1;
    width: min(100%, 82rem);
    min-height: min(62vh, 39rem);
  }

  &__kicker {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: 0;
    font-family: $font-mono;
    font-size: clamp(0.58rem, 0.72vw, 0.68rem);
    line-height: 1;
    letter-spacing: 0.22em;
    color: var(--abyss-fg-subtle);
    text-transform: uppercase;
    transform: translate(-50%, calc(-50% + clamp(3.8rem, 7vw, 6.8rem)));
    pointer-events: none;
  }

  &__nodes {
    position: absolute;
    inset: 0;
  }

  &__node {
    --node-x: 0rem;
    --node-y: -0.3rem;
    --node-width: 26rem;

    position: absolute;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 0.8rem;
    width: min(var(--node-width), 38vw);
    opacity: 0;
    transform: translate3d(var(--node-x), calc(var(--node-y) + 0.9rem), 0);
    animation: contact-node-in 950ms $ease-abyss forwards;
    animation-delay: calc(220ms + var(--node-index) * 90ms);
  }

  &__node--email {
    --node-x: -0.22rem;
    --node-y: -0.45rem;
    --node-width: 34rem;

    top: 16%;
    left: 3%;
  }

  &__node--phone {
    --node-x: 0.18rem;
    --node-y: -0.25rem;
    --node-width: 28rem;

    right: 6%;
    bottom: 17%;
  }

  &__node--qq {
    --node-x: -0.16rem;
    --node-y: 0.24rem;
    --node-width: 21rem;

    left: 12%;
    bottom: 14%;
  }

  &__node--wechat {
    --node-x: 0.2rem;
    --node-y: 0.15rem;
    --node-width: 23rem;

    top: 20%;
    right: 10%;
  }

  &__channel {
    position: relative;
    display: grid;
    width: 100%;
    gap: 0.68rem;
    padding: 0.1rem 0 0.92rem;
    border: 0;
    border-bottom: 1px solid color-mix(in srgb, var(--line-current-mid) 82%, transparent);
    background: transparent;
    color: var(--abyss-fg);
    text-align: left;
    cursor: copy;
    isolation: isolate;
    transition:
      color 620ms $ease-fluid,
      opacity 620ms $ease-fluid,
      transform 620ms $ease-fluid,
      border-color 620ms $ease-fluid;
  }

  &__channel::before,
  &__channel::after {
    content: "";
    position: absolute;
    right: 0;
    bottom: -1px;
    left: 0;
    height: 1px;
    pointer-events: none;
    transform-origin: left;
  }

  &__channel::before {
    background: color-mix(in srgb, var(--accent-current) 55%, transparent);
    transform: scaleX(0);
    transition: transform 760ms $ease-fluid;
  }

  &__channel::after {
    background: linear-gradient(
      90deg,
      transparent,
      color-mix(in srgb, var(--accent-current) 70%, transparent),
      transparent
    );
    opacity: 0;
    transform: translateX(-18%) scaleX(0.26);
  }

  &__node--copied &__channel::after {
    animation: contact-scan 900ms $ease-fluid;
  }

  &__channel:hover,
  &__channel:focus-visible {
    color: color-mix(in srgb, var(--abyss-fg) 86%, var(--accent-current) 14%);
    border-color: color-mix(in srgb, var(--accent-current) 42%, transparent);
    transform: translate3d(0, -0.18rem, 0);
  }

  &__channel:hover::before,
  &__channel:focus-visible::before {
    transform: scaleX(1);
  }

  &__channel:active {
    transform: translate3d(0, -0.04rem, 0) scale(0.992);
  }

  &__channel:focus-visible,
  &__action:focus-visible {
    outline: 1px solid var(--accent-current);
    outline-offset: 0.4rem;
  }

  &__channel-meta {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    font-family: $font-mono;
    font-size: clamp(0.52rem, 0.66vw, 0.62rem);
    line-height: 1;
    letter-spacing: 0.2em;
    color: var(--abyss-fg-subtle);
    text-transform: uppercase;
  }

  &__channel-label {
    font-family: $font-display;
    font-size: clamp(2.2rem, 4vw, 4.45rem);
    font-weight: 300;
    line-height: 0.84;
    letter-spacing: -0.045em;
  }

  &__channel-value {
    max-width: 100%;
    overflow: hidden;
    font-family: $font-mono;
    font-size: clamp(0.72rem, 0.88vw, 0.9rem);
    line-height: 1.5;
    letter-spacing: 0.045em;
    color: var(--abyss-fg-muted);
    text-overflow: ellipsis;
    white-space: nowrap;
    transition:
      color 620ms $ease-fluid,
      opacity 620ms $ease-fluid;
  }

  &__channel:hover &__channel-value,
  &__channel:focus-visible &__channel-value {
    color: var(--abyss-fg);
    opacity: 0.96;
  }

  &__action {
    align-self: end;
    justify-self: end;
    padding: 0.35rem 0.05rem 0.98rem;
    border-bottom: 1px solid color-mix(in srgb, var(--accent-current) 32%, transparent);
    color: var(--abyss-fg-muted);
    font-family: $font-mono;
    font-size: clamp(0.54rem, 0.68vw, 0.64rem);
    line-height: 1;
    letter-spacing: 0.2em;
    text-decoration: none;
    transition:
      color 620ms $ease-fluid,
      border-color 620ms $ease-fluid,
      transform 620ms $ease-fluid;
  }

  &__action:hover {
    border-color: color-mix(in srgb, var(--accent-current) 72%, transparent);
    color: var(--accent-current);
    transform: translate3d(0.22rem, -0.12rem, 0);
  }

  &__foot {
    position: absolute;
    right: clamp(0rem, 4vw, 3rem);
    bottom: max(0rem, env(safe-area-inset-bottom));
    display: flex;
    gap: clamp(1rem, 2.6vw, 2.8rem);
    max-width: min(34rem, 45vw);
    margin: 0;
    font-family: $font-mono;
    font-size: clamp(0.54rem, 0.68vw, 0.64rem);
    line-height: 1.7;
    letter-spacing: 0.16em;
    color: var(--abyss-fg-subtle);
    text-transform: uppercase;
    pointer-events: none;
  }

  @media (max-width: 1024px) {
    padding-right: clamp(3rem, 8vw, 5rem);
    padding-left: clamp(3rem, 8vw, 5rem);

    &__inner {
      min-height: 68vh;
    }

    &__node {
      width: min(var(--node-width), 44vw);
    }

    &__node--email {
      left: 0;
    }

    &__node--wechat {
      right: 2%;
    }

    &__node--phone {
      right: 2%;
    }
  }

  @media (max-width: 767px) {
    align-items: start;
    padding: 6.7rem 1.55rem 5.8rem;

    &::after {
      opacity: 0.2;
    }

    &__field {
      top: 44%;
      width: min(82vw, 24rem);
      opacity: 0.42;
    }

    &__inner {
      width: 100%;
      min-height: auto;
    }

    &__kicker {
      position: relative;
      top: auto;
      left: auto;
      margin: 0 0 2.8rem;
      transform: none;
    }

    &__nodes {
      position: relative;
      display: grid;
      gap: 1.35rem;
    }

    &__node,
    &__node--email,
    &__node--phone,
    &__node--qq,
    &__node--wechat {
      --node-x: 0rem;
      --node-y: 0rem;
      --node-width: 100%;

      position: relative;
      top: auto;
      right: auto;
      bottom: auto;
      left: auto;
      width: 100%;
    }

    &__channel {
      padding-bottom: 0.84rem;
    }

    &__channel-label {
      font-size: clamp(2.25rem, 15vw, 4rem);
    }

    &__channel-value {
      white-space: normal;
      word-break: break-word;
    }

    &__foot {
      position: relative;
      right: auto;
      bottom: auto;
      display: grid;
      max-width: none;
      margin-top: 2.6rem;
      padding-right: 7rem;
    }
  }
}

@keyframes contact-core-in {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.96);
  }

  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes contact-node-in {
  from {
    opacity: 0;
    transform: translate3d(var(--node-x), calc(var(--node-y) + 0.9rem), 0);
  }

  to {
    opacity: 1;
    transform: translate3d(var(--node-x), var(--node-y), 0);
  }
}

@keyframes contact-ring-breathe {
  from {
    opacity: 0.18;
    transform: translate(-50%, -50%) scale(0.982);
  }

  to {
    opacity: 0.34;
    transform: translate(-50%, -50%) scale(1.018);
  }
}

@keyframes contact-scan {
  0% {
    opacity: 0;
    transform: translateX(-24%) scaleX(0.18);
  }

  38% {
    opacity: 0.72;
  }

  100% {
    opacity: 0;
    transform: translateX(74%) scaleX(0.34);
  }
}

@media (prefers-reduced-motion: reduce) {
  .act-contact {
    &__field,
    &__field-ring--outer,
    &__node,
    &__node--copied .act-contact__channel::after {
      animation: none;
    }

    &__field,
    &__node {
      opacity: 1;
    }

    &__field {
      transform: translate(-50%, -50%);
    }

    &__node {
      transform: translate3d(var(--node-x, 0), var(--node-y, 0), 0);
    }
  }
}
</style>
