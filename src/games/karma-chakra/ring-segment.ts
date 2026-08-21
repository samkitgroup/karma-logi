import { PETAL_COUNT } from "./grid-layout";

const SEGMENT_ARC = 360 / PETAL_COUNT;

/** Donut ring geometry (percent of wheel radius, centre → edge). */
export const RING_INNER_RADIUS = 28;
export const RING_OUTER_RADIUS = 49.5;
export const RING_MID_RADIUS = (RING_INNER_RADIUS + RING_OUTER_RADIUS) / 2;
/** Labels sit at the centre of each ring band wedge. */
export const RING_LABEL_RADIUS = RING_MID_RADIUS;

const SEGMENT_EDGE_GAP = 0.4;

/** CSS scale: px offset from centre = wheel width × this value (matches polarPoint units). */
export function ringRadiusCssScale(radiusPercent: number): number {
  return radiusPercent / 100;
}

function polarPoint(radius: number, degrees: number): string {
  const rad = (degrees * Math.PI) / 180;
  const x = 50 + radius * Math.cos(rad);
  const y = 50 + radius * Math.sin(rad);
  return `${x.toFixed(2)}% ${y.toFixed(2)}%`;
}

/** Donut wedge clip-path for an outer ring segment (percent-based polygon). */
export function wedgeClipPath(
  index: number,
  innerRadiusPercent: number,
  outerRadiusPercent: number,
): string {
  const startDeg = index * SEGMENT_ARC - 90 + SEGMENT_EDGE_GAP;
  const endDeg = startDeg + SEGMENT_ARC - SEGMENT_EDGE_GAP * 2;

  return `polygon(${polarPoint(outerRadiusPercent, startDeg)}, ${polarPoint(outerRadiusPercent, endDeg)}, ${polarPoint(innerRadiusPercent, endDeg)}, ${polarPoint(innerRadiusPercent, startDeg)})`;
}

/** Rotate segment label/icon to sit upright in the middle of the wedge. */
export function segmentContentRotation(index: number): string {
  return `${index * SEGMENT_ARC + SEGMENT_ARC / 2 - 90}deg`;
}

/** Octagon clip-path aligned with the eight ring segments (flat edges between wedges). */
export function octagonClipPath(radiusPercent: number): string {
  const points = Array.from({ length: PETAL_COUNT }, (_, index) =>
    polarPoint(radiusPercent, index * SEGMENT_ARC + SEGMENT_ARC / 2 - 90),
  );
  return `polygon(${points.join(", ")})`;
}

/** Absolute label position as % of the wheel box (same coords as wedgeClipPath). */
export function segmentLabelPosition(
  index: number,
  radiusPercent: number,
): { left: string; top: string } {
  const angleDeg = index * SEGMENT_ARC + SEGMENT_ARC / 2 - 90;
  const rad = (angleDeg * Math.PI) / 180;
  const x = 50 + radiusPercent * Math.cos(rad);
  const y = 50 + radiusPercent * Math.sin(rad);
  return {
    left: `${x.toFixed(2)}%`,
    top: `${y.toFixed(2)}%`,
  };
}
