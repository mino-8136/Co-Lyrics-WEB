<template>
  <v-dialog v-model="showPanel">
    <v-card>
      <v-card-title> テキストエフェクトを選択 </v-card-title>
      <v-row>
        <v-col v-for="effect in effects" :key="effect.id" class="d-flex" cols="4">
          <v-container>
            <v-img :width="200" aspect-ratio="1" class="bg-grey-lighten-2" cover> </v-img>
            <v-btn @click="handleButtonClick(effect.name, effect.id)">
              {{ effect.name }}
            </v-btn>
          </v-container>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showPanel = defineModel<boolean>('show', { required: true })
const animation = defineModel('animation', { required: true })

function handleButtonClick(effect: string, id: number) {
  animation.value = effect
  showPanel.value = false
}

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
</script>
