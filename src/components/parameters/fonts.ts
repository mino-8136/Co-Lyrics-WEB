export type fontGroup = '' | 'ゴシック体' | '明朝体' | '毛筆・硬筆体' | 'デザイン書体' | 'その他'

interface Font {
  name: string
  displayName: string
  group: fontGroup
  weightDescription: string // ウェイトの説明 (例: Light, Bold)
  weight: number // ウェイトの数値 (例: 300, 700)
  webSrc?: string // Webフォントのソース
  localSrc?: string // ローカルフォントのソース
}

const textList =
  'あいうえかがきくけこしじせそただっつづてとどなにのはもらりるをん切列刻君呪字幸捉捩文淡無確私縛色見証震頭風' +
  'サンプル'

// Googleフォントの動的読み込み (https://style01.net/3037/)
const cacheTTL = 1000 * 60 * 60 * 24 * 60 // 60日間のキャッシュ有効期間
export const setFonts = async (
  fontListData: Font[],
  onProgress: (loadedName: string, loadedCount: number) => void,
  loadSubsetFonts: Boolean
) => {
  for (let i = 0; i < fontListData.length; i++) {
    // キャッシュキーとタイムスタンプキーを生成
    const fontCacheKey = `font_${fontListData[i].name}_${fontListData[i].weight}`
    const cacheTimeKey = `${fontCacheKey}_timestamp`
    const now = new Date().getTime()

    let loadedFontName = ''

    // キャッシュが存在し、期限内かどうかチェック
    const cachedFont = localStorage.getItem(fontCacheKey)
    const cacheTimestamp = localStorage.getItem(cacheTimeKey)

    if (cachedFont && cacheTimestamp && now - parseInt(cacheTimestamp, 10) < cacheTTL) {
      console.log(fontListData[i].displayName + 'はキャッシュされています')
      const fontUrls = JSON.parse(cachedFont) // 複数のフォントURLを配列として取得
      for (const url of fontUrls) {
        const font = new FontFace(fontListData[i].displayName, url)
        await font.load()
        ;(document.fonts as any).add(font)
      }
      loadedFontName = fontListData[i].displayName
    } else {
      // フォントをGoogle Fonts APIから取得し、キャッシュに保存
      const urlFamilyName = fontListData[i].name.replace(/ /g, '+')
      const googleApiUrl = `https://fonts.googleapis.com/css2?family=${urlFamilyName}:wght@${fontListData[i].weight}&subset=japanese`

      try {
        const response = await fetch(googleApiUrl)

        if (!loadSubsetFonts && response.ok) {
          const cssFontFace = await response.text()
          const matchUrls = cssFontFace.match(/url\(.+?\)/g)
          if (!matchUrls) throw new Error('フォントが見つかりませんでした')

          const fontUrls = [] // 複数のフォントURLを保存する配列

          for (const url of matchUrls) {
            fontUrls.push(url) // 取得したURLを配列に追加
            const font = new FontFace(fontListData[i].displayName, url)
            await font.load()
            ;(document.fonts as any).add(font)
          }

          // キャッシュに保存し、タイムスタンプを更新
          localStorage.setItem(fontCacheKey, JSON.stringify(fontUrls)) // 複数のURLを保存
          localStorage.setItem(cacheTimeKey, now.toString())
          console.log(fontListData[i].displayName + 'をキャッシュしました')

          loadedFontName = fontListData[i].displayName
        } else {
          throw new Error(response.statusText)
        }
      } catch (error) {
        // フォントがDLできなかった場合にはサーバーフォントを利用する
        try {
          console.log(fontListData[i].displayName + 'はサーバーフォントを利用します')
          const localFontUrl = `url(${fontListData[i].localSrc})`
          const font = new FontFace(fontListData[i].displayName, localFontUrl)
          await font.load()
          ;(document.fonts as any).add(font)

          localStorage.setItem(fontCacheKey, JSON.stringify([localFontUrl])) // サーバーフォントURLをキャッシュ
          localStorage.setItem(cacheTimeKey, now.toString())
          console.log(fontListData[i].displayName + 'のサーバーフォントをキャッシュしました')
        } catch (error) {
          throw new Error(
            'サーバーフォントの読み込みに失敗しました: ' + fontListData[i].displayName
          )
        }
      }
    }

    onProgress(loadedFontName, i + 1)
  }
  return 'done'
}

