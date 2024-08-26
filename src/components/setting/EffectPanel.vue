<template>
  <v-dialog v-model="showPanel" class="EffectPanel">
    <v-card>
      <v-card-title> {{ props.type }} エフェクトを選択 </v-card-title>
      <v-row>
        <v-col v-for="(effect, index) in effectList" :key="index" class="d-flex" cols="3">
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
import { computed } from 'vue'
import { type StyleSettings, type AnimationSettings } from '../parameters/objectInfo'
import { generateUniqueId } from '@/components/utils/common'
import { animationList } from '@/assets/effects/animation'
import { styleList } from '@/assets/effects/style'

const showPanel = defineModel<boolean>('show', { required: true })
const effects = defineModel<StyleSettings | AnimationSettings>('effects', { required: true })
const props = defineProps<{
  type: String // 'animation' or 'style'
}>()

const effectList = computed(() => {
  return props.type == 'animation' ? animationList : styleList
})

function handleButtonClick(effectName: string, parameters: Record<string, any>) {
  const deepCopiedParameters = JSON.parse(JSON.stringify(parameters))
  effects.value.push({
    name: effectName,
    parameters: deepCopiedParameters,
    id: generateUniqueId()
  })
  showPanel.value = false
}
</script>

<style scoped>
.EffectPanel {
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
