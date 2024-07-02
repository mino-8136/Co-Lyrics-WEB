<template>
  <v-container class="preview-panel">

    <!-- ここでp5.jsのCanvasを表示 -->
    <div class="d-flex jjustify-center align-center" id="p5Canvas">

    </div>

    <!-- ここでオブジェクトのコンポーネントを表示 -->
    <div v-for="object in props.objects" :key="object.id">
      <component :is="getObjectComponent(object.type)" />
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import p5 from "p5";

// TimelinePanel上で現在再生されているオブジェクトを取得
const props = defineProps(['objects']) // EditViewから渡されたCurrentObjects

function getObjectComponent(type: string) {
  if (type === 'text') return 'TextObject'
  if (type === 'image') return 'ImageObject'
}

onMounted(() => {
  const sketch = (p: p5) => {
    p.setup = () => {
      var canvas = p.createCanvas(400, 400);
      canvas.parent('p5Canvas');
      p.background(0);
    };

    p.draw = () => {
      p.background(0);
      p.fill(255);
      p.ellipse(p.mouseX, p.mouseY, 50, 50);
    };
  };

  new p5(sketch);
})

</script>

<style scoped>
.preview-panel {
  position: relative;
  width: 100%;
  height: 500px;
  border: 1px solid #ccc;
}
</style>
