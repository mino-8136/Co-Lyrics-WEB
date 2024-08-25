<template>
  <div v-for="(params, label) in parameters" :key="label">
    <v-card variant="outlined" class="mb-2">
      <template v-slot:title>
        <p class="text-body-1">
          {{ parameters[label].anim_name }}
        </p>
      </template>
      <template v-slot:append>
        <v-icon @click="upAnimation(label)">mdi-arrow-up </v-icon>
        <v-icon @click="downAnimation(label)">mdi-arrow-down </v-icon>
        <v-icon @click="delateAnimation(label)">mdi-delete</v-icon>
      </template>

      <div v-for="(param, paramLabel) in searchEffects(params)" :key="param.name" class="mx-2">
        <div v-if="param.type != UIType.none" class="parameter-row">
          <!-- パラメータ名の表示 -->
          <v-chip class="parameter-name" variant="outlined" size="small" label>{{
            param.name
          }}</v-chip>

          <!-- 数値型パラメータの場合 -->
          <template v-if="param.type == UIType.slider">
            <v-slider
              v-model="parameters[label].anim_parameters[paramLabel]"
              :min="param.min"
              :max="param.max"
              step="1"
              hide-details
            >
              <template v-slot:prepend>
                <input
                  class="parameter-value"
                  v-model.number="parameters[label].anim_parameters[paramLabel]"
                />
              </template>
            </v-slider>
          </template>

          <!-- チェックボックス型パラメータの場合 -->
          <template v-if="param.type === UIType.checkbox">
            <v-checkbox v-model="parameters[label].anim_parameters[paramLabel]" hide-details />
          </template>
        </div>
      </div>
    </v-card>
  </div>

  <v-btn block variant="outlined" class="mb-2 elevation-1" @click="openAnimationDialog()">
    <v-icon>mdi-plus</v-icon>
    アニメーション追加
  </v-btn>
  <!-- アニメーション設定の呼び出し -->
  <AnimationPanel v-model:show="animationPanel" v-model:animations="selectedObject.animations" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useObjectStore, useTimelineStore } from '@/stores/objectStore'
import {
  UIType,
  type AnimationSettings,
  type AnimationSetting
} from '@/components/parameters/objectInfo'
import AnimationPanel from './AnimationPanel.vue'
import { effects } from '@/assets/animations/animation'

const objectStore = useObjectStore()
const timelineStore = useTimelineStore()

const parameters = defineModel<AnimationSettings>('params', { required: true })

// 選択されたオブジェクトの情報(setting panelと同じ)
const selectedObject: Record<string, any> = computed(() => {
  return objectStore.objects.find((obj) => obj.id === timelineStore.selectedObjectId)
})

//////////////////////////////////
// アニメーション設定に関する記述 //
//////////////////////////////////
const animationPanel = ref(false)
function openAnimationDialog() {
  animationPanel.value = true
}

// 指定されたアニメーションのパラメータを検索する関数
function searchEffects(animation: AnimationSetting): { [key: string]: any } {
  // effects 配列から対応するエフェクトを検索
  const effect = effects.find((effect) => effect.name === animation.anim_name)
  if (effect) {
    // console.log(Object.keys(effect.parameters).map((key) => effect.parameters[key].name))
    return effect.parameters
  } else {
    return {}
  }
}

function upAnimation(index: number) {
  if (index > 0) {
    const temp = parameters.value[index]
    parameters.value[index] = parameters.value[index - 1]
    parameters.value[index - 1] = temp
  }
}

function downAnimation(index: number) {
  if (index < parameters.value.length - 1) {
    const temp = parameters.value[index]
    parameters.value[index] = parameters.value[index + 1]
    parameters.value[index + 1] = temp
  }
}

function delateAnimation(index: number) {
  parameters.value.splice(index, 1)
}
</script>

<style scoped>
.parameter-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.parameter-name {
  width: 80px;
  font-weight: bold;
  justify-content: center;
  margin-right: 10px;
  text-align: center;
}

.parameter-value {
  width: 40px;
  text-align: center;
  color: #555;
}
</style>
