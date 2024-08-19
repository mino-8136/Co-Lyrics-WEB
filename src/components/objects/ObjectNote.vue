<template>
  <div class="object" :style="{ ...objectStyle, position: 'absolute' }" @mousedown="noteClick"></div>
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

//////////////////////////
// オブジェクト操作の関数 //
//////////////////////////

const noteClick = (event: MouseEvent) => {
  console.log('click')
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
