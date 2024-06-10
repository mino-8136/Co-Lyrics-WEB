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

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useMainStore } from '@/store';

export default defineComponent({
  name: 'SettingPanel',
  setup() {
    const store = useMainStore();
    const selectedObject = ref(null);

    // 選択されたオブジェクトの更新リスナー
    store.subscribeToSelectedObject((newObject) => {
      selectedObject.value = newObject;
    });

    return { selectedObject };
  }
});
</script>
