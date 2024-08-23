<template>
  <div>
    <svg
      :width="width + padding.left + padding.right"
      :height="height + padding.top + padding.bottom"
      @mousedown="onMouseDown"
    >
      <!-- グリッド線の描画 -->
      <g class="grid" :transform="`translate(${padding.left}, ${padding.top})`">
        <line
          v-for="(x, index) in verticalLines"
          :key="'v-' + index"
          :x1="x"
          :y1="0"
          :x2="x"
          :y2="height"
          stroke="#ccc"
          stroke-width="0.5"
        />
        <line
          v-for="(y, index) in horizontalLines"
          :key="'h-' + index"
          :x1="0"
          :y1="y"
          :x2="width"
          :y2="y"
          stroke="#ccc"
          stroke-width="0.5"
        />
      </g>

      <!-- 数値の表示 -->
      <g class="labels" :transform="`translate(${padding.left}, ${padding.top})`">
        <!-- 横軸の数値 -->
        <text
          v-for="(x, index) in verticalLines"
          :key="'xlabel-' + index"
          :x="x"
          :y="height + 20"
          text-anchor="middle"
          font-size="10"
          fill="#333"
        >
          {{ Math.round((x / width) * frameMax) }}
        </text>

        <!-- 縦軸の数値 -->
        <text
          v-for="(y, index) in horizontalLines"
          :key="'ylabel-' + index"
          :x="-10"
          :y="y + 3"
          text-anchor="end"
          font-size="10"
          fill="#333"
        >
          {{ Math.round(yRange[1] - (y / height) * (yRange[1] - yRange[0])) }}
        </text>
      </g>

      <!-- 折れ線グラフ -->
      <g :transform="`translate(${padding.left}, ${padding.top})`">
        <polyline :points="points" stroke="blue" fill="none" />
        <!-- ドラッグ可能な丸 -->
        <circle
          v-for="(kf, index) in keyframes"
          :key="kf.id"
          :cx="kf.x"
          :cy="kf.y"
          r="5"
          fill="red"
          @mousedown.stop="startDrag(index, $event)"
        />
      </g>
    </svg>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { gsap } from 'gsap'

const width = 500
const height = 300

const padding = { top: 20, right: 40, bottom: 40, left: 40 }

const keyframes = ref([
  { frame: 0, value: 0, id: '0', animation: 'power1.out' },
  { frame: 40, value: 257, id: 'm0720msp0.r0rs36iks', animation: 'power1.inOut' },
  { frame: 80, value: 79, id: 'm0720ngq0.q36boa566rl', animation: 'back.inOut' },
  { frame: 100, value: -210, id: 'm0720nz00.62q3zc0rt6t', animation: 'power4.out' },
  { frame: 120, value: 116, id: 'm0720oq70.9p18czdndna' }
])

const draggingIndex = ref(null)
const offsetX = ref(0)
const offsetY = ref(0)

const frameMin = 0
const frameMax = 200

const maxFrame = computed(() => Math.max(...keyframes.value.map((k) => k.frame)))
const minValue = computed(() => Math.min(...keyframes.value.map((k) => k.value)))
const maxValue = computed(() => Math.max(...keyframes.value.map((k) => k.value)))

// 縦軸の範囲を動的に計算して、中央が0になるように設定
const yRange = computed(() => {
  const maxAbsValue = Math.max(Math.abs(minValue.value), Math.abs(maxValue.value))
  return [-maxAbsValue, maxAbsValue]
})

const points = computed(() => {
  const allPoints = []

  for (let i = 0; i < keyframes.value.length - 1; i++) {
    const startFrame = keyframes.value[i].frame
    const endFrame = keyframes.value[i + 1].frame
    const startValue = keyframes.value[i].value
    const endValue = keyframes.value[i + 1].value
    const easingFunc = gsap.parseEase(keyframes.value[i].animation || 'none')

    const numPoints = endFrame - startFrame

    for (let j = 0; j <= numPoints; j++) {
      const t = j / numPoints
      const easedT = easingFunc(t)

      const x = ((startFrame + j) / maxFrame.value) * width
      const y =
        height -
        ((startValue + easedT * (endValue - startValue) - yRange.value[0]) /
          (yRange.value[1] - yRange.value[0])) *
          height

      allPoints.push(`${x},${y}`)
    }
  }

  return allPoints.join(' ')
})

keyframes.value.forEach((kf) => {
  kf.x = computed(() => (kf.frame / maxFrame.value) * width)
  kf.y = computed(
    () => height - ((kf.value - yRange.value[0]) / (yRange.value[1] - yRange.value[0])) * height
  )
})

// グリッド線を描画するための座標を計算
const verticalLines = computed(() => {
  const lines = []
  const step = width / 10
  for (let i = 0; i <= 10; i++) {
    lines.push(i * step)
  }
  return lines
})

const horizontalLines = computed(() => {
  const lines = []
  const numLines = 10 // 横線の本数
  const step = height / numLines
  for (let i = 0; i <= numLines; i++) {
    lines.push(i * step)
  }
  return lines
})

const startDrag = (index, event) => {
  draggingIndex.value = index
  offsetX.value = event.offsetX - keyframes.value[index].x
  offsetY.value = event.offsetY - keyframes.value[index].y
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', endDrag)
}

const onMouseMove = (event) => {
  if (draggingIndex.value !== null) {
    const kf = keyframes.value[draggingIndex.value]
    // frameの値を制限
    const newFrame = Math.round(
      ((event.offsetX - offsetX.value - padding.left) / width) * maxFrame.value
    )
    kf.frame = Math.max(frameMin, Math.min(frameMax, newFrame))
    kf.value = Math.round(
      ((height - (event.offsetY - offsetY.value - padding.top)) / height) *
        (yRange.value[1] - yRange.value[0]) +
        yRange.value[0]
    )
  }
}

const endDrag = () => {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', endDrag)
  draggingIndex.value = null
}
</script>

<style scoped>
svg {
  border: 1px solid #ccc;
}

circle {
  cursor: pointer;
}

.grid line {
  stroke: #ccc;
  stroke-width: 0.5;
}

.labels text {
  font-family: Arial, sans-serif;
}
</style>
