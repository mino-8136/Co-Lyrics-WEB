<template>
  <div v-for="(param, label) in parameters" :key="label">
    <div
      v-if="(parameters.constructor as typeof PropertyMethod).getUIType(label) != UIType.none"
      class="parameter-row"
    >
      <!-- パラメータ名の表示 -->
      <v-chip
        class="parameter-name"
        variant="outlined"
        size="small"
        label
        @click="toggleKeyframeGraph(label)"
        >{{ (parameters.constructor as typeof PropertyMethod).getParameterName(label) }}</v-chip
      >

      <!-- キーフレーム対応の場合 -->
      <template
        v-if="(parameters.constructor as typeof PropertyMethod).getUIType(label) == UIType.keyframe"
      >
        <v-row v-if="isKeyframeSettings(param)">
          <!-- キーフレームビューの表示 -->
          <KeyframeGraph
            v-if="showKeyframes.includes(label)"
            :start="selectedObject.start"
            :end="selectedObject.end"
            :panelWidth="getBoundingClientRect() * 0.75"
            v-model:keyframes="parameters[label]"
          />

          <transition-group v-else name="list" tag="div" style="width: 100%">
            <v-col
              v-for="(keyframe, idx) in param as KeyframeSettings"
              :key="keyframe.id"
              cols="12"
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
                    class="parameter-value"
                    v-model.number="keyframe.frame"
                    @change="sortKeyframe(param)"
                  />
                  <p>→</p>
                  <input class="parameter-value" v-model.number="keyframe.value" />
                </template>
                <template v-slot:append>
                  <v-icon v-if="idx > 0" @click="deleteKeyframe(param, idx)">mdi-delete</v-icon>
                  <v-icon v-else></v-icon>
                </template>
              </v-slider>
            </v-col>
          </transition-group>
        </v-row>
      </template>

      <!-- 数値型パラメータの場合 -->
      <template
        v-if="(parameters.constructor as typeof PropertyMethod).getUIType(label) == UIType.slider"
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
      </template>

      <!-- テキスト型パラメータの場合 -->
      <template
        v-if="(parameters.constructor as typeof PropertyMethod).getUIType(label) == UIType.text"
      >
        <textarea :id="label" v-model="parameters[label]" type="text" />
      </template>

      <!-- セレクト型パラメータの場合 -->
      <template
        v-if="(parameters.constructor as typeof PropertyMethod).getUIType(label) === UIType.select"
      >
        <v-select v-model="parameters[label]" :items="fontList" hide-details></v-select>
      </template>

      <!-- カラー型パラメータの場合 -->
      <template
        v-if="(parameters.constructor as typeof PropertyMethod).getUIType(label) === UIType.color"
      >
        <div class="text-center">
          <v-menu v-model="colorMenu" :close-on-content-click="false" location="end">
            <template v-slot:activator="{ props }">
              <v-btn :color="parameters[label]" v-bind="props" width="100px">
                {{ parameters[label] }}
              </v-btn>
            </template>
            <v-color-picker v-model="parameters[label]" :modes="['hexa']" flat />
          </v-menu>
        </div>
      </template>

      <!-- チェックボックス型パラメータの場合 -->
      <template
        v-if="
          (parameters.constructor as typeof PropertyMethod).getUIType(label) === UIType.checkbox
        "
      >
        <v-checkbox v-model="parameters[label]" hide-details />
      </template>
    </div>
    <v-divider></v-divider>
  </div>

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
  UIType,
  TextSettings,
  PropertyMethod
} from '@/components/parameters/objectInfo'
import EasingPanel from '@/components/setting/EasingPanel.vue'
import KeyframeGraph from '@/components/setting/KeyframeGraph.vue'
import { fontListData } from '@/assets/fonts/fonts'
import { generateUniqueId } from '@/components/utils/common'

const objectStore = useObjectStore()
const timelineStore = useTimelineStore()
const fontList = fontListData.map((font) => font.name)
const colorMenu = ref(false)

const parameters = defineModel<StandardRenderSettings | TextSettings>('params', { required: true })

// 選択されたオブジェクトの情報(setting panelと同じ)
const selectedObject: Record<string, any> = computed(() => {
  return objectStore.objects.find((obj) => obj.id === timelineStore.selectedObjectId)
})

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

.parameter-row {
  display: flex;
  align-items: center;
  margin: 8px 1px;
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

textarea {
  width: 100%;
  height: 120px;
  padding: 8px 12px;
  box-sizing: border-box;
  border: 1px solid #ccc;
}

/* リストアニメーション */
.list-move, /* 移動する要素にトランジションを適用 */
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
