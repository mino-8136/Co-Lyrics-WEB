export class BaseObjectClass {
  id: number
  start: number
  end: number
  layer: number
  overlay: number
  camera: number

  constructor(
    id: number,
    start: number,
    end: number,
    layer: number,
    overlay: number,
    camera: number
  ) {
    this.id = id
    this.start = start
    this.end = end
    this.layer = layer
    this.overlay = overlay
    this.camera = camera
  }
}

export interface TextSettings {
  size: number
  font: string
  color: string
  color2: string
  text: string
  soft: boolean
  monospace: boolean
  align: number
  spacingX: number
  spacingY: number
  precision: number
  bold: boolean
  italic: boolean
}

export class TextObjectClass extends BaseObjectClass {
  settings: TextSettings

  constructor(
    id: number,
    start: number,
    end: number,
    layer: number,
    overlay: number,
    camera: number,
    settings: TextSettings
  ) {
    super(id, start, end, layer, overlay, camera)
    this.settings = settings
  }

  // Unicode文字列をデコードするメソッド
  decodeText(encodedText: string): string {
    return decodeURIComponent(
      encodedText
        .split('')
        .map((c) => `%${('000' + c.charCodeAt(0).toString(16)).slice(-4)}`)
        .join('')
    )
  }
}

export class ImageObjectClass extends BaseObjectClass {
  file: string

  constructor(
    id: number,
    start: number,
    end: number,
    layer: number,
    overlay: number,
    camera: number,
    file: string
  ) {
    super(id, start, end, layer, overlay, camera)
    this.file = file // 画像ファイルのパス
  }
}
