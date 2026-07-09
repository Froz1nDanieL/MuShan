import { readonly, ref } from "vue";

const presentationProgress = ref(0);

function clamp01(value: number) {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

export function setPresentationProgress(progress: number) {
  presentationProgress.value = clamp01(progress);
}

export function usePresentationDepth() {
  return {
    progress: readonly(presentationProgress),
    setPresentationProgress,
  };
}
