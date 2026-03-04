// Sierpinski Triangle: Chaos Game
// Click to throw points: 100 -> 1 000 -> +5 000 per click

const canvas = document.createElement("canvas");
canvas.style.cssText = "position:absolute;left:0;top:0;cursor:pointer;";
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d")!;

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

let totalPoints = 0;
let clickCount = 0;
let px = 0, py = 0;
let started = false;

function getVerts() {
  const margin = 48;
  const w = canvas.width;
  const h = canvas.height;
  const side = Math.min(w, h) - 2 * margin;
  const triH = (side * Math.sqrt(3)) / 2;
  const cx = w / 2;
  const top = h / 2 - triH / 2;

  return [
    [cx, top],
    [cx - side / 2, top + triH],
    [cx + side / 2, top + triH],
  ] as [number, number][];
}

function drawOutline() {
  const [a, b, c] = getVerts();
  ctx.beginPath();
  ctx.moveTo(a[0], a[1]);
  ctx.lineTo(b[0], b[1]);
  ctx.lineTo(c[0], c[1]);
  ctx.closePath();
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1;
  ctx.stroke();
}

// Chaos game: repeatedly move halfway toward a random triangle vertex.
function throwPoints(count: number) {
  const verts = getVerts();

  if (!started) {
    [px, py] = verts[Math.floor(Math.random() * 3)];
    started = true;
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

function batchSize() {
  return clickCount === 0 ? 100 : clickCount === 1 ? 1_000 : 5_000;
}

function updateInfo() {
  const next = batchSize();
  info.textContent = totalPoints === 0
    ? `Click the canvas - first click throws ${next.toLocaleString()} points`
    : `${totalPoints.toLocaleString()} points thrown - click to add ${next.toLocaleString()} more`;
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  started = false;
  totalPoints = 0;
  clickCount = 0;
  drawOutline();
  updateInfo();
}

canvas.addEventListener("click", () => {
  throwPoints(batchSize());
  clickCount++;
});

window.addEventListener("resize", resize);

resize();
