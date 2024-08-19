<template>
  <PreviewPanel />
  <v-container class="timeline-panel">
    <div class="header d-flex">
      <input type="range" min="10" max="1000" value="100" />
    </div>

    <div class="timeline-container">
      <div class="timeline">
        <Waveformbar></Waveformbar>
        <v-virtual-scroll :items="layers" height="200" item-height="40">
          <template v-slot="{ item, index }">
            <div class="layer">
              <div class="layerTimeline">
                <object-note
                  v-for="object in objectStore.objects"
                  :key="object.id"
                  :object="object"
                  @click="selectObject(object.id)"
                ></object-note>
              </div>
            </div>
          </template>
        </v-virtual-scroll>
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
  Array.from({ length: 1 }, () => ({
    name: 'Layer'
  }))
)

// オブジェクトクリックで選択
function selectObject(objectId: number) {
  // クリックしたオブジェクトを選択
  objectStore.selectedObjectId = objectId
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
  overflow-x: auto;
  overflow-y: hidden;
  height: 100%;
}

.timeline {
  width: 100%;
}

.layer {
  display: flex;
  height: 40px;
}

.layerTimeline {
  border: 1px solid black;
  background: linear-gradient(90deg, #ccc 1px, transparent 1px);
  background-size: 10px;
  width: 100%;
}
</style>
