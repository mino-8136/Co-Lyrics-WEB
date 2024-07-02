export class Ball {

    constructor (p5) {
      // ボールが描画される座標
      this.x = p5.random(p5.width);
      this.y = p5.random(p5.height);
  
      // 描画されるボールの半径、色、色の透明度
      this.radius = p5.random(10) + 10;
      this.fillcol = p5.color(p5.random(255), p5.random(255), p5.random(255));
      this.alph = 0;
    }
  
    // ボールを描画
    drawBall(p5) {
      // ボールの輪郭の線を消す
      p5.noStroke();
      // 色を設定
      p5.fill(this.fillcol, this.alph);
      // (x, y) に半径 radius の円を描画
      p5.ellipse(this.x, this.y, this.radius*2, this.radius*2);
    }
  
    // ボールの位置を更新
    update(p5) {
      this.x += p5.random(-3, 3);
      this.y += p5.random(-3, 3);
  
      // 境界条件
      if (this.x > (p5.width + this.radius)) {
          this.x = 0 - this.radius;
      }
      if (this.x < (0 - this.radius)) {
          this.x = p5.width + this.radius;
      }
      if (this.y > (p5.height + this.radius)) {
          this.y = 0 - this.radius;
      }
      if (this.y < (0 - this.radius)) {
          this.y = p5.height + this.radius;
      }
  
      // 更新した座標で再描画
      this.drawBall(p5);
    }
  
    // マウスのクリック位置に集まる
    agg(p5, mouseX, mouseY) {
      const v = 0.02;
      // ボールとマウスの位置を計算
      let d = p5.dist(this.x, this.y, mouseX, mouseY)
  
      // 距離が 2 より大きければ、マウスに近づくように座標を更新
      if (d>2) {
          this.x += v*(mouseX-this.x) + p5.random(-10, 10);
          this.y += v*(mouseY-this.y) + p5.random(-10, 10);
      }
  
      // 更新した座標で再描画
      this.drawBall(p5);
    }
  }
  