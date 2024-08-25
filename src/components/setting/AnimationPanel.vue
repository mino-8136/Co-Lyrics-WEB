<template>
  <v-dialog v-model="showPanel">
    <v-card>
      <v-card-title> アニメーションエフェクトを選択 </v-card-title>
      <v-row>
        <v-col v-for="(effect, index) in effects" :key="index" class="d-flex" cols="4">
          <v-container>
            <v-img :width="200" aspect-ratio="1" class="bg-grey-lighten-2" cover> </v-img>
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
