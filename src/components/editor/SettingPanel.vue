<template>
  <v-container class="setting-panel">
    <div v-if="selectedObject">
      <v-tabs v-model="tab">
        <v-tab v-if="'standardRenderSettings' in selectedObject" value="basic">基本設定</v-tab>
        <v-tab v-if="'textSettings' in selectedObject" value="text">テキスト</v-tab>
        <v-tab v-if="'styleSettings' in selectedObject" value="style">スタイル</v-tab>
        <v-tab v-if="'animations' in selectedObject" value="animation">アニメーション</v-tab>
      </v-tabs>

      <div class="scroll">
        <v-tabs-window v-model="tab">
          <!-- 基本設定タブ -->
          <v-tabs-window-item value="basic">
            <SettingsTab
              v-if="'standardRenderSettings' in selectedObject"
              v-model:params="selectedObject.standardRenderSettings"
            >
            </SettingsTab>
          </v-tabs-window-item>

          <!-- テキスト設定タブ -->
          <v-tabs-window-item value="text">
            <SettingsTab
              v-if="'textSettings' in selectedObject"
              v-model:params="selectedObject.textSettings"
            >
            </SettingsTab>
          </v-tabs-window-item>

          <!-- スタイライズ設定タブ -->
          <v-tabs-window-item value="style">
            <StyleTab
              v-if="'styleSettings' in selectedObject"
              v-model:params="selectedObject.styleSettings"
            >
            </StyleTab>
          </v-tabs-window-item>

          <!-- アニメーション設定タブ -->
          <v-tabs-window-item value="animation">
            <AnimationTab
              v-if="'animations' in selectedObject"
              v-model:params="selectedObject.animations"
            >
            </AnimationTab>
          </v-tabs-window-item>
        </v-tabs-window>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useObjectStore, useTimelineStore } from '@/stores/objectStore'
import SettingsTab from '../setting/SettingsTab.vue'
import AnimationTab from '../setting/AnimationTab.vue'
import StyleTab from '../setting/StyleTab.vue'

const objectStore = useObjectStore()
const timelineStore = useTimelineStore()
const tab = ref('basic')

// 選択されたオブジェクトの情報が自動的に表示される
const selectedObject: Record<string, any> = computed(() => {
  return objectStore.objects.find((obj) => obj.id === timelineStore.selectedObjectId)
})
</script>

<style scoped>
.setting-panel {
  min-width: 300px;
  width: 100%;
  height: 500px;
  padding: 12px;
  border: 1px solid #ccc;
  overflow-y: hidden;
}

.scroll {
  height: 435px;
  overflow-y: scroll;
}
</style>
