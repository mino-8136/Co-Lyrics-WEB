<template>
  <v-container>
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
          :cx="computeX(kf.frame)"
          :cy="computeY(kf.value)"
          r="5"
          fill="red"
          @mousedown.stop="startDrag(index, $event)"
          @contextmenu.prevent="onKeyframeContextMenu($event, index)"
        />
      </g>
    </svg>
  </v-container>
  <EasingPanel v-model:show="displayEasingPanel" v-model:easing="selectedKeyframe" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { gsap } from 'gsap'
import ContextMenu from '@imengyu/vue3-context-menu'
import EasingPanel from '@/components/editor/EasingPanel.vue'
import { type KeyframeSettings, type KeyframeSetting } from '@/components/objects/objectInfo'

const displayEasingPanel = ref(false)
const keyframes = defineModel<KeyframeSettings>('keyframes', { required: true })
const selectedKeyframe = ref<KeyframeSetting>({} as KeyframeSetting)

const props = defineProps<{
  start: number
  end: number
}>()

const width = 500
const height = 300
const padding = { top: 20, right: 40, bottom: 40, left: 40 }

const draggingIndex = ref(-1)
const offsetX = ref(0)
const offsetY = ref(0)

const startFrame = computed(() => props.start)
const endFrame = computed(() => props.end)

const maxDeltaX = 2 // X軸の値が1回のドラッグで変化できる最大量
const maxDeltaY = 5 // Y軸の値が1回のドラッグで変化できる最大量

// xRange: frameの最小値と最大値を動的に設定
const xRange = computed(() => {
  // console.log(startFrame.value, endFrame.value)
  return [0, endFrame.value - startFrame.value]
})

// yRange: valueの範囲を動的に設定
const yRange = computed(() => {
  const maxAbsValue = Math.max(
    Math.abs(Math.min(...keyframes.value.map((k) => k.value))),
    Math.abs(Math.max(...keyframes.value.map((k) => k.value)))
  )
  const adjustedMaxAbsValue = Math.max(maxAbsValue, 100)
  return [-adjustedMaxAbsValue, adjustedMaxAbsValue]
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

// フレームと値から x 座標を計算する関数
const computeX = (frame: number) => {
  return ((frame - xRange.value[0]) / (xRange.value[1] - xRange.value[0])) * width
}

// フレームと値から y 座標を計算する関数
const computeY = (value: number) => {
  return height - ((value - yRange.value[0]) / (yRange.value[1] - yRange.value[0])) * height
}

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
function onKeyframeContextMenu(event: MouseEvent, index: number) {
  event.preventDefault()

  ContextMenu.showContextMenu({
    x: event.clientX,
    y: event.clientY,
    items: [
      {
        label: 'イージングを変更',
        onClick: () => {
          showEasingPanel(index)
        }
      },
      {
        label: 'キーフレームを削除',
        onClick: () => {
          removeKeyframe(index)
        }
      }
    ]
  })
}

// イージングパネルを表示する関数
function showEasingPanel(index: number) {
  selectedKeyframe.value = keyframes.value[index]
  displayEasingPanel.value = true
}

// キーフレームを削除する関数
function removeKeyframe(index: number) {
  keyframes.value.splice(index, 1)
}

const startDrag = (index: number, event: MouseEvent) => {
  //console.log('startDrag', index)
  draggingIndex.value = index
  // 座標を動的に計算する
  const frameX = computeX(keyframes.value[index].frame)
  const valueY = computeY(keyframes.value[index].value)
  offsetX.value = event.offsetX - frameX
  offsetY.value = event.offsetY - valueY

  // ドラッグ中のイベントリスナーを追加
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', endDrag)
}
const onMouseMove = (event: MouseEvent) => {
  if (draggingIndex.value !== null) {
    const kf = keyframes.value[draggingIndex.value]

    // フレームの変更
    let newFrame = Math.round(
      ((event.offsetX - offsetX.value) / width) * (xRange.value[1] - xRange.value[0]) +
        xRange.value[0]
    )

    // フレームの制限: xRangeの範囲内かつ前後のキーフレームのフレームを超えないように
    const prevFrame =
      draggingIndex.value > 0 ? keyframes.value[draggingIndex.value - 1].frame : xRange.value[0] - 1
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
  draggingIndex.value = -1
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
