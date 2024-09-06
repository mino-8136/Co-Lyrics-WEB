<template>
  <v-container>
    <v-card class="ma-4">
      <v-card-title>ソフトウェア概要 v0.9.3</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <p>
          本アプリケーション「Co-Lyrics-WEB」は、図形・テキストに機能を特化した動画制作アプリケーションです。
        </p>
        <p>
          画面右上の「EDIT」から編集画面に移動し、図形やテキストを配置して、キーフレームを設定することで、動画を作成することができます。
        </p>
        <p>2024年9月19日のv1.0.0リリースに向けて、現在は機能の追加・修正を行っています。</p>
      </v-card-text>
    </v-card>

    <v-card class="ma-4 pa-4">
      <v-card-title>登録楽曲の情報</v-card-title>

      <v-row>
        <v-col v-for="music in musicData" :key="music.title" cols="6">
          <v-card variant="elevated" color="blue-darken-1" rounded="xl">
            <template v-slot:prepend>
              <v-icon icon="mdi-music" class="mr-1"></v-icon>
            </template>
            <template v-slot:title> {{ music.title }} </template>
            <template v-slot:subtitle> {{ music.artist }}</template>
            <v-card-text> {{ music.lyrics }} </v-card-text>
            <v-divider></v-divider>
            <!--
              <v-card-actions>
                <v-btn text="この楽曲を選択" variant="text" @click="formPanel = true"></v-btn>
              </v-card-actions>
              -->
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <v-card class="ma-4 pa-4">
      <v-card-title>作成検討中の処理</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-list>
          <v-list-item> WEBフォントを用いたフォント切り替え機能(優先度高) </v-list-item>
          <v-list-item> タイムライン上での複数選択機能 </v-list-item>
          <v-list-item> Ctrl+Zでのやり直し機能 </v-list-item>
          <v-list-item> 編集画面の各パネルの枠を変更する機能 </v-list-item>
          <v-list-item> テキスト新規作成時に最も近い位置の歌詞を取得する </v-list-item>
          <v-list-item> 2曲目の追加および1曲目との切り替え </v-list-item>
          <v-list-item> 複数人で同じオブジェクトを編集した際に設定を統合する機能 </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>

    <v-card class="ma-4 pa-4">
      <v-card-title>アップデート情報</v-card-title>
      <v-divider></v-divider>
      <v-card-subtitle>0.9.2 → 0.9.3 (2024/09/07)</v-card-subtitle>
      <v-card-text>
        <v-list>
          <v-list-item> 表示できるレイヤー数を10から20に増加</v-list-item>
          <v-list-item> シークバー縦棒がタイムラインの下部まで届くように修正</v-list-item>
          <v-list-item> タイムライン番号の表示</v-list-item>
          <v-list-item> 設定パネルの横並び表示対応</v-list-item>
          <v-list-item> バラバラがついていない状態でも文字間隔を変更できるようにした</v-list-item>
          <v-list-item
            >ファイル読み込み・貼り付け時にshape settings/text
            settingsを等復帰できるように修正</v-list-item
          >
          <v-list-item>
            テキストレイヤーでぼかし・拡大率などの設定が次のオブジェクトまで影響を及ぼしている問題の修正</v-list-item
          >
          <v-list-item>絵文字・記号の出力への対応</v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>

  <v-dialog v-model="formPanel">
    <v-card class="ma-4">
      <v-card-title>演習情報の入力</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-text-field label="グループ番号"></v-text-field>
        <v-text-field label="制作メンバー"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="() => $router.push('/edit')">次へ</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="playPanel">
    <PlayMoviePanel />
  </v-dialog>
</template>

<script setup lang="ts">
// TODO : ファイル内のsample.jsonを読み込む部分を、複数のファイルを読み込むように変更する(要サーバープログラム)
import { onMounted, ref } from 'vue'
import PlayMoviePanel from '@/components/game/PlayMoviePanel.vue'

interface MovieObject {
  id: number
  title: string
  description: string
  date: string
}
const movies = ref<MovieObject[]>([])
const playPanel = ref(false)
const formPanel = ref(false)

// 楽曲情報(TODO: 仮データ)
const musicData = [
  {
    title: 'レターポスト',
    artist: '??? feat.重音テト',
    lyrics: `淡く刻んだ文字列が 君にはどんな風に見えてたの ああだこうだと捉えては
  確証も無しに震えてる きらり色づく文字列は 私の頭を捩じ切らせる そうだ　幸せになる呪縛
  いつからこんなだったっけ`
  },
  {
    title: '???',
    artist: '???',
    lyrics: '???'
  }
]

// @/public/userdata/sample.jsonから、ムービーデータを取得してmoviesにセット
onMounted(() => {
  fetch('/assets/userdata/sample/sample.json')
    .then((res) => res.json())
    .then((data) => {
      const movieData = data.movie_data
      movies.value.push({
        id: movieData.id,
        title: movieData.title,
        description: movieData.description,
        date: movieData.date
      })
    })
    .catch((err) => {
      console.error(err)
    })
})

function getThumbnail(movie: MovieObject) {
  return `/assets/userdata/sample/sample.jpg`
}

// サムネイルをクリックしたら、PlayMoviePanelを表示する
function playMovie(movie: MovieObject) {
  playPanel.value = true
}
</script>

<style scoped>
.thumbnail {
  height: 100px;
}
</style>
