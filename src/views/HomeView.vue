<template>
  <v-container>
    <v-row>
      <v-col v-for="movie in movies" :key="movie.id" cols="12" sm="6" md="4">
        <v-card>
          <v-img :src="getThumbnail(movie)" class="thumbnail"></v-img>
          <v-card-title>{{ movie.title }}</v-card-title>
          <v-card-subtitle>{{ movie.date }}</v-card-subtitle>
          <v-card-actions>
            <v-btn color="primary" @click="playMovie(movie)">再生</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-dialog v-model="playPanel">
    <PlayMoviePanel />
  </v-dialog>
</template>

<script setup lang="ts">
// TODO : ファイル内のsample.jsonを読み込む部分を、複数のファイルを読み込むように変更する(要サーバープログラム)
import { onMounted, ref } from 'vue'
import PlayMoviePanel from '@/components/PlayMoviePanel.vue'

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
  fetch('src/assets/userdata/sample/sample.json')
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
  return `src/assets/userdata/sample/sample.jpg`
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