export const fontListData: Font[] = [
  {
    name: 'Noto Sans JP',
    displayName: 'Noto Sans JP Light',
    group: 'ゴシック体',
    weightDescription: 'Light',
    weight: 300,
    webSrc: '',
    localSrc: '/assets/fonts/Noto_Sans_JP/static/NotoSansJP-Light-Subset.woff2'
  },
  {
    name: 'Noto Sans JP',
    displayName: 'Noto Sans JP Medium',
    group: 'ゴシック体',
    weightDescription: 'Medium',
    weight: 500,
    webSrc: '',
    localSrc: '/assets/fonts/Noto_Sans_JP/static/NotoSansJP-Medium-Subset.woff2'
  },
  {
    name: 'Noto Sans JP',
    displayName: 'Noto Sans JP Bold',
    group: 'ゴシック体',
    weightDescription: 'Bold',
    weight: 700,
    webSrc: '',
    localSrc: '/assets/fonts/Noto_Sans_JP/static/NotoSansJP-Bold-Subset.woff2'
  },
  {
    name: 'Noto Sans JP',
    displayName: 'Noto Sans JP Black',
    group: 'ゴシック体',
    weightDescription: 'Black',
    weight: 900,
    webSrc: '',
    localSrc: '/assets/fonts/Noto_Sans_JP/static/NotoSansJP-Black-Subset.woff2'
  },
  {
    name: 'Zen Maru Gothic',
    displayName: 'ZEN丸ゴシック Light',
    group: 'ゴシック体',
    weightDescription: 'Light',
    weight: 300,
    webSrc: '',
    localSrc: '/assets/fonts/Zen_Maru_Gothic/ZenMaruGothic-Light-Subset.woff2'
  },
  {
    name: 'Zen Maru Gothic',
    displayName: 'ZEN丸ゴシック Medium',
    group: 'ゴシック体',
    weightDescription: 'Medium',
    weight: 500,
    webSrc: '',
    localSrc: '/assets/fonts/Zen_Maru_Gothic/ZenMaruGothic-Medium-Subset.woff2'
  },
  {
    name: 'Zen Maru Gothic',
    displayName: 'ZEN丸ゴシック Black',
    group: 'ゴシック体',
    weightDescription: 'Black',
    weight: 900,
    webSrc: '',
    localSrc: '/assets/fonts/Zen_Maru_Gothic/ZenMaruGothic-Black-Subset.woff2'
  },
  {
    name: 'Noto Serif JP',
    displayName: 'Noto Serif JP Light',
    group: '明朝体',
    weightDescription: 'Light',
    weight: 300,
    webSrc: '',
    localSrc: '/assets/fonts/Noto_Serif_JP/static/NotoSerifJP-Light-Subset.woff2'
  },
  {
    name: 'Noto Serif JP',
    displayName: 'Noto Serif JP Medium',
    group: '明朝体',
    weightDescription: 'Medium',
    weight: 500,
    webSrc: '',
    localSrc: '/assets/fonts/Noto_Serif_JP/static/NotoSerifJP-Medium-Subset.woff2'
  },
  {
    name: 'Noto Serif JP',
    displayName: 'Noto Serif JP Bold',
    group: '明朝体',
    weightDescription: 'Bold',
    weight: 700,
    webSrc: '',
    localSrc: '/assets/fonts/Noto_Serif_JP/static/NotoSerifJP-Bold-Subset.woff2'
  },
  {
    name: 'Noto Serif JP',
    displayName: 'Noto Serif JP Black',
    group: '明朝体',
    weightDescription: 'Black',
    weight: 900,
    webSrc: '',
    localSrc: '/assets/fonts/Noto_Serif_JP/static/NotoSerifJP-Black-Subset.woff2'
  },
  {
    name: 'Hina Mincho',
    displayName: 'ひな明朝 Regular',
    group: '明朝体',
    weightDescription: 'Regular',
    weight: 400,
    webSrc: '',
    localSrc: '/assets/fonts/Hina_Mincho/HinaMincho-Regular-Subset.woff2'
  },
  {
    name: 'New Tegomin',
    displayName: 'ニューテゴミン Regular',
    group: '明朝体',
    weightDescription: 'Regular',
    weight: 400,
    webSrc: '',
    localSrc: '/assets/fonts/New_Tegomin/NewTegomin-Regular-Subset.woff2'
  },
  {
    name: 'Klee One',
    displayName: 'クレー One SemiBold',
    group: '毛筆・硬筆体',
    weightDescription: 'SemiBold',
    weight: 600,
    webSrc: '',
    localSrc: '/assets/fonts/Klee_One/KleeOne-SemiBold-Subset.woff2'
  },
  {
    name: 'Zen Kurenaido',
    displayName: 'ZEN紅道 Regular',
    group: '毛筆・硬筆体',
    weightDescription: 'Regular',
    weight: 400,
    webSrc: '',
    localSrc: '/assets/fonts/Zen_Kurenaido/ZenKurenaido-Regular-Subset.woff2'
  },
  {
    name: 'Yuji Syuku',
    displayName: 'Yuji Syuku Regular',
    group: '毛筆・硬筆体',
    weightDescription: 'Regular',
    weight: 400,
    webSrc: '',
    localSrc: '/assets/fonts/Yuji_Syuku/YujiSyuku-Regular-Subset.woff2'
  },
  {
    name: 'Kaisei Decol',
    displayName: '解星デコール Regular',
    group: 'デザイン書体',
    weightDescription: 'Regular',
    weight: 400,
    webSrc: '',
    localSrc: '/assets/fonts/Kaisei_Decol/KaiseiDecol-Regular-Subset.woff2'
  },
  {
    name: 'DotGothic16',
    displayName: 'ドットゴシック16 Regular',
    group: 'デザイン書体',
    weightDescription: 'Regular',
    weight: 400,
    webSrc: '',
    localSrc: '/assets/fonts/DotGothic16/DotGothic16-Regular-Subset.woff2'
  },
  {
    name: 'Hachi Maru Pop',
    displayName: 'はちまるポップ Regular',
    group: 'デザイン書体',
    weightDescription: 'Regular',
    weight: 400,
    webSrc: '',
    localSrc: '/assets/fonts/Hachi_Maru_Pop/HachiMaruPop-Regular-Subset.woff2'
  },
  {
    name: 'Stick',
    displayName: 'ステッキ Regular',
    group: 'デザイン書体',
    weightDescription: 'Regular',
    weight: 400,
    webSrc: '',
    localSrc: '/assets/fonts/Stick/Stick-Regular-Subset.woff2'
  },
  {
    name: 'Reggae One',
    displayName: 'レゲエ One Regular',
    group: 'デザイン書体',
    weightDescription: 'Regular',
    weight: 400,
    webSrc: '',
    localSrc: '/assets/fonts/Reggae_One/ReggaeOne-Regular-Subset.woff2'
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
