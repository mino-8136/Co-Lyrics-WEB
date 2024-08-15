<template>
  <div
    class="object"
    :style="{ ...objectStyle, position: 'absolute' }"
    @mousedown="startMove"
    @mousemove="move"
    @mouseup="stopMove"
  >
    <div class="resize-handle left-handle" @mousedown.stop="startResize('left', $event)"></div>
    <div class="resize-handle right-handle" @mousedown.stop="startResize('right', $event)"></div>
    <div
      v-for="(keyframe, index) in keyFrameList"
      :key="index"
      class="keyframe"
      :style="{ left: `${keyframe.frame * 3}px` }"
    >
      <div class="keyframe"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { BaseObject, TextObject, ImageObject } from './objectInfo'
import { type KeyframeSettings } from './objectInfo'

const props = defineProps<{
  object: BaseObject | TextObject | ImageObject
}>()
const scaler = ref(3)

const baseObject = ref(props.object)
const tempStart = ref(baseObject.value.start)
const tempEnd = ref(baseObject.value.end)

// 横幅の定義方法 : end-startで定義する
// ドラッグ時の挙動 : 右端を掴んだらendを変更、左端を掴んだらstartを変更
const isResizing = ref(false)
const isMoving = ref(false)
const lastMouseX = ref(0)
const side = ref('')

const objectStyle = computed(() => ({
  left: `${Math.floor(tempStart.value) * scaler.value}px`,
  width: `${(tempEnd.value - Math.floor(tempStart.value)) * scaler.value}px`,
  position: 'absolute',
  cursor: isMoving.value ? 'grabbing' : 'grab'
}))

// キーフレームの設定
const keyFrameList = computed(() => {
  let keyFrameList: KeyframeSettings[] = []
  Object.entries(props.object).reduce((acc, [key, value]) => {
    // KeyframeSettingsの配列であるかを判定
    if (Array.isArray(value) && value.length > 1) {
      acc.push(...value)
    }
    return acc
  }, keyFrameList)
  console.log(keyFrameList)
  return keyFrameList
})

//////////////////////////
// オブジェクト操作の関数 //
//////////////////////////

const startMove = (event: MouseEvent) => {
  isMoving.value = true
  lastMouseX.value = event.clientX
}

const move = (event: MouseEvent) => {
  if (isMoving.value) {
    const dx = (event.clientX - lastMouseX.value) / scaler.value
    lastMouseX.value = event.clientX
    if (tempStart.value + dx >= 0) {
      tempStart.value += dx
      tempEnd.value += dx
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

window.addEventListener('mouseup', stopResize)
window.addEventListener('mousemove', resize)
window.addEventListener('mouseup', stopMove)
window.addEventListener('mousemove', move)
</script>

<style scoped>
.object {
  position: relative;
  background-color: lightgray;
  width: 150px;
  height: 40px;
  left: 20px;
  cursor: move;
}

.resize-handle {
  position: absolute;
  top: 0;
  width: 5px;
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
  position: absolute;
  background-color: lightgray;
  border: 1px solid black;
  transform: rotate(45deg);
  width: 10px;
  height: 10px;
  cursor: move;
}
</style>
