<template>
  <v-row align="center" class="pt-2 mb-3">
    <template v-for="(param, label) in parameters" :key="label">
      <!-- パラメータ名とDOMの幅を動的に設定 -->
      <v-col
        :cols="getColSpan((parameters.constructor as typeof PropertyMethod).getUIType(label))"
        v-if="(parameters.constructor as typeof PropertyMethod).getUIType(label) != UIType.none"
        style="border: 0.1px #ccc solid;"
      >
        <v-row align="center" style="min-height: 50px;">
          <!-- パラメータ名の表示 -->
          <v-chip
            class="parameter-name"
            variant="outlined"
            size="small"
            @click="toggleKeyframeGraph(label)"
            >{{ (parameters.constructor as typeof PropertyMethod).getParameterName(label) }}</v-chip
          >

          <!-- キーフレーム対応の場合 -->
          <v-col
            v-if="
              (parameters.constructor as typeof PropertyMethod).getUIType(label) == UIType.keyframe
            "
          >
            <v-row v-if="isKeyframeSettings(param)">
              <!-- キーフレームビューの表示 -->
              <KeyframeGraph
                v-if="showKeyframes.includes(label)"
                :start="selectedObject.start"
                :end="selectedObject.end"
                :panelWidth="getBoundingClientRect() * 0.7"
                v-model:keyframes="parameters[label]"
              />

              <transition-group v-else name="list" tag="div" style="width: 100%">
                <v-col
                  v-for="(keyframe, idx) in param as KeyframeSettings"
                  :key="keyframe.id"
                  class="pt-1 pb-2"
                >
                  <v-slider
                    v-model="keyframe.value"
                    :min="(parameters.constructor as typeof PropertyMethod).getMinValue(label)"
                    :max="(parameters.constructor as typeof PropertyMethod).getMaxValue(label)"
                    step="1"
                    append-icon="mdi-plus"
                    @click:append="addKeyframe(param, idx)"
                    hide-details
                  >
                    <template v-slot:prepend>
                      <!-- イージング設定 -->
                      <div
                        class="ease-setting"
                        :style="{
                          backgroundColor: keyframe.easeType ? '#09b7f6' : '#ccc'
                        }"
                        @click="openEasingDialog(keyframe)"
                      ></div>

                      <!-- キーフレームのフレーム数と値 -->
                      <input
                        type="number"
                        class="parameter-value"
                        style="margin-right: 2px; width: 50px"
                        v-model.number="keyframe.frame"
                        @change="sortKeyframe(param)"
                      />
                      <p>→</p>
                      <input
                        type="number"
                        style="width: 60px"
                        class="parameter-value"
                        v-model.number="keyframe.value"
                      />
                    </template>
                    <template v-slot:append>
                      <v-icon v-if="idx > 0" @click="deleteKeyframe(param, idx)">mdi-delete</v-icon>
                      <v-icon v-else></v-icon>
                    </template>
                  </v-slider>
                </v-col>
              </transition-group>
            </v-row>
          </v-col>

          <!-- 数値型パラメータの場合 -->
          <v-col
            v-if="
              (parameters.constructor as typeof PropertyMethod).getUIType(label) == UIType.slider
            "
          >
            <v-slider
              v-model="parameters[label]"
              :min="(parameters.constructor as typeof PropertyMethod).getMinValue(label)"
              :max="(parameters.constructor as typeof PropertyMethod).getMaxValue(label)"
              step="1"
              hide-details
            >
              <template v-slot:prepend>
                <input class="parameter-value" v-model.number="parameters[label]" />
              </template>
            </v-slider>
          </v-col>

          <!-- テキスト型パラメータの場合 -->
          <v-col
            class="pb-0"
            v-if="(parameters.constructor as typeof PropertyMethod).getUIType(label) == UIType.text"
          >
            <textarea :id="label" v-model="parameters[label]" type="text" />
          </v-col>

          <!-- セレクト型パラメータの場合 -->
          <v-col
            class="py-0"
            v-if="
              (parameters.constructor as typeof PropertyMethod).getUIType(label) === UIType.select
            "
          >
            <select v-model="parameters[label]" class="w-100">
              <option v-for="(e, index) in getOptionsList(label)" :key="index">
                {{ e }}
              </option>
            </select>
          </v-col>

          <!-- カラー型パラメータの場合 -->
          <v-col
            class="py-0"
            v-if="
              (parameters.constructor as typeof PropertyMethod).getUIType(label) === UIType.color
            "
          >
            <div>
              <v-menu v-model="colorMenu" :close-on-content-click="false" location="end">
                <template v-slot:activator="{ props }">
                  <v-btn :color="parameters[label]" v-bind="props" width="110px" class="border">
                    {{ parameters[label] }}
                  </v-btn>
                </template>
                <v-color-picker v-model="parameters[label]" :modes="['hexa']" flat />
              </v-menu>
            </div>
          </v-col>

          <!-- チェックボックス型パラメータの場合 -->
          <v-col
            class="py-0"
            v-if="
              (parameters.constructor as typeof PropertyMethod).getUIType(label) === UIType.checkbox
            "
          >
            <v-checkbox-btn v-model="parameters[label]" hide-details />
          </v-col>
        </v-row>
      </v-col>
    </template>
  </v-row>

  <!-- イージング設定の呼び出し -->
  <EasingPanel v-model:show="showEasingPanel" v-model:easing="currentKeyframe" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useObjectStore, useTimelineStore } from '@/stores/objectStore'
