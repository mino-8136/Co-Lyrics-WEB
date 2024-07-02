<template>
  <v-container class="preview-panel">

    <!-- ここでp5.jsのCanvasを表示 -->
    <div id="canvas"></div>

    <!-- ここでオブジェクトのコンポーネントを表示 -->
    <div v-for="object in props.objects" :key="object.id">
      <component :is="getObjectComponent(object.type)" />
    </div>
    
    <button v-on:click="creatBalls">Create Balls</button>
    <!--全ボール削除ボタン-->
    <button v-on:click="clearCanvas">Clear Canvas</button>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import p5 from "p5";
import { p5Setup, addBalls, clearBalls } from '../p5/SetupP5';

// TimelinePanel上で現在再生されているオブジェクトを取得
const props = defineProps(['objects']) // EditViewから渡されたCurrentObjects

function getObjectComponent(type: string) {
  if (type === 'text') return 'TextObject'
  if (type === 'image') return 'ImageObject'
}

const P5 = ref();

// マウント時に canvas を生成
onMounted(() => {
  P5.value = new p5(p5Setup);
});
// ボールを追加
const creatBalls = () => {
  addBalls();
};
// ボールを全て削除
const clearCanvas = () => {
  clearBalls();
};

</script>

<style scoped>
.preview-panel {
  position: relative;
  width: 100%;
  height: 500px;
  border: 1px solid #ccc;
}
</style>
