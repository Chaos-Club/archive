# Sierpiński Triangle — Chaos Game

A browser-based visualisation of the [chaos game](https://en.wikipedia.org/wiki/Chaos_game) method for generating the Sierpiński Triangle.

## How it works

Three vertices of an equilateral triangle are fixed on the canvas.
A point starts at one of those vertices and then, repeatedly:

1. A vertex is chosen at random.
2. The current point moves **halfway** toward that vertex.
3. The new position is plotted.

After enough iterations the fractal Sierpiński Triangle emerges.

## Interacting with the app

| Click | Points thrown |
|-------|---------------|
| 1st   | 100           |
| 2nd   | 1 000         |
| 3rd+  | 5 000 each    |

Points accumulate with every click.
The current total is shown at the bottom of the page.
Resizing the window resets the canvas.

## Build & run locally

Install dependencies from the `sierpinsky-triangle/` directory (one-time):

```bash
cd 2026/02/sierpinsky-triangle
npm install
```

Start the dev server with live-reload:

```bash
npm run dev:chaos
```

Then open **http://localhost:8000/chaos-game/** in your browser.

To produce a minified bundle without the dev server:

```bash
npm run build:chaos
# output → chaos-game/bundle.js
```

