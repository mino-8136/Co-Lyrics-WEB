<script setup lang="ts">
import { ref, computed } from 'vue'
import PreviewPanel from '../components/PreviewPanel.vue'
import TimelinePanel from '../components/TimelinePanel.vue'
import SettingPanel from '../components/SettingPanel.vue'

// 全体の情報を管理する
const currentFrame = ref(0)

// オブジェクトの受け渡し用の変数(EditView上ですべての状態を管理する(storeに変更するべき？))
const objects = ref(null) // 全体のオブジェクト
const currentObjects = computed(() => {
  if(objects.value === null) return []
  return objects.value.filter((object) => {
    return object.startFrame <= currentFrame.value && object.endFrame >= currentFrame.value
  })
})
const selectedObject = ref(null) // setting-panelで表示するオブジェクト

</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <preview-panel :objects="currentObjects" />
      </v-col>
      <v-col>
        <setting-panel :selectedObject="selectedObject" />
      </v-col>
    </v-row>
    <timeline-panel :objects="objects" />
  </v-container>
</template>
