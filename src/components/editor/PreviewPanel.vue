<template>
  <v-container class="preview-panel">

    <!-- ここでp5.jsのCanvasを表示 -->
    <div id="canvas"></div>

    <!-- ここでオブジェクトのコンポーネントを表示 -->
    <div v-for="object in props.objects" :key="object.id">
      <component :is="getObjectComponent(object.type)" />
    </div>

  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import p5 from "p5";
import { sketch } from '../p5/sketch';

// TimelinePanel上で現在再生されているオブジェクトを取得
const props = defineProps(['objects']) // EditViewから渡されたCurrentObjects

function getObjectComponent(type: string) {
  if (type === 'text') return 'TextObject'
  if (type === 'image') return 'ImageObject'
}

const p = ref();

// マウント時に canvas を生成
onMounted(() => {
  p.value = new p5(sketch);
  p.value.changeColor();
});

</script>

<style scoped>
.preview-panel {
  position: relative;
  width: 100%;
  height: 500px;
  border: 1px solid #ccc;
}
</style>
