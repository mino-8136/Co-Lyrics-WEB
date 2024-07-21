<template>
  <v-container class="timeline-panel">
    <h3>Timeline</h3>

    <v-virtual-scroll :items="layers" height="200" item-height="40">
      <template v-slot="{ item, index }">
        <div class="layer">
          <div class="layerIndex">{{ item.name }} {{ index }}</div>
          <div class="layerTimeline" @contextmenu.prevent="onTimelineContextMenu($event, index)">
            <base-object
              v-for="object in objectStore.objects.filter((obj) => obj.layer === index)"
              :key="object.id"
              :object="object"
              @contextmenu.prevent="onObjectContextMenu($event, object.id)"
            ></base-object>
          </div>
        </div>
      </template>
    </v-virtual-scroll>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useObjectStore } from '@/stores/objectStore'
import ContextMenu from '@imengyu/vue3-context-menu'
import BaseObject from '../objects/BaseObject.vue'
const objectStore = useObjectStore()
const layers = ref(
  Array.from({ length: 10 }, () => ({
    name: 'Layer'
  }))
)

// タイムラインメニュー
function onTimelineContextMenu(event: MouseEvent, index: number) {
  event.preventDefault()
  ContextMenu.showContextMenu({
    x: event.clientX,
    y: event.clientY,
    items: [
      {
        label: 'テキストオブジェクトを追加',
        onClick: () => {
          addObject(index, "text")
        }
      },
      {
        label: '画像オブジェクトを追加',
        onClick: () => {
          addObject(index, "image")
        }
      }
    ],
  })
  event.stopPropagation()
}

// オブジェクトメニュー
function onObjectContextMenu(event: MouseEvent, index: number) {
  event.preventDefault()
  ContextMenu.showContextMenu({
    x: event.clientX,
    y: event.clientY,
    items: [
      {
        label: 'オブジェクトを削除',
        onClick: () => {
          removeObject(index)
        }
      },
    ],
  })
  event.stopPropagation()
}

// オブジェクトの追加
function addObject(layerIndex: number, type: string){
  objectStore.addObject({
    id: objectStore.counter,
    start: 0,
    end: 100,
    layer: layerIndex,
    selected: false
  })
}

function removeObject(index: number) {
  objectStore.removeObject(index)
}

</script>

<style scoped>
.timeline-panel {
  padding: 10px;
  border: 1px solid #ccc;
}

.layer {
  display: flex;
}

.layerIndex {
  border: 1px solid black;
  width: 80px;
  padding: 8px;
}

.layerTimeline {
  border: 1px solid black;
  background: linear-gradient(90deg, #ccc 1px, transparent 1px);
  background-size: 10px;
  width: 90%;
}
</style>
