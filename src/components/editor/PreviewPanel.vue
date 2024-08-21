<template>
  <v-container class="preview-panel">
    <!-- ここでp5.jsのCanvasを表示 -->
    <div
      id="canvas"
      ref="canvasContainer"
      :style="{ height: 500 - informationHeight + 'px' }"
    ></div>
    <div id="information">
      <v-btn @click="renderObjects" icon="mdi-play"></v-btn>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount, watch } from 'vue'
import { useObjectStore, useTimelineStore } from '@/stores/objectStore'
import p5 from 'p5'
import { defineSketch } from '@/components/p5/sketch'

const objectStore = useObjectStore()
const timelineStore = useTimelineStore()
const informationHeight = 80

// マウント時に p5.canvas を生成
const p = ref()
const canvasContainer = ref<HTMLDivElement | null>(null)
onMounted(() => {
  // canvasのsizeを取得し、スケールを計算
  if (canvasContainer.value) {
    const { width, height } = canvasContainer.value.getBoundingClientRect()
    timelineStore.canvasScale = calculateCanvasScale(width, height)
  }

  let sketch = defineSketch(timelineStore)
  p.value = new p5(sketch)

  // ウィンドウのリサイズイベントを監視
  window.addEventListener('resize', updateCanvasSize)
})

watch(
  () => timelineStore.currentFrame,
  () => {
    renderObjects()
    p.value.updateCurrentFrame(timelineStore.currentFrame)
  }
)

// canvasの大きさを取得してp5.jsに伝達
function updateCanvasSize() {
  if (canvasContainer.value && p.value) {
    const { width, height } = canvasContainer.value.getBoundingClientRect()
    timelineStore.canvasScale = calculateCanvasScale(width, height)
    p.value.updateCanvasScale()
  }
}

function calculateCanvasScale(width:number, height:number): number {
  //console.log(width, height)
  if ((width / 16) * 9 > height) {
    return height / timelineStore.height
  }
  return width / timelineStore.width
}

// 現在レンダリングするオブジェクトの描画 p5.canvasに登録
function renderObjects() {
  p.value.addRenderObjects(objectStore.currentObjects(timelineStore.currentFrame))
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateCanvasSize)
})
</script>

<style scoped>
.preview-panel {
  position: relative;
  width: 100%;
  height: 500px;
  border: 1px solid #ccc;
}

#canvas {
  width: 100%;
  height: 100%; /* 親要素の高さに合わせる */
}
</style>
