<template>
  <v-container class="setting-panel">
    <div v-if="selectedObject">
      <!-- 選択されたオブジェクトの種類に基づいてUIを表示 -->
      <div v-for="(element, param) in selectedObject" :key="param">
        <div v-if="getType(param) != UIType.none" class="parameter-row">
          <v-chip class="parameter-name" @click="animationDialog = true">{{
            getName(param)
          }}</v-chip>

          <!-- 数値型の場合 -->
          <template v-if="getType(param) == UIType.slider">
            <v-row v-if="isKeyframeSettings(element)">
              <v-col v-for="(val, idx) in element.value" :key="idx" cols="12">
                <v-slider
                  v-model="(element as KeyframeSettings).value[idx]"
                  :min="getMinValue(param) || 0"
                  :max="getMaxValue(param) || 1000"
                  step="1"
                  append-icon="mdi-plus"
                  @click:append="addKeyframe(param, idx)"
                  hide-details
                >
                  <template v-slot:prepend>
                    <input
                      class="parameter-value"
                      v-model.number="(element as KeyframeSettings).frame[idx]"
                    />
                    <p>→</p>
                    <input
                      class="parameter-value"
                      v-model.number="(element as KeyframeSettings).value[idx]"
                    />
                  </template>
                </v-slider>
              </v-col>
            </v-row>
            <v-slider
              v-else
              v-model="selectedObject[param]"
              :min="getMinValue(param) || 0"
              :max="getMaxValue(param) || 1000"
              step="1"
              append-icon="mdi-"
              hide-details
            >
              <template v-slot:prepend>
                <input class="parameter-value" v-model.number="selectedObject[param]" />
              </template>
            </v-slider>
          </template>

          <template v-if="getType(param) == UIType.text">
            <textarea :id="param" v-model="selectedObject[param]" type="text" />
          </template>

          <template v-if="getType(param) == UIType.select">
            <v-select v-model="selectedObject[param]" :items="fontList"> </v-select>
          </template>

          <template v-if="getType(param) === UIType.color">
            <input type="color" v-model="selectedObject[param]" />
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
const isKeyframeSettings = (value: any): value is KeyframeSettings => {
  return typeof value === 'object' && value !== null && 'value' in value
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
