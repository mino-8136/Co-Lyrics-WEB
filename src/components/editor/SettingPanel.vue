<template>
  <v-container class="setting-panel">
    <div v-if="selectedObject">
      <v-tabs class="tab" v-model="tab">
        <v-tab v-if="'standardRenderSettings' in selectedObject" value="basic">基本設定</v-tab>
        <v-tab v-if="'textSettings' in selectedObject" value="text">テキスト</v-tab>
        <v-tab v-if="'shapeSettings' in selectedObject" value="shape">図形</v-tab>
        <v-tab v-if="'styleSettings' in selectedObject" value="style">スタイル</v-tab>
        <v-tab v-if="'animationSettings' in selectedObject" value="animation">アニメーション</v-tab>
      </v-tabs>

      <div class="scroll" :style="{ height: configStore.upperSideHeight - 80 + 'px' }">
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
              v-if="'animationSettings' in selectedObject"
              v-model:params="selectedObject.animationSettings"
              type="animation"
            >
            </EffectTab>
          </v-tabs-window-item>
        </v-tabs-window>
      </div>
    </div>

    <div v-else class="scroll">
      <v-tabs v-model="tab">
        <v-tab value="project">プロジェクト設定</v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab">
        <!-- チーム名 -->
        <v-row dense>
          <!-- 選んだ楽曲 -->
          <v-col cols="12" class="d-flex">
            <p class="project-label">楽曲選択:</p>
            <SelectParameter
              :param="'music'"
              v-model="selectedMusic"
              @change="setMusicData(selectedMusic)"
            ></SelectParameter>
          </v-col>

          <!-- 基本背景カラー -->
          <v-col cols="126" class="d-flex">
            <p class="project-label">基本背景カラー:</p>
            <ColorParameter v-model="backgroundColor"> </ColorParameter>
          </v-col>

          <!-- 基本フォント -->
          <v-col cols="12" class="d-flex">
            <p class="project-label">基本フォント:</p>
            <SelectParameter v-model="selectedFont" :param="'font'"></SelectParameter>
          </v-col>
        </v-row>
      </v-tabs-window>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useConfigStore, useObjectStore, useTimelineStore } from '@/stores/objectStore'
import SettingsTab from '../setting/SettingsTab.vue'
import EffectTab from '../setting/EffectTab.vue'
import SelectParameter from '../setting/dom/SelectParameter.vue'
import ColorParameter from '../setting/dom/ColorParameter.vue'
import { musicListData } from '../parameters/musics'

const objectStore = useObjectStore()
const timelineStore = useTimelineStore()
const configStore = useConfigStore()
const tab = ref('basic')

// 選択されたオブジェクトの情報が自動的に表示される
const selectedObject: Record<string, any> = computed(() => {
  return objectStore.objects.find((obj) => obj.id === timelineStore.selectedObjectId)
})

/////////////////////
// プロジェクト設定 //
/////////////////////
const backgroundColor = ref('#ffffff') // 初期色は白
const selectedFont = ref('Noto Sans JP Medium')
const selectedMusic = ref('')

function setMusicData(name: string) {
  const musicData = musicListData.find((music) => music.name === name)
  if (musicData) {
    timelineStore.musicData = musicData
  }
}
</script>

<style scoped>
.tab {
  height: 50px;
}

.scroll {
  height: 335px;
  min-width: 500px;
  overflow-y: scroll;
}

.project-text {
  height: 40px;
}

.project-label {
  width: 150px;
  margin: 0;
  margin-right: 10px;
  font-size: 14px;
  font-weight: bold;
  color: #000000;
}
</style>
