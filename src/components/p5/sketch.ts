// src/components/p5/sketch.js
export default function sketch(p) {
  p.setup = () => {
    let canvas = p.createCanvas(400, 400);
    canvas.parent('p5Canvas');
    p.background(0);
  };

  p.draw = () => {
    p.background(0);
    p.fill(255);
    p.ellipse(p.mouseX, p.mouseY, 50, 50);
  };
}