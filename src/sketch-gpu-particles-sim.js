// GPU particles with a simulation step (GPGPU)
//
// Each particle's position is stored as a pixel in a 32-bit float
// framebuffer: red = x, green = y, blue = z, alpha = life (0 to 1).
// Every frame:
//   1. Simulate: a "simulation shader" reads the current positions, moves
//      each particle through a noise flow field, and writes the new
//      positions into a second framebuffer.
//   2. Swap: the new framebuffer becomes the current one ("ping-pong").
//   3. Render: the particle shader looks up each particle's position from
//      the framebuffer and draws a small quad there.
// The CPU never touches the particle data, so this scales to a lot of particles.
//
// Press "r" to respawn all particles.
//
// References:
// - https://p5js.org/reference/p5/createFramebuffer/
// - https://p5js.org/reference/p5/p5.Framebuffer/
// - https://p5js.org/reference/p5/shader/
// - https://p5js.org/tutorials/custom-geometry/

import p5 from "p5";

// Make p5 available globally so we can use global mode
window.p5 = p5;

// ---- Global variables ----
let gridSize = 512; // particles per side: gridSize * gridSize particles total
let numParticles = 0; // how many particles are in the geometry
let geoPoints; // the particle quads (built once)
let renderShader; // draws particles at their simulated positions
let simShader; // moves particles: reads old positions, writes new ones
let stateCurrent; // framebuffer holding this frame's particle positions
let stateNext; // framebuffer the simulation writes into
let gradient; // a p5.Graphics used as a color texture

// HUD ("heads-up display") drawn flat on top of the 3D scene
let sceneCam; // the camera orbitControl() moves around
let hudCam; // a camera that never moves, for flat 2D drawing
let hud; // a small 2D p5.Graphics for debug text
let fpsDisplay = 0; // smoothed fps value shown in the HUD

// ---- Shared GLSL helpers (pasted into both shaders) ----

const noiseGlsl = /* glsl */ `
  // A pseudo-random number (0 to 1) for any 2D point.
  float random(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  // Smooth "value noise" (0 to 1), similar in spirit to p5's noise().
  float noise(vec2 p) {
    vec2 cell = floor(p);
    vec2 f = fract(p);
    vec2 blend = f * f * (3.0 - 2.0 * f);
    float a = random(cell);
    float b = random(cell + vec2(1.0, 0.0));
    float c = random(cell + vec2(0.0, 1.0));
    float d = random(cell + vec2(1.0, 1.0));
    return mix(mix(a, b, blend.x), mix(c, d, blend.x), blend.y);
  }
`;

// ---- Simulation shader ----

// The simulation draws one rectangle that covers the whole framebuffer,
// so the fragment shader runs exactly once per pixel = once per particle.
// plane() is 1 x 1 (-0.5 to 0.5), so * 2.0 stretches it to fill the
// framebuffer (-1 to 1), ignoring the camera.
const simVertSrc = /* glsl */ `
  precision highp float;
  attribute vec3 aPosition;

  void main() {
    gl_Position = vec4(aPosition.xy * 2.0, 0.0, 1.0);
  }
`;

