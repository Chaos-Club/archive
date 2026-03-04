// L-System renderer: Sierpinski Arrowhead Curve
// Click to advance one iteration.

import { type LSystem, expand, fmtAngle } from "../utils/l-system";
import { walk, drawSegs } from "../utils/turtle";

const SYSTEM: LSystem = {
  name: "Sierpinski Arrowhead",
  angle: Math.PI / 3,
  axiom: "A",
  rules: { A: "B-A-B", B: "A+B+A" },
  drawSymbols: ["A", "B"],
};

/*
const SYSTEM: LSystem = {
  name: "Harter-Heighway Dragon",
  angle: Math.PI / 2,
  axiom: "FX",
  rules: { F: "F", X: "X+YF+", Y: "-FX-Y" },
  drawSymbols: ["F", "X", "Y"],
};
*/

/*
const SYSTEM: LSystem = {
  name: "Koch Curve",
  angle: Math.PI / 3,
  axiom: "F++F++F",
  rules: { F: "F-F++F-F" },
};
*/

const canvas = document.createElement("canvas");
canvas.style.cssText = "position:absolute;left:0;top:0;cursor:pointer;";
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d")!;

const overlay = document.createElement("div");
overlay.style.cssText = "position:fixed;top:20px;left:20px;color:#999;font:13px/1.7 monospace;pointer-events:none;user-select:none;white-space:pre;";
document.body.appendChild(overlay);

const hint = document.createElement("div");
hint.style.cssText = "position:fixed;bottom:22px;left:50%;transform:translateX(-50%);color:#555;font:13px/1 monospace;pointer-events:none;user-select:none;white-space:nowrap;";
document.body.appendChild(hint);

let iteration = 0;
let sentence = SYSTEM.axiom;
const MAX_LEN = 300_000;

function draw() {
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const lines = walk(sentence, 1, SYSTEM.angle, SYSTEM.drawSymbols);
  drawSegs(ctx, lines, W, H);

  ctx.strokeStyle = "#5cf";
  ctx.lineWidth = Math.max(0.4, 2 / Math.pow(3, iteration / 2));
  ctx.stroke();

  updateOverlay();
}

function updateOverlay() {
  const rules = Object.entries(SYSTEM.rules).map(([k, v]) => `  ${k} -> ${v}`).join("\n");
  overlay.textContent = `${SYSTEM.name}\n${"-".repeat(22)}\niteration  ${iteration}\nangle      ${fmtAngle(SYSTEM.angle)}\naxiom      ${SYSTEM.axiom}\n\nrules:\n${rules}`;

  const nextLen = expand(sentence, SYSTEM.rules).length;
  hint.textContent = nextLen <= MAX_LEN ? `click -> iteration ${iteration + 1}` : `maximum expansion reached`;
}

canvas.addEventListener("click", () => {
  const next = expand(sentence, SYSTEM.rules);
  if (next.length > MAX_LEN) return;
  iteration++;
  sentence = next;
  draw();
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw();
});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
draw();
