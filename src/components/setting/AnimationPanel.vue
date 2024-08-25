<template>
  <v-dialog v-model="showPanel" class="AnimationPanel">
    <v-card>
      <v-card-title> アニメーションエフェクトを選択 </v-card-title>
      <v-row>
        <v-col v-for="(effect, index) in effects" :key="index" class="d-flex" cols="3">
          <v-container class="items">
            <v-img :width="200" aspect-ratio="1" class="bg-pink-lighten-4" cover> </v-img>
            <v-btn @click="handleButtonClick(effect.name, effect.params)">
              {{ effect.name }}
            </v-btn>
          </v-container>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { type AnimationSettings } from '../parameters/objectInfo'
import { effects } from '@/assets/animations/animation'

const showPanel = defineModel<boolean>('show', { required: true })
const animations = defineModel<AnimationSettings>('animations', { required: true })

function handleButtonClick(effectName: string, parameters: Record<string, any>) {
  const deepCopiedParameters = JSON.parse(JSON.stringify(parameters))
  animations.value.push({
    anim_name: effectName,
    anim_parameters: deepCopiedParameters
  })
  showPanel.value = false
}
</script>

<style scoped>
.AnimationPanel {
  margin: auto;
  width: 60%;
  min-width: 400px;
  height: 60%;
  overflow-y: auto;
}

.items {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
