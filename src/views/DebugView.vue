<template>
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
              <div
                class="layerTimeline"
                @contextmenu.prevent="onTimelineContextMenu($event, index)"
              >
                <object-bar
                  v-for="object in objectStore.objects.filter((obj) => obj.layer === index)"
                  :key="object.id"
                  :object="object"
                  @contextmenu.prevent="onObjectContextMenu($event, object.id)"
                  @click="selectObject(object.id)"
                ></object-bar>
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
import ObjectBar from '@/components/objects/ObjectBar.vue'
import Waveformbar from '@/components/objects/WaveformBar.vue'
import { type BaseSettings, BaseObject, TextObject } from '@/components/objects/objectInfo'

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

// オブジェクトの追加
function addObject(layerIndex: number, type: string) {
  const settings: BaseSettings = {
    id: objectStore.counter,
    start: 0,
    end: 100,
    layer: layerIndex
  }

  if (type === 'text') {
    objectStore.addObject(new TextObject(settings))
  } else if (type === 'image') {
    // 画像オブジェクトを追加
  } else {
    objectStore.addObject(new BaseObject(settings))
  }
  // console.log(objectStore.objects)
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
  width: 2000px;
}

.layer {
  display: flex;
  height: 40px;
}

.layerTimeline {
  border: 1px solid black;
  background: linear-gradient(90deg, #ccc 1px, transparent 1px);
  background-size: 10px;
  width: 90%;
}
</style>
