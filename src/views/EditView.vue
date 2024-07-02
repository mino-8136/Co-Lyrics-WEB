<template>
  <v-container>
    <v-row>
      <v-col>
        <preview-panel/>
      </v-col>
      <v-col>
        <setting-panel />
      </v-col>
    </v-row>
    <timeline-panel />
  </v-container>
</template>

<script setup lang="ts">
import PreviewPanel from '../components/PreviewPanel.vue'
import TimelinePanel from '../components/TimelinePanel.vue'
import SettingPanel from '../components/SettingPanel.vue'
</script>

