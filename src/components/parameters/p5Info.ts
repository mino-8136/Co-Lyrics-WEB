import type p5 from 'p5'
import { type KeyframeSetting } from './keyframeInfo'
import gsap from 'gsap'

// エフェクト処理用の相対パラメータ
export class Transform {
  X: number
  Y: number
  scale: number
  opacity: number
  angle: number

  constructor() {
    this.X = 0
    this.Y = 0
    this.scale = 100
    this.opacity = 100
    this.angle = 0
  }
}

// 受け取ったobjectのパラメータをすべて百分率にして返す関数
export const convertToPercentage = (param: KeyframeSetting[]): KeyframeSetting[] => {
  const convertedParam = JSON.parse(JSON.stringify(param))
  convertedParam.forEach((keyframe: { value: number }) => {
    keyframe.value = keyframe.value / 100
  })
  return convertedParam
}

// キーフレーム間の値を補完する関数1
export function lerpValue(
  keyframes: KeyframeSetting[],
  objectStartFrame: number,
  currentFrame: number
): number {
  // Parameterが配列ではない場合はそのまま返す
  if (!Array.isArray(keyframes)) return keyframes


  const lastSection = keyframes.length - 1
  const currentSection = getCurrentSection(keyframes, objectStartFrame, currentFrame)
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
export function getEaseValue(
  param: KeyframeSetting[],
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
    initialValue + deltaValue * getAnimationStateAtTime(progress, param[currentSection].easeType)
  )
}

// keyframeに登録されたGSAPのアニメーションの実行結果を返す関数
export function getAnimationStateAtTime(progress: number, easeType: string | undefined) {
  if (easeType === 'none' || easeType == null) {
    return progress
  }
  const easingFunction = gsap.parseEase(easeType)
  return easingFunction(progress)
}

// どの区間のフレームを参照するかを求める(CurrentFrameを超えない最大のキーフレーム)
// 最初のキーフレームに到達していない場合に-1を返す
export function getCurrentSection(
  param: KeyframeSetting[],
  objectStartFrame: number,
  currentFrame: number
): number {
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

// エフェクトをトランスフォームに適用する関数
export function applyEffectToTransform(baseValue: Transform, effectValue: Transform): void {
  baseValue.X += effectValue.X
  baseValue.Y += effectValue.Y
  baseValue.angle += effectValue.angle
  baseValue.scale *= effectValue.scale / 100
  baseValue.opacity *= effectValue.opacity / 100
}

export class Inform {
  index: number
  totalIndex: number
  start: number
  end: number
  currentFrame: number
  p5: p5 // エフェクト等を適用する先

  constructor(
    index: number = 0,
    totalIndex: number = 0,
    start: number = 0,
    end: number = 0,
    currentFrame: number = 0,
    p5: p5
  ) {
    this.index = index
    this.totalIndex = totalIndex
    this.start = start
    this.end = end
    this.currentFrame = currentFrame
    this.p5 = p5
  }
}

export enum ShapeType {
  background = '背景',
  rect = '四角形',
  ellipse = '円'
}

export enum TextAlignX {
  left = '左揃え',
  center = '中央揃え',
  right = '右揃え'
}

export enum TextAlignY {
  top = '上揃え',
  center = '中央揃え',
  bottom = '下揃え'
}
