<template>
  <v-card class="EasingPanel">
    <v-card-title>{{ props.getParam.label }}の移動タイプを選択</v-card-title>
    <v-row>
      <v-col v-for="effect in effects" :key="effect.id" class="d-flex" cols="2">
        <v-container>
          <canvas
            :id="'canvas-' + effect.id"
            class="bg-grey-lighten-2"
            style="width: 100%; height: auto"
          ></canvas>
          <v-btn @click="handleButtonClick(effect.name, effect.id)">
            {{ effect.name }}
          </v-btn>
        </v-container>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  getParam: Object
})
const emits = defineEmits(['callAddEasing', 'update:panel']) // emits に 'update:panel' を追加

const effects = ref([
  { id: 1, name: 'none' },
  { id: 2, name: 'power1.in' },
  { id: 3, name: 'power1.out' },
  { id: 4, name: 'power1.inOut' },
  { id: 5, name: 'power2.in' },
  { id: 6, name: 'power2.out' },
  { id: 7, name: 'power2.inOut' },
  { id: 8, name: 'power3.in' },
  { id: 9, name: 'power3.out' },
  { id: 10, name: 'power3.inOut' },
  { id: 11, name: 'power4.in' },
  { id: 12, name: 'power4.out' },
  { id: 13, name: 'power4.inOut' },
  { id: 14, name: 'back.in' },
  { id: 15, name: 'back.out' },
  { id: 16, name: 'back.inOut' },
  { id: 17, name: 'elastic.in' },
  { id: 18, name: 'elastic.out' },
  { id: 19, name: 'elastic.inOut' },
  { id: 20, name: 'bounce.in' },
  { id: 21, name: 'bounce.out' },
  { id: 22, name: 'bounce.inOut' },
  { id: 23, name: 'circ.in' },
  { id: 24, name: 'circ.out' },
  { id: 25, name: 'circ.inOut' },
  { id: 26, name: 'expo.in' },
  { id: 27, name: 'expo.out' },
  { id: 28, name: 'expo.inOut' },
  { id: 29, name: 'sine.in' },
  { id: 30, name: 'sine.out' },
  { id: 31, name: 'sine.inOut' }
])

const handleButtonClick = (name: string, id: number) => {
  emits('callAddEasing', name)
  emits('update:panel', false) // ダイアログを閉じるために panel を false に更新
  nextTick(() => drawGraph(name, id)) // グラフを描画
}

const drawGraph = (easing: string, id: number) => {
  const canvas = document.getElementById('canvas-' + id) as HTMLCanvasElement
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // キャンバスのサイズを動的に設定
  canvas.width = canvas.clientWidth
  canvas.height = canvas.clientWidth * 1.2

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.beginPath()

  const yOffset = canvas.height * 0.1
  const graphHeight = canvas.height * 0.8

  // 開始位置の横線
  ctx.moveTo(0, yOffset + graphHeight)
  ctx.lineTo(canvas.width, yOffset + graphHeight)

  // 終了位置の横線
  ctx.moveTo(0, yOffset)
  ctx.lineTo(canvas.width, yOffset)

  ctx.strokeStyle = 'ccc'
  ctx.lineWidth = 0.4
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(0, yOffset + graphHeight)

  const points = 100
  for (let i = 0; i <= points; i++) {
    const progress = i / points
    const value = gsap.parseEase(easing)(progress)
    const x = (i / points) * canvas.width
    const y = yOffset + (1 - value) * graphHeight
    ctx.lineTo(x, y)
  }

  ctx.strokeStyle = '#ff0000'
  ctx.lineWidth = 2
  ctx.stroke()
}

onMounted(() => {
  effects.value.forEach((effect) => {
    nextTick(() => drawGraph(effect.name, effect.id))
  })
})
</script>

<style scoped>
.EasingPanel {
  margin: auto;
  width: 60%;
  min-width: 300px;
  height: 50%;
  border: 1px solid #ccc;
  overflow-y: auto;
}
</style>
