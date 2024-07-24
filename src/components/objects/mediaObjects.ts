// [Aviutlからの変更点]
// "settings"をuserdataに移設
// "selected"を追加

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
  X: number
  Y: number
  //Z: number
  scale: number
  transparency: number
  rotation: number
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
  //type: string
  //name: string
  size: number
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
  X: number
  Y: number
  scale: number
  transparency: number
  rotation: number
  name: string
  parameters: any
  size: number
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
    this.X = 0
    this.Y = 0
    this.scale = 100
    this.transparency = 100
    this.rotation = 0
    this.name = ''
    this.parameters = []
    this.size = 90
    this.individual_object = false
    this.align = 0
    this.spacing_x = 0
    this.spacing_y = 0
    this.color = 'ffffff'
    this.font = 'ＭＳ ゴシック'
    this.text = 'サンプルテキスト'
  }
}

export interface ImageSettings extends BaseSettings, AnimationSettings, StandardRenderSettings {
  file: string
}

export class ImageObject extends BaseObject implements ImageSettings {
  X: number
  Y: number
  scale: number
  transparency: number
  rotation: number
  file: string
  name: string
  parameters: any

  constructor(settings: BaseSettings) {
    super(settings)
    this.X = 0
    this.Y = 0
    this.scale = 100
    this.transparency = 100
    this.rotation = 0
    this.file = ''
    this.name = ''
    this.parameters = []
  }
}
