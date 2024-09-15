<template>
  <div class="timeline-panel">
    <div class="timeline-header">
      <v-btn
        size="small"
        density="comfortable"
        :icon="isPlaying ? 'mdi-pause' : 'mdi-play'"
        class="mr-3 my-1"
        @click="playPause"
      >
      </v-btn>
      <p>Frame:</p>
      <input :value="timelineStore.currentFrame" style="width: 60px" />
      <input
        type="range"
        min="50"
        max="400"
        v-model="timelineStore.pxPerSec"
        style="margin-left: auto"
      />
    </div>

    <div class="timeline-container">
      <Waveformbar
        @callGetWaveformWidth="setWaveformWidth"
        @callSetScrollPosition="setScrollPosition"
        v-model:isPlaying="isPlaying"
      ></Waveformbar>
      <div class="timeline" style="overflow-y: auto">
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
            <p class="layerindex">{{ layerIndex }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useObjectStore, useTimelineStore } from '@/stores/objectStore'
import ContextMenu from '@imengyu/vue3-context-menu'
import ObjectBar from '@/components/timeline/ObjectBar.vue'
import Waveformbar from '@/components/timeline/WaveformBar.vue'
import {
  BaseObject,
  BaseSettings,
  createObjectFromJson,
  ImageObject,
  type RenderObject,
  ShapeObject,
  TextObject,
  type typeString
} from '@/components/parameters/objectInfo'
import { getLyricMarker, type Note } from '../parameters/musics'

const objectStore = useObjectStore()
const timelineStore = useTimelineStore()
const layers = ref(
  Array.from({ length: timelineStore.layerNumbers }, () => ({
    name: 'Layer'
  }))
)
const waveformWidth = ref(900)
const isPlaying = ref(false)
const copiedObject = ref<RenderObject>()
let markerData: Note[] = []

///////////////////
// メニューの定義 //
///////////////////

// タイムラインメニュー
function onTimelineContextMenu(event: MouseEvent, layerIndex: number) {
  event.preventDefault()
  ContextMenu.showContextMenu({
    x: event.clientX,
    y: event.clientY,
    zIndex: 1000,
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
        divided: true,
        onClick: () => {
          addObject(layerIndex, 'shape', event.offsetX)
        }
      },
      // {
      //   label: '空オブジェクトを追加',
      //   onClick: () => {
      //     addObject(layerIndex, '', event.offsetX)
      //   }
      // }
      {
        label: 'オブジェクトを貼り付け',
        disabled: copiedObject.value == null,
        onClick: () => {
          if (copiedObject.value) {
            let newObj = createObjectFromJson(copiedObject.value)
            const newObjDuration = newObj.end - newObj.start

            // 最後のIDに次々追加する
            newObj.start = Math.floor(
              (event.offsetX / timelineStore.pxPerSec) * timelineStore.framerate
            )
            newObj.end = newObj.start + newObjDuration
            newObj.layer = layerIndex

            objectStore.addNewObject(newObj)
          }
        }
      }
    ]
  })
  event.stopPropagation()
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
        label: 'オブジェクトをコピー',
        onClick: () => {
          copiedObject.value = objectStore.objects.find((obj) => obj.id === objIndex)
        }
      },
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

///////////////////
// それぞれの処理 //
///////////////////

function playPause() {
  isPlaying.value = !isPlaying.value
}

// オブジェクトクリックで選択
function selectObject(objectId: number) {
  // クリックしたオブジェクトを選択
  timelineStore.selectedObjectId = objectId
}

// オブジェクトの追加
function addObject(layerIndex: number, type: typeString, offsetX: number = 0) {
  const offset = Math.floor((offsetX / timelineStore.pxPerSec) * timelineStore.framerate)
  const settings: BaseSettings = {
    id: objectStore.counter, // storeで上書きされるが一応
    start: Math.max(offset, 0),
    end: offset + 60,
    layer: layerIndex,
    type: type
  }

  if (type === 'text') {
    let newText = new TextObject(settings)
    newText.textSettings.text = findNearestLyrics(offsetX)
    newText.textSettings.font = timelineStore.defaultFont
    objectStore.addNewObject(newText)
  } else if (type === 'image') {
    objectStore.addNewObject(new ImageObject(settings))
  } else if (type === 'shape') {
    objectStore.addNewObject(new ShapeObject(settings))
  } else {
    objectStore.addNewObject(new BaseObject(settings))
  }
  selectObject(objectStore.counter - 1)
  timelineStore.isRedrawNeeded = true
  // console.log(objectStore.objects)
}

function removeObject(objIndex: number) {
  objectStore.removeObject(objIndex)
  timelineStore.isRedrawNeeded = true
}

function findNearestLyrics(offsetX: number = 0): string {
  const markerOffset = timelineStore.musicData.offset
  const mouseTime = offsetX / timelineStore.pxPerSec - markerOffset
  // console.log(mouseTime)
  // 最大値を超えないmarkerを見つける
  const nearestMarker = markerData
    .filter((marker) => marker.start_time <= mouseTime) // start_time が offset を超えないものをフィルタ
    .reduce((prev, curr) => (curr.start_time > prev.start_time ? curr : prev), markerData[0])

  // marker.lyricを返す
  return nearestMarker.lyric ?? 'サンプル'
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

onMounted(async () => {
  markerData = await getLyricMarker(timelineStore.musicData.lyricPath)
})

// musicDataの変更を監視
watch(
  () => timelineStore.musicData,
  async () => {
    markerData = await getLyricMarker(timelineStore.musicData.lyricPath)
  }
)
</script>

<style scoped>
.timeline-header {
  display: flex;
  align-items: center;
  padding: 0 10px;
  border-bottom: 1px solid #ccc;
}

.timeline-container {
  height: 100%;
}

.timeline {
  position: relative; /* 親要素を相対位置に設定 */
  overflow-x: hidden;
  overflow-y: hidden;
  width: 100%;
  height: 400px;
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

.layerindex {
  position: sticky;
  top: 0;
  left: 0;
  width: 40px;
  height: 100%;
  border-right: 1px solid #000000;

  display: flex;
  justify-content: center;
  align-items: center;

  user-select: none;
  pointer-events: none;

  z-index: 100;
}

.seekbar {
  position: absolute; /* 絶対位置を指定 */
  top: 0;
  width: 2px;
  height: 60vh; /* 親要素の高さに合わせる */
  background-color: #4cabe2;
  z-index: 100; /* z-indexを高く設定して最前面に */
  pointer-events: none; /* クリックイベントを無視 */
}
</style>
