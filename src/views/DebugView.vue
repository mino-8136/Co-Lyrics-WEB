<template>
  <h1>Debug View</h1>
  <p>{{ animVal }}</p>
  <v-btn @click="animStart">Timeline Start</v-btn>
  <v-btn @click="tl.restart()">Timeline Reset</v-btn>
  <v-btn @click="tl.pause()">Timeline Pause</v-btn>

  <v-row class="ma-4">
    <v-slider :label="`${start}`" v-model="start" max="100" step="1" />
    <v-slider :label="`${end}`" v-model="end" max="100" step="1" />
    <v-slider :label="`${animStartFrame}`" v-model="animStartFrame" max="5" step="1" />
    <v-slider :label="`${animEndFrame}`" v-model="animEndFrame" max="10" step="1" />
  </v-row>

  <v-divider />
  <div class="buttons">
    <button @click="trackStop" title="Stop">■</button>
    <button @click="trackPause" title="Pause">||</button>
    <button @click="trackPlay" title="Play">▶</button>
  </div>
  <div class="range">
    <input type="range" min="0" :max="100" step="0.001" v-model="currentTime" />
  </div>
  <div class="time">{{ timeDisplay }}sec</div>
</template>
<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { gsap } from 'gsap'

const animVal = ref(0)
const start = ref(0)
const end = ref(100)
const animStartFrame = ref(0)
const animEndFrame = ref(5)

// 3分のアニメーションを想定
let tl = gsap.timeline({
  paused: true
})
const currentTime = ref(0) //
const lock = ref(false) // 操作をロックする機能
function trackPause() {
  gsap.killTweensOf(currentTime)
  currentTime.value = 0
  lock.value = false
}
function trackStop() {
  gsap.killTweensOf(currentTime)
  lock.value = false
}
function trackPlay() {
  gsap.fromTo(
    currentTime,
    { value: 0 },
    {
      value: 180,
      duration: 180,
      ease: 'none',
      onStart: () => {
        lock.value = true
      },
      onComplete: () => {
        lock.value = false
      }
    }
  )
}

watchEffect(() => {
  tl.seek(Number(currentTime.value))
})

const timeDisplay = computed(() => Number(currentTime.value).toFixed(2))

function animStart() {
  tl.fromTo(
    animVal,
    { value: start.value },
    { value: end.value, duration: animEndFrame.value - animStartFrame.value, ease: 'power4.out' },
    animStartFrame.value
  )
}
</script>

<style scoped>
button {
  width: 200px;
  height: 32px;
  appearance: none;
  border: 1px solid rgb(0, 0, 0);
  color: rgb(0, 0, 0);
  background: none;
  user-select: none;
}
button:hover {
  color: black;
  background: rgb(181, 181, 181);
}
</style>
