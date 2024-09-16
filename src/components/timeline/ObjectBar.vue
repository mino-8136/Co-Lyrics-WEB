<template>
  <div
    class="object"
    :style="{ ...objectStyle, position: 'absolute' }"
    :class="{
      selected: timelineStore.selectedObjectId === baseObject.id,
      multiSelected: props.isMultiSelect
    }"
    @mousedown.left.stop="startMove"
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
import { ref, computed, watch } from 'vue'
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
import { clClamp } from '../utils/common'

const timelineStore = useTimelineStore()
const configStore = useConfigStore()
const text = defineModel('text')
const props = defineProps<{
  object: RenderObject
  isMultiSelect: boolean
}>()
const emits = defineEmits(['callGroupMoveFrame', 'callGroupMoveLayer'])

const baseObject = ref(props.object)
const deltaStartFrame = ref(0)
const deltaEndFrame = ref(0)
const deltaLayer = ref(0)
const scaler = ref(timelineStore.pxPerSec / timelineStore.framerate)

// ドラッグ時の挙動 : 右端を掴んだらendを変更、左端を掴んだらstartを変更
const isResizing = ref(false)
const isMoving = ref(false)
const initialMouseX = ref(0)
const initialMouseY = ref(0)
const side = ref('')

////////////////////////////////////////

// 横幅の定義方法 : end-startで定義する
const objectStyle = computed(() => ({
  left: `${(baseObject.value.start + deltaStartFrame.value) * scaler.value}px`,
  width: `${(baseObject.value.end + deltaEndFrame.value - (baseObject.value.start + deltaStartFrame.value) + 0.5) * scaler.value}px`,
  top: isMoving.value ? `${deltaLayer.value * configStore.timelineLayerHeight}px` : 0,
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

// KeyframeSettingsを再帰的に探索して抽出する関数
function extractKeyframeSettings(obj: any): KeyframeSettings[] {
  let keyframeSettingsList: KeyframeSettings[] = []

  if (obj instanceof KeyframeSettings && obj.keyframes.length > 1) {
    keyframeSettingsList.push(obj)
  } else if (typeof obj === 'object' && obj !== null) {
    Object.values(obj).forEach((value) => {
      keyframeSettingsList = keyframeSettingsList.concat(extractKeyframeSettings(value))
    })
  }

  return keyframeSettingsList
}

// 有効なキーフレームクラスの抽出（再帰バージョン）
const keyFrameSettingsList = computed(() => {
  let tempList: KeyframeSettings[] = []

  objectSettingsList.forEach((anySetting) => {
    if (anySetting in props.object) {
      const settings = props.object[anySetting as keyof typeof props.object]
      tempList = tempList.concat(extractKeyframeSettings(settings))
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
  initialMouseX.value = event.clientX
  initialMouseY.value = event.clientY
  deltaStartFrame.value = 0
  deltaEndFrame.value = 0
  deltaLayer.value = 0

  window.addEventListener('mousemove', move)
  window.addEventListener('mouseup', stopMove)
}

const move = (event: MouseEvent) => {
  if (isMoving.value) {
    let deltaFrame = Math.round((event.clientX - initialMouseX.value) / scaler.value)
    deltaFrame = Math.max(deltaFrame, -baseObject.value.start)
    deltaFrame = Math.min(deltaFrame, timelineStore.durationFrame - baseObject.value.end - 1)
    deltaStartFrame.value = deltaFrame
    deltaEndFrame.value = deltaFrame

    // レイヤー変更に対応し、横移動をクリアする
    const pDeltaLayer = deltaLayer.value
    deltaLayer.value = clClamp(
      -baseObject.value.layer,
      configStore.timelineLayerNumbers - 1,
      Math.round((event.clientY - initialMouseY.value) / configStore.timelineLayerHeight)
    )
    if (deltaLayer.value - pDeltaLayer !== 0) {
      initialMouseX.value = event.clientX
    }
  }
}

const stopMove = () => {
  if (isMoving.value) {
    // 複数選択されている場合の移動処理は上の階層に任せる
    if (props.isMultiSelect) {
      emits('callGroupMoveFrame', deltaStartFrame.value)
      emits('callGroupMoveLayer', deltaLayer.value)
    } else {
      baseObject.value.start += deltaStartFrame.value
      baseObject.value.end += deltaEndFrame.value
      baseObject.value.layer = clClamp(
        0,
        configStore.timelineLayerNumbers - 1,
        (baseObject.value.layer += deltaLayer.value)
      )
    }
  }
  isMoving.value = false
  deltaStartFrame.value = 0
  deltaEndFrame.value = 0
  deltaLayer.value = 0
  timelineStore.isRedrawNeeded = true

  window.removeEventListener('mousemove', move)
  window.removeEventListener('mouseup', stopMove)
}

//////////////////////////////////////////////////////////

const startResize = (sideValue: string, event: MouseEvent) => {
  isResizing.value = true
  side.value = sideValue
  initialMouseX.value = event.clientX
  deltaStartFrame.value = 0
  deltaEndFrame.value = 0

  window.addEventListener('mousemove', resize)
  window.addEventListener('mouseup', stopResize)
}

const resize = (event: MouseEvent) => {
  if (isResizing.value) {
    let deltaFrame = Math.round((event.clientX - initialMouseX.value) / scaler.value)
    if (side.value === 'right') {
      deltaEndFrame.value = clClamp(
        -baseObject.value.end + baseObject.value.start + 1,
        timelineStore.durationFrame - baseObject.value.end - 1,
        deltaFrame
      )
    } else {
      deltaStartFrame.value = clClamp(
        -baseObject.value.start,
        baseObject.value.end - baseObject.value.start - 1,
        deltaFrame
      )
    }
  }
}

const stopResize = () => {
  if (isResizing.value) {
    baseObject.value.start += deltaStartFrame.value
    baseObject.value.end += deltaEndFrame.value
  }
  isResizing.value = false
  deltaStartFrame.value = 0
  deltaEndFrame.value = 0
  timelineStore.isRedrawNeeded = true // TODO: stopMoveといっしょに読み込まれている

  window.removeEventListener('mousemove', resize)
  window.removeEventListener('mouseup', stopResize)
}

watch(
  () => timelineStore.pxPerSec,
  (newPxPerSec) => {
    scaler.value = newPxPerSec / timelineStore.framerate
  }
)
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

/* このselectedの順番は絶対変えないこと */
.object.multiSelected {
  box-shadow: 0 0 2px 2px rgb(156, 196, 251);
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
