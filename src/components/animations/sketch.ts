import { gsap } from 'gsap'
import type p5 from 'p5'
import {
  type TextObject,
  type KeyframeSetting,
  type KeyframeSettings,
  type AnimationSettings,
  Transform
} from '@/components/parameters/objectInfo'
import { CharacterObject } from '@/components/parameters/objectInfo'
import { effects } from '@/components/animations/animation'

let renderObjects: TextObject[] = []
let currentFrame = 0
let fonts: p5.Font

export function defineSketch(project: any) {
  // 実際はtimelineStoreを引数に取る
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
      p.colorMode(p.RGB, 255, 255, 255, 100)
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
        // テキストオブジェクトの描画
        renderText(object)
      })

      p.pop()
    }

    //////////////////////////////
    // テキストレンダリングの関数 //
    //////////////////////////////

    // テキストオブジェクトからcharacterオブジェクトを生成する関数
    const addCharCache = (object: TextObject) => {
      const char_cache = [] // キャッシュの初期化
      for (let i = 0; i < object.text.length; i++) {
        const charObject = new CharacterObject(i, object)
        char_cache.push(charObject)
      }
      return char_cache
    }

    // すべてのエフェクトを適用する関数
    function applyEffects(
      index: number,
      startFrame: number,
      animations: AnimationSettings
    ): Transform {
      const baseValue = new Transform(index, startFrame)

      animations.forEach((animation) => {
        // effects 配列から対応するエフェクトを検索
        const effect = effects.find((effect) => effect.name === animation.anim_name)
        if (effect) {
          // エフェクトの適用処理を呼び出し
          Object.assign(
            baseValue,
            effect.applyEffect(currentFrame, baseValue, animation.anim_parameters)
          )
        }
      })

      return baseValue
    }
    const renderText = (object: TextObject) => {
      p.push()

      // individual_objectがtrueかつ、char_cacheが未定義の場合、分解してキャッシュする
      // (TODO: この処理はpreview.vueに移したほうがwatchとかできて良いかもしれない)
      if (object.individual_object && object.char_cache.length == 0) {
        object.char_cache = addCharCache(object)
      } else if (!object.individual_object && object.char_cache.length > 0) {
        object.char_cache = []
      }

      // スタイライズエフェクトの処理
      p.textFont(fonts)
      p.textSize(object.textSize)
      const col = p.color(object.color)

      // 全体的なトランスフォームの実行
      p.translate(lerpValue(object.X, object.start), lerpValue(object.Y, object.start))
      p.rotate(lerpValue(object.angle, object.start))
      p.scale(lerpValue(convertToPercentage(object.scale), object.start))

      // p.text(object.text, 0, 0)

      // 個別のトランスフォームの実行
      const textQueue = object.char_cache.length > 0 ? object.char_cache : [object]
      textQueue.forEach((charObject: TextObject | CharacterObject) => {
        // エフェクト値の計算(インデックス、開始時点、エフェクトリストを渡せば十分)
        const effectValue = applyEffects(charObject.id, object.start, object.animations)
        if (effectValue.opacity == 0) return
        if (effectValue.scale == 0) return

        //console.log(effectValue)

        p.push()
        p.translate(
          object.spacing_x * charObject.id + effectValue.X,
          object.spacing_y * charObject.id + effectValue.Y
        )
        p.rotate(effectValue.angle)
        p.scale(effectValue.scale / 100)
        col.setAlpha(
          (lerpValue(object.opacity, object.start) / 100) * (effectValue.opacity / 100) * 100
        )
        p.fill(col)

        p.text(charObject.text, 0, 0)
        p.pop()
      })
      p.pop()
    }

    ////////////////////////////
    // キーフレームのための関数 //
    ////////////////////////////

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

    p.addRenderObjects = (currentObjects: TextObject[]) => {
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

declare module 'p5' {
  interface p5InstanceExtensions {
    addRenderObjects: (currentObjects: TextObject[]) => void
    updateCurrentFrame: (frame: number) => void
    updateCanvasScale: () => void
  }
}
