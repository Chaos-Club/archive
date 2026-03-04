export interface LSystem {
  name: string;
  angle: number;
  axiom: string;
  rules: Record<string, string>;
  drawSymbols?: string[];
}

// Expand an L-system sentence by applying production rules once.
export function expand(s: string, rules: Record<string, string>): string {
  let out = "";
  for (const ch of s) out += rules[ch] ?? ch;
  return out;
}

// Format a radian angle as a readable string (e.g., "π/3").
export function fmtAngle(r: number): string {
  const table: [number, string][] = [
    [Math.PI / 6, "π/6"],
    [Math.PI / 4, "π/4"],
    [Math.PI / 3, "π/3"],
    [Math.PI / 2, "π/2"],
    [2 * Math.PI / 3, "2π/3"],
    [Math.PI, "π"],
  ];
  for (const [v, label] of table) {
    if (Math.abs(r - v) < 1e-9) return label;
  }
  return r.toFixed(4) + " rad";
}
