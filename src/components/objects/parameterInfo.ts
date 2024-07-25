// パラメータ名に対応する情報を持つオブジェクト
export const parameterInfo: { [key: string]: { name: string; min: number; max: number } } = {
  id: { name: 'ID', min: 0, max: 1000 },
  start: { name: '開始', min: 0, max: 1000 },
  end: { name: '終了', min: 0, max: 1000 },
  layer: { name: 'レイヤー', min: 0, max: 10 },
  selected: { name: '選択', min: 0, max: 1 },
  X: { name: 'X', min: -2048, max: 2048 },
  Y: { name: 'Y', min: -2048, max: 2048 },
  scale: { name: '拡大率', min: 0, max: 100 },
  opacity: { name: '不透明度', min: 0, max: 100 },
  rotation: { name: '回転', min: -360, max: 360 },
  size: { name: 'サイズ', min: 1, max: 100 },
  individual_object: { name: '個別オブジェクト', min: 0, max: 1 },
  align: { name: '整列', min: 0, max: 2 },
  spacing_x: { name: '水平間隔', min: 0, max: 100 },
  spacing_y: { name: '垂直間隔', min: 0, max: 100 },
  color: { name: '色', min: 0, max: 0xffffff },
  font: { name: 'フォント', min: 0, max: 100 },
  text: { name: 'テキスト', min: 0, max: 100 }
}
