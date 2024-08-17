import { gsap } from 'gsap'
import type p5 from 'p5'
import type { TextObject } from '@/components/objects/objectInfo'

let renderObjects: TextObject[] = []
let currentFrame = 0
let fonts: p5.Font

export function defineSketch(project) {
  return function sketch(p: p5) {
    p.preload = () => {
      fonts = p.loadFont('src/assets/fonts/SourceHanSansJP/SourceHanSansJP-Medium.otf')
    }
    p.setup = () => {
      
      const canvas = p.createCanvas(project.width * project.canvasScale, project.width / 16 * 9 * project.canvasScale)
      canvas.parent('canvas')

      p.smooth()
      p.angleMode(p.DEGREES)
      p.frameRate(project.framerate)

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
      p.scale(project.canvasScale)
      renderObjects.forEach((object) => {
        p.renderTextObject(object)
      })
      p.pop()
    }

    // テキストを分解する関数
    p.splitText = (text) => {
      return 0
    }

    // レンダリングを担当する関数
    p.renderTextObject = (object) => {
      p.push()
      p.textFont(fonts)
      p.textSize(object.size[0].value)
      p.fill(object.color)
      p.translate(
        AnimationPosition(object.X, object.start),
        AnimationPosition(object.Y, object.start)
      )
      p.rotate(object.angle[0].value)
      p.scale(object.scale[0].value / 100)
      p.text(object.text, 0, 0)
      p.pop()
    }

    ////////////////////////////////

    // アニメーション位置を決める関数
    function AnimationPosition(param, initFrame) {
      // Parameterが配列であるという前提で行く
      const lastSection = param.length - 1
      const currentSection = getCurrentSection(param, initFrame)
      const nextSection = currentSection + 1

      // 最初の相対キーフレームに到達していない場合、最初の値で止める
      if (currentSection === -1) {
        return param[0].value
      }

      // 最後の相対キーフレームに到達していた場合、最後の値で止める
      // console.log(param, "curr: ", currentSection, "last: " , lastSection)
      if (currentSection == lastSection) {
        return param[currentSection].value
      }

      // それ以外の場合、値を補完して返す
      const currentValue = getEaseValue(
        param,
        currentSection,
        nextSection,
        currentFrame - initFrame
      )
      return currentValue
    }

    // アニメーションの値を補完する関数
    function getEaseValue(param, currentSection, nextSection, currentFrame) {
      const initialValue = param[currentSection].value
      const deltaValue = param[nextSection].value - param[currentSection].value
      const progress =
        (gsap.utils.clamp(param[currentSection].frame, param[nextSection].frame, currentFrame) -
          param[currentSection].frame) /
        (param[nextSection].frame - param[currentSection].frame)
      return (
        initialValue +
        deltaValue * getAnimationStateAtTime(progress, param[currentSection].animation)
      )
    }

    // keyframeに登録されたGSAPのアニメーションの実行結果を返す関数
    function getAnimationStateAtTime(progress, easeType) {
      if (easeType === 'none' || easeType == null) {
        return progress
      }
      const easingFunction = gsap.parseEase(easeType)
      return easingFunction(progress)
    }

    // どの区間のフレームを参照するかを求める(CurrentFrameを超えない最大のキーフレーム)
    // 最初のキーフレームに到達していない場合に-1を返す
    function getCurrentSection(param, initFrame) {
      let index = -1
      for (let i = 0; i < param.length; i++) {
        if (initFrame + param[i].frame <= currentFrame) {
          index = i
        } else {
          break
        }
      }
      return index
    }

    ////////////////////////////
    // 外部に公開するための関数 //
    ////////////////////////////
    p.addRenderObjects = (objects: TextObject) => {
      //console.log(objects)
      renderObjects = objects
    }

    p.updateCurrentFrame = (frame: number) => {
      currentFrame = frame
    }

    p.updateCanvasScale = () => {
      p.resizeCanvas(project.width * project.canvasScale, project.height * project.canvasScale)
    }
  }
}
// export function hoge(){} で公開して呼び出してもいい
