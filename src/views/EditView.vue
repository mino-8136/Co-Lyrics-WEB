<template>
  <menu-panel />
  <v-row>
    <v-col>
      <preview-panel />
    </v-col>
    <v-col>
      <setting-panel />
    </v-col>
  </v-row>
  <timeline-panel />
</template>

<script setup lang="ts">
import PreviewPanel from '../components/editor/PreviewPanel.vue'
import TimelinePanel from '../components/editor/TimelinePanel.vue'
import SettingPanel from '../components/editor/SettingPanel.vue'
import MenuPanel from '../components/editor/MenuPanel.vue'
</script>
