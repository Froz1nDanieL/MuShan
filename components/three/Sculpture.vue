<template>
  <TresGroup
    ref="groupRef"
    :position="[0, positionY, 0]"
    :scale="scale"
    :visible="visible"
  >
    <!-- 横向等高线管状结构：从二维平面向上突起的 3D 立体效果 -->
    <primitive v-for="(mesh, i) in contourMeshes" :key="i" :object="mesh" />

    <!-- 关键光位（主光 + 边缘光）增强 3D 立体感 -->
    <TresPointLight
      :position="[2.2, 1.2, 2.4]"
      :intensity="0.85 * rimIntensity"
      :color="'#F0F4F6'"
      :distance="6"
      :decay="1.4"
    />
    <TresPointLight
      :position="[-1.8, -0.6, 1.6]"
      :intensity="0.45 * rimIntensity"
      :color="'#6E8FA0'"
      :distance="5"
      :decay="1.6"
    />
    <TresAmbientLight :intensity="0.55" color="#E6EEF2" />
  </TresGroup>
</template>

<script setup lang="ts">
import { ref, shallowRef, onMounted, onBeforeUnmount, watch } from "vue";
import * as THREE from "three";
import { useRenderLoop } from "@tresjs/core";

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
    spinSpeed: 0.16,
    opacity: 1,
    wireOpacity: 0.78,
    emissiveIntensity: 0.06,
    rimIntensity: 0.7,
  },
);

const groupRef = ref<THREE.Group | null>(null);
const contourMeshes = shallowRef<THREE.Mesh[]>([]);

const rotationY = ref(0);
const tiltX = ref(0);

// =============================================================
// 调色：底部深沉 → 顶部冷亮（vertex color 渐变）
// =============================================================
const colorBottom = new THREE.Color(0x1a2530);
const colorMid = new THREE.Color(0x2c3a48);
const colorTop = new THREE.Color(0x4a5560);

const colorBaseBottom = new THREE.Color(0x222d38);
const colorBaseTop = new THREE.Color(0x3a4750);

// Y 范围（用于归一化）
const Y_MIN = -2.2;
const Y_MAX = 1.1;

// =============================================================
// 面部 / 颈部 / 肩部 / 基座的等高线剖面
// =============================================================
interface ContourLevel {
  y: number;
  rx: number;
  rz: number;
  feat: string;
  weight: number;
  tone: "body" | "base";
  // 该层的微 Y 摆动参数（增加"高度不规则"的有机感）
  yAmp: number;
  ySeed: number;
}

