<template>
  <v-checkbox-btn v-model="parameter" hide-details />
</template>

<script setup lang="ts">
const parameter = defineModel({ type: Boolean, required: true, default: false })
</script>
