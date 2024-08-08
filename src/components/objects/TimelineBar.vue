<template>
  <div class="slider-container">
    <input
      type="range"
      style="width: 100%"
      min="0"
      max="2000"
      step="1"
      v-model="timelineStore.currentFrame"
    />
    <ul class="ruler-x">
      <li v-for="n in ticks" :key="n"></li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTimelineStore } from '@/stores/objectStore'
const timelineStore = useTimelineStore()

const ticks = ref(20)
</script>

<style>
:root {
  --ruler-unit: 3px;
  --ruler-num-fz: 10px;
  --ruler-num-c: #888;

  --ruler1-bdw: 1px;
  --ruler1-c: #bbb;
  --ruler1-h: 10px;
  --ruler1-space: 5;

  --ruler2-bdw: 1px;
  --ruler2-c: #bbb;
  --ruler2-h: 20px;
  --ruler2-space: 50;
}

input[type='range'] {
  -webkit-appearance: none;
  appearance: none;
  outline: none;
  background: transparent;
  cursor: pointer;
  position: relative;
}

input[type='range']::-webkit-slider-runnable-track {
  background-image: linear-gradient(90deg, var(--ruler1-c) 0 var(--ruler1-bdw), transparent 0),
    linear-gradient(90deg, var(--ruler2-c) 0 var(--ruler2-bdw), transparent 0);
  background-repeat: repeat-x;
  background-size:
    calc(var(--ruler-unit) * var(--ruler1-space)) var(--ruler1-h),
    calc(var(--ruler-unit) * var(--ruler2-space)) var(--ruler2-h);
  width: 6000px;
  height: 40px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 2px;
  height: 300px; /* スマートに設定したい */
  background-color: #4cabe2;
  z-index: 3;
}

.slider-container {
  position: relative;
  width: 100%;
  height: calc(var(--ruler2-h) * 2.5); /* これで合ってる? */
}

.ruler-x {
  width: 100%;
  padding: 0;
  margin: 0;
  color: var(--ruler-num-c);
  font-size: var(--ruler-num-fz);

  display: flex;
  overflow: hidden;
  line-height: calc(var(--ruler2-h) * 2 - var(--ruler-num-fz) / 2);
  list-style: none;

  counter-reset: frameCounter calc(var(--ruler2-space) * -1);
}

.ruler-x li {
  align-self: flex-end;
  counter-increment: frameCounter var(--ruler2-space);
  flex: 0 0 calc(var(--ruler-unit) * var(--ruler2-space));
}

.ruler-x li::after {
  content: counter(frameCounter);
  line-height: 1;
  padding-inline-start: 1.75px;
}
</style>
