<template>
  <select v-model="parameter">
    <option v-for="(element, index) in getOptionsList(prop.param)" :key="index">
      {{ element }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { fontListData } from '@/components/parameters/fonts'
import { ShapeType, TextAlign } from '@/components/parameters/p5Info'
import type { PropType } from 'vue'

const parameter = defineModel({ type: String, required: true })
const prop = defineProps({
  param: {
    type: [String, Array] as PropType<string | string[]>,
    required: true
  }
})

function getOptionsList(label: string | string[]): string[] {
  if (Array.isArray(label)) {
    return label
  } else if (label === 'font') {
    return fontListData.map((font) => font.displayName)
  } else if (label === 'shape') {
    return Object.values(ShapeType)
  } else if (label === 'align') {
    return Object.values(TextAlign)
  }
  return []
}
</script>

<style scoped>
select {
  padding: 4px 12px;
  border: 1px solid #000000;
  -webkit-appearance: menulist;
  appearance: button;
}
</style>
