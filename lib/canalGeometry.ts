import * as THREE from "three";
import type { CanalId } from "./types";

/**
 * Single source of truth for the semicircular-canal labyrinth geometry.
 *
 * Coordinate frame for one (right) ear, centered on the vestibule:
 *   X+ = lateral (out to the side)
 *   Y+ = superior (up)
 *   Z+ = anterior (front of the head)
 *
 * Every canal is authored as a compact, slightly irregular loop that begins
 * and ends near the vestibule (t=0 = ampullated end, t=1 = non-ampullated
 * end feeding the common crus for the vertical canals). The loop lies in an
 * anatomical plane (defined by a normal vector) so the three canals read as
 * occupying three different 3D planes rather than three parallel rings.
 */

export interface CanalGeometryOptions {
  radius: number;
  tubeRadius: number;
  arcDegrees: number;
  irregularity: number;
  tubularSegments: number;
}

const DEFAULT_OPTIONS: CanalGeometryOptions = {
  radius: 0.82,
  tubeRadius: 0.075,
  arcDegrees: 300,
  irregularity: 0.1,
  tubularSegments: 56,
};

/**
 * Builds one canal's loop as an asymmetric arc: it starts near the origin,
 * bulges outward with a gently modulated radius (so it isn't a perfect
 * circle), and returns most of the way back toward the origin - leaving a
 * short gap that the ampulla / common-crus geometry visually bridges.
 */
export function buildCanalCurve(
  canalId: CanalId,
  options: Partial<CanalGeometryOptions> = {},
): THREE.CatmullRomCurve3 {
  const merged = { ...DEFAULT_OPTIONS, ...options };
  const { radius, arcDegrees, irregularity } = merged;
  const seed = SEED_OFFSET[canalId];
  const steps = 40;
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= steps; i++) {
    const deg = (arcDegrees * i) / steps;
    const a = THREE.MathUtils.degToRad(deg);
    const wobble = 1 + irregularity * Math.sin(a + seed);
    const r = radius * wobble;
    points.push(new THREE.Vector3(r * Math.sin(a), r * (1 - Math.cos(a)), 0));
  }
  return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.55);
}

export function buildCanalTubeGeometry(
  canalId: CanalId,
  options: Partial<CanalGeometryOptions> = {},
): THREE.TubeGeometry {
  const merged = { ...DEFAULT_OPTIONS, ...options };
  const curve = buildCanalCurve(canalId, merged);
  return new THREE.TubeGeometry(curve, merged.tubularSegments, merged.tubeRadius, 10, false);
}

const SEED_OFFSET: Record<CanalId, number> = {
  horizontal: 0.4,
  anterior: 1.7,
  posterior: 3.1,
};

/**
 * Each canal loop is authored flat in the local XY plane with normal +Z.
 * To orient it in 3D we rotate that normal to point along the canal's real
 * anatomical plane-normal direction, then apply an in-plane "twist" (rotation
 * around the new normal) so the loop bulges outward in a sensible direction.
 */
interface PlaneSpec {
  normal: THREE.Vector3;
  twistDeg: number;
}

const CANAL_PLANE: Record<CanalId, PlaneSpec> = {
  // Roughly horizontal plane, normal mostly vertical with a forward tilt
  // (the horizontal canal is only truly horizontal when the head pitches
  // forward ~30 degrees).
  horizontal: { normal: new THREE.Vector3(0, 1, -0.42).normalize(), twistDeg: 96 },
  // Vertical plane angled ~45 degrees off the sagittal plane, anterolateral.
  anterior: { normal: new THREE.Vector3(1, 0.12, -1).normalize(), twistDeg: -18 },
  // Vertical plane roughly orthogonal to the anterior canal, posterolateral.
  posterior: { normal: new THREE.Vector3(1, 0.12, 1).normalize(), twistDeg: 164 },
};

function computeCanalQuaternion(spec: PlaneSpec): THREE.Quaternion {
  const localNormal = new THREE.Vector3(0, 0, 1);
  const align = new THREE.Quaternion().setFromUnitVectors(localNormal, spec.normal);
  const twist = new THREE.Quaternion().setFromAxisAngle(
    localNormal,
    THREE.MathUtils.degToRad(spec.twistDeg),
  );
  return align.multiply(twist);
}

