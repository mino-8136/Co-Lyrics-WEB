<template>
  <div
    class="keyframe"
    :class="{ on: props.selected }"
    :style="{ ...objectStyle, position: 'absolute' }"
    @mousedown="startMove"
    @mousemove="move"
    @mouseup="stopMove"
  ></div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, computed } from 'vue'
import { type KeyframeSetting } from '@/components/parameters/keyframeInfo'

const point = defineModel<KeyframeSetting>('point', { required: true })
const props = defineProps<{ scaler: number; selected: boolean }>()
const emits = defineEmits(['callKeyframeSort'])

const isMoving = ref(false)
const lastMouseX = ref(0)
const lastMouseY = ref(0)
const tempPoint = ref(point.value.frame)

const keysize = computed(() => (props.selected ? 8 : 4)) // keysizeを計算

const objectStyle = computed(() => {
  const offset = keysize.value / 2 // keysizeに基づいてオフセットを計算
  return {
    left: isMoving.value
      ? `${tempPoint.value * props.scaler - offset}px`
      : `${point.value.frame * props.scaler - offset}px`
  }
})

const startMove = (event: MouseEvent) => {
  isMoving.value = true
  lastMouseX.value = event.clientX
  lastMouseY.value = event.clientY
  tempPoint.value = point.value.frame
  event.stopPropagation()

  window.addEventListener('mousemove', move)
  window.addEventListener('mouseup', stopMove)
}

const move = (event: MouseEvent) => {
  if (isMoving.value) {
    const dx = (event.clientX - lastMouseX.value) / props.scaler
    lastMouseX.value = event.clientX
    tempPoint.value = tempPoint.value + dx
  }
}

const stopMove = () => {
  if (isMoving.value) {
    point.value.frame = Math.floor(tempPoint.value)
    tempPoint.value = point.value.frame
    isMoving.value = false
    window.removeEventListener('mousemove', move)
    window.removeEventListener('mouseup', stopMove)
    emits('callKeyframeSort')
  }
}

onUnmounted(() => {
  window.removeEventListener('mousemove', move)
  window.removeEventListener('mouseup', stopMove)
})
</script>

<style scoped>
.keyframe {
  --keysize: 4px;
  width: var(--keysize);
  height: var(--keysize);
  top: calc(87% - var(--keysize) / 2);
  transform: rotate(45deg);

  background-color: lightgray;
  border-radius: 100%;
  border: 0.8px solid black;
  position: absolute;
  cursor: move;
}

.keyframe.on {
  --keysize: 8px;
  width: var(--keysize);
  height: var(--keysize);
  top: calc(87% - var(--keysize) / 2);
  border: 1.2px solid black;
  box-shadow: 0 0 1px 1px rgb(251, 255, 211);
  z-index: 10;
}
</style>
