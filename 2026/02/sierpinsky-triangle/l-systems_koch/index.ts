// L-System renderer — Koch Curve
// Click to advance one iteration.

import { type LSystemDef, expand, fmtAngle } from "../utils/l-system";
import { walk, drawSegs } from "../utils/turtle";

// ── System definition ─────────────────────────────────────────────────────────

const SYSTEM: LSystemDef = {
  name: "Koch Curve",
  angle: Math.PI / 3,
  axiom: "F++F++F",
  rules: { F: "F-F++F-F" },
};

// ── Canvas ────────────────────────────────────────────────────────────────────

const canvas = document.createElement("canvas");
canvas.style.cssText = "position:absolute;left:0;top:0;cursor:pointer;";
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d")!;

// ── Overlay ───────────────────────────────────────────────────────────────────

const overlay = document.createElement("div");
overlay.style.cssText = [
  "position:fixed", "top:20px", "left:20px",
  "color:#999", "font:13px/1.7 monospace",
  "pointer-events:none", "user-select:none", "white-space:pre",
].join(";");
document.body.appendChild(overlay);

const hint = document.createElement("div");
hint.style.cssText = [
  "position:fixed", "bottom:22px", "left:50%",
  "transform:translateX(-50%)",
  "color:#555", "font:13px/1 monospace",
  "pointer-events:none", "user-select:none", "white-space:nowrap",
].join(";");
document.body.appendChild(hint);

// ── State ─────────────────────────────────────────────────────────────────────

let iteration = 0;
let sentence = SYSTEM.axiom;
const MAX_LENGTH = 300_000;

// ── Rendering ─────────────────────────────────────────────────────────────────

function draw(): void {
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const segs = walk(sentence, 1, SYSTEM.angle, SYSTEM.drawSymbols);
  drawSegs(ctx, segs, W, H);

  ctx.strokeStyle = "#5cf";
  ctx.lineWidth = Math.max(0.4, 2 / Math.pow(3, iteration / 2));
  ctx.stroke();

  updateOverlay();
}

function updateOverlay(): void {
  const rules = Object.entries(SYSTEM.rules).map(([k, v]) => `  ${k} → ${v}`).join("\n");
  overlay.textContent =
    `${SYSTEM.name}\n${"─".repeat(22)}\n` +
    `iteration  ${iteration}\nangle      ${fmtAngle(SYSTEM.angle)}\n` +
    `axiom      ${SYSTEM.axiom}\n\nrules:\n${rules}`;

  const nextLen = expand(sentence, SYSTEM.rules).length;
  hint.textContent = nextLen <= MAX_LENGTH
    ? `click → iteration ${iteration + 1}`
    : `maximum expansion reached`;
}

// ── Events ────────────────────────────────────────────────────────────────────

canvas.addEventListener("click", () => {
  const next = expand(sentence, SYSTEM.rules);
  if (next.length > MAX_LENGTH) return;
  iteration++;
  sentence = next;
  draw();
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw();
});

// ── Boot ──────────────────────────────────────────────────────────────────────

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
draw();
