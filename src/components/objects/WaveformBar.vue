<template>
  <div ref="waveform" class="waveform"></div>
  <div class="scrollable">
    <p class="scrollchild" :style="{ width: waveformWidth }">aaaaaaaaaaaaaaaaaa</p>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import WaveSurfer from 'wavesurfer.js'
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js'

import { useTimelineStore } from '@/stores/objectStore'
const timelineStore = useTimelineStore()

const waveform = ref(null) // DOM要素への参照を作成
const waveformWidth = ref(100)

let wavesurfer = null // wavesurferのインスタンスを保持する変数

onMounted(() => {
  if (waveform.value) {
    // タイムラインプラグインの設定
    const bottomTimeline = TimelinePlugin.create({
      height: 15,
      timeInterval: 0.1,
      primaryLabelInterval: 1,
      formatTimeCallback: (seconds) => {
        return Math.round(seconds * timelineStore.framerate) + 'f'
      },
      style: {
        fontSize: '10px',
        color: '#6A3274'
      }
    })

    // インスタンスを生成し、設定を行う
    wavesurfer = WaveSurfer.create({
      container: waveform.value,
      waveColor: '#4F4A85',
      progressColor: '#383351',
      url: '/src/assets/music/demo.mp3',
      height: 40,
      minPxPerSec: 90, // ここを1フレームあたりの幅に合わせる
      autoplay: false,
      autoScroll: true,
      dragToSeek: true,
      fillParent: false,
      normalize: true,
      hideScrollbar: false,
      plugins: [bottomTimeline]
    })

    // イベントリスナーを追加
    wavesurfer.on('click', () => {
      wavesurfer.playPause()
    })
    wavesurfer.on('dragstart', () => {
      wavesurfer.pause()
    })
    wavesurfer.on('audioprocess', (currentTime) => {
      timelineStore.currentFrame = Math.round(currentTime * timelineStore.framerate)
      const scrollPosition = currentTime * 100 // currentTimeに基づいてスクロール位置を計算
      setScrollPosition(scrollPosition)
    })
    wavesurfer.on('interaction', (newTime) => {
      timelineStore.currentFrame = Math.round(newTime * timelineStore.framerate)
    })
    wavesurfer.on('scroll', (scroll) => {
      const scrollPosition = scroll * wavesurfer.options.minPxPerSec // スクロール位置を計算
      setScrollPosition(scrollPosition)
    })

    // 再生直前の処理はここに追加
    wavesurfer.on('ready', () => {
      waveformWidth.value = wavesurfer.getWrapper().style.width
    })

    // スケーラーの追加
    wavesurfer.once('decode', () => {
      const slider = document.querySelector('input[type="range"]')

      slider.addEventListener('input', (e) => {
        const minPxPerSec = e.target.valueAsNumber
        wavesurfer.zoom(minPxPerSec)
        waveformWidth.value = wavesurfer.getWrapper().style.width
      })
    })
  }
})

// スクロールバーの位置を操作する関数
const setScrollPosition = (position) => {
  const scrollableElement = document.querySelector('.scrollable')
  if (scrollableElement) {
    scrollableElement.scrollLeft = position // 水平方向のスクロール位置を設定
  }
}

onUnmounted(() => {
  if (wavesurfer) {
    wavesurfer.destroy()
  }
})
</script>

<style scoped>
div {
  background-color: aliceblue;
}

.waveform ::part(cursor) {
  border: 1px solid #4cabe2;
}

.scrollable {
  overflow-x: scroll;
}
.scrollchild {
  background-color: red;
}
</style>
