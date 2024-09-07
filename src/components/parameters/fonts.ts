export type fontGroup = '' | 'ゴシック体' | '明朝体' | '毛筆・硬筆体' | 'デザイン書体' | 'その他'

interface FontWeight {
  description: string
  value: number
}

interface Font {
  name: string
  displayName: string
  group: fontGroup
  weights: FontWeight[]
  localSrc?: string
}

export const fontListData: Font[] = [
  {
    name: 'Noto Sans JP',
    displayName: 'Noto Sans JP',
    group: 'ゴシック体',
    weights: [
      { description: 'Light', value: 300 },
      { description: 'Medium', value: 500 },
      { description: 'Bold', value: 700 },
      { description: 'Black', value: 900 }
    ]
  },
  {
    name: 'Zen Maru Gothic',
    displayName: 'ZEN丸ゴシック',
    group: 'ゴシック体',
    weights: [
      { description: 'Light', value: 300 },
      { description: 'Medium', value: 500 },
      { description: 'Black', value: 900 }
    ]
  },
  {
    name: 'Noto Serif JP',
    displayName: 'Noto Serif JP',
    group: '明朝体',
    weights: [
      { description: 'Light', value: 300 },
      { description: 'Medium', value: 500 },
      { description: 'Bold', value: 700 },
      { description: 'Black', value: 900 }
    ]
  },
  {
    name: 'Hina Mincho',
    displayName: 'ひな明朝',
    group: '明朝体',
    weights: [{ description: 'Regular', value: 400 }]
  },
  {
    name: 'New Tegomin',
    displayName: 'ニューテゴミン',
    group: '明朝体',
    weights: [{ description: 'Regular', value: 400 }]
  },
  {
    name: 'Klee One',
    displayName: 'クレー One',
    group: '毛筆・硬筆体',
    weights: [{ description: 'SemiBold', value: 600 }]
  },
  {
    name: 'Zen Kurenaido',
    displayName: 'ZEN紅道',
    group: '毛筆・硬筆体',
    weights: [{ description: 'Regular', value: 400 }]
  },
  {
    name: 'Yuji Syuku',
    displayName: 'Yuji Syuku',
    group: '毛筆・硬筆体',
    weights: [{ description: 'Regular', value: 400 }]
  },
  {
    name: 'Kaisei Decol',
    displayName: '解星デコール',
    group: 'デザイン書体',
    weights: [{ description: 'Regular', value: 400 }]
  },
  {
    name: 'DotGothic16',
    displayName: 'ドットゴシック16',
    group: 'デザイン書体',
    weights: [{ description: 'Regular', value: 400 }]
  },
  {
    name: 'Hachi Maru Pop',
    displayName: 'はちまるポップ',
    group: 'デザイン書体',
    weights: [{ description: 'Regular', value: 400 }]
  },
  {
    name: 'Stick',
    displayName: 'ステッキ',
    group: 'デザイン書体',
    weights: [{ description: 'Regular', value: 400 }]
  },
  {
    name: 'Reggae One',
    displayName: 'レゲエ One',
    group: 'デザイン書体',
    weights: [{ description: 'Regular', value: 400 }]
  }
]

/* ver0.9.2以前のデータ 
export const fontListData: FontList[] = [
  {
    name: '851チカラヅヨク',
    srcLocal: '/assets/fonts/851チカラヅヨク/851CHIKARA-DZUYOKU_kanaA_004.ttf'
  },
  {
    name: 'homura',
    srcLocal: '/assets/fonts/homura/03HomuraM-SemiLight.otf'
  },
  {
    name: '瀬戸フォントSP_sjis版',
    srcLocal: '/assets/fonts/sjis_sp_setofont/sjis_sp_setofont.ttf'
  },
  {
    name: 'SourceHanSansJP',
    srcLocal: '/assets/fonts/SourceHanSansJP/SourceHanSansJP-Medium.otf'
  },
  {
    name: 'SourceHanSerifJP',
    srcLocal: '/assets/fonts/SourceHanSerifJP/SourceHanSerifJP-Medium.otf'
  },
  {
    name: 'Yusei_Magic',
    srcLocal: '/assets/fonts/Yusei_Magic/YuseiMagic-Regular.ttf'
  }
]
*/
