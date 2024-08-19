<template>
  <div
    class="object"
    :class="{ correct: isCorrect }"
    :style="{ ...objectStyle, position: 'absolute' }"
    @mousedown="noteClick"
  ></div>
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

const objectStyle = computed(() => ({
  left: `${Math.floor(tempStart.value) * scaler.value - 10}px`,
  position: 'absolute'
}))
const isCorrect = ref(false)

//////////////////////////
// オブジェクト操作の関数 //
//////////////////////////

const noteClick = (event: MouseEvent) => {
  isCorrect.value = true
}
</script>

<style scoped>
.object {
  --barWidth: 5px;
  --keysize: 10px;

  position: relative;
  background-color: lightgray;
  border-radius: 50%;
  border: 1px solid black;
  top: 10px;
  width: 20px;
  height: 20px;
  left: 20px;
  cursor: move;
}

@keyframes grow {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.2);
  }
}

/* 新しいIDが付与されたときに適用されるスタイル */
.correct {
  background-color: rgb(87, 255, 191);
  animation: grow 0.3s cubic-bezier(1, 0, 0, 1);
  transition: cubic-bezier(1, 0, 0, 1);
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
