<template>
  <v-dialog v-model="showPanel" class="EffectPanel">
    <v-card>
      <v-card-subtitle class="text-center pt-2"> {{ props.type }}</v-card-subtitle>
      <v-tabs v-model="selectedTag" align-tabs="center">
        <v-tab value="all"> all </v-tab>
        <v-tab v-for="(tag, index) in tagList" :key="index" :value="tag">
          {{ tag }}
        </v-tab>
      </v-tabs>

      <v-tabs-window v-model="selectedTag">
        <v-row>
          <v-col v-for="(effect, index) in filteredEffectList" :key="index" class="d-flex" cols="3">
            <v-container class="items">
              <v-img
                :width="200"
                aspect-ratio="1"
                class="bg-pink-lighten-4 effect-image"
                :class="imageColor(effect.tag)"
              >
                <p v-for="(tag, index) in effect.tag" :key="index">
                  {{ tag }}
                </p>
              </v-img>
              <v-btn
                @click="handleButtonClick(effect.name, effect.params)"
                :disabled="isEffectAlreadySelected(effect.name)"
              >
                {{ effect.name }}
              </v-btn>
            </v-container>
          </v-col>
        </v-row>
      </v-tabs-window>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { type StyleSettings, type AnimationSettings } from '../parameters/objectInfo'
import { generateUniqueId } from '@/components/utils/common'
import { animationList } from '@/assets/effects/animation'
import { styleList } from '@/assets/effects/style'

const showPanel = defineModel<boolean>('show', { required: true })
const effects = defineModel<StyleSettings | AnimationSettings>('effects', { required: true })
const props = defineProps<{
  type: String // 'animation' or 'style'
}>()

const selectedTag = ref('all')

const effectList = computed(() => {
  return props.type == 'animation' ? animationList : styleList
})

const tagList = computed(() => {
  const tags = [...new Set(effectList.value.flatMap((effect) => effect.tag).filter((tag) => tag))]
  //console.log(tags)
  return tags // 重複を削除して返却
})

// allの場合はすべてを表示する、それ以外の場合はタグに一致するものだけを表示する
const filteredEffectList = computed(() => {
  if (selectedTag.value === 'all' || selectedTag.value === '') {
    return effectList.value
  }
  return effectList.value.filter((effect) => effect.tag?.includes(selectedTag.value))
})

/////////////////////////////////////////////////////////

function imageColor(tags: string | string[] | undefined): string {
  const colors = [
    'bg-pink-lighten-4',
    'bg-indigo-lighten-4',
    'bg-green-lighten-4',
    'bg-orange-lighten-4'
  ]
  const firstTag = tagList.value.findIndex((tag) => tags?.includes(tag ?? ''))
  return colors[firstTag % colors.length]
}

/////////////////////////////////////////////////////////

function handleButtonClick(effectName: string, parameters: Record<string, any>) {
  const deepCopiedParameters = JSON.parse(JSON.stringify(parameters))
  effects.value.effects.push({
    name: effectName,
    parameters: deepCopiedParameters,
    id: generateUniqueId()
  })
  showPanel.value = false
}

function isEffectAlreadySelected(effectName: string): boolean {
  if (props.type === 'style') {
    return effects.value.effects.some((effect) => effect.name === effectName)
  }
  return false
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

.effect-image {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  text-transform: uppercase;
  font-size: 0.8rem;
}

.items {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
