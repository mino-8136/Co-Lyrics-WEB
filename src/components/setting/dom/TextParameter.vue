<template>
  <textarea v-model="parameter" type="text"> </textarea>
</template>

<script setup lang="ts">
const parameter = defineModel({ type: String, required: true })
</script>

<style scoped>
textarea {
  width: 100%;
  height: 80px;
  padding: 4px 12px;
  box-sizing: border-box;
  border: 1px solid #ccc;
}
</style>
