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
  id: number
  totalId: number
  start: number
  end: number
  currentFrame: number

  constructor(
    id: number = 0,
    totalId: number = 0,
    start: number = 0,
    end: number = 0,
    currentFrame: number = 0
  ) {
    this.id = id
    this.totalId = totalId
    this.start = start
    this.end = end
    this.currentFrame = currentFrame
  }
}

export enum ShapeType {
  background = '背景',
  rect = '四角形',
  ellipse = '円'
}
