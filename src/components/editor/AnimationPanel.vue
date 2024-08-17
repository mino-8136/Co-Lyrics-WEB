<template>
  <v-card>
    <v-card-title> テキストエフェクトを選択 </v-card-title>
    <v-row>
      <v-col v-for="effect in effects" :key="effect.id" class="d-flex" cols="4">
        <v-container>
          <v-img :width="200" aspect-ratio="1" class="bg-grey-lighten-2" cover> </v-img>
          <v-btn @click="emits.addAnimation()">
            {{ effect.name }}
          </v-btn>
        </v-container>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import { gsap } from 'gsap'

// 仮のアニメーションリスト
const effects = ref([
  { id: 0, name: 'none' },
  { id: 1, name: 'ランダム配置' },
  { id: 2, name: 'フェード' },
  { id: 3, name: '' }
])

// ここではアニメーションのパラメータのみを定義し、
// 実際のアニメーションはp5.jsのdraw関数内で行う。
// そのため、アニメーションの実装はcomponents/animationsに記述する。
// vueでコンポーネントにアニメーションを追加する場合は、parametersにオブジェクトとして記述する。
// p5.jsでは、受け取ったparametersのオブジェクト情報をもとに、アニメーションを実施する・
// animations.tsを呼び出し、細かい計算はその関数に任せる。
// p5.jsでは、エフェクトの付与を考慮するためにl、parametersをforEachで回して処理する。

// 受け取ったパラメータの種類
const props = defineProps({
  getParameter: Object
})
const emits = defineEmits({
  addAnimation: String
})
</script>
