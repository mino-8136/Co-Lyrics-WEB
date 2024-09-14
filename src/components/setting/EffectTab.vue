<template>
  <transition-group name="list">
    <div v-for="(params, label) in parameters.effects" :key="params.id">
      <v-card variant="outlined" class="mb-2">
        <template v-slot:title>
          <p class="text-body-1">{{ params.name }}</p>
        </template>
        <template v-slot:prepend>
          <v-icon @click="openDescription(searchEffects(params).description)"
            >mdi-file-document-outline
          </v-icon>
        </template>
        <template v-slot:append>
          <v-icon @click="upEffect(label)">mdi-arrow-up </v-icon>
          <v-icon @click="downEffect(label)">mdi-arrow-down </v-icon>
          <v-icon @click="deleteEffect(label)">mdi-delete</v-icon>
        </template>

        <!-- 各パラメータの表示 -->
        <div
          v-for="(param, paramLabel) in searchEffects(params).parameters"
          :key="param.name"
          class="mx-2"
        >
          <div v-if="param.type != UIType.none" class="parameter-row">
            <!-- パラメータ名の表示 -->
            <v-chip
              v-if="param.type == UIType.keyframe"
              class="parameter-name"
              variant="outlined"
              size="small"
              label
              @click="
                (params.parameters[paramLabel] as KeyframeSettings).isGraphOpen = !(
                  params.parameters[paramLabel] as KeyframeSettings
                ).isGraphOpen
              "
              >{{ param.name }}</v-chip
            >
            <v-chip v-else class="parameter-name" variant="outlined" size="small">{{
              param.name
            }}</v-chip>

            <!-- キーフレーム対応の場合 -->
            <template v-if="param.type == UIType.keyframe">
              <KeyframeParameter
                v-model="params.parameters[paramLabel]"
                :min="param.min"
                :max="param.max"
              />
            </template>

            <!-- 数値型パラメータの場合 -->
            <template v-if="param.type == UIType.slider">
              <SliderParameter
                v-model="params.parameters[paramLabel]"
                :min="param.min"
                :max="param.max"
              />
            </template>

            <!-- テキスト型パラメータの場合 -->
            <template v-if="param.type === UIType.text">
              <TextParameter v-model="params.parameters[paramLabel] as string" class="w-100" />
            </template>

            <!-- セレクトボックス型パラメータの場合 -->
            <template v-if="param.type === UIType.select">
              <SelectParameter
                v-model="params.parameters[paramLabel] as string"
                :param="param.options"
              />
            </template>

            <!-- カラー型パラメータの場合 -->
            <template v-if="param.type === UIType.color">
              <ColorParameter v-model="params.parameters[paramLabel] as string" />
            </template>

            <!-- チェックボックス型パラメータの場合 -->
            <template v-if="param.type === UIType.checkbox">
              <CheckboxParameter v-model="params.parameters[paramLabel] as boolean" />
            </template>
          </div>

          <v-divider />
        </div>
      </v-card>
    </div>
  </transition-group>

  <v-btn block variant="outlined" class="mb-2 elevation-1" @click="openEffectDialog()">
    <v-icon>mdi-plus</v-icon>
    エフェクト追加
  </v-btn>

  <!-- アニメーション設定の呼び出し -->
  <EffectPanel :type="props.type" v-model:show="effectPanel" v-model:effects="parameters" />

  <v-dialog v-model="descriptionPanel" max-width="800px">
    <v-card>
      <v-card-title>エフェクトの説明</v-card-title>
      <v-card-text>
        <p>{{ description }}</p>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="descriptionPanel = false">閉じる</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  type StyleSettings,
  type StyleSetting,
  type AnimationSetting
} from '@/components/parameters/objectInfo'
import { UIType } from '@/components/parameters/uiInfo'
import EffectPanel from './EffectPanel.vue'
import { animationList } from '@/assets/effects/animation'
import { styleList } from '@/assets/effects/style'

import KeyframeParameter from './dom/KeyframeParameter.vue'
import SliderParameter from './dom/SliderParameter.vue'
import TextParameter from './dom/TextParameter.vue'
import SelectParameter from './dom/SelectParameter.vue'
import ColorParameter from './dom/ColorParameter.vue'
import CheckboxParameter from './dom/CheckboxParameter.vue'
import type { KeyframeSettings } from '../parameters/keyframeInfo'

const parameters = defineModel<StyleSettings>('params', { required: true })
const props = defineProps<{
  type: String // 'animation' or 'style'
}>()

//////////////////////////////////
// アニメーション設定に関する記述 //
//////////////////////////////////
const effectPanel = ref(false)
const descriptionPanel = ref(false)
let description = ''

function openEffectDialog() {
  effectPanel.value = true
}

// 指定されたアニメーションのパラメータを検索する関数
function searchEffects(effect: StyleSetting | AnimationSetting): { [key: string]: any } {
  const effectList = props.type == 'animation' ? animationList : styleList
  return effectList.find((item) => item.name === effect.name) || {}
}

// 説明書を開く関数
function openDescription(text: string) {
  description = text
  descriptionPanel.value = true
}

function upEffect(index: number) {
  if (index > 0) {
    const temp = parameters.value.effects[index]
    parameters.value.effects[index] = parameters.value.effects[index - 1]
    parameters.value.effects[index - 1] = temp
  }
}

function downEffect(index: number) {
  if (index < parameters.value.effects.length - 1) {
    const temp = parameters.value.effects[index]
    parameters.value.effects[index] = parameters.value.effects[index + 1]
    parameters.value.effects[index + 1] = temp
  }
}
function deleteEffect(index: number) {
  parameters.value.effects.splice(index, 1)
}
</script>

<style scoped>
.parameter-row {
  display: flex;
  align-items: center;
  margin: 2px 0px;
}

.parameter-name {
  width: 80px;
  font-weight: bold;
  justify-content: center;
  margin-right: 10px;
  text-align: center;
}

/* リストアニメーション */
.list-move,
/* 移動する要素にトランジションを適用 */
.list-enter-active,
.list-leave-active {
  transition: all 0.2s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}
</style>
