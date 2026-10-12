import p5 from "p5";

// 1. Force p5 onto the global window object
window.p5 = p5;

// 2. Define your sketch functions globally
window.setup = () => {
  createCanvas(400, 400);
};

window.draw = () => {
  background(220);
  fill(255, 0, 0);
  ellipse(mouseX, mouseY, 50, 50);
};