/** Local-space quaternion that orients each canal's loop plane. */
export const CANAL_ORIENTATION: Record<CanalId, THREE.Quaternion> = {
  horizontal: computeCanalQuaternion(CANAL_PLANE.horizontal),
  anterior: computeCanalQuaternion(CANAL_PLANE.anterior),
  posterior: computeCanalQuaternion(CANAL_PLANE.posterior),
};

export const CANAL_RADIUS: Record<CanalId, number> = {
  horizontal: 0.82,
  anterior: 0.85,
  posterior: 0.85,
};

/** Where the ampulla bulge sits along the curve, t in [0, 1]. */
export const AMPULLA_T = 0.035;
/** The non-ampullated (crus) end of the curve, used to anchor the common crus. */
export const CRUS_END_T = 0.985;

const curveCache = new Map<CanalId, THREE.CatmullRomCurve3>();
function cachedCurve(canalId: CanalId): THREE.CatmullRomCurve3 {
  let curve = curveCache.get(canalId);
  if (!curve) {
    curve = buildCanalCurve(canalId, { radius: CANAL_RADIUS[canalId] });
    curveCache.set(canalId, curve);
  }
  return curve;
}

/** Point along a canal's curve in its own unrotated local frame (t in [0,1]). */
export function getCanalPointRaw(canalId: CanalId, t: number): THREE.Vector3 {
  return cachedCurve(canalId).getPoint(t).clone();
}

/** Same point, rotated into the ear group's frame (i.e. world-relative to the vestibule). */
export function getCanalPointOriented(canalId: CanalId, t: number): THREE.Vector3 {
  return getCanalPointRaw(canalId, t).applyQuaternion(CANAL_ORIENTATION[canalId]);
}

export function getAmpullaLocalPosition(canalId: CanalId): THREE.Vector3 {
  return getCanalPointRaw(canalId, AMPULLA_T);
}

/** Ampulla position rotated into the ear group's frame. */
export function getAmpullaPointOriented(canalId: CanalId): THREE.Vector3 {
  return getCanalPointOriented(canalId, AMPULLA_T);
}

export function quaternionToArray(q: THREE.Quaternion): [number, number, number, number] {
  return [q.x, q.y, q.z, q.w];
}

/** Vestibule: an irregular flattened ellipsoid centered at the local origin. */
export const VESTIBULE_RADII: [number, number, number] = [0.5, 0.6, 0.38];

/**
 * The common crus: the anterior and posterior canals' non-ampullated limbs
 * merge into one shared duct before entering the vestibule. We approximate
 * this by drawing a short connecting tube between their two crus-end points.
 */
export function getCommonCrusCurve(): THREE.CatmullRomCurve3 {
  const a = getCanalPointOriented("anterior", CRUS_END_T);
  const p = getCanalPointOriented("posterior", CRUS_END_T);
  const mid = a.clone().add(p).multiplyScalar(0.5).add(new THREE.Vector3(-0.08, 0.06, 0));
  return new THREE.CatmullRomCurve3([a, mid, p], false, "catmullrom", 0.5);
}

/** Cochlea spiral: ~2.5 turns, tapering from a large basal turn to the apex. */
export interface CochleaGeometryOptions {
  turns: number;
  startRadius: number;
  height: number;
  tubeRadius: number;
}

export const COCHLEA_DEFAULTS: CochleaGeometryOptions = {
  turns: 2.5,
  startRadius: 0.58,
  height: 1.35,
  tubeRadius: 0.078,
};

export function buildCochleaCurve(
  options: Partial<CochleaGeometryOptions> = {},
): THREE.CatmullRomCurve3 {
  const { turns, startRadius, height } = { ...COCHLEA_DEFAULTS, ...options };
  const steps = 200;
  const thetaMax = turns * 2 * Math.PI;
  const decay = 2.7;
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= steps; i++) {
    const theta = (thetaMax * i) / steps;
    const radius = startRadius * Math.exp((-decay * theta) / thetaMax);
    const y = height * (i / steps);
    points.push(new THREE.Vector3(radius * Math.cos(theta), y, radius * Math.sin(theta)));
  }
  return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.5);
}

export function buildCochleaGeometry(
  options: Partial<CochleaGeometryOptions> = {},
): THREE.TubeGeometry {
  const merged = { ...COCHLEA_DEFAULTS, ...options };
  const curve = buildCochleaCurve(merged);
  return new THREE.TubeGeometry(curve, 220, merged.tubeRadius, 12, false);
}
