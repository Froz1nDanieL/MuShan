import {
  defineConfig,
  presetUno,
  presetAttributify,
  presetIcons,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

// UnoCSS 配置 - 不使用 Tailwind。
// 这里只承担"原子化布局 / 间距 / 响应式 / 少量工具类"职责；
// 复杂视觉全部走 CSS Variables + SCSS，避免模板感。
export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: false,
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  theme: {
    breakpoints: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    colors: {
      // 主题色与 design token 同步，确保 utility 与 CSS Variables 不脱节
      void: "var(--color-void)",
      abyss: "var(--color-abyss)",
      depth: "var(--color-depth)",
      frost: "var(--color-frost)",
      ice: "var(--color-ice)",
      glacier: "var(--color-glacier)",
      steel: "var(--color-steel-blue)",
      marble: "var(--color-marble)",
      stone: "var(--color-stone)",
      signal: "var(--color-signal)",
      cyan: "var(--color-cyan-dim)",
    },
    fontFamily: {
      display: "var(--font-display)",
      sans: "var(--font-sans)",
      serif: "var(--font-serif)",
      mono: "var(--font-mono)",
    },
  },
  shortcuts: {
    "line-soft": "border border-[var(--line-soft)]",
    "line-mid": "border border-[var(--line-mid)]",
    "line-strong": "border border-[var(--line-strong)]",
    panel:
      "bg-[var(--panel-bg)] backdrop-blur-xl border border-[var(--panel-border)]",
    "panel-deep":
      "bg-[var(--panel-bg-deep)] backdrop-blur-2xl border border-[var(--panel-border)]",
    eyebrow:
      "font-mono text-[10.5px] uppercase tracking-[0.22em] text-[var(--color-glacier)]",
  },
  safelist: ["panel", "panel-deep", "eyebrow"],
});
