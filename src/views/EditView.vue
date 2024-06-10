<template>
  <v-container>
    <v-row>
      <v-col>
        <preview-panel :objects="objects" />
      </v-col>
      <v-col>
        <timeline-panel :objects="objects" @updateObjects="updateObjects" />
      </v-col>
      <v-col>
        <setting-panel :selectedObject="selectedObject" @updateObject="updateObject" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VContainer, VRow, VCol } from 'vuetify/components'
import PreviewPanel from '../components/PreviewPanel.vue'
import TimelinePanel from '../components/TimelinePanel.vue'
import SettingPanel from '../components/SettingPanel.vue'
import { MediaObject } from '../mediaObjects'

const objects = ref<MediaObject[]>([])
const selectedObject = ref<MediaObject | null>(null)

const updateObjects = (newObjects: MediaObject[]) => {
  objects.value = newObjects
}

const updateObject = (updatedObject: MediaObject) => {
  const index = objects.value.findIndex(obj => obj.id === updatedObject.id)
  if (index !== -1) {
    objects.value[index] = updatedObject
  }
}
</script>
