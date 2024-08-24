<template>
  <v-dialog v-model="showPanel">
    <v-card>
      <v-card-title> テキストエフェクトを選択 </v-card-title>
      <v-row>
        <v-col v-for="effect in effects" :key="effect.id" class="d-flex" cols="4">
          <v-container>
            <v-img :width="200" aspect-ratio="1" class="bg-grey-lighten-2" cover> </v-img>
            <v-btn @click="handleButtonClick(effect.name, effect.parameter)">
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
import { type AnimationSettings, type AnimationSetting, TextObject } from '../parameters/objectInfo'

const showPanel = defineModel<boolean>('show', { required: true })
const animations = defineModel<AnimationSettings>('animations', { required: true })

function handleButtonClick(effect: string, parameter: Array<number>) {
  animations.value.push({ anim_name: effect, anim_parameters: parameter })
  showPanel.value = false
}

// 仮のアニメーションリスト
const effects = ref([
  { id: 0, name: 'none', parameter: [0, 0, 0, 0, 0] },
  { id: 1, name: 'ランダム配置', parameter: [0, 0, 0, 0, 0] },
  { id: 2, name: 'フェード', parameter: [0, 0, 0, 0, 0] }
])

function mojiokuriDefaultParameter() {
  return [0, 0, 0, 0, 0]
}

import { useTimelineStore } from '@/stores/objectStore'
import { BaseObject } from '@/components/objects/objectInfo'
const timelineStore = useTimelineStore()
const object = ref() as TextObject

function mojiokuri() {
  let time = 30 // default 30
  let span = 10 // default 10
  let delay = 5 // default 0

  let progress = (timelineStore.currentFrame - object.start - object.id * span - delay) / time
  progress = Math.min(progress, 1)

  if (progress < 0) {
    // 表示しない
  } else {
    // X座標をprogerss * 100だけ移動する
  }
}

function randomPositionDefaultParameter() {
  return [0, 0, 0, 0, 0]
}

function randomPosition() {}

// ここではアニメーションのパラメータのみを定義し、
// 実際のアニメーションはp5.jsのdraw関数内で行う。
// そのため、アニメーションの実装はcomponents/animationsに記述する。
// vueでコンポーネントにアニメーションを追加する場合は、parametersにオブジェクトとして記述する。
// p5.jsでは、受け取ったparametersのオブジェクト情報をもとに、アニメーションを実施する・
// animations.tsを呼び出し、細かい計算はその関数に任せる。
// p5.jsでは、エフェクトの付与を考慮するためにl、parametersをforEachで回して処理する。
</script>
