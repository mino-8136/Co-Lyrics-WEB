<template>
  <v-dialog v-model="showEffects" max-width="500px">
    <v-card>
      <v-card-title> テキストエフェクトを選択 </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col v-for="effect in effects" :key="effect.id" cols="4" >
              <v-btn block>
                {{ effect.name }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="close">閉じる</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showEffects = ref(false)
const effects = ref([
  { id: 1, name: 'フェードイン' },
  { id: 2, name: 'ズーム' },
  { id: 3, name: '回転' }
])

function close() {
  showEffects.value = false
}
</script>
