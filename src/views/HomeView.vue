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
