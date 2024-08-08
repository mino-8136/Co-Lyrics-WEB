let renderObjects = []
let currentFrame = 0

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
    p.textSize(object.size[0].value)
    p.fill(object.color)
    p.translate(AnimationPosition(object.X), AnimationPosition(object.Y))
    p.rotate(object.angle[0].value)
    p.scale(object.scale[0].value / 100)
    p.text(object.text, 0, 0)
    p.pop()
  }

  // アニメーション位置を決める関数
  function AnimationPosition(param) {
    // Parameterが配列であるという前提で行く
    const length = param.length
    if (length === 1) {
      return param[0].value
    } else {
      return (
        param[0].value +
        ((param[1].value - param[0].value) * (Math.min(param[1].frame, Math.max(param[0].frame, currentFrame)) - param[0].frame)) /
          (param[1].frame - param[0].frame)
      )
    }
  }
  // 外部に公開するための関数
  p.addRenderObjects = (objects) => {
    //console.log(objects)
    renderObjects = objects
  }

  p.updateCurrentFrame = (frame) => {
    currentFrame = frame
  }
}

// export function hoge(){} で公開して呼び出してもいい
