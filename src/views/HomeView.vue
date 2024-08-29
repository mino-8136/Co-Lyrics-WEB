<template>
  <v-card class="ma-4">
    <v-card-title>ソフトウェア概要 v0.9.0</v-card-title>
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

  <v-container>
    <v-card class="pa-4">
      <v-card-title>楽曲情報</v-card-title>

      <v-row>
        <v-col cols="6">
          <v-card variant="elevated" rounded="xl">
            <template v-slot:prepend>
              <v-icon icon="mdi-music" color="blue-lighten-3"></v-icon>
            </template>
            <template v-slot:title> レターポスト </template>
            <template v-slot:subtitle> ??? feat.重音テト </template>
            <v-card-text>
              淡く刻んだ文字列が 君にはどんな風に見えてたの ああだこうだと捉えては
              確証も無しに震えてる きらり色づく文字列は 私の頭を捩じ切らせる そうだ　幸せになる呪縛
              いつからこんなだったっけ
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn text="この楽曲を選択" variant="text" @click="formPanel = true"></v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
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
        <v-btn text @click="() => $router.push('/edit')">次へ</v-btn>
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
