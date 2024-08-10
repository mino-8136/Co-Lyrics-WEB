<template>
  <div ref="waveform"></div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import WaveSurfer from 'wavesurfer.js';

const waveform = ref(null); // DOM要素への参照を作成
let wavesurfer = null;      // wavesurferのインスタンスを保持する変数

onMounted(() => {
  if (waveform.value) {
    // インスタンスを生成し、設定を行う
    wavesurfer = WaveSurfer.create({
      container: waveform.value, // refを使用して要素を指定
      waveColor: '#4F4A85',
      progressColor: '#383351',
      url: '/src/assets/music/demo.mp3' // オーディオファイルのURL
    });

    // イベントリスナーを追加
    wavesurfer.on('interaction', () => wavesurfer.play());

    // オーディオのロード
    wavesurfer.load();
  }
});

onUnmounted(() => {
  if (wavesurfer) {
    // リソースのクリーンアップ
    wavesurfer.destroy();
  }
});
</script>

<style scoped>
div {
  background-color: aliceblue;
}
</style>
