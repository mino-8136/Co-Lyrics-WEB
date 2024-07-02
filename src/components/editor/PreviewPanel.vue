<template>
  <v-container class="preview-panel">
    <div class="preview-area">
      <!-- ここでオブジェクトのコンポーネントを表示 -->
      <div v-for="object in props.objects" :key="object.id">
        <component :is="getObjectComponent(object.type)" />
        <!-- TODO : 表示する位置を指定できるようにする-->
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

// TimelinePanel上で現在再生されているオブジェクトを取得
const props = defineProps(['objects']) // EditViewから渡されたCurrentObjects

function getObjectComponent(type: string) {
  if (type === 'text') return 'TextObject'
  if (type === 'image') return 'ImageObject'
}


</script>

<style scoped>
.preview-panel {
  position: relative;
  width: 100%;
  height: 500px;
  border: 1px solid #ccc;
}

.preview-area {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
