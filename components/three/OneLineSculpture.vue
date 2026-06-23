<template>
  <TresGroup
    ref="groupRef"
    :position="groupPosition"
    :scale="groupScale"
    :visible="visible"
  >
    <primitive :object="portraitLine" />
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
import { useMediaQuery } from "@vueuse/core";
import { useRenderLoop } from "@tresjs/core";
import { gsap } from "gsap";
import * as THREE from "three";
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
    spinSpeed: 0.035,
    opacity: 1,
    wireOpacity: 0.22,
    emissiveIntensity: 0.05,
    rimIntensity: 0.6,
  },
);

type PointTuple = readonly [number, number, number];

const groupRef = ref<THREE.Group | null>(null);
const reducedMotion = useReducedMotion();
const isMobile = useMediaQuery("(max-width: 767px)");
const { textOnLight } = useAbyssGradient();

const groupPosition = computed<[number, number, number]>(() => [
  isMobile.value ? 0.55 : 0.72,
  props.positionY + (isMobile.value ? 1.05 : 0.15),
  0,
]);

const groupScale = computed(() => {
  const responsiveScale = isMobile.value ? 0.5 : 1;
  return props.scale * responsiveScale;
});

const lineColor = computed(() =>
  textOnLight.value ? "#31424A" : "#DCE7EA",
);

const lineOpacity = computed(() =>
  THREE.MathUtils.clamp(
    props.opacity * (0.78 + props.wireOpacity * 0.34),
    0,
    1,
  ),
);

function vector([x, y, z]: PointTuple) {
  return new THREE.Vector3(x, y, z);
}

function appendPath(target: THREE.Vector3[], points: readonly PointTuple[]) {
  points.forEach((point) => target.push(vector(point)));
}

function appendEllipse(
  target: THREE.Vector3[],
  center: PointTuple,
  radiusX: number,
  radiusY: number,
  depth: number,
  startAngle: number,
  turns: number,
  segments: number,
) {
  const [cx, cy, cz] = center;
  for (let i = 0; i <= segments; i++) {
    const progress = i / segments;
    const angle = startAngle + progress * Math.PI * 2 * turns;
    target.push(
      new THREE.Vector3(
        cx + Math.cos(angle) * radiusX,
        cy + Math.sin(angle) * radiusY,
        cz + Math.sin(angle) * depth,
      ),
    );
  }
}

function appendCurl(
  target: THREE.Vector3[],
  center: PointTuple,
  radiusX: number,
  radiusY: number,
  turns: number,
  phase: number,
  segments = 18,
) {
  const [cx, cy, cz] = center;
  for (let i = 0; i <= segments; i++) {
    const progress = i / segments;
    const angle = phase + progress * Math.PI * 2 * turns;
    const radius = 1 - progress * 0.3;
    target.push(
      new THREE.Vector3(
        cx + Math.cos(angle) * radiusX * radius,
        cy + Math.sin(angle) * radiusY * radius,
        cz + Math.sin(angle * 0.72) * 0.09,
      ),
    );
  }
}

