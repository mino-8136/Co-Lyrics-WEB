<template>
  <v-container class="setting-panel">
    <div v-if="selectedObject">
      <!-- 選択されたオブジェクトの種類に基づいてUIを表示 -->
      <div v-for="(value, index) in selectedObject" :key="index">
        <div v-if="getType(index) != UIType.none" class="parameter-row">
          <v-chip class="parameter-name" @click="animationDialog = true">{{
            getName(index)
          }}</v-chip>

          <!-- 数値型の場合 -->
          <template v-if="getType(index) == UIType.slider">
            <v-slider
              v-model="selectedObject[index]"
              :min="getMinValue(index) || 0"
              :max="getMaxValue(index) || 1000"
              step="1"
              append-icon="mdi-plus"
              @click:append="animationDialog = true"
              hide-details
            >
              <template v-slot:prepend>
                <input class="parameter-value" v-model.number="selectedObject[index]" />
              </template>
            </v-slider>
          </template>

          <template v-if="getType(index) == UIType.text">
            <textarea :id="index" v-model="selectedObject[index]" type="text" />
          </template>

          <template v-if="getType(index) == UIType.select">
            <v-select v-model="selectedObject[index]" :items="fontList"> </v-select>
          </template>

          <template v-if="getType(index) === UIType.color">
            <input type="color" v-model="selectedObject[index]" />
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
import AnimationPanel from './AnimationPanel.vue'

const objectStore = useObjectStore()
const fontList = ['Arial', 'Verdana', 'Times New Roman', 'Courier New']
const animationDialog = ref(false)

// 選択されたオブジェクトの情報が自動的に表示される
const selectedObject = computed(() => {
  return objectStore.objects.find((obj) => obj.selected)
})

// 
function addKeyframe() {

}


function addAnimation(arg1, arg2) {
  // 指定したプロパティにアニメーションを追加
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
