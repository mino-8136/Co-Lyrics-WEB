<template>
  <v-container>
    <v-card class="ma-4">
      <v-card-title>ソフトウェア概要 v0.9.6</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <p>
          本アプリケーション「Co-Lyrics-WEB」は、図形・テキストに機能を特化した動画制作アプリケーションです。
        </p>
        <p>
          <a
            href="https://lecture-cc.notion.site/Co-Lyrics-WEB-34b19df882c34498ba847044d2709c30?pvs=4"
            target="_blank"
            >Co-Lyrics-WEB Wiki </a
          >から操作方法や開発情報を確認することができます。
        </p>
      </v-card-text>
      <v-card-text>
        <p>
          画面右上の「EDIT」から編集画面に移動し、図形やテキストを配置して、キーフレームを設定することで、動画を作成することができます。
        </p>
        <p>2024年9月19日のv1.0.0リリースに向けて、現在は機能の追加・修正を行っています。</p>
      </v-card-text>
    </v-card>

    <v-card class="ma-4 pa-4">
      <v-card-title>登録楽曲の情報</v-card-title>

      <v-row>
        <v-col v-for="music in musicData" :key="music.title" cols="12" sm="6">
          <v-card variant="elevated" color="blue-darken-1" rounded="xl">
            <template v-slot:prepend>
              <v-icon icon="mdi-music" class="mr-1"></v-icon>
            </template>
            <template v-slot:title> {{ music.title }} </template>
            <template v-slot:subtitle> {{ music.artist }}</template>
            <v-card-text> {{ music.lyrics }} </v-card-text>
            <v-divider></v-divider>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
// TODO: musics.tsから取得するように変更
const musicData = [
  {
    title: 'レターポスト',
    artist: '??? feat.重音テトSV',
    lyrics: `淡く刻んだ文字列が 君にはどんな風に見えてたの ああだこうだと捉えては
  確証も無しに震えてる きらり色づく文字列は 私の頭を捩じ切らせる そうだ　幸せになる呪縛
  いつからこんなだったっけ`
  },
  {
    title: '誘閃光',
    artist: '??? feat. 重音テトSV',
    lyrics: '唯、融け合う意識の狭間。招かれた箱庭は、霧掻き分けた先で閃光に誘われた。'
  }
]
</script>