const faceProfile: ContourLevel[] = [
  // === 卷发：略宽 + 强噪声 ===
  { y: 1.02, rx: 0.58, rz: 0.56, feat: "hair", weight: 1.0, tone: "body", yAmp: 0.022, ySeed: 0.4 },
  { y: 0.94, rx: 0.66, rz: 0.62, feat: "hair", weight: 1.0, tone: "body", yAmp: 0.018, ySeed: 1.7 },
  { y: 0.86, rx: 0.7, rz: 0.64, feat: "hair", weight: 1.0, tone: "body", yAmp: 0.02, ySeed: 2.9 },
  { y: 0.78, rx: 0.66, rz: 0.62, feat: "hairline", weight: 1.0, tone: "body", yAmp: 0.014, ySeed: 4.1 },
  // === 额头：平滑渐窄 ===
  { y: 0.7, rx: 0.6, rz: 0.6, feat: "forehead", weight: 1.0, tone: "body", yAmp: 0.01, ySeed: 5.3 },
  { y: 0.6, rx: 0.56, rz: 0.59, feat: "forehead", weight: 1.0, tone: "body", yAmp: 0.008, ySeed: 6.5 },
  { y: 0.5, rx: 0.53, rz: 0.58, feat: "forehead", weight: 1.0, tone: "body", yAmp: 0.008, ySeed: 7.7 },
  { y: 0.4, rx: 0.52, rz: 0.58, feat: "brow", weight: 1.0, tone: "body", yAmp: 0.01, ySeed: 8.9 },
  // === 眉骨 / 眼窝 ===
  { y: 0.3, rx: 0.52, rz: 0.58, feat: "brow", weight: 1.0, tone: "body", yAmp: 0.012, ySeed: 0.2 },
  { y: 0.2, rx: 0.5, rz: 0.58, feat: "eyes", weight: 1.0, tone: "body", yAmp: 0.014, ySeed: 1.4 },
  { y: 0.1, rx: 0.5, rz: 0.58, feat: "eyes", weight: 1.0, tone: "body", yAmp: 0.012, ySeed: 2.6 },
  { y: 0.0, rx: 0.5, rz: 0.58, feat: "eyes", weight: 1.0, tone: "body", yAmp: 0.014, ySeed: 3.8 },
  // === 颧骨：两侧外凸 ===
  { y: -0.1, rx: 0.52, rz: 0.58, feat: "cheek", weight: 1.0, tone: "body", yAmp: 0.012, ySeed: 5.0 },
  { y: -0.2, rx: 0.53, rz: 0.58, feat: "cheek", weight: 1.0, tone: "body", yAmp: 0.012, ySeed: 6.2 },
  // === 鼻部：前脸明显凸起 ===
  { y: -0.3, rx: 0.52, rz: 0.58, feat: "nose", weight: 1.05, tone: "body", yAmp: 0.014, ySeed: 7.4 },
  { y: -0.38, rx: 0.5, rz: 0.58, feat: "nose", weight: 1.05, tone: "body", yAmp: 0.012, ySeed: 8.6 },
  // === 嘴部：前脸微凸（唇部） ===
  { y: -0.46, rx: 0.48, rz: 0.56, feat: "mouth", weight: 1.0, tone: "body", yAmp: 0.01, ySeed: 0.7 },
  { y: -0.54, rx: 0.44, rz: 0.54, feat: "mouth", weight: 1.0, tone: "body", yAmp: 0.012, ySeed: 1.9 },
  // === 下颌 / 颏部 ===
  { y: -0.62, rx: 0.4, rz: 0.5, feat: "chin", weight: 1.0, tone: "body", yAmp: 0.014, ySeed: 3.1 },
  { y: -0.7, rx: 0.34, rz: 0.44, feat: "chin", weight: 1.0, tone: "body", yAmp: 0.016, ySeed: 4.3 },
  { y: -0.78, rx: 0.28, rz: 0.38, feat: "chin", weight: 1.0, tone: "body", yAmp: 0.018, ySeed: 5.5 },
  // === 颈部 ===
  { y: -0.86, rx: 0.24, rz: 0.34, feat: "neck", weight: 0.85, tone: "body", yAmp: 0.012, ySeed: 6.7 },
  { y: -0.94, rx: 0.24, rz: 0.32, feat: "neck", weight: 0.85, tone: "body", yAmp: 0.01, ySeed: 7.9 },
  { y: -1.02, rx: 0.24, rz: 0.32, feat: "neck", weight: 0.85, tone: "body", yAmp: 0.01, ySeed: 9.1 },
  { y: -1.1, rx: 0.24, rz: 0.32, feat: "neck", weight: 0.85, tone: "body", yAmp: 0.012, ySeed: 0.3 },
  { y: -1.18, rx: 0.26, rz: 0.34, feat: "neck", weight: 0.85, tone: "body", yAmp: 0.014, ySeed: 1.5 },
  // === 肩部：急剧展宽 ===
  { y: -1.28, rx: 0.4, rz: 0.46, feat: "shoulder", weight: 0.9, tone: "body", yAmp: 0.018, ySeed: 2.7 },
  { y: -1.38, rx: 0.56, rz: 0.6, feat: "shoulder", weight: 0.9, tone: "body", yAmp: 0.016, ySeed: 3.9 },
  { y: -1.48, rx: 0.7, rz: 0.72, feat: "shoulder", weight: 0.9, tone: "body", yAmp: 0.014, ySeed: 5.1 },
  { y: -1.58, rx: 0.8, rz: 0.82, feat: "shoulder", weight: 0.9, tone: "body", yAmp: 0.012, ySeed: 6.3 },
  { y: -1.68, rx: 0.88, rz: 0.9, feat: "shoulder", weight: 0.9, tone: "body", yAmp: 0.012, ySeed: 7.5 },
  // === 基座：稳定展宽 ===
  { y: -1.78, rx: 0.93, rz: 0.95, feat: "base", weight: 0.9, tone: "base", yAmp: 0.01, ySeed: 8.7 },
  { y: -1.86, rx: 0.96, rz: 0.98, feat: "base", weight: 0.9, tone: "base", yAmp: 0.008, ySeed: 0.9 },
  { y: -1.94, rx: 0.98, rz: 1.0, feat: "base", weight: 0.9, tone: "base", yAmp: 0.008, ySeed: 2.1 },
  { y: -2.02, rx: 1.0, rz: 1.02, feat: "base", weight: 0.9, tone: "base", yAmp: 0.006, ySeed: 3.3 },
  { y: -2.1, rx: 1.02, rz: 1.04, feat: "base", weight: 0.9, tone: "base", yAmp: 0.006, ySeed: 4.5 },
  { y: -2.18, rx: 1.04, rz: 1.06, feat: "base", weight: 0.9, tone: "base", yAmp: 0.006, ySeed: 5.7 },
];

