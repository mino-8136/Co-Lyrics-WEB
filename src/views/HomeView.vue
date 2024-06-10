<template>
  <v-container>
    <v-row>
      <v-col
        v-for="animation in animations"
        :key="animation.id"
        cols="12"
        sm="6"
        md="4">
        <v-card>
          <v-img :src="getThumbnail(animation)"></v-img>
          <v-card-title>{{ animation.title }}</v-card-title>
          <v-card-subtitle>{{ animation.date }}</v-card-subtitle>
          <v-card-actions>
            <v-btn color="primary" @click="playAnimation(animation)">再生</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useStore } from '@/store';

export default defineComponent({
  name: 'HomeView',
  setup() {
    const store = useStore();
    const animations = ref([]);

    onMounted(async () => {
      animations.value = await fetchAnimations();
    });

    const getThumbnail = (animation) => {
      return animation.thumbnailUrl; // アニメーションのサムネイル画像URLを返す
    };

    const playAnimation = (animation) => {
      // アニメーション再生のためのロジック
    };

    const fetchAnimations = async () => {
      // サーバーからアニメーションデータをフェッチする想定
      return [
        { id: 1, title: "アニメーション1", date: "2022/01/01", thumbnailUrl: "/path/to/thumbnail1.jpg" },
        { id: 2, title: "アニメーション2", date: "2022/02/01", thumbnailUrl: "/path/to/thumbnail2.jpg" }
      ];
    };

    return { animations, getThumbnail, playAnimation };
  }
});
</script>
