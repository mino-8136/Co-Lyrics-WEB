<template>
  <PreviewPanel />
  <v-container class="timeline-panel">
    <div class="header d-flex">
      <input type="range" min="10" max="1000" v-model="timelineSpan" />
    </div>

    <div class="timeline-container">
      <Waveformbar
        @callGetWaveformWidth="setWaveformWidth"
        @callSetScrollPosition="setScrollPosition"
      ></Waveformbar>
      <div class="timeline" style="overflow-y: auto; height: 200px">
        <div
          class="layer"
          v-for="(layer, index) in layers"
          :key="index"
          :style="{ width: waveformWidth }"
        >
          <div class="layerTimeline" :style="{backgroundSize: timelineSpan/3 + 'px'}">
            <object-note
              v-for="object in objectStore.objects"
              :key="object.id"
              :object="object"
              @click="selectObject(object.id)"
            ></object-note>
          </div>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useObjectStore, useTimelineStore } from '@/stores/objectStore'
import ObjectNote from '@/components/objects/ObjectNote.vue'
import Waveformbar from '@/components/objects/WaveformBar.vue'
import PreviewPanel from '@/components/editor/PreviewPanel.vue'

const objectStore = useObjectStore()
const timelineStore = useTimelineStore()
const layers = ref(
  Array.from({ length: 10 }, () => ({
    name: 'Layer'
  }))
)

const waveformWidth = ref(90)
const timelineSpan = ref(9)

// オブジェクトクリックで選択
function selectObject(objectId: number) {
  // クリックしたオブジェクトを選択
  objectStore.selectedObjectId = objectId
}

function setWaveformWidth(width: number) {
  waveformWidth.value = width
}

function setScrollPosition(position: number) {
  console.log('ccc', position)
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
  overflow-x: hidden;
  overflow-y: hidden;
  width: 100%;
}

.layer {
  width: 200px;
  display: flex;
  height: 40px;
}

.layerTimeline {
  position: relative;
  border: 1px solid black;
  background: linear-gradient(90deg, #ccc 1px, transparent 1px);
  background-size: 9px;
  width: 100%;
}
</style>
