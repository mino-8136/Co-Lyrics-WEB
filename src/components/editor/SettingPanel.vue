<template>
  <v-container class="setting-panel">
    <div v-if="selectedObject">
      <v-tabs v-model="tab">
        <v-tab value="basic">基本設定</v-tab>
        <v-tab v-if="selectedObject.type === 'text'" value="text">テキスト</v-tab>
        <v-tab value="stylize">スタイル</v-tab>
        <v-tab value="animation">アニメーション</v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab">
        <!-- 基本設定タブ -->
        <v-tabs-window-item value="basic">
          <SettingsTab v-model:params="selectedObject.standardRenderSettings"> </SettingsTab>
        </v-tabs-window-item>

        <!-- テキスト設定タブ -->
        <v-tabs-window-item value="text">
          <SettingsTab v-model:params="selectedObject.textSettings"> </SettingsTab>
        </v-tabs-window-item>

        <!-- スタイライズ設定タブ -->
        <v-tabs-window-item value="stylize">
          <p>機能追加予定</p>
        </v-tabs-window-item>

        <!-- アニメーション設定タブ -->
        <v-tabs-window-item value="animation">
          <div v-for="(animation, index) in selectedObject.animations" :key="index">
            <p>{{ animation.anim_name }}</p>
            <p>{{ animation.anim_parameters }}</p>
            <div v-for="(parameter, paramKey) in animation.anim_parameters" :key="paramKey">
              <!-- アニメーションパラメータの表示と操作 -->
            </div>
          </div>
          <v-btn @click="openAnimationDialog()">
            <v-icon>mdi-plus</v-icon>
            アニメーション追加
          </v-btn>
          <!-- アニメーション設定の呼び出し -->
          <AnimationPanel
            v-if="selectedObject && 'animations' in selectedObject"
            v-model:show="animationPanel"
            v-model:animations="selectedObject.animations"
          />
        </v-tabs-window-item>
      </v-tabs-window>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useObjectStore, useTimelineStore } from '@/stores/objectStore'
import AnimationPanel from '@/components/setting/AnimationPanel.vue'
import SettingsTab from '../setting/SettingsTab.vue'

const objectStore = useObjectStore()
const timelineStore = useTimelineStore()
const tab = ref('basic')

// 選択されたオブジェクトの情報が自動的に表示される
const selectedObject: Record<string, any> = computed(() => {
  return objectStore.objects.find((obj) => obj.id === timelineStore.selectedObjectId)
})

//////////////////////////////////
// アニメーション設定に関する記述 //
//////////////////////////////////
const animationPanel = ref(false)
function openAnimationDialog() {
  animationPanel.value = true
}
</script>

<style scoped>
.setting-panel {
  min-width: 300px;
  width: 100%;
  height: 500px;
  padding: 12px;
  border: 1px solid #ccc;
  overflow-y: auto;
}
</style>
