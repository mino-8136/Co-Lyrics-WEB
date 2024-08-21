// UIの種類
export enum UIType {
  none = 'none',
  slider = 'slider',
  select = 'select',
  color = 'color',
  checkbox = 'checkbox',
  text = 'text'
}
// 設定パネルで表示するパラメータに対応する情報を持つオブジェクト
export const parameterInfo: {
  [key: string]: {
    name: string
    type: UIType
    min?: number
    max?: number
  }
} = {
  X: { name: 'X', type: UIType.slider, min: -1024, max: 1024 },
  Y: { name: 'Y', type: UIType.slider, min: -1024, max: 1024 },
  scale: { name: '拡大率', type: UIType.slider, min: 0, max: 300 },
  opacity: { name: '不透明度', type: UIType.slider, min: 0, max: 100 },
  angle: { name: '回転', type: UIType.slider, min: -360, max: 360 },
  size: { name: 'サイズ', type: UIType.none, min: 1, max: 100 },
  individual_object: { name: 'バラバラ', type: UIType.checkbox, min: 0, max: 1 },
  align: { name: '整列', type: UIType.none, min: 0, max: 2 },
  spacing_x: { name: '水平間隔', type: UIType.slider, min: 0, max: 100 },
  spacing_y: { name: '垂直間隔', type: UIType.none, min: 0, max: 100 },
  color: { name: '色', type: UIType.color, min: 0, max: 0xffffff },
  font: { name: 'フォント', type: UIType.select },
  text: { name: 'テキスト', type: UIType.text },
  ////////////////////////////////////////////////
  anim_name: { name: 'アニメーション', type: UIType.none },
  anim_parameters: { name: 'アニメーションパラメータ', type: UIType.none }
}

// パラメータを取得する関数
export const getName = (key: string) => {
  return parameterInfo[key]?.name ?? key
}
export const getMaxValue = (key: string) => {
  return parameterInfo[key]?.max
}
export const getMinValue = (key: string) => {
  return parameterInfo[key]?.min
}
export const getType = (key: string): UIType => {
  if (parameterInfo[key]?.type === undefined) {
    return UIType.none
  }
  return parameterInfo[key]?.type
}
