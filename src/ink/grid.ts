type Viewport = {
  panX: number;
  panY: number;
  scale: number; // world -> screen multiplier (ratio)
  widthCss: number;
  heightCss: number;
};

type Opts = {
  spacingWorld?: number;
  baseDotRadiusWorld?: number;
  maxDots?: number;
  color?: string;
};

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

export function drawDottedGrid(ctx: CanvasRenderingContext2D, vp: Viewport, opts: Opts = {}) {
  const scale = Math.max(0.0001, vp.scale);
  let spacing = Math.max(2, opts.spacingWorld ?? 24);
  const baseDotRadiusWorld = Math.max(0.2, opts.baseDotRadiusWorld ?? 1);
  const maxDots = Math.max(2000, opts.maxDots ?? 12000);

  const minX = -vp.panX / scale;
  const maxX = (vp.widthCss - vp.panX) / scale;
  const minY = -vp.panY / scale;
  const maxY = (vp.heightCss - vp.panY) / scale;

  const worldW = Math.max(1, maxX - minX);
  const worldH = Math.max(1, maxY - minY);

  const estCols = Math.ceil(worldW / spacing) + 2;
  const estRows = Math.ceil(worldH / spacing) + 2;
  const estDots = estCols * estRows;
  if (estDots > maxDots) {
    const factor = Math.ceil(Math.sqrt(estDots / maxDots));
    spacing *= factor;
  }

  const startX = Math.floor(minX / spacing) * spacing;
  const startY = Math.floor(minY / spacing) * spacing;

  const rScreen = clamp(baseDotRadiusWorld * scale, 0.55, 1.35);
  const rWorld = rScreen / scale;

  ctx.save();
  ctx.fillStyle = opts.color ?? 'rgba(0,0,0,0.18)';
  ctx.beginPath();
  for (let y = startY; y <= maxY + spacing; y += spacing) {
    for (let x = startX; x <= maxX + spacing; x += spacing) {
      ctx.moveTo(x + rWorld, y);
      ctx.arc(x, y, rWorld, 0, Math.PI * 2);
    }
  }
  ctx.fill();
  ctx.restore();
}
