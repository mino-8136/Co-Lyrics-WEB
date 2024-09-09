<template>
  <v-slider v-model="parameter" :min="prop.min" :max="prop.max" step="1" hide-details class="pr-4">
    <template v-slot:prepend>
      <input type="number" class="parameter-value" v-model.number="parameter" />
    </template>
  </v-slider>
</template>

<script setup lang="ts">
const parameter = defineModel({ type: Number, required: true })
const prop = defineProps(['min', 'max'])
</script>

<style scoped>
.parameter-value {
  width: 60px;
  color: #555;
  text-align: right;
}
</style>
