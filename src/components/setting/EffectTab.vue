// AnimationTabと統合予定

<template>
  <transition-group name="list">
    <div v-for="(params, label) in parameters" :key="params.id">
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

        <div
          v-for="(param, paramLabel) in searchEffects(params).parameters"
          :key="param.name"
          class="mx-2"
        >
          <div v-if="param.type != UIType.none" class="parameter-row">
            <!-- パラメータ名の表示 -->
            <v-chip class="parameter-name" variant="outlined" size="small" label>{{
              param.name
            }}</v-chip>

            <!-- 数値型パラメータの場合 -->
            <template v-if="param.type == UIType.slider">
              <v-slider
                v-model="params.parameters[paramLabel]"
                :min="param.min"
                :max="param.max"
                step="1"
                hide-details
              >
                <template v-slot:prepend>
                  <input class="parameter-value" v-model.number="params.parameters[paramLabel]" />
                </template>
              </v-slider>
            </template>

            <!-- チェックボックス型パラメータの場合 -->
            <template v-if="param.type === UIType.checkbox">
              <v-checkbox v-model="params.parameters[paramLabel]" hide-details />
            </template>
          </div>
        </div>
      </v-card>
    </div>
  </transition-group>

  <v-btn block variant="outlined" class="mb-2 elevation-1" @click="openEffectDialog()">
    <v-icon>mdi-plus</v-icon>
    エフェクト追加
  </v-btn>

  <!-- アニメーション設定の呼び出し -->
  <StylePanel :type="props.type" v-model:show="effectPanel" v-model:effects="parameters" />

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
  UIType,
  type StyleSettings,
  type StyleSetting,
  type AnimationSetting
} from '@/components/parameters/objectInfo'
import StylePanel from './EffectPanel.vue'
import { animationList } from '@/assets/animations/animation'
import { styleList } from '@/assets/styles/style'

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
    const temp = parameters.value[index]
    parameters.value[index] = parameters.value[index - 1]
    parameters.value[index - 1] = temp
  }
}

function downEffect(index: number) {
  if (index < parameters.value.length - 1) {
    const temp = parameters.value[index]
    parameters.value[index] = parameters.value[index + 1]
    parameters.value[index + 1] = temp
  }
}
function deleteEffect(index: number) {
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

/* リストアニメーション */
.list-move, /* 移動する要素にトランジションを適用 */
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
