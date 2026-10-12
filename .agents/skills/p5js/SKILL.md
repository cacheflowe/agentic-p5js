---
name: p5js
description: Reference guides for writing and debugging p5.js sketches, covering the core API, shapes, animation, color, interaction, typography, noise and visual effects, WebGL/3D, and troubleshooting. Use when creating, changing, or fixing a p5.js sketch.
---

# p5.js

Use these guides when you write or debug p5.js code in this project. Read only the reference that fits the task, and only the sections you need.

## Which reference to read

| Task                                                 | Reference                                           |
| ---------------------------------------------------- | --------------------------------------------------- |
| Lifecycle, canvas setup, and general API questions   | [core-api.md](references/core-api.md)               |
| Drawing shapes, curves, and geometry                 | [shapes-geometry.md](references/shapes-geometry.md) |
| Motion, easing, and timing                           | [animation.md](references/animation.md)             |
| Palettes and color modes                             | [color-systems.md](references/color-systems.md)     |
| Mouse, keyboard, touch, and other input              | [interaction.md](references/interaction.md)         |
| Text and fonts                                       | [typography.md](references/typography.md)           |
| Perlin noise, blur, glow, grain, and similar effects | [visual-effects.md](references/visual-effects.md)   |
| 3D, cameras, and shaders                             | [webgl-3d.md](references/webgl-3d.md)               |
| Errors, blank canvases, and performance problems     | [troubleshooting.md](references/troubleshooting.md) |

## Adapt the examples to this project

- **Version:** this project uses p5.js 2.x. Some examples are written for p5.js 1.x. Never use `preload()`: load assets with `await` inside `async setup()`. See "async setup() replaces preload()" in [core-api.md](references/core-api.md).
- **Loading:** p5.js is installed through npm and imported in the sketch file. Do not add `<script>` tags that load p5.js or its add-ons from a CDN. If an add-on is needed, ask the user before adding a dependency.
- **Mode:** match the mode of the active sketch. Global mode uses bare calls such as `createCanvas()`. Instance mode uses the instance's methods and properties, such as `s.createCanvas()` and `s.mouseX`.

## Credit

These references come from [NousResearch's Hermes Agent p5.js skill](https://github.com/NousResearch/hermes-agent/tree/main/skills/creative/p5js). Credit the upstream project whenever you discuss where they came from.
