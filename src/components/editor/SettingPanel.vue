<template>
  <v-container class="setting-panel">
    <div v-if="selectedObject">
      <!-- 選択されたオブジェクトの種類に基づいてUIを表示 -->
      <div v-for="(value, key) in selectedObject" :key="key" class="parameter-row">
        <template v-if="isNumber(value)">
          <div class="parameter-label">{{ key }}:</div>
          <div class="parameter-value">{{ value }}</div>
          <v-slider
            v-model="selectedObject[key]"
            :min="0"
            :max="100"
          ></v-slider>
        </template>
        <template v-else-if="isString(value)">
          <div class="parameter-label">{{ key }}:</div>
          <input :id="key" v-model="selectedObject[key]" type="text" />
        </template>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useObjectStore } from '@/stores/objectStore'
const objectStore = useObjectStore()

// 選択されたオブジェクトの情報が自動的に表示される
const selectedObject = computed(() => {
  return objectStore.objects.find(obj => obj.selected)
})

// 型チェック関数
const isNumber = (value: unknown): value is number => typeof value === 'number'
const isString = (value: unknown): value is string => typeof value === 'string'
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
  margin-bottom: 10px;
}

.parameter-label {
  width: 100px;
  font-weight: bold;
  margin-right: 10px;
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
