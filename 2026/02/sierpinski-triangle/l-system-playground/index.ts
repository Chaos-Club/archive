// L-System playground: uncomment a SYSTEM block to try different fractals
// Click to advance iterations. Reload page to reset.

import { type LSystem, expand, fmtAngle } from "../utils/l-system";
import { walk, drawSegs } from "../utils/turtle";

// Helper: you can use deg(90) instead of Math.PI / 2 for angles
const deg = (d: number) => (d * Math.PI) / 180;

// SYMBOLS YOU CAN USE:
//
//   F, G, A, B, X, Y, etc  = draw a line forward
//   f                      = move forward without drawing
//   +                      = turn left by 'angle' degrees
//   -                      = turn right by 'angle' degrees
//   [                      = save current position/angle (push)
//   ]                      = restore saved position/angle (pop)
//
// The symbols after 'drawSymbols' in your system config actually draw lines.
// Everything else is just movement or branching control.

// BRACKETS EXPLAINED:
// [ = "remember this spot" (push current position and angle onto a stack)
// ] = "go back to that spot" (pop from stack, restore position and angle)
//
// Example: F[+F]F draws a Y shape:
//   F = draw up
//   [ = remember where we are (at the top of first line)
//   +F = turn left, draw a branch
//   ] = go back to remembered spot (top of first line, facing up)
//   F = draw the other half of the Y

//
// EXAMPLES: uncomment one block to try it:
//

// 1. simplest: just a straight line that doubles each time
// const SYSTEM: LSystem = {
//   name: "Simple Growth",
//   angle: deg(0),
//   axiom: "F",
//   rules: { F: "FF" },
// };

// 2. basic branching tree
// const SYSTEM: LSystem = {
//   name: "Branching Tree",
//   angle: Math.PI / 5,
//   axiom: "F",
//   rules: { F: "F[+F]F[-F]F" },
// };

// 3. classic sierpinski triangle
// const SYSTEM: LSystem = {
//   name: "Sierpinski Arrowhead",
//   angle: deg(60),
//   axiom: "A",
//   rules: { A: "B-A-B", B: "A+B+A" },
//   drawSymbols: ["A", "B"],
// };

// 4. koch snowflake
// const SYSTEM: LSystem = {
//   name: "Koch Snowflake",
//   angle: deg(60),
//   axiom: "F++F++F",
//   rules: { F: "F-F++F-F" },
// };

// 5. dragon curve
// const SYSTEM: LSystem = {
//   name: "Dragon Curve",
//   angle: deg(90),
//   axiom: "FX",
//   rules: { X: "X+YF+", Y: "-FX-Y" },
//   drawSymbols: ["F", "X", "Y"],
// };

// 6. bush
// const SYSTEM: LSystem = {
//   name: "Plant",
//   angle: deg(25),
//   axiom: "X",
//   rules: { X: "F+[[X]-X]-F[-FX]+X", F: "FF" },
//   drawSymbols: ["F", "X"],
// };

// 7. hilbert curve
// const SYSTEM: LSystem = {
//   name: "Hilbert Curve",
//   angle: deg(90),
//   axiom: "A",
//   rules: { A: "+BF-AFA-FB+", B: "-AF+BFB+FA-" },
//   drawSymbols: ["F", "A", "B"],
// };

// 8. gosper curve
// const SYSTEM: LSystem = {
//   name: "Gosper Curve",
//   angle: deg(60),
//   axiom: "A",
//   rules: { A: "A-B--B+A++AA+B-", B: "+A-BB--B-A++A+B" },
//   drawSymbols: ["A", "B"],
// };

// 9. Levy C curve
// const SYSTEM: LSystem = {
//   name: "Levy C Curve",
//   angle: deg(45),
//   axiom: "F",
//   rules: { F: "+F--F+" },
// };

// 10. Clouds, change angle by five
const SYSTEM: LSystem = {
  name: "Tim's Fractal",
  angle: deg(70),
  axiom: "A",
  rules: { A: "-B-B+A+", B: "B+A+B", },
  drawSymbols: ["A", "B"],
};



// 11. make your own! copy this block and fill in the blanks:
// const SYSTEM: LSystem = {
//   name: "My Fractal",
//   angle: deg(60),
//   axiom: "F",
//   rules: { F: "F+F-F" },
// };
// tips:
// - start simple: just change the angle first
// - add one rule at a time and see what happens
// - if it explodes too fast, use less F's in your rules

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
