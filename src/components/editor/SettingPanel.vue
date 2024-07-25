<template>
  <v-container class="setting-panel">
    <div v-if="selectedObject">
      <!-- 選択されたオブジェクトの種類に基づいてUIを表示 -->
      <div v-for="(value, param) in selectedObject" :key="param" class="parameter-row">
        <template v-if="isNumber(value)">
          <div class="parameter-name">{{getName(param)}}</div>
          <div class="parameter-value">{{ value }}</div>
          <v-slider
            v-model="selectedObject[param]"
            :min="getMinValue(param) || 0"
            :max="getMaxValue(param) || 1000"
            step="1"
          ></v-slider>
        </template>
        <template v-else-if="isString(value)">
          <div class="parameter-name">{{ param }}</div>
          <input :id="param" v-model="selectedObject[param]" type="text" />
        </template>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useObjectStore } from '@/stores/objectStore'
import { parameterInfo } from '../objects/parameterInfo'
const objectStore = useObjectStore()

// 選択されたオブジェクトの情報が自動的に表示される
const selectedObject = computed(() => {
  return objectStore.objects.find(obj => obj.selected)
})

// 型チェック関数
const isNumber = (value: unknown): value is number => typeof value === 'number'
const isString = (value: unknown): value is string => typeof value === 'string'

function getName(key: string) {
  return parameterInfo[key]?.name ?? key
}

function getMaxValue(key: string) {
  return parameterInfo[key]?.max
}

function getMinValue(key: string) {
  return parameterInfo[key]?.min
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
