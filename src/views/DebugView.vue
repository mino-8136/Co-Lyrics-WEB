<template>
  <h1>Debug View</h1>
  <p>{{ tmp }}</p>
  <v-btn @click="animStart">Timeline Start</v-btn>
  <v-btn @click="animStart2">ChainStart</v-btn>
  <v-btn @click="tl.restart()">Timeline Reset</v-btn>
  <v-btn @click="tl.pause()">Timeline Pause</v-btn>
  <v-btn @click="tl.seek(seek)">Timeline Seek</v-btn>
  
  <v-row class="ma-4">
      <v-slider :label="`${start}`" v-model="start" max="100" step="1"/>
      <v-slider :label="`${end}`" v-model="end" max="100" step="1"/>
      <v-slider :label="`${animStartFrame}`" v-model="animStartFrame" max="5" step="1"/>
      <v-slider :label="`${animEndFrame}`" v-model="animEndFrame" max="10" step="1"/>
        </v-row>
        <v-slider :label="`${seek}`" v-model="seek" max="100" step="1" @input="tl.seek(seek)"/>
      
    </template>
<script setup lang="ts">
import { ref } from 'vue'
import { gsap } from 'gsap'

const tmp = ref(0)
const start = ref(0)
const end = ref(100)
const animStartFrame =ref(0)
const animEndFrame = ref(5)
const seek = ref(0)

// 3分のアニメーションを想定
let tl = gsap.timeline()

function animStart() {
  tl.fromTo(tmp, {value: start.value},{value:end.value, duration: animEndFrame.value-animStartFrame.value, ease: 'power4.out' }, animStartFrame.value)
}
function animStart2() {
  gsap.fromTo(tmp, { value: start.value }, { value: end.value, duration: animEndFrame.value-animStartFrame.value, ease: 'power4.out' })
}
</script>

<style scoped></style>