import {
  StandardRenderSettings,
  type KeyframeSettings,
  type KeyframeSetting,
  isKeyframeSettings,
  TextSettings,
  PropertyMethod
} from '@/components/parameters/objectInfo'
import { UIType } from '@/components/parameters/uiInfo'
import EasingPanel from '@/components/setting/EasingPanel.vue'
import KeyframeGraph from '@/components/setting/KeyframeGraph.vue'
import { generateUniqueId } from '@/components/utils/common'

import { fontListData } from '@/components/parameters/fonts'
import { ShapeType, TextAlign } from '../parameters/p5Info'

const objectStore = useObjectStore()
const timelineStore = useTimelineStore()
const colorMenu = ref(false)

const parameters = defineModel<StandardRenderSettings | TextSettings>('params', { required: true })

// 選択されたオブジェクトの情報(setting panelと同じ)
const selectedObject: Record<string, any> = computed(() => {
  return objectStore.objects.find((obj) => obj.id === timelineStore.selectedObjectId)
})

// TODO: どこでも使えるようにしたほうが良いかも
function getOptionsList(label: string): string[] {
  if (label === 'font') {
    return fontListData.map((font) => font.displayName)
  } else if (label === 'shape') {
    return Object.values(ShapeType)
  } else if (label === 'align') {
    return Object.values(TextAlign)
  }
  return []
}

function getColSpan(uiType: UIType) {
  if (uiType === UIType.keyframe) {
    return 12
  } else if (uiType === UIType.color || uiType === UIType.checkbox || uiType === UIType.select) {
    return 6
  }
  return 12 // デフォルトはフル幅
}

// ウィンドウの幅を求める関数
// TODO: もう少しスマートにする
function getBoundingClientRect() {
  const parent = document.querySelector('.setting-panel')
  if (!parent) return 300
  return parent.getBoundingClientRect().width
}

////////////////////////////
// キーフレームに関する設定 //
////////////////////////////

// ボタンが押されたとき、指定したインデックスの次にキーフレームを追加する関数
// TODO: 追加位置を吟味
function addKeyframe(keyframes: KeyframeSettings, idx: number) {
  const newKeyframe =
    keyframes.length - 1 !== idx
      ? Math.floor((keyframes[idx].frame + keyframes[idx + 1].frame) / 2)
      : keyframes[idx].frame + 20
  keyframes.splice(idx + 1, 0, {
    frame: newKeyframe,
    value: keyframes[idx].value,
    id: generateUniqueId()
  })
}

// 指定したキーフレームを削除する関数
function deleteKeyframe(keyframes: KeyframeSettings, idx: number) {
  keyframes.splice(idx, 1)
}

// キーフレーム順に並び替える関数
function sortKeyframe(keyframes: KeyframeSettings) {
  keyframes.sort((a, b) => a.frame - b.frame)
}

//////////////////////////////
// イージング設定に関する記述 //
//////////////////////////////
const showEasingPanel = ref(false)
const currentKeyframe = ref<KeyframeSetting>({} as KeyframeSetting)

function openEasingDialog(keyframe: KeyframeSetting) {
  currentKeyframe.value = keyframe
  showEasingPanel.value = true
}

// キーフレームグラフの表示切り替え
const showKeyframes = ref<string[]>([])
function toggleKeyframeGraph(label: string) {
  if (showKeyframes.value.includes(label)) {
    showKeyframes.value = showKeyframes.value.filter((keyframe) => keyframe !== label)
  } else {
    showKeyframes.value.push(label)
  }
}
</script>

<style scoped>
div.ease-setting {
  width: 12px;
  height: 12px;
  border-radius: 100%;
  margin-right: 10px;
  background-color: #09b7f6;
}

.parameter-name {
  width: 80px;
  font-weight: bold;
  margin-left: 20px;
  justify-content: center;
  text-align: center;
}

.parameter-value {
  width: 40px;
  text-align: center;
  color: #555;
  text-align: right;
}

textarea {
  width: 100%;
  height: 80px;
  padding: 4px 12px;
  box-sizing: border-box;
  border: 1px solid #ccc;
}

select {
  padding: 4px 12px;
  border: 1px solid #000000;
  -webkit-appearance: menulist;
  appearance: button;
}

/* リストアニメーション */
.list-move,
/* 移動する要素にトランジションを適用 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
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
