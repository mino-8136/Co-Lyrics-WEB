let renderObjects = []

export function sketch(p) {
  p.setup = () => {
    const canvas = p.createCanvas(400, 400)
    canvas.parent('canvas')

    p.smooth()
    p.angleMode(p.DEGREES)

    p.background(0)
  }

  p.draw = () => {
    p.background(0)

    // デバッグ用
    p.fill(255)
    p.ellipse(p.mouseX, p.mouseY, 50, 50)

    // メインの描画
    p.push()
    p.translate(p.width / 2, p.height / 2)
    renderObjects.forEach((object) => {
      p.renderTextObject(object)
    })
    p.pop()
  }

  // レンダリングを担当する関数
  p.renderTextObject = (object) => {
    p.push()
    p.textSize(object.size.value[0])
    p.fill(object.color)
    p.translate(object.X.value[0], object.Y.value[0])
    p.rotate(object.angle.value[0])
    p.scale(object.scale.value[0]/100)
    p.text(object.text, 0, 0)
    p.pop()
  }

  // 外部に公開するための関数
  p.addRenderObjects = (objects) => {
    console.log(objects)
    renderObjects = objects
  }
}

// export function hoge(){} で公開して呼び出してもいい
