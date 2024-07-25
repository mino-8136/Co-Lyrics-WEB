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
  X: { name: 'X', min: -2048, max: 2048, type: UIType.slider },
  Y: { name: 'Y', min: -2048, max: 2048, type: UIType.slider },
  scale: { name: '拡大率', min: 0, max: 100, type: UIType.slider },
  opacity: { name: '不透明度', min: 0, max: 100, type: UIType.slider },
  rotation: { name: '回転', min: -360, max: 360, type: UIType.slider },
  size: { name: 'サイズ', min: 1, max: 100, type: UIType.slider },
  individual_object: { name: '個別オブジェクト', min: 0, max: 1, type: UIType.none },
  align: { name: '整列', min: 0, max: 2, type: UIType.none },
  spacing_x: { name: '水平間隔', min: 0, max: 100, type: UIType.none },
  spacing_y: { name: '垂直間隔', min: 0, max: 100, type: UIType.none },
  color: { name: '色', min: 0, max: 0xffffff, type: UIType.color },
  font: { name: 'フォント', type: UIType.select },
  text: { name: 'テキスト', type: UIType.text }
}