function buildPortraitPath() {
  const points: THREE.Vector3[] = [];

  appendEllipse(
    points,
    [0, -2.36, -0.28],
    0.96,
    0.13,
    0.1,
    Math.PI,
    1,
    28,
  );

  appendPath(points, [
    [-0.78, -2.18, -0.22],
    [-0.68, -2.04, -0.18],
  ]);

  appendEllipse(
    points,
    [0, -2.02, -0.2],
    0.72,
    0.11,
    0.09,
    Math.PI,
    1,
    24,
  );

  appendPath(points, [
    [-0.57, -1.87, -0.16],
    [-0.51, -1.68, -0.12],
  ]);

  appendEllipse(
    points,
    [0, -1.64, -0.16],
    0.59,
    0.09,
    0.07,
    Math.PI,
    1,
    22,
  );

  appendPath(points, [
    [-0.58, -1.55, -0.16],
    [-1.02, -1.42, -0.22],
    [-1.48, -1.16, -0.34],
    [-1.22, -0.98, -0.16],
    [-0.83, -0.84, 0.02],
    [-0.57, -0.61, 0.18],
    [-0.5, -0.38, 0.38],
    [-0.63, -0.18, 0.52],
    [-0.73, -0.05, 0.61],
    [-0.57, 0.03, 0.67],
    [-0.34, 0.01, 0.61],
    [-0.21, -0.04, 0.52],
    [-0.31, 0.09, 0.61],
    [-0.5, 0.16, 0.69],
    [-0.72, 0.12, 0.71],
    [-0.8, 0.03, 0.66],
    [-0.64, 0.23, 0.69],
    [-0.73, 0.32, 0.7],
    [-0.92, 0.41, 0.76],
    [-0.78, 0.53, 0.75],
    [-0.61, 0.59, 0.7],
    [-0.55, 0.78, 0.65],
    [-0.48, 1.02, 0.58],
    [-0.64, 1.15, 0.46],
    [-0.87, 1.16, 0.37],
    [-1.02, 1.08, 0.31],
    [-0.91, 0.97, 0.35],
    [-0.71, 0.94, 0.42],
    [-0.53, 1.01, 0.51],
    [-0.39, 1.13, 0.57],
    [-0.16, 1.17, 0.53],
    [0.06, 1.16, 0.44],
    [0.27, 1.08, 0.33],
    [0.13, 0.97, 0.39],
    [-0.08, 0.94, 0.48],
    [-0.29, 1.02, 0.56],
    [-0.12, 1.24, 0.46],
    [0.12, 1.31, 0.34],
    [0.34, 1.27, 0.21],
    [0.46, 1.14, 0.1],
    [0.44, 1.43, 0.02],
    [0.29, 1.62, 0.01],
  ]);

  const curls = [
    { center: [0.22, 1.68, 0.02] as PointTuple, rx: 0.27, ry: 0.2 },
    { center: [-0.14, 1.78, 0.08] as PointTuple, rx: 0.29, ry: 0.22 },
    { center: [-0.52, 1.71, 0.06] as PointTuple, rx: 0.3, ry: 0.23 },
    { center: [-0.83, 1.56, -0.01] as PointTuple, rx: 0.26, ry: 0.22 },
    { center: [-0.75, 1.92, -0.1] as PointTuple, rx: 0.31, ry: 0.25 },
    { center: [-0.39, 2.12, -0.18] as PointTuple, rx: 0.32, ry: 0.24 },
    { center: [0.02, 2.19, -0.24] as PointTuple, rx: 0.34, ry: 0.25 },
    { center: [0.43, 2.1, -0.29] as PointTuple, rx: 0.33, ry: 0.25 },
    { center: [0.76, 1.91, -0.33] as PointTuple, rx: 0.31, ry: 0.24 },
    { center: [0.95, 1.61, -0.31] as PointTuple, rx: 0.28, ry: 0.23 },
    { center: [0.98, 1.32, -0.25] as PointTuple, rx: 0.24, ry: 0.2 },
  ];

  curls.forEach((curl, index) => {
    appendCurl(
      points,
      curl.center,
      curl.rx,
      curl.ry,
      0.92,
      index * 1.12 + 0.45,
    );
  });

  appendPath(points, [
    [0.91, 1.14, -0.16],
    [0.99, 1.01, -0.08],
  ]);

  appendEllipse(
    points,
    [0.9, 0.82, -0.06],
    0.22,
    0.36,
    0.1,
    Math.PI * 0.35,
    1,
    26,
  );

  appendCurl(points, [0.88, 0.82, 0.02], 0.11, 0.2, 0.82, 0.2, 16);

  appendPath(points, [
    [0.78, 0.55, 0.1],
    [0.66, 0.25, 0.18],
    [0.58, -0.05, 0.22],
    [0.43, -0.31, 0.23],
    [0.2, -0.49, 0.25],
    [-0.08, -0.58, 0.25],
    [0.16, -0.72, 0.09],
    [0.35, -0.96, -0.04],
    [0.49, -1.24, -0.16],
    [0.87, -1.38, -0.2],
    [1.43, -1.16, -0.34],
    [1.17, -1.48, -0.24],
    [0.65, -1.62, -0.15],
    [0.56, -1.7, -0.13],
  ]);

  appendEllipse(
    points,
    [0, -1.72, -0.15],
    0.61,
    0.09,
    0.07,
    0,
    0.5,
    14,
  );

  return points;
}

const portraitPath = buildPortraitPath();
const portraitCurve = new THREE.CatmullRomCurve3(
  portraitPath,
  false,
  "centripetal",
  0.5,
);
const sampledPoints = portraitCurve.getPoints(1800);
const positions = new Float32Array(sampledPoints.length * 3);

sampledPoints.forEach((point, index) => {
  positions[index * 3] = point.x;
  positions[index * 3 + 1] = point.y;
  positions[index * 3 + 2] = point.z;
});

const lineGeometry = markRaw(new THREE.BufferGeometry());
lineGeometry.setAttribute(
  "position",
  markRaw(new THREE.BufferAttribute(positions, 3)),
);
const lineMaterial = markRaw(new THREE.LineBasicMaterial({
  color: lineColor.value,
  transparent: true,
  opacity: lineOpacity.value,
  depthTest: true,
  depthWrite: false,
  toneMapped: false,
}));
const portraitLine = markRaw(new THREE.Line(lineGeometry, lineMaterial));
portraitLine.frustumCulled = false;

watch(
  [lineColor, lineOpacity],
  ([color, opacity]) => {
    lineMaterial.color.set(color);
    lineMaterial.opacity = opacity;
    lineMaterial.needsUpdate = true;
  },
  { immediate: true },
);

const drawState = { count: 0 };
let drawTween: gsap.core.Tween | null = null;
let disposed = false;
let elapsed = 0;

function revealLine() {
  const total = sampledPoints.length;
  drawTween?.kill();

  if (reducedMotion.value) {
    lineGeometry.setDrawRange(0, total);
    return;
  }

  drawState.count = 0;
  lineGeometry.setDrawRange(0, 0);
  drawTween = gsap.to(drawState, {
    count: total,
    duration: 4.6,
    ease: "power3.inOut",
    onUpdate: () => {
      lineGeometry.setDrawRange(0, Math.floor(drawState.count));
    },
  });
}

onMounted(() => {
  requestAnimationFrame(() => revealLine());
});

const { onLoop } = useRenderLoop();
onLoop(({ delta }) => {
  if (disposed || !groupRef.value || reducedMotion.value) return;

  elapsed += delta;
  const targetY =
    -0.12 +
    Math.sin(elapsed * 0.24) * 0.055 +
    elapsed * props.spinSpeed * 0.08;
  const targetX = 0.015 + Math.sin(elapsed * 0.18) * 0.012;

  groupRef.value.rotation.y = THREE.MathUtils.lerp(
    groupRef.value.rotation.y,
    targetY,
    Math.min(1, delta * 1.8),
  );
  groupRef.value.rotation.x = THREE.MathUtils.lerp(
    groupRef.value.rotation.x,
    targetX,
    Math.min(1, delta * 1.4),
  );
  groupRef.value.rotation.z = -0.018;
});

onBeforeUnmount(() => {
  disposed = true;
  drawTween?.kill();
  drawTween = null;
  lineGeometry.dispose();
  lineMaterial.dispose();
});
</script>
