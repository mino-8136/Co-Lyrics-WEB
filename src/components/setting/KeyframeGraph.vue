<template>
  <v-container>
    <svg
      :width="props.panelWidth + padding.left + padding.right"
      :height="height + padding.top + padding.bottom"
      @contextmenu.prevent="onGraphContextMenu"
      @mousedown="updateSeekbar"
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
          :x2="props.panelWidth"
          :y2="y"
          stroke="#ccc"
          stroke-width="0.5"
        />
      </g>

      <!-- シークバーの表示 -->
      <g :transform="`translate(${padding.left}, ${padding.top})`">
        <line
          :x1="computeX(timelineStore.currentFrame - props.start)"
          :y1="0"
          :x2="computeX(timelineStore.currentFrame - props.start)"
          :y2="height"
          stroke="#666"
          stroke-width="1"
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
          {{ Math.round(xRange[0] + (x / props.panelWidth) * (xRange[1] - xRange[0])) }}
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
          @contextmenu.stop.prevent="onKeyframeContextMenu($event, index)"
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
import EasingPanel from '@/components/setting/EasingPanel.vue'
import { type KeyframeSettings, type KeyframeSetting } from '@/components/parameters/objectInfo'
import { generateUniqueId } from '../utils/common'
import { useTimelineStore } from '@/stores/objectStore'

const displayEasingPanel = ref(false)
const keyframes = defineModel<KeyframeSettings>('keyframes', { required: true })
const selectedKeyframe = ref<KeyframeSetting>({} as KeyframeSetting)
const timelineStore = useTimelineStore()

const props = defineProps<{
  start: number
  end: number
  panelWidth: number
}>()

const height = 150
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

let initialYRange = [-100, 100]
const yRange = computed(() => {
  const currentMaxAbsValue = Math.max(
    Math.abs(Math.min(...keyframes.value.map((k) => k.value))),
    Math.abs(Math.max(...keyframes.value.map((k) => k.value)))
  )

  // ドラッグ中かどうかで最大値を調整
  const targetMaxAbsValue =
    draggingIndex.value !== -1
      ? Math.max(
          currentMaxAbsValue,
          Math.max(Math.abs(initialYRange[0]), Math.abs(initialYRange[1]))
        )
      : Math.max(currentMaxAbsValue, 100)

  // ドラッグが終了したら新しいyRangeを設定
  if (draggingIndex.value === -1) {
    initialYRange = [-targetMaxAbsValue, targetMaxAbsValue]
  }

  return [-targetMaxAbsValue, targetMaxAbsValue]
})

// フレームと値から x 座標を計算する関数
const computeX = (frame: number) => {
  return ((frame - xRange.value[0]) / (xRange.value[1] - xRange.value[0])) * props.panelWidth
}

// フレームと値から y 座標を計算する関数
const computeY = (value: number) => {
  return height - ((value - yRange.value[0]) / (yRange.value[1] - yRange.value[0])) * height
}

/////////////////
// グラフの描画 //
/////////////////

