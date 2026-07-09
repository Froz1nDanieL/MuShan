// https://nuxt.com/docs/api/configuration/nuxt-config
import { platform } from "node:os";
import { fileURLToPath } from "node:url";

// On Windows, .output/public can be locked by antivirus or indexing services.
// Use .output_build there while keeping Nuxt's default output elsewhere.
const isWindows = platform() === "win32";
const outputDir =
  process.env.NITRO_OUTPUT_DIR || (isWindows ? ".output_build" : ".output");

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  ssr: true,
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ["/"],
      failOnError: false,
    },
    preset: process.env.NITRO_PRESET || "static",
    output: {
      dir: outputDir,
    },
  },

  modules: ["@unocss/nuxt", "@tresjs/nuxt", "@vueuse/nuxt"],

  components: [
    // Keep directory prefixes for auto-imported section and Three components.
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
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Monsieur+La+Doulaise&display=swap",
        },
      ],
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
