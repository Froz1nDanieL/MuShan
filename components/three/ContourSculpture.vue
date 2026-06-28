<template>
  <TresGroup
    ref="groupRef"
    :position="groupPosition"
    :scale="groupScale"
    :visible="visible"
  >
    <primitive :object="portraitGroup" />
  </TresGroup>
</template>

<script setup lang="ts">
import {
  computed,
  markRaw,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import {
  useDevicePixelRatio,
  useMediaQuery,
  useWindowSize,
} from "@vueuse/core";
import { useRenderLoop } from "@tresjs/core";
import { gsap } from "gsap";
import * as THREE from "three";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import faceContourData from "~/assets/data/face-contours.json";
import { useAbyssGradient } from "~/composables/useAbyssGradient";
import { useReducedMotion } from "~/composables/useReducedMotion";

const props = withDefaults(
  defineProps<{
    visible?: boolean;
    scale?: number;
    positionY?: number;
    spinSpeed?: number;
    opacity?: number;
    wireOpacity?: number;
    emissiveIntensity?: number;
    rimIntensity?: number;
  }>(),
  {
    visible: true,
    scale: 1,
    positionY: 0,
    spinSpeed: 0,
    opacity: 1,
    wireOpacity: 0.78,
    emissiveIntensity: 0.05,
    rimIntensity: 0.7,
  },
);

type ContourPath = {
  closed: boolean;
  points: Array<[number, number]>;
};

type ContourPayload = {
  paths: ContourPath[];
};

const INITIAL_Y = -0.1;
const paths = (faceContourData as ContourPayload).paths;
const groupRef = ref<THREE.Group | null>(null);
const reducedMotion = useReducedMotion();
const isMobile = useMediaQuery("(max-width: 767px)");
const isCoarsePointer = useMediaQuery("(pointer: coarse)");
const { width: viewportWidth, height: viewportHeight } = useWindowSize({
  initialWidth: 1440,
  initialHeight: 900,
});
const { pixelRatio } = useDevicePixelRatio();
const { textOnLight } = useAbyssGradient();

const groupPosition = computed<[number, number, number]>(() => [
  0,
  props.positionY,
  0,
]);

const groupScale = computed(() => {
  const responsiveScale = isMobile.value ? 0.66 : 1.1;
  return props.scale * responsiveScale;
});

const lineColor = computed(() =>
  textOnLight.value ? "#536169" : "#DCE7EA",
);

const opacityFactor = computed(() =>
  THREE.MathUtils.clamp(
    props.opacity * (0.84 + props.wireOpacity * 0.16),
    0,
    1,
  ),
);

function createLineMaterial(linewidth: number, opacity: number) {
  return markRaw(
    new LineMaterial({
      color: lineColor.value,
      linewidth,
      transparent: true,
      opacity,
      depthWrite: false,
      depthTest: false,
      toneMapped: false,
      worldUnits: false,
      alphaToCoverage: true,
    }),
  );
}

const frontMaterial = createLineMaterial(1.22, 0.76);
const middleMaterial = createLineMaterial(1.06, 0.62);
const backMaterial = createLineMaterial(0.9, 0.46);
const materials = [frontMaterial, middleMaterial, backMaterial];

const portraitGroup = markRaw(new THREE.Group());
portraitGroup.rotation.order = "YXZ";
portraitGroup.rotation.set(0, 0, -0.008);

const geometries: LineGeometry[] = [];

function flatten(points: readonly THREE.Vector3[]) {
  const positions: number[] = [];
  points.forEach((point) => positions.push(point.x, point.y, point.z));
  return positions;
}

function normalizedPointToWorld([u, v]: [number, number]) {
  const x = (u - 0.5) * 2.46;
  // Keep the geometry centered around its own origin so entrance transforms
  // cannot push the head toward the top edge before layout settles.
  const y = 1.5 - v * 3;
  const normalizedX = THREE.MathUtils.clamp((x - 0.02) / 1.28, -1, 1);
  const dome = Math.sqrt(Math.max(0, 1 - normalizedX * normalizedX));
  const heightFactor = THREE.MathUtils.lerp(
    0.8,
    1,
    THREE.MathUtils.clamp((y + 1.5) / 3, 0, 1),
  );
  const z = dome * 0.5 * heightFactor;
  return new THREE.Vector3(x, y, z);
}

function buildCurvePoints(path: ContourPath) {
  const controls = path.points.map(normalizedPointToWorld);
  if (controls.length < 3) return controls;

  const curve = new THREE.CatmullRomCurve3(
    controls,
    path.closed,
    "centripetal",
    0.46,
  );
  const sampleCount = THREE.MathUtils.clamp(controls.length * 5, 18, 110);
  return curve.getPoints(sampleCount);
}

function averageDepth(points: readonly THREE.Vector3[]) {
  return (
    points.reduce((total, point) => total + point.z, 0) /
    Math.max(1, points.length)
  );
}

function selectMaterial(depth: number) {
  if (depth >= 0.38) return frontMaterial;
  if (depth >= 0.24) return middleMaterial;
  return backMaterial;
}

function addContour(path: ContourPath, index: number) {
  const points = buildCurvePoints(path);
  if (points.length < 2) return;

  const geometry = markRaw(new LineGeometry());
  geometry.setPositions(flatten(points));
  const line = markRaw(new Line2(geometry, selectMaterial(averageDepth(points))));
  line.name = `reference-contour-${index + 1}`;
  line.computeLineDistances();
  line.frustumCulled = false;

  geometries.push(geometry);
  portraitGroup.add(line);
}

paths.forEach(addContour);

function syncMaterials() {
  const widths = isMobile.value
    ? [0.98, 0.86, 0.74]
    : [1.22, 1.06, 0.9];
  const opacities = [0.76, 0.62, 0.46];
  const dpr = Math.min(pixelRatio.value, 1.75);

  materials.forEach((material, index) => {
    material.color.set(lineColor.value);
    material.linewidth = widths[index]!;
    material.opacity = opacities[index]! * opacityFactor.value;
    if (
      Number.isFinite(viewportWidth.value) &&
      Number.isFinite(viewportHeight.value) &&
      viewportWidth.value > 0 &&
      viewportHeight.value > 0
    ) {
      material.resolution.set(
        viewportWidth.value * dpr,
        viewportHeight.value * dpr,
      );
    }
    material.needsUpdate = true;
  });
}

watch(
  [
    lineColor,
    opacityFactor,
    isMobile,
    viewportWidth,
    viewportHeight,
    pixelRatio,
  ],
  syncMaterials,
  { immediate: true },
);

let entranceTimeline: gsap.core.Timeline | null = null;
let entranceFrame = 0;
let targetRotationX = 0.008;
let targetRotationY = INITIAL_Y;
let disposed = false;

function handlePointerMove(event: PointerEvent) {
  if (reducedMotion.value || isCoarsePointer.value || !props.visible) return;
  const normalizedX = event.clientX / window.innerWidth - 0.5;
  const normalizedY = event.clientY / window.innerHeight - 0.5;
  targetRotationY = INITIAL_Y + normalizedX * 0.34;
  targetRotationX = THREE.MathUtils.clamp(normalizedY * 0.1, -0.05, 0.05);
}

function resetPointerTarget() {
  targetRotationX = 0.008;
  targetRotationY = INITIAL_Y;
}

function playEntrance() {
  if (disposed) return;
  entranceTimeline?.kill();

  if (groupRef.value) {
    groupRef.value.rotation.set(0.008, INITIAL_Y, -0.008);
  }

  if (reducedMotion.value) {
    portraitGroup.scale.setScalar(1);
    portraitGroup.rotation.y = 0;
    return;
  }

  portraitGroup.scale.setScalar(0.72);
  portraitGroup.rotation.y = -0.78;
  entranceTimeline = gsap
    .timeline({ defaults: { duration: 1.9, ease: "power4.out" } })
    .to(portraitGroup.scale, { x: 1, y: 1, z: 1 }, 0)
    .to(portraitGroup.rotation, { y: 0 }, 0);
}

onMounted(() => {
  window.addEventListener("pointermove", handlePointerMove, { passive: true });
  window.addEventListener("pointerleave", resetPointerTarget, { passive: true });
  // Let TresCanvas establish its window-sized drawing buffer and camera aspect
  // before the first visible sculpture transform is applied.
  entranceFrame = requestAnimationFrame(() => {
    entranceFrame = requestAnimationFrame(playEntrance);
  });
});

const { onLoop } = useRenderLoop();
onLoop(({ delta }) => {
  if (disposed || !groupRef.value || reducedMotion.value) return;
  const damping = 1 - Math.exp(-delta * 5.2);
  groupRef.value.rotation.y = THREE.MathUtils.lerp(
    groupRef.value.rotation.y,
    targetRotationY,
    damping,
  );
  groupRef.value.rotation.x = THREE.MathUtils.lerp(
    groupRef.value.rotation.x,
    targetRotationX,
    damping,
  );
  groupRef.value.rotation.z = -0.008;
});

onBeforeUnmount(() => {
  disposed = true;
  cancelAnimationFrame(entranceFrame);
  entranceTimeline?.kill();
  entranceTimeline = null;
  window.removeEventListener("pointermove", handlePointerMove);
  window.removeEventListener("pointerleave", resetPointerTarget);
  portraitGroup.clear();
  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => material.dispose());
});
</script>
