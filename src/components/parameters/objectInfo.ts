import { KeyframeSettings } from '@/components/parameters/keyframeInfo'
import {
  ShapeType,
  Transform,
  Inform,
  applyEffectToTransform,
  TextAlignX,
  TextAlignY
} from './p5Info'
import { styleList } from '@/assets/effects/style'
import { animationList } from '@/assets/effects/animation'
import { UIType } from './uiInfo'
import { deepCopy, generateUniqueId } from '../utils/common'

//////////////////////////////////////////////////////////////

// アニメーションの情報管理
export interface AnimationSetting {
  name: string
  parameters: { [key: string]: number | string | boolean | KeyframeSettings }
  id: string
}
export class AnimationSettings {
  effects: AnimationSetting[]
  constructor(animations: AnimationSetting[] = []) {
    this.effects = animations
  }

  animate(inform: Inform, animations: AnimationSettings): Transform {
    const baseValue = new Transform()

    animations.effects.forEach((animation) => {
      // effects 配列から対応するエフェクトを検索
      const effect = animationList.find((effect) => effect.name === animation.name)
      if (effect) {
        const effectValue = effect.applyEffect(inform, baseValue, animation.parameters)
        applyEffectToTransform(baseValue, effectValue)
      }
    })

    return baseValue
  }
}

// スタイルの情報管理
export interface StyleSetting {
  name: string
  parameters: { [key: string]: number | string | boolean | KeyframeSettings }
  id: string
}
export class StyleSettings {
  effects: StyleSetting[]

  constructor(styles: StyleSetting[] = []) {
    this.effects = styles
  }

  stylize(inform : Inform): void {
    this.effects.forEach((style) => {
      const effect = styleList.find((effect) => effect.name === style.name)
      if (effect) {
        effect.applyStyle(inform, style)
      }
    })
  }
}

//////////////////////////////////////////////////////////////

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

/////////////////////////
// Settings系統のクラス //
/////////////////////////

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
  relativeX: number // アニメーションによる相対座標を記録する予定
  relativeY: number
  scale: KeyframeSettings
  opacity: KeyframeSettings
  angle: KeyframeSettings
  //blend: number

  static parameterInfo = {
    X: { name: 'X', type: UIType.keyframe, min: -1024, max: 1024 },
    Y: { name: 'Y', type: UIType.keyframe, min: -1024, max: 1024 },
    relativeX: { name: '相対X', type: UIType.none },
    relativeY: { name: '相対Y', type: UIType.none },
    scale: { name: '拡大率', type: UIType.keyframe, min: 0, max: 500 },
    opacity: { name: '不透明度', type: UIType.keyframe, min: 0, max: 100 },
    angle: { name: '回転', type: UIType.keyframe, min: -360, max: 360 }
  }

  constructor({
    X = new KeyframeSettings([{ value: 0, frame: 0, id: '0' }]),
    Y = new KeyframeSettings([{ value: 0, frame: 0, id: '0' }]),
    scale = new KeyframeSettings([{ value: 100, frame: 0, id: '0' }]),
    opacity = new KeyframeSettings([{ value: 100, frame: 0, id: '0' }]),
    angle = new KeyframeSettings([{ value: 0, frame: 0, id: '0' }])
  } = {}) {
    super()
    this.X = new KeyframeSettings(X.keyframes)
    this.Y = new KeyframeSettings(Y.keyframes)
    this.relativeX = 0
    this.relativeY = 0
    this.scale = new KeyframeSettings(scale.keyframes)
    this.opacity = new KeyframeSettings(opacity.keyframes)
    this.angle = new KeyframeSettings(angle.keyframes)
  }
}

export class TextSettings extends PropertyMethod {
  text: string
  font: string
  fill_color: string
  spacing_x: KeyframeSettings
  spacing_y: KeyframeSettings
  //name: string
  textSize: number
  //display_speed: number
  //auto_scroll: boolean
  //bold: boolean
  //italic: boolean
  //autoadjust: boolean
  //soft: boolean
  //monospace: boolean
  align_x: TextAlignX
  align_y: TextAlignY
  isVertical: boolean
  individual_object: boolean

  //precision: number
  //color2: '000000

  static parameterInfo = {
    textSize: { name: 'サイズ', type: UIType.none, min: 1, max: 100 },
    isVertical: { name: '縦書き', type: UIType.checkbox },
    individual_object: { name: 'バラバラ', type: UIType.checkbox },
    spacing_x: { name: '水平間隔', type: UIType.keyframe, min: 0, max: 500 },
    spacing_y: { name: '垂直間隔', type: UIType.keyframe, min: 0, max: 500 },
    fill_color: { name: '色', type: UIType.color },
    font: { name: 'フォント', type: UIType.select },
    text: { name: 'テキスト', type: UIType.text },
    align_x: { name: '行', type: UIType.select },
    align_y: { name: '列', type: UIType.select }
  }

