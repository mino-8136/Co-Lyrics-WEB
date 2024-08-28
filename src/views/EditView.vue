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
import MenuPanel from '@/components/setting/MenuPanel.vue'
</script>

<style>
.preview-panel {
  height: 400px;
  position: relative;
  width: 100%;
  border: 1px solid #ccc;
}

.setting-panel {
  height: 400px;
  min-width: 300px;
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  overflow-y: hidden;
}

.timeline-panel {
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;
}
</style>
