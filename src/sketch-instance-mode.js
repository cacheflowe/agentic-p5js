import p5 from "p5";

const sketch = (s) => {
  s.setup = () => {
    s.createCanvas(400, 400);
  };

  s.draw = () => {
    s.background(220);
    s.fill(0);
    s.text("We're in instance mode!", 20, 30);
    s.fill(100, 150, 255);
    s.ellipse(s.mouseX, s.mouseY, 50, 50);
  };
};

// Initialize the sketch (attach to the body or a specific DOM element)
new p5(sketch);
