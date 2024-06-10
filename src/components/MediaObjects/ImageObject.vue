<template>
  <div class="image-object" @mousedown="startDragging">
    <img :src="objectData.url" alt="Image Object"/>
  </div>
</template>

<script lang="ts">
import BaseObject from './BaseObject.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ImageObject',
  extends: BaseObject,
  props: {
    objectData: {
      type: Object,
      required: true
    }
  },
  setup() {
    // ここで画像固有のロジックを追加できます
  }
});
</script>

<style scoped>
.image-object img {
  width: 100%;
  height: auto;
  display: block;
}
</style>
