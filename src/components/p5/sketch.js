let renderObjects = []

export function sketch(p) {
  p.setup = () => {
    const canvas = p.createCanvas(400, 400)
    canvas.parent('canvas')
    p.background(0)
    p.smooth()
  }

  p.draw = () => {
    p.background(0)
    p.fill(255)

    // デバッグ用
    p.ellipse(p.mouseX, p.mouseY, 50, 50)

    renderObjects.forEach((object) => {
      p.renderTextObject(object)
    })
  }

  p.addRenderObjects = (objects) => {
    renderObjects = objects
  }

  p.renderTextObject = (object) => {4
    p.textSize(object.size)
    p.fill(object.color)
    p.text(object.text, object.X, object.Y)
  }
}


// export function hoge(){} で公開して呼び出してもいい