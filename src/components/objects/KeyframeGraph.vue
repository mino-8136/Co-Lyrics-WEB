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
          {{ Math.round(xRange[0] + (x / width) * (xRange[1] - xRange[0])) }}
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
          @contextmenu.prevent="onKeyframeContextMenu($event, index)"
        />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { gsap } from 'gsap'
import ContextMenu from '@imengyu/vue3-context-menu'
import EasingPanel from '@/components/editor/EasingPanel.vue'
import { type KeyframeSettings } from '@/components/objects/objectInfo'

const props = defineProps<{
  start: number
  end: number
}>()

const keyframes = defineModel<KeyframeSettings>('keyframes')

const width = 500
const height = 300

const padding = { top: 20, right: 40, bottom: 40, left: 40 }

const draggingIndex = ref(null)
const offsetX = ref(0)
const offsetY = ref(0)

const startFrame = computed(() => props.start || 0)
const endFrame = computed(() => props.end || 200)

const maxDeltaX = 2 // X軸の値が1回のドラッグで変化できる最大量
const maxDeltaY = 5 // Y軸の値が1回のドラッグで変化できる最大量

// xRange: frameの最小値と最大値を動的に設定
const xRange = computed(() => {
  console.log(keyframes.value)
  const minFrame = Math.min(...keyframes.value.map((k) => k.frame))
  const maxFrame = Math.max(...keyframes.value.map((k) => k.frame))
  return [Math.min(startFrame.value, minFrame), Math.max(endFrame.value, maxFrame)]
})

// yRange: valueの範囲を動的に設定
const yRange = computed(() => {
  const maxAbsValue = Math.max(
    Math.abs(Math.min(...keyframes.value.map((k) => k.value))),
    Math.abs(Math.max(...keyframes.value.map((k) => k.value)))
  )
  return [-maxAbsValue, maxAbsValue]
})

const points = computed(() => {
  const allPoints = []

  // 最初のキーフレームの前に水平線を追加
  const firstKeyframe = keyframes.value[0]
  const firstX = 0
  const firstY =
    height -
    ((firstKeyframe.value - yRange.value[0]) / (yRange.value[1] - yRange.value[0])) * height
  const firstFrameX =
    ((firstKeyframe.frame - xRange.value[0]) / (xRange.value[1] - xRange.value[0])) * width

  // 最初のキーフレームから前の水平線
  allPoints.push(`${firstX},${firstY}`, `${firstFrameX},${firstY}`)

  // キーフレーム間の折れ線グラフ
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

      const x = ((startFrame + j - xRange.value[0]) / (xRange.value[1] - xRange.value[0])) * width
      const y =
        height -
        ((startValue + easedT * (endValue - startValue) - yRange.value[0]) /
          (yRange.value[1] - yRange.value[0])) *
          height

      allPoints.push(`${x},${y}`)
    }
  }

  // 最後のキーフレームの後に水平線を追加
  const lastKeyframe = keyframes.value[keyframes.value.length - 1]
  const lastFrameX =
    ((lastKeyframe.frame - xRange.value[0]) / (xRange.value[1] - xRange.value[0])) * width
  const lastY =
    height - ((lastKeyframe.value - yRange.value[0]) / (yRange.value[1] - yRange.value[0])) * height
  const lastX = width

  // 最後のキーフレームから後の水平線
  allPoints.push(`${lastFrameX},${lastY}`, `${lastX},${lastY}`)

  return allPoints.join(' ')
})

keyframes.value.forEach((kf) => {
  kf.x = computed(
    () => ((kf.frame - xRange.value[0]) / (xRange.value[1] - xRange.value[0])) * width
  )
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

/////////////////////
// キーフレーム操作 //
/////////////////////

// キーフレームを右クリックしたときのコンテキストメニュー
function onKeyframeContextMenu(event, index) {
  event.preventDefault()

  ContextMenu.showContextMenu({
    x: event.clientX,
    y: event.clientY,
    items: [
      {
        label: 'キーフレームを削除',
        onClick: () => {
          removeKeyframe(index)
        }
      }
    ]
  })
}

// キーフレームを削除する関数
function removeKeyframe(index) {
  keyframes.value.splice(index, 1)
}

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

    // フレームの変更
    let newFrame = Math.round(
      ((event.offsetX - offsetX.value) / width) * (xRange.value[1] - xRange.value[0]) +
        xRange.value[0]
    )

    // フレームの制限: xRangeの範囲内かつ前後のキーフレームのフレームを超えないように
    const prevFrame =
      draggingIndex.value > 0 ? keyframes.value[draggingIndex.value - 1].frame : xRange.value[0]
    const nextFrame =
      draggingIndex.value < keyframes.value.length - 1
        ? keyframes.value[draggingIndex.value + 1].frame
        : xRange.value[1]

    newFrame = Math.max(prevFrame + 1, Math.min(newFrame, nextFrame - 1))
    kf.frame = newFrame

    // 値の変更
    const newValue = Math.round(
      ((offsetY.value - event.offsetY) / height) * (yRange.value[1] - yRange.value[0]) +
        yRange.value[1]
    )

    const deltaValue = newValue - kf.value
    if (Math.abs(deltaValue) > maxDeltaY) {
      kf.value += deltaValue > 0 ? maxDeltaY : -maxDeltaY
    } else {
      kf.value = newValue
    }
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
  user-select: none;
}

circle {
  cursor: pointer;
}

.grid line {
  stroke: #ccc;
  stroke-width: 0.5;
}

.labels {
  font-family: Arial, sans-serif;
}
</style>
