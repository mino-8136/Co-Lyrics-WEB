<template>
  <h1>Debug View</h1>
  <p>{{ tmp }}</p>
  <v-btn @click="animStart" icon="mdi-play"> </v-btn>
  <v-btn @click="animStart2" icon="mdi-play"> </v-btn>
  <v-slider v-model="start" max="100" step="1"/>
  <v-slider v-model="end" max="100" step="1"/>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { gsap } from 'gsap'

const tmp = ref(0)
const start = ref(0)
const end = ref(0)

function animStart() {
  gsap.to(tmp, { value: 100, duration: 1, ease: 'power4.out' })
}
function animStart2() {
  gsap.fromTo(tmp, { value: start.value }, { value: end.value, duration: 1, ease: 'power4.out' })
}
</script>

<style scoped></style>
