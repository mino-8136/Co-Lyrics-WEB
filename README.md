# Co-Lyrics-WEB
本アプリケーションは、学校の授業課題として「リリックビデオ」という映像の制作演習のために開発されたWEBアプリケーションです。
文字・図形という限られた要素のみを使ったミュージックビデオ制作を通じて、映像の演出制作を体験することができます。
詳しい操作説明に関しては、解説Wikiページに記載されています。

## 主なディレクトリの説明
- public/assets : フォントデータ・音楽データ
- src/assets/effects : エフェクト・レイヤースタイルのスクリプト
- src/components/editor : 編集画面を構成するパネルのコンポーネント
- src/components/p5 : 描画処理を行うp5.jsのスクリプト
- src/components/parameters : 各種クラスを格納する部分
- src/python : midiファイルや編集ファイルの変換を行う補助的スクリプト


## 各種メモ

### タイムライン内でのZ-indexの状態
- 3 グループ制御オブジェクト
- 10 選択中オブジェクト
- 100 シークバー
- 1000 タイムラインコンテキストメニュー


### 使用技術

- npm install p5
- npm install -D @types/p5
- npm install -save @imengyu/vue3-context-menu
- npm install gsap
- npm install --save @types/wavesurfer.js
- npm i pinia-plugin-persistedstate

※p5.jsとVue.jsを組み合わせる方法については以下を参考にしています
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
