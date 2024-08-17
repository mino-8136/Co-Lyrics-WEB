<template>
  <menu-panel />
  <div class="d-flex">
    <preview-panel />
    <setting-panel />
  </div>
  <timeline-panel />
</template>

<script setup lang="ts">
import PreviewPanel from '@/components/editor/PreviewPanel.vue'
import TimelinePanel from '@/components/editor/TimelinePanel.vue'
import SettingPanel from '@/components/editor/SettingPanel.vue'
import MenuPanel from '@/components/editor/MenuPanel.vue'
</script>
