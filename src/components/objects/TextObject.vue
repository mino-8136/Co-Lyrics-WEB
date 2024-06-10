<template>
  <div class="text-object">
    {{ objectData.text }}
  </div>
</template>

<script setup lang="ts">
import BaseObject from './BaseObject.vue';

const objectData = defineProps(['objectData']);
</script>
