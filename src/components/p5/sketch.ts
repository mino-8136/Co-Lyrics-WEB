import { gsap } from 'gsap'
import p5 from 'p5'
import {
  type TextObject,
  type KeyframeSettings,
  type AnimationSettings,
  type StyleSettings,
  ShapeObject,
  ImageObject,
  BaseObject,
  type RenderObject
} from '@/components/parameters/objectInfo'
import { Transform, Inform, ShapeType } from '@/components/parameters/p5Info'
import { animationList } from '@/assets/effects/animation'
import { fontListData } from '../parameters/fonts'

let renderObjects: RenderObject[] = []
let currentFrame = 0
const fontLimit = true // フォントファイルを読み込むかどうかのフラグ

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
      p.background(0)

      // デバッグ用
      p.fill(255)
      p.ellipse(p.mouseX, p.mouseY, 50, 50)

      // メインの描画
      p.push()
      p.translate(p.width / 2, p.height / 2)
      p.scale(project.canvasScale)

      renderObjects.forEach((object) => {
        // テキストオブジェクトの描画
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

      p.pop()
    }
    ///////////////////////
    // スタイル処理の関数 //
    ///////////////////////

    function applyStyle(styles: StyleSettings) {}

    ////////////////////////
    // エフェクト処理の関数 //
    ////////////////////////

    // エフェクトをトランスフォームに適用する関数
    function applyEffectToTransform(baseValue: Transform, effectValue: Transform): void {
      baseValue.X += effectValue.X
      baseValue.Y += effectValue.Y
      baseValue.angle += effectValue.angle
      baseValue.scale *= effectValue.scale / 100
      baseValue.opacity *= effectValue.opacity / 100
    }

    // すべてのエフェクトを適用する関数
    function applyEffects(inform: Inform, animations: AnimationSettings): Transform {
      const baseValue = new Transform()

      animations.effects.forEach((animation) => {
        // effects 配列から対応するエフェクトを検索
        const effect = animationList.find((effect) => effect.name === animation.name)
        if (effect) {
          const effectValue = effect.applyEffect(inform, baseValue, animation.parameters)
          applyEffectToTransform(baseValue, effectValue)
        }
      })

      return baseValue
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

      // スタイライズエフェクトの処理(renderTextと同様)
      const col = p.color(object.shapeSettings.fill_color)
      col.setAlpha(lerpValue(object.standardRenderSettings.opacity, object.start))
      p.fill(col)

      // スタイルの適用
      applyStyle(object.styleSettings)

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
      const effectValue = applyEffects(inform, object.animations)
      if (effectValue.opacity == 0) return
      if (effectValue.scale == 0) return

      p.push()
      p.translate(effectValue.X, effectValue.Y)
      p.rotate(effectValue.angle)
      p.scale(effectValue.scale / 100)
      col.setAlpha(
        (lerpValue(object.standardRenderSettings.opacity, object.start) / 100) *
          (effectValue.opacity / 100) *
          100
      )
      p.fill(col)

      // 図形のレンダリングの実行
      switch (object.shapeSettings.shape) {
        case ShapeType.background:
          p.background(object.shapeSettings.fill_color)
          break
        case ShapeType.rect:
          p.rect(0, 0, object.shapeSettings.width, object.shapeSettings.height)
          break
        case ShapeType.ellipse:
          p.ellipse(0, 0, object.shapeSettings.width, object.shapeSettings.height)
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
      const col = p.color(object.textSettings.color)

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
      const totalIndex = object.textSettings.individual_object ? object.textSettings.text.length : 1

      for (let index = 0; index < totalIndex; index++) {
        // 改行の数を数える処理
        if (object.textSettings.text[index] == '\n') {
          newLineCount++
          newLineCharacterCount = 0
          continue
        }

        // エフェクト値の計算(インデックス、開始時点、エフェクトリストを渡せば十分)
        const inform = new Inform(
          index - newLineCount,
          totalIndex, // TODO: 改行などの文字数も入っている + TODO: 絵文字など複数文字に対応する
          object.start,
          object.end,
          currentFrame
        )
        const effectValue = applyEffects(inform, object.animations)
        if (effectValue.opacity == 0) return
        if (effectValue.scale == 0) return

        p.push()
        p.translate(
          object.textSettings.spacing_x * newLineCharacterCount + effectValue.X,
          object.textSettings.spacing_y * newLineCount + effectValue.Y
        )
        p.rotate(effectValue.angle)
        p.scale(effectValue.scale / 100)
        col.setAlpha(
          (lerpValue(object.standardRenderSettings.opacity, object.start) / 100) *
            (effectValue.opacity / 100) *
            100
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
    updateCanvasScale: () => void
  }
}
