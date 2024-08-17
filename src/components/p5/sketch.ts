import { gsap } from 'gsap'
import type p5 from 'p5'
import type { TextObject, KeyframeSettings } from '@/components/objects/objectInfo'

let renderObjects: TextObject[] = []
let currentFrame = 0
let fonts: p5.Font

export function defineSketch(project) {
  return function sketch(p: p5) {
    p.preload = () => {
      fonts = p.loadFont('src/assets/fonts/SourceHanSansJP/SourceHanSansJP-Medium.otf')
    }
    p.setup = () => {
      const canvas = p.createCanvas(
        project.width * project.canvasScale,
        (project.width / 16) * 9 * project.canvasScale
      )
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
        // individual_objectがtrueかつ、char_cacheが未定義の場合、分解してキャッシュする
        if (object.individual_object && object.char_cache.length == 0) {
          object.char_cache = addCharCache(object)
        }

        // テキストオブジェクトの描画
        if (object.individual_object) {
          renderIndividualText(object)
        } else {
          renderTextObject(object)
        }
      })

      p.pop()
    }

    //////////////////////
    // テキスト周りの関数 //
    //////////////////////
    class CharacterObject {
      index: number
      parent: TextObject
      char: string
      animX: number
      animY: number
      animScale: number
      animOpacity: number
      animAngle: number

      constructor(index: number, parent: TextObject) {
        ;(this.index = index),
          (this.parent = parent),
          (this.char = parent.text[index]),
          (this.animX = 0),
          (this.animY = 0),
          (this.animScale = 0),
          (this.animOpacity = 0),
          (this.animAngle = 0)
      }
    }

    // テキストオブジェクトからcharacterオブジェクトを生成する関数
    const addCharCache = (object: TextObject) => {
      const char_cache = [] // キャッシュの初期化
      for (let i = 0; i < object.text.length; i++) {
        const charObject = new CharacterObject(i, object)
        char_cache.push(charObject)
      }
      return char_cache
    }

    // レンダリングを担当する関数
    // TODO: object.individual_objectがtrueの場合, object.charaterを使うようにする
    const renderTextObject = (object: TextObject) => {
      p.push()
      p.textFont(fonts)
      p.textSize(object.textSize[0].value)
      p.fill(object.color)
      p.translate(lerpValue(object.X, object.start), lerpValue(object.Y, object.start))
      p.rotate(object.angle[0].value)
      p.scale(object.scale[0].value / 100)
      p.text(object.text, 0, 0)
      p.pop()
    }

    const renderIndividualText = (object: TextObject) => {
      p.push()
      p.textFont(fonts)
      p.textSize(object.textSize[0].value)
      p.fill(object.color)
      object.char_cache.forEach((charObject: CharacterObject) => {
        p.push()
        p.translate(
          lerpValue(object.X, object.start) +
            object.spacing_x * charObject.index +
            charObject.animX,
          lerpValue(object.Y, object.start) + object.spacing_y * charObject.index + charObject.animY
        )
        p.rotate(object.angle[0].value + charObject.animAngle)
        p.scale((object.scale[0].value + charObject.animScale) / 100)
        p.text(charObject.char, 0, 0)
        p.pop()
      })
    }

    ////////////////////////////////

    // アニメーション位置を決める関数
    function lerpValue(param: KeyframeSettings[], objectStartFrame: number) {
      // Parameterが配列であるという前提で行く
      const lastSection = param.length - 1
      const currentSection = getCurrentSection(param, objectStartFrame)
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
        currentFrame - objectStartFrame
      )
      return currentValue
    }

    // アニメーションの値を補完する関数
    function getEaseValue(
      param: KeyframeSettings[],
      currentSection: number,
      nextSection: number,
      currentFrame: number
    ) {
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
    function getCurrentSection(param: KeyframeSettings[], objectStartFrame: number) {
      let index = -1
      for (let i = 0; i < param.length; i++) {
        if (objectStartFrame + param[i].frame <= currentFrame) {
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
    p.addRenderObjects = (currentObjects: TextObject) => {
      //console.log(objects)
      renderObjects = currentObjects
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
