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
    const lastSection = param.length - 1
    const currentSection = getFrameSection(param)
    const nextSection = currentSection + 1

    // 最初のキーフレームに到達していない場合、最初の値で止める
    if (currentSection === -1) {
      return param[0].value
    }

    // 最後のキーフレームに到達していた場合、最後の値で止める
    // console.log(param, "curr: ", currentSection, "last: " , lastSection)
    if (currentSection == lastSection) {
      return param[currentSection].value
    }

    // それ以外の場合、仮に線形補間する
    const currentValue =
      param[currentSection].value +
      ((param[nextSection].value - param[currentSection].value) *
        (Math.min(param[nextSection].frame, Math.max(param[currentSection].frame, currentFrame)) -
          param[currentSection].frame)) /
        (param[nextSection].frame - param[currentSection].frame)
    return currentValue
  }

  // どの区間のフレームを参照するかを求める(CurrentFrameを超えない最大のキーフレーム)
  // 最初のキーフレームに到達していない場合に-1を返す
  function getFrameSection(param) {
    let index = -1
    for (let i = 0; i < param.length; i++) {
      if (param[i].frame <= currentFrame) {
        index = i
      } else {
        break
      }
    }
    return index
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
