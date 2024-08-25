// エフェクト処理用の相対パラメータ
export class Transform {
  id: number
  start: number
  X: number
  Y: number
  scale: number
  opacity: number
  angle: number

  constructor(id: number = 0, start: number = 0) {
    this.id = id
    this.start = start
    this.X = 0
    this.Y = 0
    this.scale = 100
    this.opacity = 100
    this.angle = 0
  }
}

// p5.js内で用いるのがメイン
export class CharacterObject {
  id: number
  text: string

  constructor(index: number, text: string) {
    this.id = index
    this.text = text
  }
}