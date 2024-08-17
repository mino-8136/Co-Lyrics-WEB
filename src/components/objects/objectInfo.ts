// [Aviutlからの変更点]
// "settings"をuserdataに移設
// "selected"を追加
// 数値パラメータを配列に変更

// キーフレームの情報管理
export interface KeyframeSettings {
  value: number
  frame: number
  animation?: string
}

// KeyframeSettings 型か number 型かを判定する関数
// TODO:配列かどうかで判定しているので、もう少し詳細の判定が必要
export function isKeyframeSettings(element: any): element is KeyframeSettings {
  return Array.isArray(element)
}

export interface BaseSettings {
  id: number
  start: number
  end: number
  layer: number
  //overlay: number
  //camera: number
  selected: boolean
}

export interface AnimationSettings {
  anim_name: string
  anim_parameters: {}
}

export interface StandardRenderSettings {
  X: KeyframeSettings[]
  Y: KeyframeSettings[]
  //Z: KeyframeSettings[]
  scale: KeyframeSettings[]
  opacity: KeyframeSettings[]
  angle: KeyframeSettings[]
  //blend: number
}

export class BaseObject implements BaseSettings {
  id: number
  start: number
  end: number
  layer: number
  //overlay: number
  //camera: number
  selected: boolean

  constructor(settings: BaseSettings) {
    this.id = settings.id
    this.start = settings.start
    this.end = settings.end
    this.layer = settings.layer
    //this.overlay = settings.overlay
    //this.camera = settings.camera
    this.selected = false
  }
}

export interface TextSettings extends BaseSettings, AnimationSettings, StandardRenderSettings {
  type: string
  //name: string
  size: KeyframeSettings[]
  //display_speed: number
  individual_object: boolean
  //display_coordinates: boolean
  //auto_scroll: boolean
  //bold: boolean
  //italic: boolean
  //autoadjust: boolean
  //soft: boolean
  //monospace: boolean
  align: number
  spacing_x: number
  spacing_y: number
  //precision: number
  color: string
  //color2: '000000'
  font: string
  text: string
  char_cache: string[] // 効率的な描画のために分解したテキストを保持する(p5.jsで利用)
}

export class TextObject extends BaseObject implements TextSettings {
  X: KeyframeSettings[]
  Y: KeyframeSettings[]
  scale: KeyframeSettings[]
  opacity: KeyframeSettings[]
  angle: KeyframeSettings[]
  anim_name: string
  anim_parameters: any
  type: string
  size: KeyframeSettings[]
  individual_object: boolean
  align: number
  spacing_x: number
  spacing_y: number
  color: string
  font: string
  text: string
  char_cache: any // 本当はp5jsのcharacterObjects型

  constructor(settings: BaseSettings) {
    // 追加時は結局BaseSettingくらいの中身になる
    super(settings)
    this.X = [
      { value: 0, frame: this.start },
      { value: 100, frame: this.end }
    ]
    this.Y = [{ value: 0, frame: this.start }]
    this.scale = [{ value: 100, frame: this.start }]
    this.opacity = [{ value: 100, frame: this.start }]
    this.angle = [{ value: 0, frame: this.start }]
    this.anim_name = 'サンプル'
    this.anim_parameters = []
    this.type = 'text'
    this.size = [{ value: 28, frame: this.start }]
    this.individual_object = false
    this.align = 0
    this.spacing_x = 20
    this.spacing_y = 20
    this.color = '#ffffff'
    this.font = 'SourceHanSansJP'
    this.text = 'サンプルテキスト'
    this.char_cache = []
  }
}

export interface ImageSettings extends BaseSettings, AnimationSettings, StandardRenderSettings {
  file: string
}

export class ImageObject extends BaseObject implements ImageSettings {
  X: KeyframeSettings[]
  Y: KeyframeSettings[]
  scale: KeyframeSettings[]
  opacity: KeyframeSettings[]
  angle: KeyframeSettings[]
  file: string
  anim_name: string
  anim_parameters: any

  constructor(settings: BaseSettings) {
    super(settings)
    this.X = [
      { value: 0, frame: this.start },
      { value: 100, frame: this.end }
    ]
    this.Y = [{ value: 0, frame: this.start }]
    this.scale = [{ value: 100, frame: this.start }]
    this.opacity = [{ value: 100, frame: this.start }]
    this.angle = [{ value: 0, frame: this.start }]
    this.file = ''
    this.anim_name = ''
    this.anim_parameters = []
  }
}
