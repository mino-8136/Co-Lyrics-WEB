<template>
  <v-dialog class="EasingPanel" v-model="showPanel">
    <v-card>
      <v-container class="pt-4 pb-0">
        <v-tabs v-model="selectedTag" align-tabs="center">
          <v-tab value="all"> all </v-tab>
          <v-tab v-for="(tag, index) in tagList" :key="index" :value="tag">
            {{ tag }}
          </v-tab>
        </v-tabs>
      </v-container>

      <v-card-text>
        <v-tabs-window v-model="selectedTag">
          <v-row>
            <v-col
              v-for="(easing, index) in filteredEasingList"
              :key="index"
              class="d-flex"
              cols="12"
              sm="4"
              lg="2"
            >
              <v-container class="items">
                <svg
                  :id="'svg-' + easing"
                  class="bg-grey-lighten-2"
                  :width="width + 'px'"
                  :height="height + 'px'"
                  :class="{ selected: isEasingAlreadySelected(easing.name) }"
                >
                  <rect x="0" y="0" width="100%" height="100%" fill="none" stroke="#ccc" />
                  <path :d="drawPath(easing.name)" fill="none" stroke="#ff0000" stroke-width="2" />
                </svg>
                <v-btn
                  block
                  @click="handleButtonClick(easing.name)"
                  :disabled="isEasingAlreadySelected(easing.name)"
                >
                  {{ easing.name }}
                </v-btn>
              </v-container>
            </v-col>
          </v-row>
        </v-tabs-window>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { type KeyframeSetting } from '@/components/parameters/keyframeInfo'
import gsap from 'gsap'

const showPanel = defineModel<boolean>('show', { required: true })
const easing = defineModel<KeyframeSetting>('easing', { required: true })

const width = 100
const height = 120

const selectedTag = ref('all')
const tagList = ['加速', '減速', '加減速']
const easingList = [
  { name: 'linear', tag: ['加速', '減速', '加減速'] },
  { name: 'sine.in', tag: ['加速'] },
  { name: 'sine.out', tag: ['減速'] },
  { name: 'sine.inOut', tag: ['加減速'] },
  // { name: 'power1.in', tag: ['加速'] },
  // { name: 'power1.out', tag: ['減速'] },
  // { name: 'power1.inOut', tag: ['加減速'] },
  // { name: 'power2.in', tag: ['加速'] },
  // { name: 'power2.out', tag: ['減速'] },
  // { name: 'power2.inOut', tag: ['加減速'] },
  // { name: 'power3.in', tag: ['加速'] },
  // { name: 'power3.out', tag: ['減速'] },
  // { name: 'power3.inOut', tag: ['加減速'] },
  // { name: 'power4.in', tag: ['加速'] },
  // { name: 'power4.out', tag: ['減速'] },
  // { name: 'power4.inOut', tag: ['加減速'] },
  { name: 'circ.in', tag: ['加速'] },
  { name: 'circ.out', tag: ['減速'] },
  { name: 'circ.inOut', tag: ['加減速'] },
  { name: 'expo.in', tag: ['加速'] },
  { name: 'expo.out', tag: ['減速'] },
  { name: 'expo.inOut', tag: ['加減速'] },
  { name: 'back.in', tag: ['加速'] },
  { name: 'back.out', tag: ['減速'] },
  { name: 'back.inOut', tag: ['加減速'] },
  // { name: 'elastic.in', tag: ['加速'] },
  // { name: 'elastic.out', tag: ['減速'] },
  // { name: 'elastic.inOut', tag: ['加減速'] },
  { name: 'bounce.in', tag: ['加速'] },
  { name: 'bounce.out', tag: ['減速'] },
  { name: 'bounce.inOut', tag: ['加減速'] }
]
const filteredEasingList = computed(() => {
  if (selectedTag.value === 'all' || selectedTag.value === '') {
    return easingList
  }
  return easingList.filter((easing) => easing.tag?.includes(selectedTag.value))
})

//////////////////////////////////////////////////

const handleButtonClick = (name: string) => {
  easing.value.easeType = name
  showPanel.value = false
}

function isEasingAlreadySelected(easingName: string): boolean {
  if (
    easingName == 'linear' &&
    (easing.value.easeType === undefined ||
      easing.value.easeType === 'none' ||
      easing.value.easeType === '')
  )
    return true
  return easing.value.easeType == easingName ?? false
}

const drawPath = (easingName: string) => {
  const points = 100
  let path = `M 0 ${height - height * 0.1}`
  for (let i = 0; i <= points; i++) {
    const progress = i / points
    const value = gsap.parseEase(easingName)(progress)
    const x = (i / points) * width
    const y = height * 0.1 + (1 - value) * (height - height * 0.2)
    path += ` L ${x.toFixed(2)} ${y.toFixed(2)}`
  }
  return path
}
</script>

<style scoped>
.EasingPanel {
  margin: auto;
  width: 60%;
  min-width: 400px;
  height: 60%;
}

v-tabs-window {
  overflow-y: auto;
}

.selected {
  box-shadow: inset 0 0 0 2px #09b7f6;
}

.items {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
