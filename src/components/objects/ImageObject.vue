<template>
  <div class="image-object" @mousedown="startDragging">
    <img :src="objectData.url" alt="Image Object"/>
  </div>
</template>

<script setup lang="ts">
import BaseObject from './BaseObject.vue';


</script>

<style scoped>
.image-object img {
  width: 100%;
  height: auto;
  display: block;
}
</style>
