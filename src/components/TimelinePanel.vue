<template>
  <div class="timeline-panel">
    <div v-for="(layer, index) in layers" :key="index" class="layer" >
        <div
          v-for="object in layer.objects"
          :key="object.id"
          :is="getObjectComponent(object.type)"
          :object-data="object"/>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TextObject from './objects/TextObject.vue';
import ImageObject from './objects/ImageObject.vue';

const layers = ref([
  { id: 1, objects: [] }
]);

const getObjectComponent = (type) => {
  if (type === 'text') return TextObject;
  if (type === 'image') return ImageObject;
};

</script>

<style scoped>
/* 必要に応じてスタイルを追加 */
</style>
