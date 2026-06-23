// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from "node:url";
import { platform } from "node:os";

// Windows 上 .output/public 常被杀软/索引器锁住导致 EBUSY，
// 自动改用 .output_build 绕开；其他平台保持默认 .output。
const isWindows = platform() === "win32";
const outputDir =
  process.env.NITRO_OUTPUT_DIR || (isWindows ? ".output_build" : ".output");

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  // 静态站点生成 - 支持 Vercel / Cloudflare Pages / Netlify / GitHub Pages
  // 通过 NITRO_PRESET 环境变量切换目标
  //   NITRO_PRESET=vercel_static        → Vercel
  //   NITRO_PRESET=cloudflare_pages     → Cloudflare Pages
  //   NITRO_PRESET=netlify              → Netlify
  //   NITRO_PRESET=github_pages         → GitHub Pages
  ssr: true,
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ["/"],
      failOnError: false,
    },
    preset: process.env.NITRO_PRESET || "static",
    // 允许通过 NITRO_OUTPUT_DIR 覆盖 .output 目录，便于在
    // Windows 杀软/索引器锁定 .output/public 时绕开 EBUSY。
    output: {
      dir: outputDir,
    },
  },

  modules: ["@unocss/nuxt", "@tresjs/nuxt", "@vueuse/nuxt"],

  components: [
    // 自动扫描，但保留目录前缀 (Sections*) / (Three*)
    { path: "~/components", pathPrefix: true },
  ],

  app: {
    head: {
      htmlAttrs: { lang: "zh-CN" },
      title: "MuShan: Neo-Classical Abyss",
      meta: [
        { charset: "utf-8" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, viewport-fit=cover",
        },
        { name: "theme-color", content: "#F3F6F7" },
        {
          name: "description",
          content:
            "A deep-sea digital exhibition hall. A personal portfolio rendered as the descent into a neo-classical abyss.",
        },
        { name: "color-scheme", content: "light dark" },
      ],
      link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    },
  },

  css: ["@unocss/reset/tailwind-compat.css", "~/assets/styles/index.scss"],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/styles/_tokens.scss" as *;',
          api: "modern-compiler",
        },
      },
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  experimental: {
    payloadExtraction: false,
  },

  alias: {
    "~scss": fileURLToPath(new URL("./assets/styles", import.meta.url)),
  },

  features: {
    inlineStyles: true,
  },
});
