<template>
  <v-container class="setting-panel">
    <div v-if="selectedObject">
      <!-- 選択されたオブジェクトの種類に基づいてUIを表示 -->

      <div v-if="selectedObject.type === 'text'">

        <textarea v-model="selectedObject.text" type="text" />

        <v-slider label="val1"></v-slider>
        <v-slider label="val1"></v-slider>
        <v-slider label="val1"></v-slider>
        <v-slider label="val1"></v-slider>
      </div>

      <div v-if="selectedObject.type === 'image'">
        <label>画像URL:</label>
        <input v-model="selectedObject.url" type="text" />
      </div>
      
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useObjectStore } from '@/stores/objectStore'
const objectStore = useObjectStore()

// 選択されたオブジェクトの情報
const selectedObject = computed(() => {
  return objectStore.objects.find(obj => obj.selected)
})

</script>

<style scoped>
.setting-panel {
  width: 100%;
  height: 500px;
  padding: 10px;
  border: 1px solid #ccc;
  overflow-y: auto
}

textarea {
  width: 100%;
  height: 120px;
  padding: 8px 12px;
  box-sizing: border-box;
  border: 1px solid #ccc;
}

</style>