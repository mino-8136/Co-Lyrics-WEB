<template>
  <v-card>
    <v-card-title> {{ props.getParam.label }}の移動タイプを選択 </v-card-title>
    <v-row>
      <v-col v-for="effect in effects" :key="effect.id" class="d-flex" cols="2">
        <v-container>
          <v-img :width="200" aspect-ratio="1" class="bg-grey-lighten-2" cover> </v-img>
          <v-btn @click="emits('callAddEasing', effect.name), (panel = false)">
            {{ effect.name }}
          </v-btn>
        </v-container>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineModel } from 'vue'

// 受け取ったパラメータの種類
const props = defineProps({
  getParam: Object
})
const emits = defineEmits({
  callAddEasing: String
})

const panel = defineModel('panel')

// 仮のイージングリスト
const effects = ref([
  { id: 1, name: 'none' },
  { id: 2, name: 'power1.in' },
  { id: 3, name: 'power1.out' },
  { id: 4, name: 'power1.inOut' },
  { id: 5, name: 'power2.in' },
  { id: 6, name: 'power2.out' },
  { id: 7, name: 'power2.inOut' },
  { id: 8, name: 'power3.in' },
  { id: 9, name: 'power3.out' },
  { id: 10, name: 'power3.inOut' },
  { id: 11, name: 'power4.in' },
  { id: 12, name: 'power4.out' },
  { id: 13, name: 'power4.inOut' },
  { id: 14, name: 'back.in' },
  { id: 15, name: 'back.out' },
  { id: 16, name: 'back.inOut' },
  { id: 17, name: 'elastic.in' },
  { id: 18, name: 'elastic.out' },
  { id: 19, name: 'elastic.inOut' },
  { id: 20, name: 'bounce.in' },
  { id: 21, name: 'bounce.out' },
  { id: 22, name: 'bounce.inOut' },
  { id: 23, name: 'circ.in' },
  { id: 24, name: 'circ.out' },
  { id: 25, name: 'circ.inOut' },
  { id: 26, name: 'expo.in' },
  { id: 27, name: 'expo.out' },
  { id: 28, name: 'expo.inOut' },
  { id: 29, name: 'sine.in' },
  { id: 30, name: 'sine.out' },
  { id: 31, name: 'sine.inOut' }
])
</script>
