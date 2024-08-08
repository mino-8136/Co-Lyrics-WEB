<template>
  <v-container class="setting-panel">
    <div v-if="selectedObject">
      <!-- 選択されたオブジェクトの種類に基づいてUIを表示 -->
      <div v-for="(element, label) in selectedObject" :key="label">
        <div v-if="getType(label) != UIType.none" class="parameter-row">
          <v-chip class="parameter-name" @click="animationDialog = true">{{
            getName(label)
          }}</v-chip>

          <!-- 数値型の場合 -->
          <template v-if="getType(label) == UIType.slider">
            <v-row v-if="isKeyframeSettings(element)">
              <v-col v-for="(val, idx) in element" :key="idx" cols="12">
                <v-slider
                  v-model="(element[idx] as unknown as KeyframeSettings).value"
                  :min="getMinValue(label) || 0"
                  :max="getMaxValue(label) || 1000"
                  step="1"
                  append-icon="mdi-plus"
                  @click:append="addKeyframe(label, idx)"
                  hide-details
                >
                  <template v-slot:prepend>
                    <input
                      class="parameter-value"
                      v-model.number="(element[idx] as unknown as KeyframeSettings).frame"
                    />
                    <p>→</p>
                    <input
                      class="parameter-value"
                      v-model.number="(element[idx] as unknown as KeyframeSettings).value"
                    />
                  </template>
                </v-slider>
              </v-col>
            </v-row>
            <v-slider
              v-else
              v-model="selectedObject[label]"
              :min="getMinValue(label) || 0"
              :max="getMaxValue(label) || 1000"
              step="1"
              append-icon="mdi-"
              hide-details
            >
              <template v-slot:prepend>
                <input class="parameter-value" v-model.number="selectedObject[label]" />
              </template>
            </v-slider>
          </template>

          <template v-if="getType(label) == UIType.text">
            <textarea :id="label" v-model="selectedObject[label]" type="text" />
          </template>

          <template v-if="getType(label) == UIType.select">
            <v-select v-model="selectedObject[label]" :items="fontList"> </v-select>
          </template>

          <template v-if="getType(label) === UIType.color">
            <input type="color" v-model="selectedObject[label]" />
          </template>
        </div>
      </div>
    </div>

    <!-- アニメーション設定の「呼び出し-->
    <v-dialog v-model="animationDialog">
      <AnimationPanel :getParameter="ad" @callAddAnimaton="addAnimation" />
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useObjectStore } from '@/stores/objectStore'
import { parameterInfo, UIType } from '../objects/parameterInfo'
import type { KeyframeSettings } from '../objects/objectInfo'
import AnimationPanel from './AnimationPanel.vue'

const objectStore = useObjectStore()
const fontList = ['Arial', 'Verdana', 'Times New Roman', 'Courier New']
const animationDialog = ref(false)

// 選択されたオブジェクトの情報が自動的に表示される
const selectedObject = computed(() => {
  return objectStore.objects.find((obj) => obj.selected)
})

// TODO: 雑な実装なのであとで直す。slider型のときだけ呼び出す関数
function addKeyframe(index: string, idx: number) {
  // キーフレームが1つのときは、this.endに値を設定
  if (isKeyframeSettings(selectedObject.value?.[index as keyof typeof selectedObject.value])) {
    ;(selectedObject.value as any)[index].value
      .push((selectedObject.value as any)[index].value[idx])(selectedObject.value as any)
      [index].frame.push((selectedObject.value as any)[index].frame[idx] + 1)
  }

  // キーフレームが2つのときは、this.startとthis.endの間に値を設定
}

function addAnimation(arg1, arg2) {
  // 指定したプロパティにアニメーションを追加
}

///////////////////////////////////////////

// KeyframeSettings 型か number 型かを判定する関数
function isKeyframeSettings(element: any): element is KeyframeSettings {
  return Array.isArray(element)
}
// パラメータを取得する関数
const getName = (key: string) => {
  return parameterInfo[key]?.name ?? key
}
const getMaxValue = (key: string) => {
  return parameterInfo[key]?.max
}
const getMinValue = (key: string) => {
  return parameterInfo[key]?.min
}
const getType = (key: string): UIType => {
  if (parameterInfo[key]?.type === undefined) {
    return UIType.none
  }
  return parameterInfo[key]?.type
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
</style>
