<template>
  <v-dialog class="EasingPanel" v-model="showPanel">
    <v-card>
      <v-card-text>
        <v-row>
          <v-col
            v-for="effect in effects"
            :key="effect.id"
            class="d-flex"
            cols="12"
            sm="4"
            md="3"
            lg="2"
            xl="2"
          >
            <v-container class="items">
              <svg
                :id="'svg-' + effect.id"
                class="bg-grey-lighten-2"
                :width="width + 'px'"
                :height="height + 'px'"
              >
                <rect x="0" y="0" width="100%" height="100%" fill="none" stroke="#ccc" />
                <path :d="drawPath(effect.name)" fill="none" stroke="#ff0000" stroke-width="2" />
              </svg>
              <v-btn block @click="handleButtonClick(effect.name, effect.id)">
                {{ effect.name }}
              </v-btn>
            </v-container>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { type KeyframeSetting } from '@/components/objects/objectInfo'
import gsap from 'gsap'

const showPanel = defineModel<boolean>('show', { required: true })
const easing = defineModel<KeyframeSetting>('easing', { required: true })

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

const width = 100
const height = 120

const handleButtonClick = (name: string, id: number) => {
  easing.value.easeType = name
  showPanel.value = false
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
  overflow-y: auto;
}

v-card {
  width: 100%;
}

.items {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
