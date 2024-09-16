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
      <div
        class="timeline"
        style="overflow-y: auto"
        @click.stop="clearObjectSelect"
        @mousedown.left.stop="onMouseDown"
      >
        <div
          class="seekbar"
          :style="{
            left:
              (timelineStore.currentFrame * timelineStore.pxPerSec) / timelineStore.framerate +
              'px',
            height: configStore.timelineLayerHeight * configStore.timelineLayerNumbers + 'px'
          }"
        ></div>

        <div
          v-if="isSelecting"
          class="selection-rectangle"
          :style="{
            left: selectionRectangle.left + 'px',
            top: selectionRectangle.top + 'px',
            width: selectionRectangle.width + 'px',
            height: selectionRectangle.height + 'px'
          }"
        ></div>

        <div
          class="layer"
          v-for="(layer, layerIndex) in layers"
          :key="layerIndex"
          :style="{ width: waveformWidth, height: configStore.timelineLayerHeight + 'px' }"
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
              <!-- TextObjectの場合はテキスト変更機能を用意(TODO: objectbarにtemplateを仕込めば統一できる) -->
              <object-bar
                v-if="object instanceof TextObject"
                :object="object"
                :isMultiSelect="timelineStore.selectedObjectIds.includes(object.id)"
                v-model:text="object.textSettings.text"
                @callGroupMoveFrame="groupMoveFrame"
                @callGroupMoveLayer="groupMoveLayer"
                @contextmenu.prevent="onObjectContextMenu($event, object.id)"
                @click.stop="selectObject(object.id)"
              />
              <!-- その他のオブジェクトの場合 -->
              <object-bar
                v-else
                :object="object"
                :isMultiSelect="timelineStore.selectedObjectIds.includes(object.id)"
                @callGroupMoveFrame="groupMoveFrame"
                @callGroupMoveLayer="groupMoveLayer"
                @contextmenu.prevent="onObjectContextMenu($event, object.id)"
                @click.stop="selectObject(object.id)"
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
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useConfigStore, useObjectStore, useTimelineStore } from '@/stores/objectStore'
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
const configStore = useConfigStore()
const layers = ref(
  Array.from({ length: configStore.timelineLayerNumbers }, () => ({
    name: 'Layer'
  }))
)
const waveformWidth = ref(900)
const isPlaying = ref(false)
const copiedObject = ref<RenderObject>()
let markerData: Note[] = []

// Reactive properties for selection
const isSelecting = ref(false)
const selectionStartX = ref(0)
const selectionStartY = ref(0)
const selectionCurrentX = ref(0)
const selectionCurrentY = ref(0)

// Computed property for selection rectangle
const selectionRectangle = computed(() => {
  const x1 = selectionStartX.value
  const y1 = selectionStartY.value
  const x2 = selectionCurrentX.value
  const y2 = selectionCurrentY.value
  return {
    left: Math.min(x1, x2),
    top: Math.min(y1, y2),
    width: Math.abs(x2 - x1),
    height: Math.abs(y2 - y1)
  }
})

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

//////////////////////////
// オブジェクト操作の処理 //
//////////////////////////

// オブジェクトクリックで選択
function selectObject(objectId: number) {
  // クリックしたオブジェクトを選択
  timelineStore.selectedObjectId = objectId

  // 選択外のオブジェクトをクリックした場合は複数選択解除
  if (!timelineStore.selectedObjectIds.includes(objectId)) {
    timelineStore.selectedObjectIds = []
  }
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
  // 右クリック時にobjIndexのオブジェクトが含まれる想定
  if (timelineStore.selectedObjectIds.length > 0) {
    timelineStore.selectedObjectIds.forEach((id) => {
      objectStore.removeObject(id)
    })
    timelineStore.selectedObjectIds = []
  } else {
    objectStore.removeObject(objIndex)
    timelineStore.selectedObjectId = -1
  }

  timelineStore.isRedrawNeeded = true
}

function clearObjectSelect() {
  timelineStore.selectedObjectId = -1
  ;(document.activeElement as HTMLElement)?.blur()
}

///////////////////
// そのほかの処理 //
///////////////////

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

