<template>
  <v-container class="timeline-panel">
    <div class="header">
      <h3>Timeline: <input :value="objectStore.currentFrame"></h3>
    </div>

    <Timelinebar></Timelinebar>

    <v-virtual-scroll :items="layers" height="200" item-height="40">
      <template v-slot="{ item, index }">
        <div class="layer">
          <div class="layerIndex">{{ item.name }} {{ index }}</div>
          <div class="layerTimeline" @contextmenu.prevent="onTimelineContextMenu($event, index)">
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
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useObjectStore } from '@/stores/objectStore'
import ContextMenu from '@imengyu/vue3-context-menu'
import ObjectBar from '../objects/ObjectBar.vue'
import Timelinebar from '../objects/TimelineBar.vue'
import { type BaseSettings, BaseObject, TextObject } from '@/components/objects/objectInfo'

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
          addObject(index, 'text')
        }
      },
      {
        label: '画像オブジェクトを追加',
        onClick: () => {
          addObject(index, 'image')
        }
      },
            {
        label: '基底オブジェクトを追加',
        onClick: () => {
          addObject(index, '')
        }
      },

    ]
  })
  event.stopPropagation()
}

// オブジェクトクリックで選択
function selectObject(objectId: number) {
  // すべてのオブジェクトの選択を解除
  objectStore.objects.forEach((obj) => {
    obj.selected = false
  })

  // クリックしたオブジェクトを選択
  objectStore.objects[objectId].selected = true
}

// オブジェクトを右クリックした場合のメニュー
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
      }
    ]
  })
  event.stopPropagation()
}

// オブジェクトの追加
function addObject(layerIndex: number, type: string) {
  const settings: BaseSettings = {
    id: objectStore.counter,
    start: 0,
    end: 100,
    layer: layerIndex,
    selected: false
  }

  if (type === 'text') {
    objectStore.addObject(new TextObject(settings))
  } else if (type === 'image') {
    // 画像オブジェクトを追加
  } else{
    objectStore.addObject(new BaseObject(settings))
  }
  // console.log(objectStore.objects)
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
