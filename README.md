# Co-Lyrics-WEB


## 開発要件

- npm install p5
- npm install -D @types/p5
- npm install -save @imengyu/vue3-context-menu
- npm install gsap
- npm install --save @types/wavesurfer.js
- npm i pinia-plugin-persistedstate

## 各種変更のメモ
### 音源ファイルの追加対応箇所
- src\stores\objectStore.ts -> audioPath: '/assets/music/musicfile.mp3'

### フォントファイルの追加対応箇所
- src\components\parameters\fonts.ts -> export const fontListData: FontList[]
- index.html

## Z-index
- 10 選択中オブジェクト
- 100 シークバー
- 1000 タイムラインコンテキストメニュー

## 参考メモ
p5js 
https://qiita.com/mitsuya_bauhaus/items/b6f3d1aec07a9e07bb3a


## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
