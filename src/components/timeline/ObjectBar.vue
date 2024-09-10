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

    <template v-if="configStore.isShowKeyframe">
      <div v-for="(keyframeSetting, settingIndex) in keyFrameSettingsList" :key="settingIndex">
        <div v-for="(keyframe, index) in keyframeSetting.keyframes" :key="index">
          <KeyframePoint
            :point="keyframe"
            :scaler="scaler"
            :selected="timelineStore.selectedObjectId === baseObject.id"
            @callKeyframeSort="sortKeyframe"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { useTimelineStore, useConfigStore } from '@/stores/objectStore'
import {
  BaseObject,
  TextObject,
  ImageObject,
  ShapeObject,
  type RenderObject,
  objectSettingsList
} from '../parameters/objectInfo'
import { KeyframeSettings } from '@/components/parameters/keyframeInfo'
import KeyframePoint from './KeyframePoint.vue'
import gsap from 'gsap'

const text = defineModel('text')
const props = defineProps<{
  object: RenderObject
}>()

const timelineStore = useTimelineStore()
const configStore = useConfigStore()
const scaler = ref(timelineStore.pxPerSec / timelineStore.framerate)

const baseObject = ref(props.object)
const tempStart = ref(baseObject.value.start)
const tempEnd = ref(baseObject.value.end)

// ドラッグ時の挙動 : 右端を掴んだらendを変更、左端を掴んだらstartを変更
const isResizing = ref(false)
const isMoving = ref(false)
const lastMouseX = ref(0)
const lastMouseY = ref(0)
const side = ref('')

// 横幅の定義方法 : end-startで定義する
const objectStyle = computed(() => ({
  left: `${Math.floor(tempStart.value) * scaler.value}px`,
  width: `${(Math.floor(tempEnd.value - Math.floor(tempStart.value)) + 0.5) * scaler.value}px`,
  position: 'absolute',
  background: bgColor.value,
  cursor: isMoving.value ? 'grabbing' : 'grab'
}))

const bgColor = computed(() => {
  if (baseObject.value instanceof TextObject) {
    return 'linear-gradient(to right, rgb(217, 233, 255), rgba(230, 255, 255, 0.6))'
  } else if (baseObject.value instanceof ShapeObject) {
    return 'linear-gradient(to bottom right, rgb(120, 152, 255), rgba(230, 255, 255, 0.6))'
  } else if (baseObject.value instanceof ImageObject) {
    return 'rgb(211, 211, 211)'
  } else {
    return 'rgb(211, 211, 211)'
  }
})

//////////////////////////
// キーフレーム操作の関数 //
//////////////////////////

// 有効なキーフレームクラスの抽出
const keyFrameSettingsList = computed(() => {
  let tempList: KeyframeSettings[] = []
  objectSettingsList.forEach((anySetting) => {
    if (anySetting in props.object) {
      Object.entries(props.object[anySetting as keyof typeof props.object]).forEach(
        ([param, value]) => {
          // KeyframeSettingsかを判定
          if (value instanceof KeyframeSettings && value.keyframes.length > 1) {
            tempList.push(value)
          }
        }
      )
    }
  })
  return tempList
})

// props.objectのキーフレームの並び替え
const sortKeyframe = () => {
  //console.log('sortKeyframe')
  keyFrameSettingsList.value.forEach((keyframeSettings) => {
    keyframeSettings.sortKeyframes()
  })
}

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
    // console.log(lastMouseY.value, event.clientY)
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
  timelineStore.isRedrawNeeded = true // TODO: stopMoveといっしょに読み込まれている
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
  --barWidth: 2px;

  position: relative;
  background-color: rgb(211, 211, 211);
  width: 150px;
  height: 40px;
  left: 20px;
  cursor: move;
  user-select: none;
}

.object .text {
  position: absolute;
  width: 8em;
  height: 1.2em;
  top: 50%;
  left: 20px;
  transform: translate(0%, -50%);
  border-bottom: 0.5px solid black;
}

.object.selected {
  box-shadow: 0 0 2px 2px rgb(241, 251, 156);
  z-index: 10;
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
</style>
