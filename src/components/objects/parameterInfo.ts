// パラメータ名に対応する情報を持つオブジェクト
export const parameterInfo: { [key: string]: { label: string; min: number; max: number } } = {
  id: { label: 'ID', min: 0, max: 1000 },
  start: { label: '開始', min: 0, max: 1000 },
  end: { label: '終了', min: 0, max: 1000 },
  layer: { label: 'レイヤー', min: 0, max: 10 },
  selected: { label: '選択', min: 0, max: 1 },
  size: { label: 'サイズ', min: 1, max: 100 },
  individual_object: { label: '個別オブジェクト', min: 0, max: 1 },
  align: { label: '整列', min: 0, max: 2 },
  spacing_x: { label: '水平間隔', min: 0, max: 100 },
  spacing_y: { label: '垂直間隔', min: 0, max: 100 },
  color: { label: '色', min: 0, max: 0xffffff },
  font: { label: 'フォント', min: 0, max: 100 },
  text: { label: 'テキスト', min: 0, max: 100 }
}
