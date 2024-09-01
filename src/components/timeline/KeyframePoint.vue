<template>
  <div
    class="keyframe"
    :style="{ ...objectStyle, position: 'absolute' }"
    @mousedown="startMove"
    @mousemove="move"
    @mouseup="stopMove"
  ></div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, computed } from 'vue'
import type { KeyframeSetting } from '../parameters/objectInfo'

const point = defineModel<KeyframeSetting>('point', { required: true })
const props = defineProps<{ scaler: number }>()
const emits = defineEmits(['callKeyframeSort'])

const isMoving = ref(false)
const lastMouseX = ref(0)
const lastMouseY = ref(0)
const tempPoint = ref(point.value.frame)

const objectStyle = computed(() => ({
  left: isMoving.value
    ? `${tempPoint.value * props.scaler - 3.5}px`
    : `${point.value.frame * props.scaler - 3.5}px`
}))

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
  --keysize: 8px;

  background-color: lightgray;
  border-radius: 100%;
  border: 1.2px solid black;
  position: absolute;
  width: var(--keysize);
  height: var(--keysize);
  top: calc(87% - var(--keysize) / 2);
  transform: rotate(45deg);
  cursor: move;
}
</style>
