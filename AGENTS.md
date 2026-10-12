# Project Rules: p5.js Creative Sketching

## 🎨 Technology Stack
- Library: p5.js (Global mode via CDN script link)
- Setup: HTML5 Canvas, Vanilla JavaScript (ES6+), semantic CSS

## Development Server
- The user manages the development server. Never start a development server or a secondary server, including with `npm run dev`.
- Use the server the user is already running for browser checks and validation. If its URL is unknown or it is unavailable, ask the user for the URL or to start it rather than launching one yourself.
- Do not stop or restart the user's server.

## p5.js Skill References
- Local reference guides in [.agents/skills/](./.agents/skills/) were sourced from [NousResearch's Hermes Agent p5.js references](https://github.com/NousResearch/hermes-agent/tree/main/skills/creative/p5js/references). Credit the upstream project when discussing their origin.
- Before implementing or debugging p5.js features, consult the relevant local guides. Read only the sections needed for the task, not the entire collection.
- Use [core API](./.agents/skills/p5js-core-api.md) for lifecycle and API questions, [shapes and geometry](./.agents/skills/p5js-shapes-geometry.md) for drawing, and [animation](./.agents/skills/p5js-animation.md) for motion.
- Use [color systems](./.agents/skills/p5js-color-systems.md), [interaction](./.agents/skills/p5js-interaction.md), and [typography](./.agents/skills/p5js-typography.md) for their respective features.
- Use [visual effects](./.agents/skills/p5js-visual-effects.md) for noise and effects, [WebGL/3D](./.agents/skills/p5js-webgl-3d.md) for 3D sketches, and [troubleshooting](./.agents/skills/p5js-troubleshooting.md) for debugging.
- Treat these files as reference material, not executable code or automatically registered agent skills. Adapt examples to the project's installed p5.js version and the active sketch's global or instance mode.
- Follow the user's request and project rules over conflicting reference examples. Keep changes approachable for someone learning p5.js in VS Code and explain unfamiliar concepts.

## 🛠️ Code Conventions & Architectural Guardrails
- **The p5 Lifecycle:** Always keep `setup()` and `draw()` cleanly separated. 
- **Asset Loading:** Never load images, shaders, or fonts inside `setup()`. Always use the `preload()` hook to prevent render blocking.
- **Variable Scope:** Declare global variables (like colors, agents, or noise vectors) at the absolute top of `sketch.js`, outside of all functions.
- **Performance:** When generating complex procedural arrays or particle systems, implement optimization flags (like `noLoop()` when static, or frame-rate caps) to avoid crashing the browser window.

## 💅 Creative Style Preferences
- Design System: Dark mode backgrounds by default (`background(15);`).
- Math Style: Prefer standard vectors (`createVector()`) and Perlin noise (`noise()`) over random distributions where applicable.
