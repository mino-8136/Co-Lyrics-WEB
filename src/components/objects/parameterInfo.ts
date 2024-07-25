// UIの種類
export enum UIType {
  none = 'none',
  slider = 'slider',
  select = 'select',
  color = 'color',
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
  X: { name: 'X', type: UIType.slider, min: -2048, max: 2048 },
  Y: { name: 'Y', type: UIType.slider, min: -2048, max: 2048 },
  scale: { name: '拡大率', type: UIType.slider, min: 0, max: 100 },
  opacity: { name: '不透明度', type: UIType.slider, min: 0, max: 100 },
  rotation: { name: '回転', type: UIType.slider, min: -360, max: 360 },
  size: { name: 'サイズ', type: UIType.slider, min: 1, max: 100 },
  individual_object: { name: '個別オブジェクト', type: UIType.none, min: 0, max: 1 },
  align: { name: '整列', type: UIType.none, min: 0, max: 2 },
  spacing_x: { name: '水平間隔', type: UIType.none, min: 0, max: 100 },
  spacing_y: { name: '垂直間隔', type: UIType.none, min: 0, max: 100 },
  color: { name: '色', type: UIType.color, min: 0, max: 0xffffff },
  font: { name: 'フォント', type: UIType.select },
  text: { name: 'テキスト', type: UIType.text }
}