const simFragSrc = /* glsl */ `
  precision highp float;

  uniform sampler2D uState; // current positions (xyz) and life (a)
  uniform vec2 uStateSize; // framebuffer size in pixels
  uniform float uTime;
  uniform float uReset; // 1.0 = respawn every particle
  uniform float uSpeed; // how far particles move per frame
  uniform float uNoiseScale; // size of the swirls in the flow field
  uniform float uSpawnRadius; // particles spawn inside this distance from the center

  ${noiseGlsl}

  // A random position inside a cube, different for each particle and each time
  vec3 spawnPosition(vec2 uv) {
    float seed = fract(uTime * 0.0137) * 100.0;
    vec3 r = vec3(
      random(uv + seed),
      random(uv + seed + 1.7),
      random(uv + seed + 3.1)
    );
    return (r * 2.0 - 1.0) * uSpawnRadius;
  }

  void main() {
    // Which particle is this? gl_FragCoord is this pixel's position,
    // so dividing by the size gives a 0 to 1 texture coordinate.
    vec2 uv = gl_FragCoord.xy / uStateSize;

    vec4 state = texture2D(uState, uv);
    vec3 pos = state.xyz;
    float life = state.a;

    if (uReset > 0.5) {
      // start with random lives, so particles don't all respawn at once
      gl_FragColor = vec4(spawnPosition(uv), random(uv * 7.3));
      return;
    }

    // Flow field: noise at the particle's position picks a direction.
    // Three noise lookups (on different 2D slices of space) give x, y, and z.
    vec3 p = pos * uNoiseScale;
    float t = uTime * 0.3;
    vec3 dir = vec3(
      noise(p.yz + t),
      noise(p.xz + t + 13.1),
      noise(p.xy + t + 27.7)
    ) * 2.0 - 1.0;
    pos += dir * uSpeed;

    // age the particle (each one ages at a slightly different rate)
    life -= 0.002 + random(uv) * 0.004;
    if (life <= 0.0) {
      pos = spawnPosition(uv);
      life = 1.0;
    }

    gl_FragColor = vec4(pos, life);
  }
`;

// ---- Render shader ----

// Each quad's 4 corners are small offsets around (0, 0), and all 4 share
// a texture coordinate that points at that particle's pixel in the state
// framebuffer. The shader looks up the position there and moves the quad to it.
const renderVertSrc = /* glsl */ `
  precision highp float;
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  attribute vec3 aPosition; // this corner's offset from the particle center
  attribute vec2 aTexCoord; // which pixel in uState holds this particle
  varying vec4 vColor;

  uniform sampler2D uState;
  uniform sampler2D uGradient;

  void main() {
    vec4 state = texture2D(uState, aTexCoord);
    vec3 particlePos = state.xyz;
    float life = state.a;

    // grow in at birth and shrink out at death (sin goes 0 -> 1 -> 0)
    float size = sin(life * 3.14159);

    // Move the particle center into camera space, then add the corner
    // offset there. This keeps quads facing the camera as you orbit
    // (a "billboard").
    vec4 viewPos = uModelViewMatrix * vec4(particlePos, 1.0);
    viewPos.xy += aPosition.xy * size;
    gl_Position = uProjectionMatrix * viewPos;

    // color by age, using the gradient texture
    vColor = texture2D(uGradient, vec2(0.5, 1.0 - life));
  }
`;

const renderFragSrc = /* glsl */ `
  precision highp float;
  varying vec4 vColor;

  void main() {
    gl_FragColor = vColor;
  }
`;

// ---- p5 lifecycle ----

window.setup = () => {
  createCanvas(windowWidth, windowHeight, WEBGL);
  createGeometry();
  createGradient();
  createStateBuffers();

  renderShader = createShader(renderVertSrc, renderFragSrc);
  simShader = createShader(simVertSrc, simFragSrc);
  simulate(true); // fill the state with starting positions

  // two cameras: one for the 3D scene, one for the flat HUD
  hudCam = createCamera();
  sceneCam = createCamera();
  setCamera(sceneCam);

  // a 2D (not WEBGL) graphics, so text() works without loading a font
  hud = createGraphics(220, 70);
};

window.draw = () => {
  simulate(false);

  background(0);
  setCamera(sceneCam);
  orbitControl();

  shader(renderShader);
  renderShader.setUniform("uState", stateCurrent);
  renderShader.setUniform("uGradient", gradient);
  model(geoPoints);
  resetShader(); // back to p5's normal shader for the HUD

  drawHud();
};

window.windowResized = () => {
  resizeCanvas(windowWidth, windowHeight);
  // rebuild the HUD camera so it matches the new canvas size
  hudCam = createCamera();
  setCamera(sceneCam);
};

window.keyPressed = () => {
  if (key === "r") simulate(true);
};

// ---- Helper functions ----

