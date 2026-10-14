# GPGPU Particles (Simulation in Float Framebuffers)

Store particle state as pixels in 32-bit float framebuffers, update it with a "simulation" shader each frame, and draw particles by reading that state in a vertex shader. The CPU never loops over particles, so hundreds of thousands are practical.

Working example in this project: [src/sketch-gpu-particles-sim.js](../../../../src/sketch-gpu-particles-sim.js). Everything below was checked against p5.js 2.x source.

## The Frame Loop

```
setup:  build quad geometry (once) -> create 2 float framebuffers -> simulate(reset = true)
draw:   simulate()  -> read stateCurrent, write stateNext, swap ("ping-pong")
        render      -> vertex shader reads each particle's pixel from stateCurrent
```

One pixel = one particle. With RGBA: `rgb = position xyz`, `a = life (0..1)` (or any other value you need).

## 1. Data Framebuffers

```javascript
let gridSize = 256; // gridSize * gridSize particles
let stateCurrent, stateNext;

function createStateBuffers() {
  let options = {
    width: gridSize,
    height: gridSize,
    density: 1,                // exactly 1 pixel per particle (default is the screen's pixelDensity)
    format: FLOAT,             // 32-bit floats; default UNSIGNED_BYTE clamps to 0..1 in 256 steps
    textureFiltering: NEAREST, // default LINEAR blends neighboring particles' data
    antialias: false,          // antialiasing also blends neighbors
    depth: false,              // no depth buffer needed for a data pass
  };
  stateCurrent = createFramebuffer(options);
  stateNext = createFramebuffer(options);
}
```

Every option matters. Missing any one of `FLOAT`, `NEAREST`, `density: 1` gives subtly wrong data, not an error. `HALF_FLOAT` also exists (less memory, less precision; fine for colors, risky for positions far from 0).

## 2. The Simulation Pass

Draw one `plane()` that covers the whole framebuffer with the sim shader, so the fragment shader runs once per particle.

```javascript
function simulate(reset) {
  stateNext.draw(() => {
    blendMode(REPLACE); // write values exactly (see below)
    noStroke();         // a stroke would draw lines over the data
    shader(simShader);
    simShader.setUniform("uState", stateCurrent); // a p5.Framebuffer works as a sampler2D
    simShader.setUniform("uStateSize", [gridSize, gridSize]);
    simShader.setUniform("uReset", reset ? 1 : 0);
    plane(1, 1);
  });
  [stateCurrent, stateNext] = [stateNext, stateCurrent]; // swap
}
```

Sim vertex shader: ignore the camera entirely. `plane()` geometry is a unit plane (`aPosition` from -0.5 to 0.5; size comes from the model matrix), so `* 2.0` maps it to clip space -1..1:

```glsl
precision highp float;
attribute vec3 aPosition;
void main() {
  gl_Position = vec4(aPosition.xy * 2.0, 0.0, 1.0);
}
```

Sim fragment shader: find "which particle am I" from `gl_FragCoord`, not from `aTexCoord`/`vTexCoord`. `gl_FragCoord` addresses pixels exactly the way `texture2D()` reads them, so there is no y-flip or half-pixel ambiguity:

```glsl
precision highp float;
uniform sampler2D uState;
uniform vec2 uStateSize;
uniform float uReset;

void main() {
  vec2 uv = gl_FragCoord.xy / uStateSize;
  vec4 state = texture2D(uState, uv);
  vec3 pos = state.xyz;
  float life = state.a;

  if (uReset > 0.5) {
    gl_FragColor = vec4(/* spawn position */ vec3(0.0), /* life */ 1.0);
    return;
  }

  // ... move pos, age life, respawn when life <= 0 ...
  gl_FragColor = vec4(pos, life);
}
```

Key rules:

- **`blendMode(REPLACE)` inside `fb.draw()`.** The default `BLEND` mixes the output with the old pixel whenever alpha < 1, which corrupts data stored in alpha (like life). `fb.draw()` wraps a `push()`/`pop()`, so the blend mode doesn't leak into the main canvas.
- **Never read and write the same framebuffer in one pass.** Always ping-pong between two.
- **Initialize on the GPU** with a reset uniform (run `simulate(true)` once in `setup()`, and again for a "reset" key). No need to upload data from JavaScript.
- **Stagger lifetimes** at reset (`life = random(uv)`), or every particle respawns on the same frame.

## 3. Particle Geometry

Build one quad per particle, once, with `buildGeometry()`. The corners are small offsets around (0, 0). All 4 corners share a `(u, v)` that points at the **center** of that particle's pixel:

```javascript
geoPoints = buildGeometry(() => {
  fill(255);
  noStroke();
  let half = 1; // half the particle size, in pixels
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      let u = (x + 0.5) / gridSize; // + 0.5 = pixel center
      let v = (y + 0.5) / gridSize;
      beginShape(QUADS);
      vertex(-half, -half, 0, u, v); // vertex(x, y, z, u, v)
      vertex(half, -half, 0, u, v);
      vertex(half, half, 0, u, v);
      vertex(-half, half, 0, u, v);
      endShape();
    }
  }
});
```

