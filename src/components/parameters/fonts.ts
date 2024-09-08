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
  fontFamilyList: {
    name: string
    displayName: string
    weight: number
  }[]
) => {
  for (let i = 0; i < fontFamilyList.length; i++) {
    const fontCacheKey = `font_${fontFamilyList[i].name}_${fontFamilyList[i].weight}`;
    const cacheTimeKey = `${fontCacheKey}_timestamp`;
    const now = new Date().getTime();

    // キャッシュが存在し、期限内かどうかチェック
    const cachedFont = localStorage.getItem(fontCacheKey);
    const cacheTimestamp = localStorage.getItem(cacheTimeKey);

    if (cachedFont && cacheTimestamp && now - parseInt(cacheTimestamp, 10) < cacheTTL) {
      console.log(fontFamilyList[i].displayName + 'はキャッシュされています');
      const fontUrls = JSON.parse(cachedFont); // 複数のフォントURLを配列として取得
      for (const url of fontUrls) {
        const font = new FontFace(fontFamilyList[i].displayName, url);
        await font.load();
        (document.fonts as any).add(font);
      }
    } else {
      // フォントをGoogle Fonts APIから取得し、キャッシュに保存
      const urlFamilyName = fontFamilyList[i].name.replace(/ /g, '+');
      const googleApiUrl = `https://fonts.googleapis.com/css2?family=${urlFamilyName}:wght@${fontFamilyList[i].weight}&subset=japanese`;

      const response = await fetch(googleApiUrl);

      if (response.ok) {
        const cssFontFace = await response.text();
        const matchUrls = cssFontFace.match(/url\(.+?\)/g);
        if (!matchUrls) throw new Error('フォントが見つかりませんでした');

        const fontUrls = []; // 複数のフォントURLを保存する配列

        for (const url of matchUrls) {
          fontUrls.push(url); // 取得したURLを配列に追加
          const font = new FontFace(fontFamilyList[i].displayName, url);
          await font.load();
          (document.fonts as any).add(font);
        }

        // キャッシュに保存し、タイムスタンプを更新
        localStorage.setItem(fontCacheKey, JSON.stringify(fontUrls)); // 複数のURLを保存
        localStorage.setItem(cacheTimeKey, now.toString());
        console.log(fontFamilyList[i].displayName + 'をキャッシュしました');
      } else {
        throw new Error(response.statusText);
      }
    }
  }
  return 'done';
}
export const fontListData: Font[] = [
  {
    name: 'Noto Sans JP',
    displayName: 'Noto Sans JP Light',
    group: 'ゴシック体',
    weightDescription: 'Light',
    weight: 300,
    webSrc: '',
    localSrc: ''
  },
  {
    name: 'Noto Sans JP',
    displayName: 'Noto Sans JP Medium',
    group: 'ゴシック体',
    weightDescription: 'Medium',
    weight: 500,
    webSrc: '',
    localSrc: ''
  },
  {
    name: 'Noto Sans JP',
    displayName: 'Noto Sans JP Bold',
    group: 'ゴシック体',
    weightDescription: 'Bold',
    weight: 700,
    webSrc: '',
    localSrc: ''
  },
  {
    name: 'Noto Sans JP',
    displayName: 'Noto Sans JP Black',
    group: 'ゴシック体',
    weightDescription: 'Black',
    weight: 900,
    webSrc: '',
    localSrc: ''
  },
  {
    name: 'Zen Maru Gothic',
    displayName: 'ZEN丸ゴシック Light',
    group: 'ゴシック体',
    weightDescription: 'Light',
    weight: 300,
    webSrc: '',
    localSrc: ''
  },
  {
    name: 'Zen Maru Gothic',
    displayName: 'ZEN丸ゴシック Medium',
    group: 'ゴシック体',
    weightDescription: 'Medium',
    weight: 500,
    webSrc: '',
    localSrc: ''
  },
  {
    name: 'Zen Maru Gothic',
    displayName: 'ZEN丸ゴシック Black',
    group: 'ゴシック体',
    weightDescription: 'Black',
    weight: 900,
    webSrc: '',
    localSrc: ''
  },
  {
    name: 'Noto Serif JP',
    displayName: 'Noto Serif JP Light',
    group: '明朝体',
    weightDescription: 'Light',
    weight: 300,
    webSrc: '',
    localSrc: ''
  },
  {
    name: 'Noto Serif JP',
    displayName: 'Noto Serif JP Medium',
    group: '明朝体',
    weightDescription: 'Medium',
    weight: 500,
    webSrc: '',
    localSrc: ''
  },
  {
    name: 'Noto Serif JP',
    displayName: 'Noto Serif JP Bold',
    group: '明朝体',
    weightDescription: 'Bold',
    weight: 700,
    webSrc: '',
    localSrc: ''
  },
  {
    name: 'Noto Serif JP',
    displayName: 'Noto Serif JP Black',
    group: '明朝体',
    weightDescription: 'Black',
    weight: 900,
    webSrc: '',
    localSrc: ''
  },
  {
    name: 'Hina Mincho',
    displayName: 'ひな明朝 Regular',
    group: '明朝体',
    weightDescription: 'Regular',
    weight: 400,
    webSrc: '',
    localSrc: ''
  },
  {
    name: 'New Tegomin',
    displayName: 'ニューテゴミン Regular',
    group: '明朝体',
    weightDescription: 'Regular',
    weight: 400,
    webSrc: '',
    localSrc: ''
  },
  {
    name: 'Klee One',
    displayName: 'クレー One SemiBold',
    group: '毛筆・硬筆体',
    weightDescription: 'SemiBold',
    weight: 600,
    webSrc: '',
    localSrc: ''
  },
  {
    name: 'Zen Kurenaido',
    displayName: 'ZEN紅道 Regular',
    group: '毛筆・硬筆体',
    weightDescription: 'Regular',
    weight: 400,
    webSrc: '',
    localSrc: ''
  },
  {
    name: 'Yuji Syuku',
    displayName: 'Yuji Syuku Regular',
    group: '毛筆・硬筆体',
    weightDescription: 'Regular',
    weight: 400,
    webSrc: '',
    localSrc: ''
  },
  {
    name: 'Kaisei Decol',
    displayName: '解星デコール Regular',
    group: 'デザイン書体',
    weightDescription: 'Regular',
    weight: 400,
    webSrc: '',
    localSrc: ''
  },
  {
    name: 'DotGothic16',
    displayName: 'ドットゴシック16 Regular',
    group: 'デザイン書体',
    weightDescription: 'Regular',
    weight: 400,
    webSrc: '',
    localSrc: ''
  },
  {
    name: 'Hachi Maru Pop',
    displayName: 'はちまるポップ Regular',
    group: 'デザイン書体',
    weightDescription: 'Regular',
    weight: 400,
    webSrc: '',
    localSrc: ''
  },
  {
    name: 'Stick',
    displayName: 'ステッキ Regular',
    group: 'デザイン書体',
    weightDescription: 'Regular',
    weight: 400,
    webSrc: '',
    localSrc: ''
  },
  {
    name: 'Reggae One',
    displayName: 'レゲエ One Regular',
    group: 'デザイン書体',
    weightDescription: 'Regular',
    weight: 400,
    webSrc: '',
    localSrc: ''
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
