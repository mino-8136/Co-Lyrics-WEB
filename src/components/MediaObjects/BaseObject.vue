<template>
  <div class="base-object" :style="styleObject" @mousedown="startDragging">
    <!-- ハンドルとその他のUI要素 -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'BaseObject',
  props: {
    objectData: Object
  },
  setup(props) {
    const styleObject = ref({});

    const startDragging = (event: MouseEvent) => {
      // ドラッグ操作を開始
    };

    return { styleObject, startDragging };
  }
});
</script>

<style scoped>
.base-object {
  position: absolute;
}
</style>
