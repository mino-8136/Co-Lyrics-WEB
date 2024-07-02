
let changeColorFlag = false;

export function sketch(p) {
  p.setup = () => {
    const canvas = p.createCanvas(400, 400);
    canvas.parent('canvas');
    p.background(0);
    p.smooth();
  };

  p.draw = () => {
    p.background(0);
    p.fill(255);

    if (changeColorFlag) {
      p.fill(p.random(255), p.random(255), p.random(255));
      if(p.frameCount >= 100){
        changeColorFlag = false;
      }
    }
    p.ellipse(p.mouseX, p.mouseY, 50, 50);
  };

  p.changeColor = () => {
    console.log('changeColor');
    changeColorFlag = true;
  }
}


// export function hoge(){} で公開して呼び出してもいい