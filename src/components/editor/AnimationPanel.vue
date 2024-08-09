<template>
  <v-card>
    <v-card-title> テキストエフェクトを選択 </v-card-title>
    <v-row>
      <v-col v-for="effect in effects" :key="effect.id" class="d-flex" cols="4">
        <v-container>
          <v-img :width="200" aspect-ratio="1" class="bg-grey-lighten-2" cover>
          </v-img>
          <v-btn >
            {{ effect.name }}
          </v-btn>
        </v-container>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import { gsap } from 'gsap'

// 仮のイージングリスト
const effects = ref([
  { id: 0, name: 'none' },
  { id: 1, name: 'power1.in' },
  { id: 2, name: 'power1.out' },
  { id: 3, name: 'power1.inOut' }
])

// 受け取ったパラメータの種類
const props = defineProps({
  getParameter: Object
})
const emits = defineEmits({
  addAnimation: String
})
</script>
