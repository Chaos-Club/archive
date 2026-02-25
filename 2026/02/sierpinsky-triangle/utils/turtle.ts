// Turtle graphics utilities

/** A segment in the turtle path. */
export interface Seg {
  x: number;
  y: number;
  /** true = start of a pen-down stroke (moveTo), false = continuation (lineTo). */
  move: boolean;
}

/** Bounding box. */
export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/**
 * Walk an L-system sentence with turtle graphics.
 * @param sentence - The L-system string to interpret.
 * @param step - Step size for each forward move.
 * @param angle - Turning angle in radians.
 * @param drawSymbols - Symbols that draw (move forward with pen down). Defaults to ["F", "G"].
 * @returns Array of segments representing the path.
 */
export function walk(
  sentence: string,
  step: number,
  angle: number,
  drawSymbols: string[] = ["F", "G"]
): Seg[] {
  const segs: Seg[] = [];
  const stack: { x: number; y: number; a: number }[] = [];
  const drawSet = new Set(drawSymbols);
  let x = 0, y = 0, a = 0;

  for (const ch of sentence) {
    if (drawSet.has(ch)) {
      // Drawing symbol
      segs.push({ x, y, move: true });
      x += step * Math.cos(a);
      y += step * Math.sin(a);
      segs.push({ x, y, move: false });
    } else {
      switch (ch) {
        case "f":
          // Move forward without drawing
          x += step * Math.cos(a);
          y += step * Math.sin(a);
          break;
        case "+": a -= angle; break;  // turn left
        case "-": a += angle; break;  // turn right
        case "[": stack.push({ x, y, a }); break;
        case "]": ({ x, y, a } = stack.pop()!); break;
      }
    }
  }
  return segs;
}

/** Compute the bounding box of a set of segments. */
export function boundingBox(segs: Seg[]): BoundingBox {
  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;
  for (const s of segs) {
    if (s.x < minX) minX = s.x;
    if (s.x > maxX) maxX = s.x;
    if (s.y < minY) minY = s.y;
    if (s.y > maxY) maxY = s.y;
  }
  return { minX, minY, maxX, maxY };
}

/**
 * Draw segments to a canvas context, auto-fitting to the canvas with margin.
 * @param ctx - The 2D rendering context.
 * @param segs - The path segments from walk().
 * @param width - Canvas width.
 * @param height - Canvas height.
 * @param margin - Margin around the drawing.
 */
export function drawSegs(
  ctx: CanvasRenderingContext2D,
  segs: Seg[],
  width: number,
  height: number,
  margin: number = 56
): void {
  if (segs.length === 0) return;

  const bb = boundingBox(segs);
  const bbW = bb.maxX - bb.minX || 1;
  const bbH = bb.maxY - bb.minY || 1;
  const scale = Math.min((width - margin * 2) / bbW, (height - margin * 2) / bbH);
  const ox = (width - bbW * scale) / 2 - bb.minX * scale;
  const oy = (height - bbH * scale) / 2 - bb.minY * scale;

  ctx.beginPath();
  for (let i = 0; i < segs.length - 1; i++) {
    const cur = segs[i];
    const next = segs[i + 1];
    if (cur.move) {
      ctx.moveTo(cur.x * scale + ox, cur.y * scale + oy);
      ctx.lineTo(next.x * scale + ox, next.y * scale + oy);
    }
  }
}

