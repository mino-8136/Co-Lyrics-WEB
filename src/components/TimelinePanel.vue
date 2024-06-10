<template>
  <div class="timeline-panel">
    <div v-for="(layer, index) in layers" :key="index" class="layer">
      <draggable
        class="draggable-area"
        v-model="layer.objects"
        group="objects"
        @change="updateObjectPosition">
        <div
          v-for="object in layer.objects"
          :key="object.id"
          :is="getObjectComponent(object.type)"
          :object-data="object"/>
      </draggable>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Draggable from 'vuedraggable';
import TextObject from './objects/TextObject.vue';
import ImageObject from './objects/ImageObject.vue';

export default defineComponent({
  name: 'TimelinePanel',
  components: { Draggable, TextObject, ImageObject },
  setup() {
    const layers = ref([
      { id: 1, objects: [] }
    ]);

    const getObjectComponent = (type) => {
      if (type === 'text') return TextObject;
      if (type === 'image') return ImageObject;
    };

    const updateObjectPosition = () => {
      // オブジェクトの位置更新
    };

    return { layers, getObjectComponent, updateObjectPosition };
  }
});
</script>