const points = computed(() => {
  const allPoints = []

  // 最初のキーフレームの前に水平線を追加
  const firstKeyframe = keyframes.value[0]
  const firstX = 0
  const firstY =
    height -
    ((firstKeyframe.value - yRange.value[0]) / (yRange.value[1] - yRange.value[0])) * height
  const firstFrameX =
    ((firstKeyframe.frame - xRange.value[0]) / (xRange.value[1] - xRange.value[0])) *
    props.panelWidth

  // 最初のキーフレームから前の水平線
  allPoints.push(`${firstX},${firstY}`, `${firstFrameX},${firstY}`)

  // キーフレーム間の折れ線グラフ
  for (let i = 0; i < keyframes.value.length - 1; i++) {
    const startFrame = keyframes.value[i].frame
    const endFrame = keyframes.value[i + 1].frame
    const startValue = keyframes.value[i].value
    const endValue = keyframes.value[i + 1].value
    const easingFunc = gsap.parseEase(keyframes.value[i].easeType || 'none')

    const numPoints = endFrame - startFrame

    for (let j = 0; j <= numPoints; j++) {
      const t = j / numPoints
      const easedT = easingFunc(t)

      const x =
        ((startFrame + j - xRange.value[0]) / (xRange.value[1] - xRange.value[0])) *
        props.panelWidth
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
    ((lastKeyframe.frame - xRange.value[0]) / (xRange.value[1] - xRange.value[0])) *
    props.panelWidth
  const lastY =
    height - ((lastKeyframe.value - yRange.value[0]) / (yRange.value[1] - yRange.value[0])) * height
  const lastX = props.panelWidth

  // 最後のキーフレームから後の水平線
  allPoints.push(`${lastFrameX},${lastY}`, `${lastX},${lastY}`)

  return allPoints.join(' ')
})

// グリッド線を描画するための座標を計算
const verticalLines = computed(() => {
  const lines = []
  const step = props.panelWidth / 10
  for (let i = 0; i <= 10; i++) {
    lines.push(i * step)
  }
  return lines
})

const horizontalLines = computed(() => {
  const lines = []
  const numLines = 4 // 横線の本数
  const step = height / numLines
  for (let i = 0; i <= numLines; i++) {
    lines.push(i * step)
  }
  return lines
})

///////////////////
// メニューの定義 //
///////////////////

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

function onGraphContextMenu(event: MouseEvent) {
  event.preventDefault()

  ContextMenu.showContextMenu({
    x: event.clientX,
    y: event.clientY,
    items: [
      {
        label: 'キーフレームを追加',
        onClick: () => {
          addKeyframe(event)
        }
      }
    ]
  })
}

///////////////////
// キーパネル操作 //
///////////////////

// イージングパネルを表示する関数
function showEasingPanel(index: number) {
  selectedKeyframe.value = keyframes.value[index]
  displayEasingPanel.value = true
}

// キーフレームを削除する関数
function removeKeyframe(index: number) {
  keyframes.value.splice(index, 1)
}

// キーフレームを追加する関数
function addKeyframe(event: MouseEvent) {
  let frame = Math.round(
    ((event.offsetX - padding.left) / props.panelWidth) * (xRange.value[1] - xRange.value[0]) +
      xRange.value[0]
  )
  const value = Math.round(
    ((height - (event.offsetY - padding.top)) / height) * (yRange.value[1] - yRange.value[0]) +
      yRange.value[0]
  )

  // frameを基準に挿入位置を決める
  const frameIndex = keyframes.value.findIndex((kf) => kf.frame > frame)
  // もしframeが1つ前のキーフレームと同じ場合はframeを+1する
  // TODO: 他のキーフレームとも重複しないようにする
  if (frameIndex !== -1 && keyframes.value[frameIndex - 1].frame === frame) {
    frame++
  }

  keyframes.value.splice(frameIndex, 0, {
    id: generateUniqueId(),
    frame,
    value,
    easeType: 'none'
  })
}

const updateSeekbar = (event: MouseEvent) => {
  timelineStore.currentFrame =
    Math.round(
      ((event.offsetX - padding.left) / props.panelWidth) * (xRange.value[1] - xRange.value[0]) +
        xRange.value[0]
    ) + props.start
}

/////////////////////
// キーフレーム操作 //
/////////////////////

// キーフレームドラッグ用の変数
let svgRect: DOMRect | null = null

const startDrag = (index: number, event: MouseEvent) => {
  draggingIndex.value = index

  // ドラッグ開始時の表示域を保存
  initialYRange = yRange.value

  // SVG全体のオフセットを計算して保存
  svgRect = (event.currentTarget as SVGElement).getBoundingClientRect()

  // 座標を動的に計算する
  const frameX = computeX(keyframes.value[index].frame)
  const valueY = computeY(keyframes.value[index].value)

  offsetX.value = event.clientX - (svgRect.left + frameX)
  offsetY.value = event.clientY - (svgRect.top + valueY)

  // ドラッグ中のイベントリスナーを追加
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', endDrag)
}

const onMouseMove = (event: MouseEvent) => {
  if (draggingIndex.value !== -1 && svgRect) {
    const kf = keyframes.value[draggingIndex.value]

    // フレームの変更
    let newFrame = Math.round(
      ((event.clientX - svgRect.left - offsetX.value) / props.panelWidth) *
        (xRange.value[1] - xRange.value[0]) +
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
      ((offsetY.value - (event.clientY - svgRect.top)) / height) *
        (yRange.value[1] - yRange.value[0]) +
        yRange.value[1]
    )

    const deltaValue = newValue - kf.value
    // 範囲外かつ速度制限を超えた場合に制限する
    if (
      (newValue < yRange.value[0] || yRange.value[1] < newValue) &&
      Math.abs(deltaValue) > maxDeltaY
    ) {
      kf.value += deltaValue > 0 ? maxDeltaY : -maxDeltaY
    } else {
      kf.value = newValue
    }
  }
}

const endDrag = () => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', endDrag)
  draggingIndex.value = -1
  svgRect = null // 終了時にクリア
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
