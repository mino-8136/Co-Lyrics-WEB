<template>
  <div>
    <v-menu v-model="colorMenu" :close-on-content-click="false" location="end">
      <template v-slot:activator="{ props }">
        <v-btn :color="parameter" v-bind="props" width="110px" class="border">
          {{ parameter }}
        </v-btn>
      </template>
      <v-color-picker v-model="parameter" :modes="[props.colorType]" flat />
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const parameter = defineModel({ type: String, required: true })
const props = defineProps({
  colorType: {
    type: String,
    default: 'hexa'
  }
})
const colorMenu = ref(false)
</script>
