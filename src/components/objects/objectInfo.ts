// [Aviutlからの変更点]
// "settings"をuserdataに移設
// "selected"を追加
// 数値パラメータを配列に変更

// キーフレームの情報管理
export interface KeyframeSettings {
  value: number[]
  time: number[]
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
  name: string
  parameters: {}
}

export interface StandardRenderSettings {
  X: KeyframeSettings
  Y: KeyframeSettings
  //Z: KeyframeSettings
  scale: KeyframeSettings
  opacity: KeyframeSettings
  angle: KeyframeSettings
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
  size: KeyframeSettings
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
}

export class TextObject extends BaseObject implements TextSettings {
  X: KeyframeSettings
  Y: KeyframeSettings
  scale: KeyframeSettings
  opacity: KeyframeSettings
  angle: KeyframeSettings
  name: string
  parameters: any
  type: string
  size: KeyframeSettings
  individual_object: boolean
  align: number
  spacing_x: number
  spacing_y: number
  color: string
  font: string
  text: string

  constructor(settings: BaseSettings) {
    // 追加時は結局BaseSettingくらいの中身になる
    super(settings)
    this.X = { value: [0, 100], time: [this.start, this.end] }
    this.Y = { value: [0, 0], time: [this.start, this.end] }
    this.scale = { value: [100, 100], time: [this.start, this.end] }
    this.opacity = { value: [100, 100], time: [this.start, this.end] }
    this.angle = { value: [0, 0], time: [this.start, this.end] }
    this.name = ''
    this.parameters = []
    this.type = 'text'
    this.size = { value: [28, 28], time: [this.start, this.end] }
    this.individual_object = false
    this.align = 0
    this.spacing_x = 0
    this.spacing_y = 0
    this.color = '#ffffff'
    this.font = 'ＭＳ ゴシック'
    this.text = 'サンプルテキスト'
  }
}

export interface ImageSettings extends BaseSettings, AnimationSettings, StandardRenderSettings {
  file: string
}

export class ImageObject extends BaseObject implements ImageSettings {
  X: KeyframeSettings
  Y: KeyframeSettings
  scale: KeyframeSettings
  opacity: KeyframeSettings
  angle: KeyframeSettings
  file: string
  name: string
  parameters: any

  constructor(settings: BaseSettings) {
    super(settings)
    this.X = { value: [0, 100], time: [this.start, this.end] }
    this.Y = { value: [0, 0], time: [this.start, this.end] }
    this.scale = { value: [100, 100], time: [this.start, this.end] }
    this.opacity = { value: [100, 100], time: [this.start, this.end] }
    this.angle = { value: [0, 0], time: [this.start, this.end] }
    this.file = ''
    this.name = ''
    this.parameters = []
  }
}

export interface AudioSettings extends BaseSettings {
  file: string
}

export class AudioObject extends BaseObject implements AudioSettings {
  file: string

  constructor(settings: BaseSettings) {
    super(settings)
    this.file = ''
  }
}