`buildGeometry()` runs on the CPU, so it takes a moment at large sizes (512 × 512 = 262,144 quads, about 1M vertices). That cost is only in `setup()`.

## 4. The Render Pass

The vertex shader reads the particle's state (vertex texture fetch) and builds the quad around it in **camera space**, so quads always face the camera when using `orbitControl()` (billboarding):

```glsl
precision highp float;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
attribute vec3 aPosition; // corner offset
attribute vec2 aTexCoord; // which particle
uniform sampler2D uState;
varying vec4 vColor;

void main() {
  vec4 state = texture2D(uState, aTexCoord);
  float size = sin(state.a * 3.14159); // grow in at birth, shrink out at death
  vec4 viewPos = uModelViewMatrix * vec4(state.xyz, 1.0);
  viewPos.xy += aPosition.xy * size;
  gl_Position = uProjectionMatrix * viewPos;
  vColor = vec4(1.0);
}
```

```javascript
function draw() {
  simulate(false);
  background(0);
  orbitControl();
  shader(renderShader);
  renderShader.setUniform("uState", stateCurrent);
  model(geoPoints);
  resetShader();
}
```

## Precision and Randomness

- Use **`precision highp float;`** in every GPGPU shader. `mediump` can be as low as 16-bit on some (mostly mobile) GPUs: positions jitter, snap to a grid, or overflow. The general "use `mediump`" advice in [troubleshooting.md](troubleshooting.md) is for color-only shaders.
- The common hash `fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453)` degrades when its input gets large. Don't feed it raw time (`random(uv + uTime)` becomes streaky after a while). Wrap the time first: `float seed = fract(uTime * 0.0137) * 100.0;`.
- GLSL has no built-in `noise()`. Paste a small value-noise or simplex function into the shader. Sharing one JavaScript string between shaders with `${noiseGlsl}` keeps it in one place.

## Debugging

- **See the data:** `image(stateCurrent, x, y, 100, 100)` draws the buffer. Values outside 0..1 show clipped, but you can see whether it changes and whether it has structure.
- **Read exact values:** `stateCurrent.loadPixels()` then `stateCurrent.pixels` (a Float32Array for `FLOAT` buffers). This is slow (a GPU-to-CPU copy), so use it once, not every frame.
- **HUD text:** in WEBGL, `text()` needs a font loaded with `loadFont()`. A shortcut is to draw text into a small 2D `createGraphics()` and `image()` it. To keep a HUD fixed while `orbitControl()` moves the scene, use a second camera (`createCamera()`, then `setCamera()` between scene and HUD) and call `clearDepth()` before drawing the HUD.

## Common Failures

| Symptom | Likely cause |
| --- | --- |
| All particles at the center or one corner | Sim output never reaches `stateCurrent`: forgot the swap, or `uState` is set to the buffer being written |
| Particles stuck on a grid / move in steps | Framebuffer isn't `FLOAT` (8-bit data), float render targets unsupported on this GPU, or `mediump` precision |
| Particles smear or average together | `textureFiltering` left as `LINEAR`, or `antialias` on |
| Only part of the particles move, or patterns repeat in quarters | Missing `density: 1` on a high-DPI screen, or `uStateSize` doesn't match the framebuffer size |
| Life values drift or particles flicker | Missing `blendMode(REPLACE)` (alpha is being blended) |
| Thin lines across the data / strange stripes | Missing `noStroke()` before `plane()` in the sim pass |
| Nothing renders, no error | Shader compile errors are in the browser console; also check that `model()` happens after `shader()` |
| Main scene looks wrong after the sim pass | Shader or blend state leaked: keep sim drawing inside `fb.draw()`, call `resetShader()` after the render pass |

## Extending

**Velocity / momentum.** Add a second ping-pong pair for velocity. WebGL in p5 writes one color output per pass, so run two passes per frame:

```javascript
// 1. velocity pass: reads pos + vel, writes new vel (forces, drag, attractors)
velNext.draw(() => { /* shader(velShader); uPos = posCurrent; uVel = velCurrent; plane(1, 1) */ });
[velCurrent, velNext] = [velNext, velCurrent];
// 2. position pass: reads pos + NEW vel, writes pos += vel
posNext.draw(() => { /* shader(posShader); uPos = posCurrent; uVel = velCurrent; plane(1, 1) */ });
[posCurrent, posNext] = [posNext, posCurrent];
```

**Mouse attractor.** Pass the mouse as a uniform. With the default camera and no `orbitControl()` rotation, the z = 0 plane maps to the screen as `(mouseX - width / 2, mouseY - height / 2)`. In the sim: `vec3 toMouse = uMouse - pos; vel += normalize(toMouse) * strength / (1.0 + length(toMouse))`.

**More data per particle.** Add another framebuffer pair (color, size, type, seed...). Read as many state textures as you need in the render shader. Only the simulation needs ping-pong; data that never changes can be a single framebuffer written once.

**Particle count.** `gridSize` 256 = 65k, 512 = 262k, 1024 = 1M. Rendering (fill rate and vertex count) usually limits before simulation does. Watch the fps and keep quads small.