/**
 * 给定角度和剖面特征，返回该方向上的实际半径
 * 椭圆基础 + 特征凸凹 + 有机波动
 */
function getFaceRadius(
  y: number,
  angle: number,
  rx: number,
  rz: number,
  feat: string,
): number {
  // 椭圆半径（极坐标公式）
  let r =
    (rx * rz) /
    Math.sqrt(
      (rz * Math.cos(angle)) ** 2 + (rx * Math.sin(angle)) ** 2,
    );

  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);
  const absCos = Math.abs(cosA);
  const absSin = Math.abs(sinA);

  // 鼻部：前脸（cosA > 0.5）显著外凸
  if (feat === "nose") {
    if (cosA > 0.45) {
      r += (cosA - 0.45) * 0.16;
    }
    if (absSin > 0.5) {
      r += (absSin - 0.5) * 0.04;
    }
  }

  // 眉骨：前脸上方微凸
  if (feat === "brow" || feat === "forehead") {
    if (cosA > 0.35) {
      r += (cosA - 0.35) * 0.05;
    }
  }

  // 眼窝：前脸中上部两侧微凹
  if (feat === "eyes") {
    if (cosA > 0.55) {
      r += (cosA - 0.55) * 0.03;
    }
    if (absSin > 0.55 && absSin < 0.85) {
      r -= 0.025;
    }
  }

  // 颧骨：两侧外凸
  if (feat === "cheek") {
    if (absSin > 0.55) {
      r += (absSin - 0.55) * 0.1;
    }
  }

  // 嘴部 / 颏部：前脸渐收
  if (feat === "mouth" || feat === "chin") {
    if (cosA > 0.4) {
      r += (cosA - 0.4) * 0.07;
    }
  }

  // 头发 / 发际线：不规则强波动模拟卷曲
  if (feat === "hair" || feat === "hairline") {
    const curl =
      Math.sin(angle * 6 + y * 4) * 0.05 +
      Math.cos(angle * 11 - y * 3) * 0.03 +
      Math.sin(angle * 17 + y * 7) * 0.018;
    r += curl;
  }

  // 肩部：前胸微凸
  if (feat === "shoulder") {
    if (cosA > 0.3) {
      r += (cosA - 0.3) * 0.08;
    }
  }

  // 全局细微波动：避免曲线过于机械
  r += Math.sin(angle * 3 + y * 5) * 0.006;
  r += Math.cos(angle * 7 - y * 4) * 0.004;

  return r;
}

/**
 * 为单个剖面生成等高线采样点
 * 包含"高度不规则"的有机 Y 摆动
 */
function generateContourPoints(
  y: number,
  rx: number,
  rz: number,
  feat: string,
  yAmp: number,
  ySeed: number,
  numPoints = 96,
): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const r = getFaceRadius(y, angle, rx, rz, feat);
    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;
    // 高度不规则：多频微摆动（让曲线不完美水平）
    const yWave =
      Math.sin(i * 0.31 + ySeed) * yAmp * 0.6 +
      Math.sin(i * 0.73 + ySeed * 2.1) * yAmp * 0.3 +
      Math.cos(i * 1.17 - ySeed * 1.7) * yAmp * 0.15;
    points.push(new THREE.Vector3(x, y + yWave, z));
  }
  return points;
}

