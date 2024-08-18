<template>
  <div class="text-center">
    <v-menu v-model="colorMenu" :close-on-content-click="false" location="end">
      <template v-slot:activator="{ props }">
        <v-btn :color="color" v-bind="props" width="100px"> {{ color }} </v-btn>
      </template>
      <v-color-picker v-model="color" :modes="['hexa']" flat />
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const colorMenu = ref(false)
const color = ref('#1976D2')
</script>
