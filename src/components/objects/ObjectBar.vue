<template>
  <div
    class="object"
    :style="{ ...objectStyle, position: 'absolute' }"
    :class="timelineStore.selectedObjectId === baseObject.id ? 'selected' : ''"
    @mousedown="startMove"
    @mousemove="move"
    @mouseup="stopMove"
  >
    <input v-if="baseObject instanceof TextObject" class="text" v-model="text" @mousedown.stop />
    <div class="resize-handle left-handle" @mousedown.stop="startResize('left', $event)"></div>
    <div class="resize-handle right-handle" @mousedown.stop="startResize('right', $event)"></div>
    <div
      v-for="(keyframe, index) in keyFrameList"
      :key="index"
      class="keyframe"
      :style="{ left: `${keyframe.frame * scaler - 5}px` }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { BaseObject, TextObject, ImageObject } from './objectInfo'
import { type KeyframeSettings } from './objectInfo'
import { useTimelineStore } from '@/stores/objectStore'
import gsap from 'gsap'

const text = defineModel('text')
const props = defineProps<{
  object: TextObject | ImageObject | BaseObject
}>()
const timelineStore = useTimelineStore()
const scaler = ref(timelineStore.pxPerSec / timelineStore.framerate)

const baseObject = ref(props.object)
const tempStart = ref(baseObject.value.start)
const tempEnd = ref(baseObject.value.end)

// 横幅の定義方法 : end-startで定義する
// ドラッグ時の挙動 : 右端を掴んだらendを変更、左端を掴んだらstartを変更
const isResizing = ref(false)
const isMoving = ref(false)
const lastMouseX = ref(0)
const lastMouseY = ref(0)
const side = ref('')

const objectStyle = computed(() => ({
  left: `${Math.floor(tempStart.value) * scaler.value}px`,
  width: `${(tempEnd.value - Math.floor(tempStart.value)) * scaler.value}px`,
  position: 'absolute',
  cursor: isMoving.value ? 'grabbing' : 'grab'
}))

// キーフレームの設定
const keyFrameList = computed(() => {
  let keyFrameList: KeyframeSettings = []
  Object.entries(props.object).reduce((acc, [key, value]) => {
    // KeyframeSettingsの配列であるかを判定
    if (Array.isArray(value) && value.length > 1) {
      acc.push(...value)
    }
    return acc
  }, keyFrameList)
  return keyFrameList
})

//////////////////////////
// オブジェクト操作の関数 //
//////////////////////////

const startMove = (event: MouseEvent) => {
  isMoving.value = true
  lastMouseX.value = event.clientX
  lastMouseY.value = event.clientY
}

const move = (event: MouseEvent) => {
  if (isMoving.value) {
    const dx = (event.clientX - lastMouseX.value) / scaler.value
    lastMouseX.value = event.clientX
    if (tempStart.value + dx >= 0) {
      tempStart.value += dx
      tempEnd.value += dx
    }
    // レイヤー変更に対応
    const layerHeight = 40
    if (Math.abs(event.clientY - lastMouseY.value) > layerHeight) {
      baseObject.value.layer += Math.round((event.clientY - lastMouseY.value) / layerHeight)
      lastMouseY.value = event.clientY
      baseObject.value.layer = gsap.utils.clamp(0, 9, baseObject.value.layer)
    }
  }
}

const stopMove = () => {
  if (isMoving.value) {
    baseObject.value.start = Math.floor(tempStart.value)
    baseObject.value.end = Math.floor(tempEnd.value)
  }
  isMoving.value = false
}

const startResize = (sideValue: string, event: MouseEvent) => {
  isResizing.value = true
  lastMouseX.value = event.clientX
  side.value = sideValue
  event.stopPropagation() // これによりドラッグイベントが起動しないようにする
}

const resize = (event: MouseEvent) => {
  if (isResizing.value) {
    const dx = (event.clientX - lastMouseX.value) / scaler.value
    lastMouseX.value = event.clientX
    if (side.value === 'right') {
      tempEnd.value += dx
    } else {
      if (tempStart.value + dx >= 0) {
        tempStart.value += dx
      }
    }
  }
}

const stopResize = () => {
  if (isResizing.value) {
    baseObject.value.start = Math.floor(tempStart.value)
    baseObject.value.end = Math.floor(tempEnd.value)
  }
  isResizing.value = false
}

watch(
  () => timelineStore.pxPerSec,
  (newPxPerSec) => {
    scaler.value = newPxPerSec / timelineStore.framerate
  }
)

window.addEventListener('mouseup', stopResize)
window.addEventListener('mousemove', resize)
window.addEventListener('mouseup', stopMove)
window.addEventListener('mousemove', move)

onUnmounted(() => {
  window.removeEventListener('mouseup', stopResize)
  window.removeEventListener('mousemove', resize)
  window.removeEventListener('mouseup', stopMove)
  window.removeEventListener('mousemove', move)
})
</script>

<style scoped>
.object {
  --barWidth: 5px;
  --keysize: 10px;

  position: relative;
  background-color: rgb(211, 211, 211);
  width: 150px;
  height: 40px;
  left: 20px;
  cursor: move;
}

.object .text {
  position: absolute;
  width: 8em;
  top: 50%;
  left: 20px;
  transform: translate(0%, -50%);
  user-select: none;
}

.object.selected {
  box-shadow: 0 0 2px 2px rgb(241, 251, 156);
}

.resize-handle {
  position: absolute;
  top: 0;
  width: calc(var(--barWidth));
  height: 100%;
  background-color: gray;
  cursor: ew-resize;
}

.left-handle {
  left: 0;
}

.right-handle {
  right: 0;
}

.keyframe {
  background-color: lightgray;
  border: 1px solid black;
  position: absolute;
  width: var(--keysize);
  height: var(--keysize);
  top: calc(50% - var(--keysize) / 2);
  transform: rotate(45deg);
  cursor: move;
}
</style>
