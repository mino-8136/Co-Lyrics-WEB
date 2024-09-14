<template>
  <div ref="waveform" class="waveform"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import WaveSurfer from 'wavesurfer.js'
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js'
import { useTimelineStore } from '@/stores/objectStore'
import { type Note, getLyricMarker } from '../parameters/musics'
const timelineStore = useTimelineStore()

const waveform = ref(null) // DOM要素への参照を作成
let wavesurfer: WaveSurfer // wavesurferのインスタンスを保持する変数

const isPlaying = defineModel('isPlaying', { type: Boolean }) // 再生中かどうかを保持する変数
const emits = defineEmits(['callGetWaveformWidth', 'callSetScrollPosition'])

onMounted(() => {
  if (waveform.value) {
    // マーカー用プラグインの設定
    const regions = RegionsPlugin.create()

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
      url: timelineStore.musicData.audioPath,
      height: 40,
      minPxPerSec: timelineStore.pxPerSec, // ここが1フレームあたりの幅
      autoplay: false,
      autoScroll: true,
      dragToSeek: true,
      fillParent: false,
      normalize: true,
      hideScrollbar: false,
      plugins: [bottomTimeline, regions]
    })

    // イベントリスナーを追加
    wavesurfer.on('click', () => {
      isPlaying.value = !isPlaying.value
    })
    wavesurfer.on('dragstart', () => {
      isPlaying.value = false
    })
    wavesurfer.on('interaction', (newTime) => {
      timelineStore.currentFrame = Math.round(newTime * timelineStore.framerate)
    })
    wavesurfer.on('audioprocess', (currentTime) => {
      timelineStore.currentFrame = Math.round(currentTime * timelineStore.framerate)
    })
    wavesurfer.on('scroll', (scroll) => {
      const scrollPosition = scroll * wavesurfer.options.minPxPerSec // スクロール位置を計算
      emits('callSetScrollPosition', scrollPosition)
    })

    // 再生直前の処理はここに追加
    wavesurfer.on('ready', () => {
      emits('callGetWaveformWidth', wavesurfer.getWrapper().style.width)
    })

    // マーカーの追加
    wavesurfer.on('decode', async () => {
      setLyricMarker(regions)
    })
  }
})

async function setLyricMarker(regions: RegionsPlugin) {
  // 各ノートデータに基づいてリージョンを追加
  const noteData = await getLyricMarker(timelineStore.musicData.lyricPath)
  noteData.forEach((note: Note) => {
    if ('lyric' in note) {
      regions.addRegion({
        start: note.start_time + timelineStore.musicData.offset,
        content: note.lyric || '', // 歌詞がある場合のみ表示
        drag: false,
        color: 'rgba(255, 255, 0, 0.5)'
      })
    }
  })
}

// isPlayingの変更を監視して再生・停止を管理
watch(
  () => isPlaying.value,
  (newIsPlaying) => {
    if (wavesurfer) {
      if (newIsPlaying) {
        wavesurfer.play()
      } else {
        wavesurfer.pause()
      }
    }
  }
)

// pxPerSecの変更を監視
watch(
  () => timelineStore.pxPerSec,
  (newPxPerSec) => {
    if (wavesurfer) {
      wavesurfer.zoom(newPxPerSec)
      emits('callGetWaveformWidth', wavesurfer.getWrapper().style.width)
    }
  }
)

// musicDataの変更を監視
watch(
  () => timelineStore.musicData,
  async (newAudio) => {
    if (wavesurfer) {
      // 既存のリージョンをクリア
      const regions = wavesurfer
        .getActivePlugins()
        .find((plugin) => plugin instanceof RegionsPlugin) as RegionsPlugin
      if (regions) {
        regions.clearRegions()
      }

      // 新しい音声ファイルをロード
      wavesurfer.load(newAudio.audioPath)
    }
  }
)

onUnmounted(() => {
  if (wavesurfer) {
    wavesurfer.destroy()
  }
})
</script>

<style scoped>
div {
  background-color: aliceblue;
  overflow-y: scroll;
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

.waveform ::part(region-content) {
  font-size: 16px;
  white-space: nowrap;
  color: rgb(255, 255, 255);
  text-shadow:
    1px 1px 0 #000,
    -1px 1px 0 #000,
    -1px -1px 0 #000,
    1px -1px 0 #000;
  pointer-events: none;
}

.waveform ::part(marker) {
  background-color: rgba(0, 166, 255, 0.658) !important;
  padding: 1px;
  padding-top: 4px;
  pointer-events: none;
}
</style>
