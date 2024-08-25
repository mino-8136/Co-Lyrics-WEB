// [Aviutlからの変更点]
// "settings"をuserdataに移設
// 数値パラメータを配列に変更
// anim_name, anim_parametersをanimations配列に統合

import { CharacterObject } from './p5Info'
//////////////////////////////////////////////////////////////

// キーフレームの情報管理
export interface KeyframeSetting {
  value: number
  frame: number
  id: string
  easeType?: string
}

export type KeyframeSettings = KeyframeSetting[]

// パラメータがKeyframeSettings型かを判定する関数
// TODO:配列かどうかで判定しているので、もう少し詳細の判定が必要
export function isKeyframeSettings(element: any): element is KeyframeSettings {
  return Array.isArray(element)
}

export interface AnimationSetting {
  anim_name: string
  anim_parameters: { [key: string]: any }
}

export type AnimationSettings = AnimationSetting[]

// UIの種類の管理
export enum UIType {
  none = 'none',
  keyframe = 'keyframe', // キーフレームの設定(実質slider)
  slider = 'slider',
  select = 'select',
  color = 'color',
  checkbox = 'checkbox',
  text = 'text'
}

export abstract class PropertyMethod {
  static parameterInfo: { [key: string]: any } = {}

  // 静的メソッドでパラメータ情報を取得する
  static getParameterInfo(param: string) {
    return this.parameterInfo[param]
  }
  // 日本語名を取得するメソッド
  static getParameterName(param: string) {
    return this.parameterInfo[param]?.name
  }
  // UIタイプを取得するメソッド
  static getUIType(param: string) {
    return this.parameterInfo[param]?.type
  }
  // 最大値を取得するメソッド
  static getMaxValue(param: string) {
    return 'max' in this.parameterInfo[param] ? this.parameterInfo[param].max : 100
  }
  // 最小値を取得するメソッド
  static getMinValue(param: string) {
    return 'min' in this.parameterInfo[param] ? this.parameterInfo[param].min : 0
  }
}

//////////////////////////////////////////////////////////////

export class BaseSettings {
  id: number
  start: number
  end: number
  layer: number
  type: string
  //overlay: number
  //camera: number

  constructor(id: number, start: number, end: number, layer: number, type: string) {
    this.id = id
    this.start = start
    this.end = end
    this.layer = layer
    this.type = type
  }
}

// AviUtlでの標準描画に相当する部分
export class StandardRenderSettings extends PropertyMethod {
  X: KeyframeSettings
  Y: KeyframeSettings
  //Z: KeyframeSettings
  scale: KeyframeSettings
  opacity: KeyframeSettings
  angle: KeyframeSettings
  //blend: number

  static parameterInfo = {
    X: { name: 'X座標', type: UIType.keyframe, min: -1024, max: 1024 },
    Y: { name: 'Y座標', type: UIType.keyframe, min: -1024, max: 1024 },
    scale: { name: '拡大率', type: UIType.keyframe, min: 0, max: 300 },
    opacity: { name: '不透明度', type: UIType.keyframe, min: 0, max: 100 },
    angle: { name: '回転', type: UIType.keyframe, min: -360, max: 360 }
  }

  constructor() {
    super()
    this.X = [{ value: 0, frame: 0, id: '0' }]
    this.Y = [{ value: 0, frame: 0, id: '0' }]
    this.scale = [{ value: 100, frame: 0, id: '0' }]
    this.opacity = [{ value: 100, frame: 0, id: '0' }]
    this.angle = [{ value: 0, frame: 0, id: '0' }]
  }
}

export class TextSettings extends PropertyMethod {
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
  char_cache: CharacterObject[] // 効率的な描画のために分解したテキストを保持する(p5.jsで利用)

  static parameterInfo = {
    textSize: { name: 'サイズ', type: UIType.none, min: 1, max: 100 },
    individual_object: { name: 'バラバラ', type: UIType.checkbox },
    align: { name: '整列', type: UIType.select },
    spacing_x: { name: '水平間隔', type: UIType.slider, min: 0, max: 100 },
    spacing_y: { name: '垂直間隔', type: UIType.none, min: 0, max: 100 },
    color: { name: '色', type: UIType.color },
    font: { name: 'フォント', type: UIType.select },
    text: { name: 'テキスト', type: UIType.text },
    char_cache: { name: 'キャッシュ', type: UIType.none }
  }

  constructor() {
    super()
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

export class ImageSettings extends PropertyMethod {
  file: string

  static parameterInfo = {
    file: { name: 'ファイル', type: UIType.text }
  }

  constructor() {
    super()
    this.file = ''
  }
}

/////////////////////////
// 各オブジェクトの実装  //
/////////////////////////

export class BaseObject {
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
  }
}

export class TextObject extends BaseObject {
  standardRenderSettings: StandardRenderSettings
  textSettings: TextSettings
  animations: AnimationSettings

  constructor(settings: BaseSettings) {
    super(settings)
    this.type = 'text'
    this.standardRenderSettings = new StandardRenderSettings()
    this.textSettings = new TextSettings()
    this.animations = []
  }
}

export class ImageObject extends BaseObject {
  standardRenderSettings: StandardRenderSettings
  imageSettings: ImageSettings
  animations: AnimationSettings

  constructor(settings: BaseSettings) {
    super(settings)
    this.type = 'image'
    this.standardRenderSettings = new StandardRenderSettings()
    this.imageSettings = new ImageSettings()
    this.animations = []
  }
}
