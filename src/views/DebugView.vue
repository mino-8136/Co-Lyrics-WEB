<template>
  <div class="ruler">
    <ul class="ruler-x">
      <li v-for="n in numItems" :key="n"></li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const numItems = ref(20); 
</script>

<style scoped>
.ruler {
  --ruler-unit: 2px;
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

  background-image: linear-gradient(90deg, var(--ruler1-c) 0 var(--ruler1-bdw), transparent 0),
    linear-gradient(90deg, var(--ruler2-c) 0 var(--ruler2-bdw), transparent 0);
  background-repeat: repeat-x;
  background-size:
    calc(var(--ruler-unit) * var(--ruler1-space)) var(--ruler1-h),
    calc(var(--ruler-unit) * var(--ruler2-space)) var(--ruler2-h);
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
