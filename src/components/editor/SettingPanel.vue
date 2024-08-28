<template>
  <v-container class="setting-panel">
    <div v-if="selectedObject">
      <v-tabs v-model="tab">
        <v-tab v-if="'standardRenderSettings' in selectedObject" value="basic">基本設定</v-tab>
        <v-tab v-if="'textSettings' in selectedObject" value="text">テキスト</v-tab>
        <v-tab v-if="'shapeSettings' in selectedObject" value="shape">図形</v-tab>
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

          <!-- テキスト設定タブ -->
          <v-tabs-window-item value="shape">
            <SettingsTab
              v-if="'shapeSettings' in selectedObject"
              v-model:params="selectedObject.shapeSettings"
            >
            </SettingsTab>
          </v-tabs-window-item>

          <!-- スタイライズ設定タブ -->
          <v-tabs-window-item value="style">
            <EffectTab
              v-if="'styleSettings' in selectedObject"
              v-model:params="selectedObject.styleSettings"
              type="style"
            >
            </EffectTab>
          </v-tabs-window-item>

          <!-- アニメーション設定タブ -->
          <v-tabs-window-item value="animation">
            <EffectTab
              v-if="'animations' in selectedObject"
              v-model:params="selectedObject.animations"
              type="animation"
            >
            </EffectTab>
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
import EffectTab from '../setting/EffectTab.vue'

const objectStore = useObjectStore()
const timelineStore = useTimelineStore()
const tab = ref('basic')

// 選択されたオブジェクトの情報が自動的に表示される
const selectedObject: Record<string, any> = computed(() => {
  return objectStore.objects.find((obj) => obj.id === timelineStore.selectedObjectId)
})
</script>

<style scoped>
.scroll {
  height: 335px;
  min-width: 500px;
  overflow-y: scroll;
}
</style>
