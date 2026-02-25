// Sierpinski Triangle — Chaos Game
// Click to throw points: 100 → 1 000 → +5 000 per click

// Canvas setup
const canvas = document.createElement("canvas");
canvas.style.cssText = "position:absolute;left:0;top:0;cursor:pointer;";
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d")!;

// Info overlay 
const info = document.createElement("div");
info.style.cssText = [
  "position:fixed",
  "bottom:24px",
  "left:50%",
  "transform:translateX(-50%)",
  "color:#aaa",
  "font:14px/1 monospace",
  "pointer-events:none",
  "user-select:none",
  "white-space:nowrap",
].join(";");
document.body.appendChild(info);

// State 
let totalPoints = 0;
let clickCount = 0;

/** Current wandering point for the chaos game (persists across clicks). */
let px = 0;
let py = 0;
let chaosStarted = false;

// Triangle geometry
type Vertex = [number, number];

/** Returns the three vertices of an equilateral triangle centred in the canvas. */
function getVertices(): [Vertex, Vertex, Vertex] {
  const margin = 48;
  const w = canvas.width;
  const h = canvas.height;
  const side = Math.min(w, h) - 2 * margin;
  const triH = (side * Math.sqrt(3)) / 2; // height of the equilateral triangle
  const cx = w / 2;
  const top = h / 2 - triH / 2;          // y of apex so the triangle is vertically centred

  const apex: Vertex = [cx, top];
  const botLeft: Vertex = [cx - side / 2, top + triH];
  const botRight: Vertex = [cx + side / 2, top + triH];
  return [apex, botLeft, botRight];
}

// Drawing helpers
function drawOutline(): void {
  const [a, b, c] = getVertices();
  ctx.beginPath();
  ctx.moveTo(a[0], a[1]);
  ctx.lineTo(b[0], b[1]);
  ctx.lineTo(c[0], c[1]);
  ctx.closePath();
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1;
  ctx.stroke();
}

// Chaos game
function throwPoints(count: number): void {
  const verts = getVertices();

  if (!chaosStarted) {
    // Seed: start at one of the vertices so we are inside the triangle immediately.
    [px, py] = verts[Math.floor(Math.random() * 3)];
    chaosStarted = true;
  }

  ctx.fillStyle = "rgba(80,200,255,0.75)";

  for (let i = 0; i < count; i++) {
    const v = verts[Math.floor(Math.random() * 3)];
    px = (px + v[0]) / 2;
    py = (py + v[1]) / 2;
    ctx.fillRect(Math.round(px), Math.round(py), 1, 1);
  }

  totalPoints += count;
  updateInfo();
}

// Info text 
function nextBatchSize(): number {
  if (clickCount === 0) return 100;
  if (clickCount === 1) return 1_000;
  return 5_000;
}

function updateInfo(): void {
  const next = nextBatchSize();
  if (totalPoints === 0) {
    info.textContent = `Click the canvas · first click throws ${next.toLocaleString()} points`;
  } else {
    info.textContent =
      `${totalPoints.toLocaleString()} points thrown · ` +
      `click to add ${next.toLocaleString()} more`;
  }
}

// Resize
function resize(): void {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Resizing clears the canvas; reset chaos state so next click restarts cleanly.
  chaosStarted = false;
  totalPoints = 0;
  clickCount = 0;

  drawOutline();
  updateInfo();
}

// Event listeners
canvas.addEventListener("click", () => {
  const count = nextBatchSize();
  clickCount++;
  throwPoints(count);
});

window.addEventListener("resize", resize);

// Boot
resize();
