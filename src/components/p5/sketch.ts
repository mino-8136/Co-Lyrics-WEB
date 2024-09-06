import { gsap } from 'gsap'
import p5 from 'p5'
import {
  type TextObject,
  type KeyframeSettings,
  ShapeObject,
  ImageObject,
  BaseObject,
  type RenderObject
} from '@/components/parameters/objectInfo'
import { Inform, ShapeType, TextAlign } from '@/components/parameters/p5Info'
import { fontListData } from '../parameters/fonts'

let renderObjects: RenderObject[] = []
const selectedObject = {
  object: null as RenderObject | null,
  startMouseX: 0,
  startMouseY: 0,
  startObjectX: 0,
  startObjectY: 0
}
let currentFrame = 0
const fontLimit = true // フォントファイルを読み込むかどうかのフラグ
let showCollisionBox = true

const fonts: { name: string; font: p5.Font }[] = []

export function defineSketch(project: any) {
  // 実際はtimelineStoreを引数に取る
  return function sketch(p: p5) {
    p.preload = () => {
      // 全フォントデータの読み込みを行う(TODO:プロジェクトに読み込まれているものだけに限定する？)
      if (!fontLimit) {
        fontListData.forEach((font) => {
          //console.log(font.src)
          fonts.push({ name: font.name, font: p.loadFont(font.src) })
        })
      }
    }
    p.setup = () => {
      const canvas = p.createCanvas(
        project.width * project.canvasScale,
        (project.width / 16) * 9 * project.canvasScale
      )
      canvas.parent('canvas')

      p.smooth()
      p.angleMode(p.DEGREES)
      p.colorMode(p.RGB, 255, 255, 255, 100)
      p.strokeWeight(0)
      p.rectMode(p.CENTER)
      p.frameRate(project.framerate)
      p.textAlign(p.CENTER, p.CENTER)

      p.background(0)
    }

    p.draw = () => {
      p.background(80)

      // デバッグ用
      p.fill(255)
      p.ellipse(p.mouseX, p.mouseY, 50 * project.canvasScale)

      // メインの描画
      p.push()
      p.translate(p.width / 2, p.height / 2)
      p.scale(project.canvasScale)

      renderObjects.forEach((object) => {
        switch (object.type) {
          case 'text':
            renderText(object as TextObject)
            break
          case 'image':
            renderImage(object as ImageObject)
            break
          case 'shape':
            renderShape(object as ShapeObject)
            break
        }
      })

      if (showCollisionBox) {
        renderObjects.forEach((object) => {
          if (!('standardRenderSettings' in object)) return
          p.push()
          p.strokeWeight(3)
          p.stroke(255, 0, 0)
          p.noFill()
          p.rect(
            lerpValue(object.standardRenderSettings.X, object.start),
            lerpValue(object.standardRenderSettings.Y, object.start),
            50,
            50
          )
          p.pop()
        })
      }

      p.pop()
    }

    ////////////////////////
    // ドラッグして位置変更 //
    ////////////////////////

    p.mousePressed = () => {
      let nearestObject: RenderObject | null = null
      let minDistance = Infinity
      const mouseX = (p.mouseX - p.width / 2) / project.canvasScale
      const mouseY = (p.mouseY - p.height / 2) / project.canvasScale

      renderObjects.forEach((object) => {
        if (!('standardRenderSettings' in object)) return

        const objectX =
          lerpValue(object.standardRenderSettings.X, object.start) +
          object.standardRenderSettings.relativeX
        const objectY =
          lerpValue(object.standardRenderSettings.Y, object.start) +
          object.standardRenderSettings.relativeY

        const distance = p.dist(mouseX, mouseY, objectX, objectY)
        if (distance < minDistance) {
          minDistance = distance
          nearestObject = object
          selectedObject.startObjectX = objectX
          selectedObject.startObjectY = objectY
        }
      })

      if (minDistance < 50 && nearestObject) {
        selectedObject.object = nearestObject
        selectedObject.startMouseX = mouseX
        selectedObject.startMouseY = mouseY
      } else {
        selectedObject.object = null
      }
    }

    p.mouseDragged = () => {
      if (selectedObject.object && 'standardRenderSettings' in selectedObject.object) {
        const mouseX = (p.mouseX - p.width / 2) / project.canvasScale
        const mouseY = (p.mouseY - p.height / 2) / project.canvasScale

        selectedObject.object.standardRenderSettings.X.forEach((keyframe) => {
          keyframe.value += mouseX - selectedObject.startMouseX
        })
        selectedObject.object.standardRenderSettings.Y.forEach((keyframe) => {
          keyframe.value += mouseY - selectedObject.startMouseY
        })

        // マウスの現在位置を更新
        selectedObject.startMouseX = mouseX
        selectedObject.startMouseY = mouseY
      }
    }

    p.mouseReleased = () => {
      selectedObject.object = null
    }

    //////////////////////////
    // 画像レンダリングの関数 //
    //////////////////////////
    const renderImage = (object: ImageObject) => {
      return null
    }

    //////////////////////////
    // 図形レンダリングの関数 //
    //////////////////////////

    const renderShape = (object: ShapeObject) => {
      p.push()

      // スタイルの適用
      object.styleSettings.stylize(p)

      // 全体的なトランスフォームの実行(renderTextと同様)
      p.translate(
        lerpValue(object.standardRenderSettings.X, object.start),
        lerpValue(object.standardRenderSettings.Y, object.start)
      )
      p.rotate(lerpValue(object.standardRenderSettings.angle, object.start))
      p.scale(lerpValue(convertToPercentage(object.standardRenderSettings.scale), object.start))

      // エフェクト値の計算(インデックス、開始時点、エフェクトリストを渡せば十分)
      const inform = new Inform(
        0,
        1, // TODO: 改行などの文字数も入っている + TODO: 絵文字など複数文字に対応する
        object.start,
        object.end,
        currentFrame
      )
      const effectValue = object.animationSettings.animate(inform, object.animationSettings)
      if (effectValue.opacity == 0) return
      if (effectValue.scale == 0) return

      p.translate(effectValue.X, effectValue.Y)
      p.rotate(effectValue.angle)
      p.scale(effectValue.scale / 100)

      // スタイライズエフェクトの処理(renderTextと同様)
      const col = p.color(object.shapeSettings.fill_color)
      col.setAlpha(
        (lerpValue(object.standardRenderSettings.opacity, object.start) / 100) *
          (effectValue.opacity / 100) *
          p.alpha(col)
      )
      p.fill(col)

      // 図形のレンダリングの実行
      switch (object.shapeSettings.shape) {
        case ShapeType.background:
          p.background(object.shapeSettings.fill_color)
          break
        case ShapeType.rect:
          p.rect(
            0,
            0,
            lerpValue(object.shapeSettings.width, object.start),
            lerpValue(object.shapeSettings.height, object.start)
          )
          break
        case ShapeType.ellipse:
          p.ellipse(
            0,
            0,
            lerpValue(object.shapeSettings.width, object.start),
            lerpValue(object.shapeSettings.height, object.start)
          )
          break
      }
      p.pop()
    }

    //////////////////////////////
    // テキストレンダリングの関数 //
    //////////////////////////////

    const renderText = (object: TextObject) => {
      p.push()

      // スタイライズエフェクトの処理
      if (fontLimit) {
        p.textFont('Noto Sans JP')
      } else {
        if (fonts != null) {
          const foundFont = fonts.find((e) => object.textSettings.font == e.name)?.font
          p.textFont(foundFont ? foundFont : 'Arial')
        }
      }
      p.textSize(object.textSettings.textSize)

      // スタイルの適用
      object.styleSettings.stylize(p)

      // 全体的なトランスフォームの実行
      p.translate(
        lerpValue(object.standardRenderSettings.X, object.start),
        lerpValue(object.standardRenderSettings.Y, object.start)
      )
      p.rotate(lerpValue(object.standardRenderSettings.angle, object.start))
      p.scale(lerpValue(convertToPercentage(object.standardRenderSettings.scale), object.start))

      // p.text(object.text, 0, 0)

      let newLineCount = 0
      let newLineCharacterCount = 0
      const eachLineCharacters = ((text) => {
        const lines = text.split(/\r?\n/)
        const lineLengths = lines.map((lines) => lines.length)
        return lineLengths
      })(object.textSettings.text)

      const totalIndex = object.textSettings.individual_object ? object.textSettings.text.length : 1

      for (let index = 0; index < totalIndex; index++) {
        // 改行の数を数える処理
        if (object.textSettings.text[index] == '\n') {
          newLineCount++
          newLineCharacterCount = 0
          continue
        }
        const textAnchor = () => {
          if (object.textSettings.align == TextAlign.center)
            return newLineCharacterCount - (eachLineCharacters[newLineCount] - 1) / 2
          if (object.textSettings.align == TextAlign.right)
            return newLineCharacterCount - eachLineCharacters[newLineCount] + 1
          return newLineCharacterCount
        }

        // エフェクト値の計算(インデックス、開始時点、エフェクトリストを渡せば十分)
        const inform = new Inform(
          index - newLineCount,
          totalIndex, // TODO: 改行などの文字数も入っている + TODO: 絵文字など複数文字に対応する
          object.start,
          object.end,
          currentFrame
        )
        const effectValue = object.animationSettings.animate(inform, object.animationSettings)
        if (effectValue.opacity == 0) return
        if (effectValue.scale == 0) return

        p.push()
        if (object.textSettings.isVertical) {
          p.translate(
            -lerpValue(object.textSettings.spacing_x, object.start) * newLineCount + effectValue.Y,
            lerpValue(object.textSettings.spacing_y, object.start) * textAnchor() + effectValue.X
          )
        } else {
          p.translate(
            lerpValue(object.textSettings.spacing_x, object.start) * textAnchor() + effectValue.X,
            lerpValue(object.textSettings.spacing_y, object.start) * newLineCount + effectValue.Y
          )
        }

        p.rotate(effectValue.angle)
        p.scale(effectValue.scale / 100)
        const col = p.color(object.textSettings.fill_color)
        col.setAlpha(
          (lerpValue(object.standardRenderSettings.opacity, object.start) / 100) *
            (effectValue.opacity / 100) *
            p.alpha(col)
        )
        p.fill(col)

        if (object.textSettings.individual_object) {
          p.text(object.textSettings.text[index], 0, 0)
        } else {
          p.text(object.textSettings.text, 0, 0)
        }
        p.pop()

        // 後処理部分
        newLineCharacterCount++
      }
      p.pop()
    }

    //////////////////////////
    // キーフレーム処理の関数 //
    //////////////////////////

    // 受け取ったobjectのパラメータをすべて百分率にして返す関数
    const convertToPercentage = (param: KeyframeSettings): KeyframeSettings => {
      const convertedParam = JSON.parse(JSON.stringify(param))
      convertedParam.forEach((keyframe: { value: number }) => {
        keyframe.value = keyframe.value / 100
      })
      return convertedParam
    }

    // キーフレーム間の値を補完する関数1
    function lerpValue(keyframes: KeyframeSettings, objectStartFrame: number): number {
      // Parameterが配列であるという前提で行く
      const lastSection = keyframes.length - 1
      const currentSection = getCurrentSection(keyframes, objectStartFrame)
      const nextSection = currentSection + 1

      // 最初の相対キーフレームに到達していない場合、最初の値で止める
      if (currentSection === -1) {
        return keyframes[0].value
      }

      // 最後の相対キーフレームに到達していた場合、最後の値で止める
      // console.log(param, "curr: ", currentSection, "last: " , lastSection)
      if (currentSection == lastSection) {
        return keyframes[currentSection].value
      }

      // それ以外の場合、値を補完して返す
      const currentValue = getEaseValue(
        keyframes,
        currentSection,
        nextSection,
        currentFrame - objectStartFrame
      )
      return currentValue
    }

    // キーフレーム間の値を補完する関数2
    function getEaseValue(
      param: KeyframeSettings,
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
        deltaValue * getAnimationStateAtTime(progress, param[currentSection].easeType)
      )
    }

    // keyframeに登録されたGSAPのアニメーションの実行結果を返す関数
    function getAnimationStateAtTime(progress: number, easeType: string | undefined) {
      if (easeType === 'none' || easeType == null) {
        return progress
      }
      const easingFunction = gsap.parseEase(easeType)
      return easingFunction(progress)
    }

    // どの区間のフレームを参照するかを求める(CurrentFrameを超えない最大のキーフレーム)
    // 最初のキーフレームに到達していない場合に-1を返す
    function getCurrentSection(param: KeyframeSettings, objectStartFrame: number) {
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

    p.addRenderObjects = (currentObjects: RenderObject[]) => {
      //console.log(objects)
      renderObjects = currentObjects
      renderObjects.sort((a, b) => a.layer - b.layer)
    }

    p.updateCurrentFrame = (frame: number) => {
      currentFrame = frame
    }

    p.updateShowCollisionBox = (show: boolean) => {
      showCollisionBox = show
    }

    p.updateCanvasScale = () => {
      p.resizeCanvas(project.width * project.canvasScale, project.height * project.canvasScale)
    }
  }
}
// export function hoge(){} で公開して呼び出してもいい

declare module 'p5' {
  interface p5InstanceExtensions {
    addRenderObjects: (currentObjects: RenderObject[]) => void
    updateCurrentFrame: (frame: number) => void
    updateShowCollisionBox: (show: boolean) => void
    updateCanvasScale: () => void
  }
}
