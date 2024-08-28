<template>
  <v-container class="timeline-panel">
    <div class="header d-flex">
      <p>Frame:</p>
      <input :value="timelineStore.currentFrame" style="width: 60px" />
      <input type="range" min="50" max="400" v-model="timelineStore.pxPerSec" />
    </div>

    <div class="timeline-container">
      <Waveformbar
        @callGetWaveformWidth="setWaveformWidth"
        @callSetScrollPosition="setScrollPosition"
      ></Waveformbar>
      <div class="timeline" style="overflow-y: auto; height: 200px">
        <div
          class="seekbar"
          :style="{
            left:
              (timelineStore.currentFrame * timelineStore.pxPerSec) / timelineStore.framerate + 'px'
          }"
        ></div>
        <div
          class="layer"
          v-for="(layer, layerIndex) in layers"
          :key="layerIndex"
          :style="{ width: waveformWidth }"
        >
          <div
            class="layerTimeline"
            :style="{ backgroundSize: timelineStore.pxPerSec / timelineStore.framerate + 'px' }"
            @contextmenu.prevent="onTimelineContextMenu($event, layerIndex)"
          >
            <template
              v-for="object in objectStore.objects.filter((obj) => obj.layer === layerIndex)"
              :key="object.id"
            >
              <!-- TextObjectの場合はテキスト変更機能を用意 -->
              <object-bar
                v-if="object instanceof TextObject"
                :object="object"
                v-model:text="object.textSettings.text"
                @contextmenu.prevent="onObjectContextMenu($event, object.id)"
                @click="selectObject(object.id)"
              />
              <!-- その他のオブジェクトの場合 -->
              <object-bar
                v-else
                :object="object"
                @contextmenu.prevent="onObjectContextMenu($event, object.id)"
                @click="selectObject(object.id)"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useObjectStore, useTimelineStore } from '@/stores/objectStore'
import ContextMenu from '@imengyu/vue3-context-menu'
import ObjectBar from '@/components/timeline/ObjectBar.vue'
import Waveformbar from '@/components/timeline/WaveformBar.vue'
import {
  BaseObject,
  BaseSettings,
  ImageObject,
  ShapeObject,
  TextObject,
  type typeString
} from '@/components/parameters/objectInfo'

const objectStore = useObjectStore()
const timelineStore = useTimelineStore()
const layers = ref(
  Array.from({ length: 10 }, () => ({
    name: 'Layer'
  }))
)
const waveformWidth = ref(900)

// タイムラインメニュー
function onTimelineContextMenu(event: MouseEvent, layerIndex: number) {
  event.preventDefault()
  ContextMenu.showContextMenu({
    x: event.clientX,
    y: event.clientY,
    items: [
      {
        label: 'テキストオブジェクトを追加',
        onClick: () => {
          addObject(layerIndex, 'text', event.offsetX)
        }
      },
      // {
      //   label: '画像オブジェクトを追加',
      //   onClick: () => {
      //     addObject(layerIndex, 'image', event.offsetX)
      //   }
      // },
      {
        label: '図形オブジェクトを追加',
        onClick: () => {
          addObject(layerIndex, 'shape', event.offsetX)
        }
      }
      // {
      //   label: '基底オブジェクトを追加',
      //   onClick: () => {
      //     addObject(layerIndex, '', event.offsetX)
      //   }
      // }
    ]
  })
  event.stopPropagation()
}

// オブジェクトクリックで選択
function selectObject(objectId: number) {
  // クリックしたオブジェクトを選択
  timelineStore.selectedObjectId = objectId
}

// オブジェクトを右クリックした場合のメニュー
function onObjectContextMenu(event: MouseEvent, objIndex: number) {
  event.preventDefault()
  selectObject(objIndex)
  ContextMenu.showContextMenu({
    x: event.clientX,
    y: event.clientY,
    items: [
      {
        label: 'オブジェクトを削除',
        onClick: () => {
          removeObject(objIndex)
        }
      }
    ]
  })
  event.stopPropagation()
}

// オブジェクトの追加
function addObject(layerIndex: number, type: typeString, offsetX: number = 0) {
  const offset = Math.floor((offsetX / timelineStore.pxPerSec) * timelineStore.framerate)
  const settings: BaseSettings = {
    id: objectStore.counter,
    start: Math.max(offset, 0),
    end: offset + 100, // TODO: ここに最大値を設定できるようにする
    layer: layerIndex,
    type: type
  }

  if (type === 'text') {
    objectStore.addObject(new TextObject(settings))
  } else if (type === 'image') {
    objectStore.addObject(new ImageObject(settings))
  } else if (type === 'shape') {
    objectStore.addObject(new ShapeObject(settings))
  } else {
    objectStore.addObject(new BaseObject(settings))
  }
  selectObject(objectStore.counter - 1)
  // console.log(objectStore.objects)
}

function removeObject(objIndex: number) {
  objectStore.removeObject(objIndex)
}

////////////////////////////
// タイムライン操作用の関数 //
////////////////////////////

function setWaveformWidth(width: number) {
  waveformWidth.value = width
}

function setScrollPosition(position: number) {
  // console.log('ccc', position)
  const scrollable = document.querySelector('.timeline')
  if (scrollable) {
    scrollable.scrollLeft = position
  }
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
  z-index: 999; /* z-indexを高く設定して最前面に */
  pointer-events: none; /* クリックイベントを無視 */
}
</style>