function createStateBuffers() {
  // Settings for storing data (not pictures) in a framebuffer:
  let options = {
    width: gridSize,
    height: gridSize,
    density: 1, // exactly 1 pixel per particle, even on high-DPI screens
    format: FLOAT, // 32-bit floats per channel, so positions can be any number
    textureFiltering: NEAREST, // read exact pixels, never blend neighbors
    antialias: false, // antialiasing would blend neighboring particles' data
    depth: false, // no depth buffer needed for a flat data pass
  };
  stateCurrent = createFramebuffer(options);
  stateNext = createFramebuffer(options);
}

// Run one simulation step: read stateCurrent, write stateNext, then swap.
function simulate(reset) {
  stateNext.draw(() => {
    blendMode(REPLACE); // write values exactly, don't blend with what's there
    noStroke();
    shader(simShader);
    simShader.setUniform("uState", stateCurrent);
    simShader.setUniform("uStateSize", [gridSize, gridSize]);
    simShader.setUniform("uTime", frameCount * 0.01);
    simShader.setUniform("uReset", reset ? 1 : 0);
    simShader.setUniform("uSpeed", 1.5);
    simShader.setUniform("uNoiseScale", 0.007);
    simShader.setUniform("uSpawnRadius", 250);
    plane(1, 1); // the vertex shader stretches this to fill the framebuffer
  });

  // swap ("ping-pong"): what we just wrote becomes the current state
  [stateCurrent, stateNext] = [stateNext, stateCurrent];
}

function createGeometry() {
  let pSize = 2; // particle size in pixels
  let half = pSize / 2;

  // One quad per particle. The corners are offsets around (0, 0); the real
  // position comes from the state framebuffer in the shader. The (u, v) value
  // points at the center of this particle's pixel (hence the + 0.5).
  geoPoints = buildGeometry(() => {
    numParticles = 0;
    fill(255);
    noStroke();
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        let u = (x + 0.5) / gridSize;
        let v = (y + 0.5) / gridSize;
        beginShape(QUADS);
        vertex(-half, -half, 0, u, v);
        vertex(half, -half, 0, u, v);
        vertex(half, half, 0, u, v);
        vertex(-half, half, 0, u, v);
        endShape();
        numParticles++;
      }
    }
    print(`numParticles: ${numParticles}`);
  });
}

function createGradient() {
  gradient = createGraphics(width, height);

  // Build a vertical gradient with the browser's built-in canvas tools.
  // drawingContext is the plain HTML canvas 2D context under p5.
  let ctx = gradient.drawingContext;
  let canvasGradient = ctx.createLinearGradient(0, 0, 0, height);
  canvasGradient.addColorStop(0, "rgb(127, 0, 255)");
  canvasGradient.addColorStop(0.33, "rgb(127, 0, 255)");
  canvasGradient.addColorStop(0.66, "rgb(0, 255, 255)");
  canvasGradient.addColorStop(1, "rgb(255, 127, 0)");
  ctx.fillStyle = canvasGradient;
  ctx.fillRect(0, 0, width, height);
}

function drawHud() {
  // Switch to the HUD camera. With the default camera, (0, 0) is the
  // center of the canvas, so the top-left corner is (-width / 2, -height / 2).
  setCamera(hudCam);
  clearDepth(); // forget the 3D scene's depth, so the HUD is always on top

  let left = -width / 2;
  let top = -height / 2;

  // texture previews: the color gradient, and the raw position data
  // (positions outside 0..1 show as clipped colors, but you can see it change)
  image(gradient, left + 10, top + 10, 100, 100);
  image(stateCurrent, left + 120, top + 10, 100, 100);

  // smooth the fps so the number is readable, and only update it a few times a second
  if (frameCount % 15 === 0) {
    fpsDisplay = frameRate();
  }

  // redraw the debug text into the 2D graphics, then draw that as an image
  hud.clear();
  hud.fill(0, 160);
  hud.noStroke();
  hud.rect(0, 0, hud.width, hud.height);
  hud.fill(255);
  hud.textFont("monospace");
  hud.textSize(14);
  hud.text(`particles: ${numParticles.toLocaleString()}`, 10, 25);
  hud.text(`fps: ${fpsDisplay.toFixed(1)}`, 10, 50);
  image(hud, left + 10, top + 120);
}
