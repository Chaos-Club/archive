export interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface BBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

// Interpret an L-system string with turtle graphics.
// Symbols: F/G = draw forward, f = move forward, +/- = turn, [] = push/pop state
export function walk(
  sentence: string,
  step: number,
  angle: number,
  drawSymbols: string[] = ["F", "G"]
): Line[] {
  const lines: Line[] = [];
  const stack: { x: number; y: number; a: number }[] = [];
  const drawSet = new Set(drawSymbols);
  let x = 0, y = 0, a = 0;

  for (const ch of sentence) {
    if (drawSet.has(ch)) {
      const x2 = x + step * Math.cos(a);
      const y2 = y + step * Math.sin(a);
      lines.push({ x1: x, y1: y, x2, y2 });
      x = x2;
      y = y2;
    } else {
      switch (ch) {
        case "f":
          x += step * Math.cos(a);
          y += step * Math.sin(a);
          break;
        case "+": a -= angle; break;
        case "-": a += angle; break;
        case "[": stack.push({ x, y, a }); break;
        case "]": ({ x, y, a } = stack.pop()!); break;
      }
    }
  }
  return lines;
}

function bbox(lines: Line[]): BBox {
  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;
  for (const ln of lines) {
    minX = Math.min(minX, ln.x1, ln.x2);
    maxX = Math.max(maxX, ln.x1, ln.x2);
    minY = Math.min(minY, ln.y1, ln.y2);
    maxY = Math.max(maxY, ln.y1, ln.y2);
  }
  return { minX, minY, maxX, maxY };
}

// Draw lines to a canvas, auto-fitted with margin.
export function drawSegs(
  ctx: CanvasRenderingContext2D,
  lines: Line[],
  width: number,
  height: number,
  margin = 56
) {
  if (lines.length === 0) return;

  const b = bbox(lines);
  const bw = b.maxX - b.minX || 1;
  const bh = b.maxY - b.minY || 1;
  const scale = Math.min((width - margin * 2) / bw, (height - margin * 2) / bh);
  const ox = (width - bw * scale) / 2 - b.minX * scale;
  const oy = (height - bh * scale) / 2 - b.minY * scale;

  ctx.beginPath();
  for (const ln of lines) {
    ctx.moveTo(ln.x1 * scale + ox, ln.y1 * scale + oy);
    ctx.lineTo(ln.x2 * scale + ox, ln.y2 * scale + oy);
  }
}
