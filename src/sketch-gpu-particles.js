// GPU particles foundation
//
// A grid of tiny quads ("particles") built once with buildGeometry().
// A custom vertex shader moves every particle on the GPU each frame,
// so we never loop over the particles in JavaScript inside draw().
//
// References:
// - https://p5js.org/reference/p5/shader/
// - https://p5js.org/reference/p5/p5.Geometry/
// - https://p5js.org/tutorials/custom-geometry/
// More resources:
// - https://beta.p5js.org/reference/p5/vertexproperty/ - custom attributes!
// - https://p5js.org/reference/p5/p5.Framebuffer/ - 32-bit, no antialiasing, for position storage
// - https://beta.p5js.org/tutorials/intro-to-p5-strands/
// - https://p5js.org/examples/3d-adjusting-positions-with-a-shader/
// - https://p5js.org/tutorials/optimizing-webgl-sketches/
// - https://p5js.org/examples/3d-filter-shader/

import p5 from "p5";

// Make p5 available globally so we can use global mode
window.p5 = p5;

// ---- Global variables ----
let geoPoints; // the particle grid geometry (built once)
let shaderProgram; // our custom vertex + fragment shader
let gradient; // a p5.Graphics used as a color texture
let numParticles = 0; // how many particles are in the grid

// HUD ("heads-up display") drawn flat on top of the 3D scene
let sceneCam; // the camera orbitControl() moves around
let hudCam; // a camera that never moves, for flat 2D drawing
let hud; // a small 2D p5.Graphics for debug text
let fpsDisplay = 0; // smoothed fps value shown in the HUD

// ---- Shader source code (GLSL) ----

// The vertex shader runs once for every vertex (4 per particle).
// It decides where each vertex ends up on screen.
const vertSrc = /* glsl */ `
  precision highp float;
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  attribute vec3 aPosition;
  attribute vec2 aTexCoord;
  varying vec2 vTexCoord;

  uniform float uTime;
  uniform float uDisplace;
  uniform float uNoiseAmount; // how far (in pixels) noise can push a particle
  uniform float uNoiseScale; // smaller = smoother, larger = more detailed noise
  uniform sampler2D uGradient;

  // A pseudo-random number (0 to 1) for any 2D point.
  float random(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  // Smooth "value noise" (0 to 1), similar in spirit to p5's noise().
  // It picks random values at the 4 corners of a grid cell and
  // blends between them smoothly.
  float noise(vec2 p) {
    vec2 cell = floor(p);
    vec2 f = fract(p);
    vec2 blend = f * f * (3.0 - 2.0 * f); // smooth curve instead of a straight line
    float a = random(cell);
    float b = random(cell + vec2(1.0, 0.0));
    float c = random(cell + vec2(0.0, 1.0));
    float d = random(cell + vec2(1.0, 1.0));
    return mix(mix(a, b, blend.x), mix(c, d, blend.x), blend.y);
  }

  void main() {
    vTexCoord = aTexCoord; // pass texture coords to the fragment shader
    vTexCoord = vTexCoord + vec2(0., uTime / 5.); // scroll the UV sampling
    vec4 gradientColor = texture2D(uGradient, aTexCoord.xy); // use the original lookup for displacement
    vec3 finalPos = aPosition + vec3(
      cos(uTime + aTexCoord.x * 15.) * uDisplace * gradientColor.r * 5.,
      sin(uTime + aTexCoord.y * 15.) * uDisplace * gradientColor.r * 1.,
      sin(uTime + aTexCoord.y * 15.) * uDisplace * gradientColor.r * 5.
    );

    // Noise wobble in x and y. Each particle samples the noise at its own
    // grid position, drifting through it over time. The y lookup is offset
    // so x and y move independently. (* 2.0 - 1.0 maps 0..1 to -1..1)
    vec2 noisePos = aTexCoord * uNoiseScale + uTime * 0.5;
    float noiseX = noise(noisePos) * 2.0 - 1.0;
    float noiseY = noise(noisePos + vec2(31.7, 17.3)) * 2.0 - 1.0;
    finalPos.xy += vec2(noiseX, noiseY) * uNoiseAmount;
    vec4 positionVec4 = vec4(finalPos, 1.0);
    gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
  }
`;

// The fragment shader runs once for every pixel the particles cover.
// It decides the color of each pixel.
const fragSrc = /* glsl */ `
  precision highp float;

  varying vec2 vTexCoord;

  uniform float uTime;
  uniform sampler2D uGradient;

  void main() {
    // sample the gradient color
    vec4 gradientColor = texture2D(uGradient, vTexCoord.xy);
    gl_FragColor = gradientColor;
  }
`;

// ---- p5 lifecycle ----

window.setup = () => {
  createCanvas(windowWidth, windowHeight, WEBGL);
  createGeometry();
  shaderProgram = createShader(vertSrc, fragSrc);
  createGradient();

  // two cameras: one for the 3D scene, one for the flat HUD
  hudCam = createCamera();
  sceneCam = createCamera();
  setCamera(sceneCam);

  // a 2D (not WEBGL) graphics, so text() works without loading a font
  hud = createGraphics(220, 70);
};

window.draw = () => {
  background(0);
  setCamera(sceneCam);
  orbitControl();

  // displace & display geometry
  textureWrap(REPEAT, REPEAT); // enables UV wrapping
  shader(shaderProgram);
  shaderProgram.setUniform("uTime", frameCount * 0.02);
  shaderProgram.setUniform("uDisplace", 12);
  shaderProgram.setUniform("uNoiseAmount", 30);
  shaderProgram.setUniform("uNoiseScale", 12);
  shaderProgram.setUniform("uGradient", gradient);
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

// ---- Helper functions ----

function createGeometry() {
  // config
  let gridSize = 256;
  let spacing = width / gridSize;
  let pSize = spacing * 0.8;
  let startX = (-spacing * gridSize) / 2;
  let startY = (-spacing * gridSize) / 2;

  // Build one quad per particle. Every vertex of a quad gets the same
  // (u, v) value, so the shader can treat the whole quad as one particle.
  geoPoints = buildGeometry(() => {
    numParticles = 0;
    fill(255);
    noStroke();
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        let u = x / gridSize;
        let v = y / gridSize;
        let xPos = startX + x * spacing;
        let yPos = startY + y * spacing;
        beginShape(QUADS);
        vertex(xPos, yPos, 0, u, v);
        vertex(xPos + pSize, yPos, 0, u, v);
        vertex(xPos + pSize, yPos + pSize, 0, u, v);
        vertex(xPos, yPos + pSize, 0, u, v);
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
  canvasGradient.addColorStop(0, "rgb(0, 255, 255)");
  canvasGradient.addColorStop(0.33, "rgb(127, 0, 255)");
  canvasGradient.addColorStop(0.66, "rgb(255, 127, 0)");
  canvasGradient.addColorStop(1, "rgb(0, 255, 255)");
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

  // gradient texture preview
  image(gradient, left + 10, top + 10, 100, 100);

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
