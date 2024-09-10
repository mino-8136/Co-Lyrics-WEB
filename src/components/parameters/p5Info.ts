import type p5 from 'p5'
import {type KeyframeSetting } from './keyframeInfo'
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
