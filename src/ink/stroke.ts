import { getStroke } from 'perfect-freehand';
import type { InkBrush, InkPoint, InkStroke } from './types';

function toPfPoints(points: InkPoint[]): Array<[number, number, number]> {
  return points.map(([x, y, p]) => [x, y, Number.isFinite(p) ? p : 0.5]);
}

function brushOptions(brush: InkBrush, baseSize: number) {
  if (brush === 'marker') {
    return {
      size: baseSize * 3.2,
      thinning: 0.25,
      smoothing: 0.65,
      streamline: 0.55,
      taperStart: 0,
      taperEnd: 0,
      easing: (t: number) => t,
      simulatePressure: true,
    } as const;
  }
  if (brush === 'pen') {
    return {
      size: baseSize * 1.7,
      thinning: 0.65,
      smoothing: 0.55,
      streamline: 0.6,
      taperStart: 0.2,
      taperEnd: 0.2,
      easing: (t: number) => t,
      simulatePressure: true,
    } as const;
  }
  return {
    size: baseSize * 1.35,
    thinning: 0.35,
    smoothing: 0.6,
    streamline: 0.6,
    taperStart: 0.2,
    taperEnd: 0.2,
    easing: (t: number) => t,
    simulatePressure: true,
  } as const;
}

export function getStrokePolygon(stroke: Pick<InkStroke, 'points' | 'tool' | 'baseSize'>) {
  const pts = toPfPoints(stroke.points);
  if (pts.length < 2) return [];
  return getStroke(pts, brushOptions(stroke.tool, stroke.baseSize));
}

export function drawStrokeFill(
  ctx: CanvasRenderingContext2D,
  stroke: Pick<InkStroke, 'points' | 'tool' | 'baseSize' | 'color' | 'opacity'>,
) {
  const poly = getStrokePolygon(stroke);
  if (poly.length === 0) return;

  ctx.beginPath();
  const last = poly[poly.length - 1]!;
  const first = poly[0]!;
  ctx.moveTo((last[0] + first[0]) / 2, (last[1] + first[1]) / 2);
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i]!;
    const n = poly[(i + 1) % poly.length]!;
    ctx.quadraticCurveTo(p[0], p[1], (p[0] + n[0]) / 2, (p[1] + n[1]) / 2);
  }
  ctx.closePath();

  ctx.globalAlpha = stroke.tool === 'marker' ? Math.min(0.45, stroke.opacity) : stroke.opacity;
  ctx.fillStyle = stroke.color;
  ctx.fill();
  ctx.globalAlpha = 1;
}
