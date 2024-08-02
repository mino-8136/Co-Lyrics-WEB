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
import { ref } from 'vue'
import { gsap } from 'gsap'

// 仮のエフェクトリスト
const effects = ref([
  { id: 1, name: 'フェードイン' },
  { id: 2, name: 'ズーム' },
  { id: 3, name: '回転' }
])

// 受け取ったパラメータの種類
const props = defineProps({
  getParameter : Object
})
const emits = defineEmits({
  addAnimation: String
})

// パラメータにGSAPを付与する関数
function addTween(param: any){
  gsap.fromTo(param,{
    value: 0
  },{
    value: 100,
    duration: 1,
    ease: "power4.out"
  }
  )
}
</script>
