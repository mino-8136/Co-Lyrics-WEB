<template>
  <v-container class="preview-panel" style="text-align: center">
    <!-- ここでp5.jsのCanvasを表示 -->
    <div id="canvas" ref="canvasContainer"></div>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, onUnmounted } from 'vue'
import { useObjectStore, useTimelineStore, useConfigStore } from '@/stores/objectStore'
import p5 from 'p5'
import { defineSketch } from '@/components/p5/sketch'

const objectStore = useObjectStore()
const timelineStore = useTimelineStore()
const configStore = useConfigStore()

// マウント時に p5.canvas を生成
const p = ref()
const canvasContainer = ref<HTMLDivElement>()
onMounted(() => {
  // canvasのsizeを取得し、スケールを計算
  if (canvasContainer.value) {
    const { width, height } = canvasContainer.value.getBoundingClientRect()
    timelineStore.canvasScale = calculateCanvasScale(width, height)
  }
  if (!p.value) {
    let sketch = defineSketch(timelineStore)
    p.value = new p5(sketch)

    // ウィンドウのリサイズイベントを監視
    window.addEventListener('resize', updateCanvasSize)
  }

  // コンポーネントのマウント時に再描画を確実に実行
  redrawCanvas()
})

// 動画再生用の処理
watch(
  () => timelineStore.currentFrame,
  () => {
    renderObjects()
    p.value.updateCurrentFrame(timelineStore.currentFrame)
    p.value.updateShowCollisionBox(configStore.isShowCollisionBox)
  }
)

// 再描画を行う
watch(
  () => timelineStore.isRedrawNeeded,
  (newVal) => {
    if (newVal) {
      redrawCanvas()
    }
  }
)

// 読み込み時と別のタブから戻ってきた時に再描画を行う
function redrawCanvas() {
  if (timelineStore.isRedrawNeeded) {
    renderObjects()
    p.value.updateShowCollisionBox(configStore.isShowCollisionBox)
    p.value.redraw()
    timelineStore.isRedrawNeeded = false
  }
}

// canvasの大きさを取得してp5.jsに伝達
function updateCanvasSize() {
  if (canvasContainer.value && p.value) {
    const { width, height } = canvasContainer.value.getBoundingClientRect()
    timelineStore.canvasScale = calculateCanvasScale(window.innerWidth / 2, height)
    p.value.updateCanvasScale()
  }
}

function calculateCanvasScale(width: number, height: number): number {
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

onUnmounted(() => {
  window.removeEventListener('resize', updateCanvasSize)
  p.value?.remove()
})
</script>

<style scoped>
#canvas {
  width: 100%;
  height: 100%; /* 親要素の高さに合わせる */
}
</style>
