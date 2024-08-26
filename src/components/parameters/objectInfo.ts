// [Aviutlからの変更点]
// "settings"をuserdataに移設
// 数値パラメータを配列に変更
// anim_name, anim_parametersをanimations配列に統合

import { CharacterObject, ShapeType } from './p5Info'
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

//////////////////////////////////////////////////////////////

export interface AnimationSetting {
  name: string
  parameters: { [key: string]: any }
  id: string
}
export type AnimationSettings = AnimationSetting[]

export interface StyleSetting {
  name: string
  parameters: { [key: string]: any }
  id: string
}
export type StyleSettings = StyleSetting[]

//////////////////////////////////////////////////////////////

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
  type: typeString
  //overlay: number
  //camera: number

  constructor(id: number, start: number, end: number, layer: number, type: typeString) {
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
    scale: { name: '拡大率', type: UIType.keyframe, min: 0, max: 500 },
    opacity: { name: '不透明度', type: UIType.keyframe, min: 0, max: 100 },
    angle: { name: '回転', type: UIType.keyframe, min: -360, max: 360 }
  }

  constructor({
    X = [{ value: 0, frame: 0, id: '0' }],
    Y = [{ value: 0, frame: 0, id: '0' }],
    scale = [{ value: 100, frame: 0, id: '0' }],
    opacity = [{ value: 100, frame: 0, id: '0' }],
    angle = [{ value: 0, frame: 0, id: '0' }]
  } = {}) {
    super()
    this.X = X
    this.Y = Y
    this.scale = scale
    this.opacity = opacity
    this.angle = angle
  }
}

export class TextSettings extends PropertyMethod {
  text: string
  color: string
  font: string
  spacing_x: number
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

  spacing_y: number
  //precision: number
  //color2: '000000'

  char_cache: CharacterObject[] | any // 効率的な描画のために分解したテキストを保持する(p5.jsで利用)

  static parameterInfo = {
    textSize: { name: 'サイズ', type: UIType.none, min: 1, max: 100 },
    individual_object: { name: 'バラバラ', type: UIType.checkbox },
    align: { name: '整列', type: UIType.none },
    spacing_x: { name: '水平間隔', type: UIType.slider, min: 0, max: 100 },
    spacing_y: { name: '垂直間隔', type: UIType.none, min: 0, max: 100 },
    color: { name: '色', type: UIType.color },
    font: { name: 'フォント', type: UIType.select },
    text: { name: 'テキスト', type: UIType.text },
    char_cache: { name: 'キャッシュ', type: UIType.none }
  }

  constructor({
    textSize = 40,
    individual_object = true,
    align = 0,
    spacing_x = 40,
    spacing_y = 0,
    color = '#ffffff',
    font = 'SourceHanSansJP',
    text = 'サンプルテキスト',
    char_cache = []
  } = {}) {
    super()
    this.textSize = textSize
    this.individual_object = individual_object
    this.align = align
    this.spacing_x = spacing_x
    this.spacing_y = spacing_y
    this.color = color
    this.font = font
    this.text = text
    this.char_cache = char_cache
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

export class ShapeSettings extends PropertyMethod {
  width: number
  height: number
  fill_color: string
  shape: ShapeType

  static parameterInfo = {
    width: { name: '幅', type: UIType.slider, min: 0, max: 2000 },
    height: { name: '高さ', type: UIType.slider, min: 0, max: 2000 },
    fill_color: { name: '塗りつぶし', type: UIType.color },
    shape: { name: '図形', type: UIType.select }
  }

  constructor() {
    super()
    this.width = 200
    this.height = 200
    this.fill_color = '#ffffff'
    this.shape = ShapeType.rect
  }
}

/////////////////////////
// 各オブジェクトの実装  //
/////////////////////////

export class BaseObject implements BaseSettings {
  id: number
  start: number
  end: number
  layer: number
  type: typeString
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
  styleSettings: StyleSettings
  animations: AnimationSettings

  constructor(settings: BaseSettings) {
    super(settings)
    this.type = 'text'
    this.standardRenderSettings = new StandardRenderSettings()
    this.textSettings = new TextSettings()
    this.styleSettings = []
    this.animations = []
  }
}

export class ImageObject extends BaseObject {
  standardRenderSettings: StandardRenderSettings
  imageSettings: ImageSettings
  styleSettings: StyleSettings
  animations: AnimationSettings

  constructor(settings: BaseSettings) {
    super(settings)
    this.type = 'image'
    this.standardRenderSettings = new StandardRenderSettings()
    this.imageSettings = new ImageSettings()
    this.styleSettings = []
    this.animations = []
  }
}

export class ShapeObject extends BaseObject {
  standardRenderSettings: StandardRenderSettings
  shapeSettings: ShapeSettings
  styleSettings: StyleSettings
  animations: AnimationSettings

  constructor(settings: BaseSettings) {
    super(settings)
    this.type = 'shape'
    this.standardRenderSettings = new StandardRenderSettings()
    this.shapeSettings = new ShapeSettings()
    this.styleSettings = []
    this.animations = []
  }
}

//////////////////////////////////////
// オブジェクトが増えたら適宜追加する  //
//////////////////////////////////////
export type typeString = '' | 'base' | 'text' | 'image' | 'shape'
export type RenderObject = TextObject | BaseObject | ShapeObject | ImageObject

// 指定されたパラメータからオブジェクトを生成する(ファイル保存処理のみで使用)
export function createObject(obj: RenderObject): any {
  const types = {
    text: TextObject,
    image: ImageObject,
    base: BaseObject,
    shape: ShapeObject,
    '': BaseObject
  }

  const ClassRef = types[obj.type] || BaseObject
  const newObj = new ClassRef({
    id: obj.id,
    start: obj.start,
    end: obj.end,
    layer: obj.layer,
    type: obj.type
  })

  return newObj
}