/**
 * 为 TubeGeometry 注入基于 Y 位置的渐变顶点色
 * 底部深沉 → 中部过渡 → 顶部冷亮
 */
function addVertexGradient(
  geometry: THREE.TubeGeometry,
  tone: "body" | "base",
): void {
  const positions = geometry.attributes.position;
  const count = positions.count;
  const colors = new Float32Array(count * 3);

  const cBot = tone === "base" ? colorBaseBottom : colorBottom;
  const cTop = tone === "base" ? colorBaseTop : colorTop;
  const cMid = tone === "base" ? new THREE.Color(0x2e3a45) : colorMid;

  const tmpColor = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const y = positions.getY(i);
    const t = Math.max(0, Math.min(1, (y - Y_MIN) / (Y_MAX - Y_MIN)));
    // 双段渐变：底部→中部→顶部（更细腻的过渡）
    if (t < 0.5) {
      tmpColor.lerpColors(cBot, cMid, t * 2);
    } else {
      tmpColor.lerpColors(cMid, cTop, (t - 0.5) * 2);
    }
    colors[i * 3] = tmpColor.r;
    colors[i * 3 + 1] = tmpColor.g;
    colors[i * 3 + 2] = tmpColor.b;
  }
  geometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colors, 3),
  );
}

onMounted(() => {
  const meshes: THREE.Mesh[] = [];

  for (const profile of faceProfile) {
    const points = generateContourPoints(
      profile.y,
      profile.rx,
      profile.rz,
      profile.feat,
      profile.yAmp,
      profile.ySeed,
    );

    // 平滑闭合曲线（centripetal 避免尖角 / 自交）
    const curve = new THREE.CatmullRomCurve3(
      points,
      true,
      "centripetal",
      0.5,
    );

    // 管状几何：从 2D 平面向上突起的 3D 立体感
    // radius 0.004 极细（保留线稿的克制感）
    // radialSegments 5 足够平滑且轻量
    const tubeRadius = profile.tone === "base" ? 0.005 : 0.0042;
    const radialSegments = 5;
    const tubularSegments = Math.min(160, points.length * 1.6);

    const tubeGeometry = new THREE.TubeGeometry(
      curve,
      Math.floor(tubularSegments),
      tubeRadius,
      radialSegments,
      true,
    );

    // 注入渐变顶点色（颜色过渡）
    addVertexGradient(tubeGeometry, profile.tone);

    // MeshStandardMaterial 接收光照，产生 3D 阴影与边缘光
    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.55,
      metalness: 0.12,
      transparent: true,
      opacity: props.wireOpacity * profile.weight,
      depthWrite: false,
      flatShading: false,
    });

    const mesh = new THREE.Mesh(tubeGeometry, material);
    mesh.frustumCulled = false;
    mesh.castShadow = false; // 雕塑自身不投影（避免自阴影噪点）
    mesh.receiveShadow = false;
    meshes.push(mesh);
  }

  contourMeshes.value = meshes;
});

onBeforeUnmount(() => {
  for (const mesh of contourMeshes.value) {
    mesh.geometry.dispose();
    (mesh.material as THREE.Material).dispose();
  }
  contourMeshes.value = [];
});

// opacity 响应 props 变化
watch(
  () => props.wireOpacity,
  (newOpacity) => {
    for (let i = 0; i < contourMeshes.value.length; i++) {
      const mesh = contourMeshes.value[i];
      const profile = faceProfile[i];
      if (profile) {
        (mesh.material as THREE.MeshStandardMaterial).opacity =
          newOpacity * profile.weight;
      }
    }
  },
);

// 动画：极缓 Y 自转 + 微微 X 倾斜（让等高线呈现微 3D 透视）
const { onLoop } = useRenderLoop();
let disposed = false;
onLoop(({ delta }) => {
  if (disposed) return;
  rotationY.value += props.spinSpeed * delta * 0.6;
  tiltX.value = Math.sin(rotationY.value * 0.5) * 0.08;
  if (groupRef.value) {
    groupRef.value.rotation.set(tiltX.value, rotationY.value, 0);
  }
});
onBeforeUnmount(() => {
  disposed = true;
});
</script>
