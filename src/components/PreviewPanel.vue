<template>
  <v-container class="preview-panel">
    <v-btn color="primary" @click="saveData">保存</v-btn>
    <v-btn color="secondary" @click="loadData">読み込み</v-btn>
    <div class="preview-area">
      <div
        v-for="object in objects"
        :key="object.id"
        :style="getStyle(object)"
        class="preview-object"
      >
        <component :is="getObjectComponent(object.type)" :object-data="object" />
      </div>
    </div>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from '@/stores/index.ts'
import TextObject from './objects/TextObject.vue'
import ImageObject from './objects/ImageObject.vue'

export default defineComponent({
  name: 'PreviewPanel',
  components: { TextObject, ImageObject },
  setup() {
    const store = useStore()

    const objects = computed(() => store.objects)

    const getObjectComponent = (type) => {
      if (type === 'text') return TextObject
      if (type === 'image') return ImageObject
    }

    const getStyle = (object) => {
      return {
        position: 'absolute',
        top: `${object.position.y}px`,
        left: `${object.position.x}px`,
        zIndex: object.layer
      }
    }

    const saveData = () => {
      localStorage.setItem('savedObjects', JSON.stringify(store.objects))
      alert('データを保存しました')
    }

    const loadData = () => {
      const savedObjects = localStorage.getItem('savedObjects')
      if (savedObjects) {
        store.objects = JSON.parse(savedObjects)
        alert('データを読み込みました')
      } else {
        alert('保存されたデータがありません')
      }
    }

    return { objects, getObjectComponent, getStyle, saveData, loadData }
  }
})
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
