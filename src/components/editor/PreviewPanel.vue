<template>
  <v-container class="preview-panel">
    <!-- ここでp5.jsのCanvasを表示 -->
    <div id="canvas"></div>
    <v-btn @click="renderObjects" icon="mdi-play"></v-btn>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useObjectStore, useTimelineStore } from '@/stores/objectStore'
import p5 from 'p5'
import { sketch } from '../p5/sketch.ts'

const objectStore = useObjectStore()
const timelineStore = useTimelineStore()

// マウント時に p5.canvas を生成
const p = ref()
onMounted(() => {
  p.value = new p5(sketch)
})

watch(
  () => timelineStore.currentFrame,
  () => {
    renderObjects()
    p.value.updateCurrentFrame(timelineStore.currentFrame)
  }
)

// 現在レンダリングするオブジェクトの描画 p5.canvasに登録
function renderObjects() {
  p.value.addRenderObjects(objectStore.currentObjects(timelineStore.currentFrame))
}
</script>

<style scoped>
.preview-panel {
  position: relative;
  width: 100%;
  height: 500px;
  border: 1px solid #ccc;
}
</style>
