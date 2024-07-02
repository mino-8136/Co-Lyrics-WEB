<template>
  <v-container class="preview-panel">
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn color="primary" v-bind="props" density="comfortable" > ファイル </v-btn>
      </template>

      <v-list>
        <v-list-item @click="openFile">
          <v-list-item-title>ファイルを開く</v-list-item-title>
        </v-list-item>
        <v-list-item @click="saveFile">
          <v-list-item-title>ファイルを保存</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

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
import { computed, ref, defineProps } from 'vue'

// TimelinePanel上で現在再生されているオブジェクトを取得
const props = defineProps(['objects']) // EditViewから渡されたCurrentObjects

function getObjectComponent(type: string) {
  if (type === 'text') return 'TextObject'
  if (type === 'image') return 'ImageObject'
}

const saveFile = () => {
  // TODO: データを保存する処理を追加
}

const openFile = () => {
  // TODO: データを読み込む処理を追加
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
