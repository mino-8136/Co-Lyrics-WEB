<template>
  <v-container class="setting-panel">
    <div v-if="selectedObject">
      <v-tabs v-model="tab">
        <v-tab value="basic">基本設定</v-tab>
        <v-tab value="stylize">スタイル</v-tab>
        <v-tab value="animation">アニメーション</v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="basic">
          <!-- 選択されたオブジェクトの種類に基づいてUIを表示 -->
          <div v-for="(param, label) in selectedObject" :key="label">
            <div
              v-if="ParameterInfo.getType(label) != ParameterInfo.UIType.none"
              class="parameter-row"
            >
              <!-- パラメータ名の表示 -->
              <v-chip class="parameter-name">{{ ParameterInfo.getName(label) }} </v-chip>

              <!-- 数値型の場合 -->
              <template v-if="ParameterInfo.getType(label) == ParameterInfo.UIType.slider">
                <v-row v-if="isKeyframeSettings(param)">
                  <transition-group name="list" tag="div" style="width: 100%">
                    <v-col v-for="(keyframe, idx) in param" :key="keyframe" cols="12">
                      <v-slider
                        v-model="(keyframe as unknown as KeyframeSettings).value"
                        :min="ParameterInfo.getMinValue(label) || 0"
                        :max="ParameterInfo.getMaxValue(label) || 500"
                        step="1"
                        append-icon="mdi-plus"
                        @click:append="
                          addKeyframe(param as unknown as KeyframeSettings[], parseInt(idx))
                        "
                        hide-details
                      >
                        <template v-slot:prepend>
                          <!-- イージング設定 -->
                          <v-chip
                            @click="
                              openEasingDialog(keyframe as unknown as KeyframeSettings, label)
                            "
                            ><v-icon> mdi-pen </v-icon></v-chip
                          >
                          <!-- キーフレームのフレーム数と値 -->
                          <input
                            class="parameter-value"
                            v-model.number="(keyframe as unknown as KeyframeSettings).frame"
                            @change="sortKeyframe(param as unknown as KeyframeSettings[])"
                          />
                          <p>→</p>
                          <input
                            class="parameter-value"
                            v-model.number="(keyframe as unknown as KeyframeSettings).value"
                          />
                        </template>
                      </v-slider>
                    </v-col>
                  </transition-group>
                </v-row>
                <v-slider
                  v-else
                  v-model="selectedObject[label]"
                  :min="ParameterInfo.getMinValue(label) || 0"
                  :max="ParameterInfo.getMaxValue(label) || 1000"
                  step="1"
                  append-icon="mdi-"
                  hide-details
                >
                  <template v-slot:prepend>
                    <input class="parameter-value" v-model.number="selectedObject[label]" />
                  </template>
                </v-slider>
              </template>

              <template v-if="ParameterInfo.getType(label) == ParameterInfo.UIType.text">
                <textarea :id="label" v-model="selectedObject[label]" type="text" />
              </template>

              <template v-if="ParameterInfo.getType(label) == ParameterInfo.UIType.select">
                <v-select v-model="selectedObject[label]" :items="fontList"> </v-select>
              </template>

              <template v-if="ParameterInfo.getType(label) === ParameterInfo.UIType.color">
                <div class="text-center">
                  <v-menu v-model="colorMenu" :close-on-content-click="false" location="end">
                    <template v-slot:activator="{ props }">
                      <v-btn :color="selectedObject[label]" v-bind="props" width="100px">
                        {{ selectedObject[label] }}
                      </v-btn>
                    </template>
                    <v-color-picker v-model="selectedObject[label]" :modes="['hexa']" flat />
                  </v-menu>
                </div>
              </template>

              <template v-if="ParameterInfo.getType(label) === ParameterInfo.UIType.checkbox">
                <v-checkbox v-model="selectedObject[label]" hide-details />
              </template>
            </div>
          </div>
        </v-tabs-window-item>

        <v-tabs-window-item value="stylize">
          <p>機能追加予定</p>
        </v-tabs-window-item>

        <v-tabs-window-item value="animation">
          <p>{{ selectedObject.anim_name }}</p>
          <p v-for="(parameter, index) in selectedObject.anim_parameters" :key="index">
            {{ selectedObject.anim_parameters }}
          </p>
          <v-btn @click="openAnimationDialog()">
            <v-icon>mdi-plus</v-icon>
            アニメーション追加
          </v-btn>
        </v-tabs-window-item>
      </v-tabs-window>
    </div>

    <!-- イージング設定の呼び出し -->
    <v-dialog v-model="easingPanel">
      <EasingPanel
        :getParam="currentParam"
        @callAddEasing="addEasing"
        v-model:panel="easingPanel"
      />
    </v-dialog>

    <!-- アニメーション設定の呼び出し -->
    <v-dialog v-model="animationPanel">
      <AnimationPanel @callAddAnimation="addAnimation" />
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useObjectStore } from '@/stores/objectStore'
import * as ParameterInfo from '@/components/objects/parameterInfo'
import { type KeyframeSettings, isKeyframeSettings } from '@/components/objects/objectInfo'
import AnimationPanel from '@/components/editor/AnimationPanel.vue'
import EasingPanel from '@/components/editor/EasingPanel.vue'
// import ColorPanel from '@/components/objects/ColorPanel.vue'
import { fontListData } from '@/assets/fonts/fonts'

const objectStore = useObjectStore()
const fontList = fontListData.map((font) => font.name)
const tab = ref('basic')
const colorMenu = ref(false)

// 選択されたオブジェクトの情報が自動的に表示される
const selectedObject: Record<string, any> = computed(() => {
  return objectStore.objects.find((obj) => obj.id === objectStore.selectedObjectId)
})

// ボタンが押されたとき、指定したインデックスの次にキーフレームを追加する関数
function addKeyframe(element: KeyframeSettings[], idx: number) {
  console.log(element, idx)
  const newKeyframe =
    element.length - 1 !== idx
      ? Math.floor((element[idx].frame + element[idx + 1].frame) / 2)
      : element[idx].frame + 10
  element.splice(idx + 1, 0, {
    frame: newKeyframe,
    value: element[idx].value
  })
}

//////////////////////////////
// イージング設定に関する記述 //
//////////////////////////////
const easingPanel = ref(false)
const currentParam = ref({
  label: '',
  param: '' as unknown as KeyframeSettings
})
function openEasingDialog(param: KeyframeSettings, label: string) {
  currentParam.value.param = param
  currentParam.value.label = label
  easingPanel.value = true
}

function addEasing(easing: string) {
  console.log(currentParam.value)
  currentParam.value.param.animation = easing
}

//////////////////////////////////
// アニメーション設定に関する記述 //
//////////////////////////////////
const animationPanel = ref(false)
function openAnimationDialog() {
  animationPanel.value = true
}

// 指定したプロパティの移動タイプを追加
function addAnimation(element: KeyframeSettings, index: number, animation: string) {
  element.animation = animation
  console.log(element)
}

function sortKeyframe(param: KeyframeSettings[]) {
  param.sort((a, b) => a.frame - b.frame)
}
</script>

<style scoped>
.setting-panel {
  min-width: 300px;
  width: 100%;
  height: 500px;
  padding: 10px;
  border: 1px solid #ccc;
  overflow-y: auto;
}

.parameter-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.parameter-name {
  width: 100px;
  font-weight: bold;
  justify-content: center;
  margin-right: 10px;
  text-align: center;
  border: 1px solid #555;
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
