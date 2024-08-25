// [Aviutlからの変更点]
// "settings"をuserdataに移設
// 数値パラメータを配列に変更
// anim_name, anim_parametersをanimations配列に統合

// キーフレームの情報管理
export interface KeyframeSetting {
  value: number
  frame: number
  id: string
  easeType?: string
}

export type KeyframeSettings = KeyframeSetting[]

// KeyframeSettings 型か number 型かを判定する関数
// TODO:配列かどうかで判定しているので、もう少し詳細の判定が必要
export function isKeyframeSettings(element: any): element is KeyframeSettings {
  return Array.isArray(element)
}

export interface AnimationSetting {
  anim_name: string
  anim_parameters: { [key: string]: any }
}

export type AnimationSettings = AnimationSetting[]

// エフェクト処理用の相対パラメータ
export class Transform {
  id: number
  start: number
  X: number
  Y: number
  scale: number
  opacity: number
  angle: number

  constructor(id: number, start: number) {
    this.id = id ?? 0
    this.start = start ?? 0
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
  parent: TextObject
  text: string

  constructor(index: number, parent: TextObject) {
    ;(this.id = index), (this.parent = parent), (this.text = parent.text[index])
  }
}

//////////////////////////////////////////////////////////////

export interface BaseSettings {
  id: number
  start: number
  end: number
  layer: number
  type: string
  //overlay: number
  //camera: number
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
  type: string
  //overlay: number
  //camera: number

  constructor(settings: BaseSettings) {
    this.id = settings.id
    this.start = settings.start
    this.end = settings.end
    this.layer = settings.layer
    this.type = 'base'
    //this.overlay = settings.overlay
    //this.camera = settings.camera
  }
}

export interface TextSettings extends BaseSettings, StandardRenderSettings {
  //name: string
  textSize: number
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
  X: KeyframeSettings
  Y: KeyframeSettings
  scale: KeyframeSettings
  opacity: KeyframeSettings
  angle: KeyframeSettings
  animations: AnimationSettings
  type: string
  textSize: number
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
    this.X = [{ value: 0, frame: 0, id: '0' }]
    this.Y = [{ value: 0, frame: 0, id: '0' }]
    this.scale = [{ value: 100, frame: 0, id: '0' }]
    this.opacity = [{ value: 100, frame: 0, id: '0' }]
    this.angle = [{ value: 0, frame: 0, id: '0' }]
    this.animations = []
    this.type = 'text'
    this.textSize = 40
    this.individual_object = false
    this.align = 0
    this.spacing_x = 30
    this.spacing_y = 0
    this.color = '#ffffff'
    this.font = 'SourceHanSansJP'
    this.text = 'サンプルテキスト'
    this.char_cache = []
  }
}

export interface ImageSettings extends BaseSettings, StandardRenderSettings {
  file: string
}

export class ImageObject extends BaseObject implements ImageSettings {
  X: KeyframeSettings
  Y: KeyframeSettings
  scale: KeyframeSettings
  opacity: KeyframeSettings
  angle: KeyframeSettings
  animations: AnimationSettings
  file: string

  constructor(settings: BaseSettings) {
    super(settings)
    this.X = [{ value: 0, frame: 0, id: '0' }]
    this.Y = [{ value: 0, frame: 0, id: '0' }]
    this.scale = [{ value: 100, frame: 0, id: '0' }]
    this.opacity = [{ value: 100, frame: 0, id: '0' }]
    this.angle = [{ value: 0, frame: 0, id: '0' }]
    this.animations = []
    this.file = ''
  }
}
