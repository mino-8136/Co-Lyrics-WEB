<script setup lang="ts">
import { ref } from 'vue'

// TODO : 仮で入れているだけ
const selectedObject = ref({
  type: 'text',
  text: 'Hello, World!'
})
</script>

<style scoped>
.setting-panel {
  padding: 10px;
  border: 1px solid #ccc;
}
</style>

<template>
  <div class="setting-panel">
    <div v-if="selectedObject">
      <!-- 選択されたオブジェクトの種類に基づいてUIを表示 -->

      <div v-if="selectedObject.type === 'text'">
        <label>テキスト:</label>
        <input v-model="selectedObject.text" type="text" />
      </div>

      <div v-if="selectedObject.type === 'image'">
        <label>画像URL:</label>
        <input v-model="selectedObject.url" type="text" />
      </div>
    </div>
  </div>
</template>
