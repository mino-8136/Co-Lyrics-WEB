<template>
  <div ref="waveform"></div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import WaveSurfer from 'wavesurfer.js'
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js'

const waveform = ref(null) // DOM要素への参照を作成
let wavesurfer = null // wavesurferのインスタンスを保持する変数

onMounted(() => {
  if (waveform.value) {
    // タイムラインプラグインの設定
    const bottomTimeline = TimelinePlugin.create({
      height: 15,
      timeInterval: 0.1,
      primaryLabelInterval: 1,
      formatTimeCallback: (seconds) => {
        return Math.round(seconds * 30) + 'f'
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
      dragToSeek: true,
      normalize: true,
      plugins: [bottomTimeline]
    })

    // イベントリスナーを追加
    wavesurfer.on('click', () => wavesurfer.playPause())
  }
})

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
</style>
