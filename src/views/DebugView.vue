<template>
  <PreviewPanel />
  <v-container class="timeline-panel">
    <div class="header d-flex">
      <p>Frame:</p>
      <input :value="timelineStore.currentFrame" style="width: 60px" />
      <input type="range" min="30" max="400" v-model="timelineStore.pxPerSec" />
    </div>

    <div class="timeline-container">
      <Waveformbar
        @callGetWaveformWidth="setWaveformWidth"
        @callSetScrollPosition="setScrollPosition"
      ></Waveformbar>
      <div class="timeline" style="overflow-y: scroll; height: 200px">
        <div
          class="seekbar"
          :style="{
            left:
              (timelineStore.currentFrame * timelineStore.pxPerSec) / timelineStore.framerate + 'px'
          }"
        ></div>
        <div
          class="layer"
          v-for="(layer, index) in layers"
          :key="index"
          :style="{ width: waveformWidth }"
        >
          <div
            class="layerTimeline"
            :style="{ backgroundSize: timelineStore.pxPerSec / timelineStore.framerate + 'px' }"
          >
            <object-note
              v-for="object in objectStore.objects"
              :key="object.id"
              :object="object"
            ></object-note>
          </div>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { useObjectStore, useTimelineStore } from '@/stores/objectStore'
import ObjectNote from '@/components/objects/ObjectNote.vue'
import Waveformbar from '@/components/objects/WaveformBar.vue'
import PreviewPanel from '@/components/editor/PreviewPanel.vue'

const objectStore = useObjectStore()
const timelineStore = useTimelineStore()
const layers = ref(
  Array.from({ length: 1 }, () => ({
    name: 'Layer'
  }))
)
const waveformWidth = ref(90)
const timelineSpan = ref(90)

function setWaveformWidth(width: number) {
  waveformWidth.value = width
}

function setScrollPosition(position: number) {
  const scrollable = document.querySelector('.timeline')
  if (scrollable) {
    scrollable.scrollLeft = position
  }
}

function frameToTime(frame: number): string {
  const frameRate = 30
  let minutes = Math.floor(frame / frameRate / 60)
  let seconds = Math.floor(frame / frameRate) % 60
  return '(' + minutes + '分' + seconds + '秒' + ')'
}

///////////////////
// 判定などの処理 //
///////////////////

// ゲーム開始前の処理
const startGame = () => {
  //
}

// スペースキーが押されたときの処理
window.addEventListener('keydown', (event) => {
  if (event.key === ' ') {
    // object.startがcurrentFrame+-15f以内かつ最も近いオブジェクトを取得 (TODO: オブジェクトをstartでソートすると早い)
    const currentFrame = timelineStore.currentFrame
    const nearestObject = objectStore.objects.reduce((prev, current) => {
      const prevDiff = Math.abs(prev.start - currentFrame)
      const currentDiff = Math.abs(current.start - currentFrame)
      return prevDiff < currentDiff ? prev : current
    })

    // 最も近いオブジェクトについて、正解かどうかを判定
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', () => {})
})
</script>

<style scoped>
.timeline-panel {
  padding: 10px;
  border: 1px solid #ccc;
}

.timeline-container {
  height: 100%;
}

.timeline {
  position: relative; /* 親要素を相対位置に設定 */
  overflow-x: hidden;
  overflow-y: hidden;
  width: 100%;
}

.layer {
  display: flex;
  height: 40px;
  width: 100%; /* layerの幅を親に合わせる */
}

.layerTimeline {
  position: relative;
  border: 1px solid black;
  background: linear-gradient(90deg, #ccc 1px, transparent 1px);
  background-size: 9px;
  width: 100%; /* widthを100%に設定して親要素に合わせる */
}

.seekbar {
  position: absolute; /* 絶対位置を指定 */
  top: 0;
  width: 2px;
  height: 100%; /* 親要素の高さに合わせる */
  background-color: #4cabe2;
  z-index: 10; /* z-indexを高く設定して最前面に */
  pointer-events: none; /* クリックイベントを無視 */
}
</style>
