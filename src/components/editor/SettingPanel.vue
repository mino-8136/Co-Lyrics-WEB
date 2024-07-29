<template>
  <v-container class="setting-panel">
    <div v-if="selectedObject">
      <!-- 選択されたオブジェクトの種類に基づいてUIを表示 -->
      <div v-for="(value, param) in selectedObject" :key="param" class="parameter-row">
        <v-chip v-if="getType(param) != UIType.none" class="parameter-name" @click="animationDialog = true">{{ getName(param) }}</v-chip>
        <template v-if="getType(param) == UIType.slider">
          <div class="parameter-value">{{ value }}</div>
          <v-slider
            v-model="selectedObject[param]"
            :min="getMinValue(param) || 0"
            :max="getMaxValue(param) || 1000"
            step="1"
          ></v-slider>
          <v-btn icon="mdi-plus"></v-btn>
        </template>
        <template v-if="getType(param) == UIType.text">
          <textarea :id="param" v-model="selectedObject[param]" type="text" />
        </template>
        <template v-if="getType(param) == UIType.select">
          <v-select 
            v-model="selectedObject[param]"
            :items="fontList"
          >
          </v-select>
        </template>

        <template v-if="getType(param) === UIType.color">
          <input type="color" v-model="selectedObject[param]" />
        </template>
      </div>
    </div>

    <!-- アニメーション設定の「呼び出し-->
    <v-dialog v-model="animationDialog">
      <AnimationPanel />
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useObjectStore } from '@/stores/objectStore'
import { parameterInfo, UIType } from '../objects/parameterInfo'
import AnimationPanel from './AnimationPanel.vue';

const objectStore = useObjectStore()
const fontList = ['Arial', 'Verdana', 'Times New Roman', 'Courier New']
const animationDialog = ref(false)

// 選択されたオブジェクトの情報が自動的に表示される
const selectedObject = computed(() => {
  return objectStore.objects.find((obj) => obj.selected)
})

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
  width: 100%;
  height: 500px;
  padding: 10px;
  border: 1px solid #ccc;
  overflow-y: auto;
}

.parameter-row {
  display: flex;
  align-items: center;
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
  width: 30px;
  margin-left: 10px;
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
