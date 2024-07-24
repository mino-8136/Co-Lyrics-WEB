<template>
  <div
    class="base-object"
    :style="objectStyle"
    @mousedown="startMove"
    @mousemove="move"
    @mouseup="stopMove"
  >
    <div class="resize-handle left-handle" @mousedown.stop="startResize('left', $event)"></div>
    <div class="resize-handle right-handle" @mousedown.stop="startResize('right', $event)"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { BaseObject } from './mediaObjects'

const props = defineProps<{
  object: BaseObject
}>()

const baseObject = ref(props.object)

// 横幅の定義方法 : end-startで定義する
// ドラッグ時の挙動 : 右端を掴んだらendを変更、左端を掴んだらstartを変更
const isResizing = ref(false)
const isMoving = ref(false)
const lastMouseX = ref(0)
const side = ref('')

const objectStyle = computed(() => ({
  left: `${baseObject.value.start}px`,
  width: `${baseObject.value.end - baseObject.value.start}px`,
  position: 'absolute',
  cursor: isMoving.value ? 'grabbing' : 'grab'
}))

const startMove = (event: MouseEvent) => {
  isMoving.value = true
  lastMouseX.value = event.clientX
}

const move = (event: MouseEvent) => {
  if (isMoving.value) {
    const dx = event.clientX - lastMouseX.value
    lastMouseX.value = event.clientX
    baseObject.value.start += dx
    baseObject.value.end += dx
  }
}

const stopMove = () => {
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
    const dx = event.clientX - lastMouseX.value
    lastMouseX.value = event.clientX
    if (side.value === 'right') {
      baseObject.value.end += dx
    } else {
      baseObject.value.start += dx
    }
  }
}

const stopResize = () => {
  isResizing.value = false
}

window.addEventListener('mouseup', stopResize)
window.addEventListener('mousemove', resize)
window.addEventListener('mouseup', stopMove)
window.addEventListener('mousemove', move)

</script>

<style scoped>
.base-object {
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
  width: 10px;
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
</style>