  constructor({
    textSize = 80,
    isVertical = false,
    individual_object = true,
    align_x = TextAlignX.center,
    align_y = TextAlignY.center,
    spacing_x = new KeyframeSettings([{ value: 80, frame: 0, id: '0' }]),
    spacing_y = new KeyframeSettings([{ value: 80, frame: 0, id: '0' }]),
    fill_color = '#ffffff',
    font = 'Noto Sans JP Bold',
    text = 'サンプル'
  } = {}) {
    super()
    this.textSize = textSize
    this.isVertical = isVertical
    this.individual_object = individual_object
    this.align_x = align_x
    this.align_y = align_y
    this.spacing_x = new KeyframeSettings(spacing_x.keyframes)
    this.spacing_y = new KeyframeSettings(spacing_y.keyframes)
    this.fill_color = fill_color
    this.font = font
    this.text = text
  }
}

export class ShapeSettings extends PropertyMethod {
  width: KeyframeSettings
  height: KeyframeSettings
  fill_color: string
  shape: ShapeType

  static parameterInfo = {
    width: { name: '幅', type: UIType.keyframe, min: 0, max: 2000 },
    height: { name: '高さ', type: UIType.keyframe, min: 0, max: 2000 },
    fill_color: { name: '塗りつぶし', type: UIType.color },
    shape: { name: '図形', type: UIType.select }
  }

  constructor({
    width = new KeyframeSettings([{ value: 200, frame: 0, id: '0' }]),
    height = new KeyframeSettings([{ value: 200, frame: 0, id: '0' }]),
    fill_color = '#D3D3D3',
    shape = ShapeType.rect
  } = {}) {
    super()
    this.width = new KeyframeSettings(width.keyframes)
    this.height = new KeyframeSettings(height.keyframes)
    this.fill_color = fill_color
    this.shape = shape
  }
}

export class ImageSettings extends PropertyMethod {
  file: string

  static parameterInfo = {
    file: { name: 'ファイル', type: UIType.text }
  }

  constructor({ file = '' } = {}) {
    super()
    this.file = file
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

  draw(): void {
    // ここに描画処理を書く
  }
}

export class TextObject extends BaseObject {
  standardRenderSettings: StandardRenderSettings
  textSettings: TextSettings
  styleSettings: StyleSettings
  animationSettings: AnimationSettings

  constructor(settings: BaseSettings) {
    super(settings)
    this.type = 'text'
    this.standardRenderSettings = new StandardRenderSettings()
    this.textSettings = new TextSettings()
    this.styleSettings = new StyleSettings()
    this.animationSettings = new AnimationSettings()
  }
  draw(): void {
    // ここに描画処理を書く
  }
}

export class ImageObject extends BaseObject {
  standardRenderSettings: StandardRenderSettings
  imageSettings: ImageSettings
  styleSettings: StyleSettings
  animationSettings: AnimationSettings

  constructor(settings: BaseSettings) {
    super(settings)
    this.type = 'image'
    this.standardRenderSettings = new StandardRenderSettings()
    this.imageSettings = new ImageSettings()
    this.styleSettings = new StyleSettings()
    this.animationSettings = new AnimationSettings()
  }
}

export class ShapeObject extends BaseObject {
  standardRenderSettings: StandardRenderSettings
  shapeSettings: ShapeSettings
  styleSettings: StyleSettings
  animationSettings: AnimationSettings

  constructor(settings: BaseSettings) {
    super(settings)
    this.type = 'shape'
    this.standardRenderSettings = new StandardRenderSettings()
    this.shapeSettings = new ShapeSettings()
    this.styleSettings = new StyleSettings()
    this.animationSettings = new AnimationSettings()
  }
}

//////////////////////////////////////
// オブジェクトが増えたら適宜追加する  //
//////////////////////////////////////
export type typeString = '' | 'base' | 'text' | 'image' | 'shape'
export type RenderObject = TextObject | BaseObject | ShapeObject | ImageObject
export const objectSettingsList = [
  'standardRenderSettings',
  'textSettings',
  'shapeSettings',
  'styleSettings',
  'animationSettings'
]

// 指定されたパラメータからオブジェクトを生成する(ファイル保存処理・再読込で使用)
export function createObjectFromJson(obj: RenderObject): any {
  const types = {
    text: TextObject,
    base: BaseObject,
    shape: ShapeObject,
    image: ImageObject,
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

  // 各オブジェクトの設定をコピー(typescriptの警告を回避するためas anyを使用)
  if ('standardRenderSettings' in obj) {
    ;(newObj as any).standardRenderSettings = new StandardRenderSettings(
      deepCopy(obj.standardRenderSettings)
    )
  }
  if ('textSettings' in obj) {
    ;(newObj as any).textSettings = new TextSettings(deepCopy(obj.textSettings))
  }
  if ('shapeSettings' in obj) {
    ;(newObj as any).shapeSettings = new ShapeSettings(deepCopy(obj.shapeSettings))
  }
  if ('styleSettings' in obj) {
    ;(newObj as any).styleSettings = new StyleSettings(deepCopy(obj.styleSettings.effects))
  }
  if ('animationSettings' in obj) {
    ;(newObj as any).animationSettings = new AnimationSettings(
      deepCopy(obj.animationSettings.effects)
    )
  }

  return newObj
}