function groupMoveFrame(deltaFrame: number) {
  objectStore.objects.forEach((obj) => {
    if (timelineStore.selectedObjectIds.includes(obj.id)) {
      const maxMoveFrame = Math.max(obj.start + deltaFrame, 0) - obj.start // 0未満には移動させない
      obj.start += maxMoveFrame
      obj.end += maxMoveFrame
    }
  })
}

function groupMoveLayer(deltaLayer: number) {
  objectStore.objects.forEach((obj) => {
    if (timelineStore.selectedObjectIds.includes(obj.id)) {
      obj.layer = Math.max(
        0,
        Math.min(configStore.timelineLayerNumbers - 1, obj.layer + deltaLayer)
      )
    }
  })
}

////////////////////////////
// タイムライン操作用の関数 //
////////////////////////////

function playPause() {
  isPlaying.value = !isPlaying.value
}

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

function onMouseDown(event: MouseEvent) {
  isSelecting.value = true
  const timelineRect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  selectionStartX.value =
    event.clientX - timelineRect.left + (event.currentTarget as HTMLElement).scrollLeft
  selectionStartY.value =
    event.clientY - timelineRect.top + (event.currentTarget as HTMLElement).scrollTop
  selectionCurrentX.value = selectionStartX.value
  selectionCurrentY.value = selectionStartY.value
  event.preventDefault()

  // Add global event listeners
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}

function onMouseMove(event: MouseEvent) {
  if (isSelecting.value) {
    const timelineRect = (
      document.querySelector('.timeline') as HTMLElement
    ).getBoundingClientRect()
    selectionCurrentX.value =
      event.clientX -
      timelineRect.left +
      (document.querySelector('.timeline') as HTMLElement).scrollLeft
    selectionCurrentY.value =
      event.clientY -
      timelineRect.top +
      (document.querySelector('.timeline') as HTMLElement).scrollTop
    event.preventDefault()
  }
}

function findSelectedObject() {
  // 領域の開始地点と終了地点を取得(TODO: selectionRectangleを使用でもいいかも)
  const x1 = Math.min(selectionStartX.value, selectionCurrentX.value)
  const y1 = Math.min(selectionStartY.value, selectionCurrentY.value)
  const x2 = Math.max(selectionStartX.value, selectionCurrentX.value)
  const y2 = Math.max(selectionStartY.value, selectionCurrentY.value)

  // 領域の開始地点をフレームとレイヤーに変換
  const startFrame = Math.floor((x1 / timelineStore.pxPerSec) * timelineStore.framerate)
  const startLayer = Math.floor(y1 / configStore.timelineLayerHeight)
  const endFrame = Math.floor((x2 / timelineStore.pxPerSec) * timelineStore.framerate)
  const endLayer = Math.floor(y2 / configStore.timelineLayerHeight)
  // console.log('Selected area:', startFrame, startLayer, endFrame, endLayer)

  // ドラッグした領域内のオブジェクトを抽出する
  const selectedObjectIds: number[] = []
  objectStore.objects.forEach((obj) => {
    if (
      obj.start < endFrame &&
      startFrame < obj.end &&
      startLayer <= obj.layer &&
      obj.layer <= endLayer
    ) {
      selectedObjectIds.push(obj.id)
    }
  })
  // console.log(selectedObjectIds)

  // Update the selected objects in the store
  timelineStore.selectedObjectIds = selectedObjectIds
}

function onMouseUp(event: MouseEvent) {
  if (isSelecting.value) {
    isSelecting.value = false

    // Remove global event listeners
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)

    findSelectedObject()
  }
}

function onSpaceDown(event: KeyboardEvent) {
  const activeElement = document.activeElement as HTMLElement
  if (activeElement.tagName === 'INPUT') return

  if (event.key === ' ') {
    playPause()
    event.preventDefault()
  }
}

onMounted(async () => {
  markerData = await getLyricMarker(timelineStore.musicData.lyricPath)

  // スペースキーが押されたら再生開始
  window.addEventListener('keydown', onSpaceDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onSpaceDown)
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
  background-color: #4cabe2;
  z-index: 100; /* z-indexを高く設定して最前面に */
  pointer-events: none; /* クリックイベントを無視 */
}

.selection-rectangle {
  position: absolute;
  border: 1px dashed #4cabe2;
  background-color: rgba(76, 171, 226, 0.2);
  pointer-events: none;
  z-index: 100;
}
</style>
