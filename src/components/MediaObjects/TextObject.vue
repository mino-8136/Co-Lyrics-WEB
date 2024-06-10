<template>
  <div class="text-object">
    {{ objectData.text }}
  </div>
</template>

<script lang="ts">
import BaseObject from './BaseObject.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TextObject',
  extends: BaseObject,
  setup() {
    // テキスト固有のロジック
  }
});
</script>
