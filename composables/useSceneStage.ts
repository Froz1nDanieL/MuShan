import { computed, readonly, ref } from "vue";

/**
 * Single source of truth for the fixed-stage presentation.
 *
 * sculpture     -> ACT 01, classical line sculpture entry
 * revealing-tip -> ACT 02 title/reveal transition
 * tip           -> ACT 02, iceberg surface/submerged states
 * descending    -> ACT 03, inner dynamics
 * underwater    -> ACT 04, project mass
 * signal        -> ACT 05, contact terminal
 *
 * The public stage name "signal" is kept for compatibility with existing
 * components, but all user-facing copy now presents ACT 05 as Contact.
 */
export type SceneStage =
  | "sculpture"
  | "revealing-tip"
  | "tip"
  | "descending"
  | "underwater"
  | "signal";

export const STAGE_ORDER: readonly SceneStage[] = [
  "sculpture",
  "revealing-tip",
  "tip",
  "descending",
  "underwater",
  "signal",
] as const;

const stage = ref<SceneStage>("sculpture");

const canScroll = computed(() =>
  ["tip", "descending", "underwater", "signal"].includes(stage.value),
);

const isTransitioning = computed(() => stage.value === "revealing-tip");

export function useSceneStage() {
  function setStage(next: SceneStage) {
    if (stage.value === next) return;
    stage.value = next;
  }

  function enterReveal() {
    if (stage.value !== "sculpture") return;
    setStage("revealing-tip");
  }

  function finishReveal() {
    if (stage.value !== "revealing-tip") return;
    setStage("tip");
  }

  function enterDescending() {
    if (stage.value === "tip") setStage("descending");
  }

  function enterUnderwater() {
    if (stage.value === "descending" || stage.value === "tip") {
      setStage("underwater");
    }
  }

  function enterSignal() {
    setStage("signal");
  }

  function reset() {
    setStage("sculpture");
  }

  return {
    stage: readonly(stage),
    canScroll: readonly(canScroll),
    isTransitioning: readonly(isTransitioning),
    setStage,
    enterReveal,
    finishReveal,
    enterDescending,
    enterUnderwater,
    enterSignal,
    reset,
  };
}
