import { onBeforeUnmount, onMounted, readonly, ref } from "vue";

export const ABYSS_STOPS = [
  {
    at: 0,
    hex: "#F3F6F7",
    act: "ACT 01 / THE FACE",
    label: "Cold White Art Gallery",
  },
  {
    at: 0.2,
    hex: "#E9F0F2",
    act: "ACT 02 / THE TIP",
    label: "Ice White Sea Surface",
  },
  {
    at: 0.4,
    hex: "#CFE3EA",
    act: "ACT 03 / INNER DYNAMICS",
    label: "Light Cold Blue",
  },
  {
    at: 0.6,
    hex: "#23465A",
    act: "ACT 04 / THE MASS",
    label: "Deep Sea Blue",
  },
  {
    at: 0.8,
    hex: "#071A26",
    act: "ACT 05 / THE CONTACT",
    label: "Deep Sea Black-Blue",
  },
  {
    at: 1,
    hex: "#02040A",
    act: "ACT 05 / CONTACT TERMINAL",
    label: "Abyss Black",
  },
] as const;

type Rgb = readonly [number, number, number];

const FOREGROUND_ON_LIGHT = hexToRgb("#07111A");
const FOREGROUND_ON_DARK = hexToRgb("#E6EEF2");
const ACCENT_ON_LIGHT = hexToRgb("#2E6D83");
const ACCENT_ON_DARK = hexToRgb("#A7E7FF");

// The background crosses from pale blue to deep blue in this interval.
// A smoothstep avoids a threshold flash while keeping the low-contrast span short.
const FOREGROUND_TRANSITION_START = 0.5;
const FOREGROUND_TRANSITION_END = 0.58;

function clamp01(value: number) {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const progress = clamp01((value - edge0) / (edge1 - edge0 || 1));
  return progress * progress * (3 - 2 * progress);
}

function hexToRgb(hex: string): Rgb {
  const value = hex.replace("#", "");
  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
  ];
}

function rgbToHex([red, green, blue]: Rgb) {
  return (
    "#" +
    [red, green, blue]
      .map((channel) => Math.round(channel).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

function rgbString([red, green, blue]: Rgb) {
  return `rgb(${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)})`;
}

function rgbaString([red, green, blue]: Rgb, alpha: number) {
  return `rgba(${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)}, ${alpha})`;
}

function mixRgb(from: Rgb, to: Rgb, progress: number): Rgb {
  const t = clamp01(progress);
  return [
    from[0] + (to[0] - from[0]) * t,
    from[1] + (to[1] - from[1]) * t,
    from[2] + (to[2] - from[2]) * t,
  ];
}

function resolveBackground(progress: number) {
  const p = clamp01(progress);

  for (let index = 0; index < ABYSS_STOPS.length - 1; index += 1) {
    const from = ABYSS_STOPS[index]!;
    const to = ABYSS_STOPS[index + 1]!;
    if (p > to.at) continue;

    const localProgress = (p - from.at) / (to.at - from.at || 1);
    return {
      color: mixRgb(hexToRgb(from.hex), hexToRgb(to.hex), localProgress),
      act: localProgress < 0.5 ? from.act : to.act,
      label: localProgress < 0.5 ? from.label : to.label,
    };
  }

  const last = ABYSS_STOPS[ABYSS_STOPS.length - 1]!;
  return {
    color: hexToRgb(last.hex),
    act: last.act,
    label: last.label,
  };
}

export function resolveAbyssStop(progress: number) {
  const p = clamp01(progress);
  const background = resolveBackground(p);
  const foregroundProgress = smoothstep(
    FOREGROUND_TRANSITION_START,
    FOREGROUND_TRANSITION_END,
    p,
  );
  const foreground = mixRgb(
    FOREGROUND_ON_LIGHT,
    FOREGROUND_ON_DARK,
    foregroundProgress,
  );
  const accent = mixRgb(
    ACCENT_ON_LIGHT,
    ACCENT_ON_DARK,
    foregroundProgress,
  );

  return {
    rgb: rgbString(background.color),
    hex: rgbToHex(background.color),
    act: background.act,
    label: background.label,
    foreground,
    foregroundRgb: rgbString(foreground),
    foregroundHex: rgbToHex(foreground),
    accentRgb: rgbString(accent),
    textOnLight: foregroundProgress < 0.5,
  };
}

const _hex = ref<string>(ABYSS_STOPS[0].hex);
const _rgb = ref<string>(ABYSS_STOPS[0].hex);
const _act = ref<string>(ABYSS_STOPS[0].act);
const _label = ref<string>(ABYSS_STOPS[0].label);
const _textOnLight = ref(true);
const _progress = ref(0);

let lastApplied = -1;
let refCount = 0;

export function applyAbyssGradient(progress: number) {
  if (typeof window === "undefined") return;

  const p = clamp01(progress);
  if (Math.abs(p - lastApplied) < 0.00035) return;
  lastApplied = p;

  const resolved = resolveAbyssStop(p);
  _hex.value = resolved.hex;
  _rgb.value = resolved.rgb;
  _act.value = resolved.act;
  _label.value = resolved.label;
  _textOnLight.value = resolved.textOnLight;
  _progress.value = p;

  const root = document.documentElement;
  const foreground = resolved.foreground;

  root.style.setProperty("--abyss-bg", resolved.rgb);
  root.style.setProperty("--abyss-fg", resolved.foregroundRgb);
  root.style.setProperty(
    "--abyss-fg-muted",
    rgbaString(foreground, 0.66),
  );
  root.style.setProperty(
    "--abyss-fg-subtle",
    rgbaString(foreground, 0.46),
  );
  root.style.setProperty(
    "--line-current-soft",
    rgbaString(foreground, 0.18),
  );
  root.style.setProperty(
    "--line-current-mid",
    rgbaString(foreground, 0.32),
  );
  root.style.setProperty(
    "--line-current-strong",
    rgbaString(foreground, 0.48),
  );
  root.style.setProperty("--accent-current", resolved.accentRgb);
  root.style.setProperty("--abyss-progress", p.toFixed(4));
  root.style.setProperty(
    "--abyss-text-on-light",
    resolved.textOnLight ? "1" : "0",
  );
  root.style.colorScheme = resolved.textOnLight ? "light" : "dark";
}

export function useAbyssGradient() {
  onMounted(() => {
    refCount += 1;
    if (typeof window === "undefined") return;

    const value = Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--abyss-progress",
      ),
    );
    if (!Number.isNaN(value)) applyAbyssGradient(value);
  });

  onBeforeUnmount(() => {
    refCount = Math.max(0, refCount - 1);
  });

  return {
    hex: readonly(_hex),
    rgb: readonly(_rgb),
    act: readonly(_act),
    label: readonly(_label),
    progress: readonly(_progress),
    textOnLight: readonly(_textOnLight),
  };
}
