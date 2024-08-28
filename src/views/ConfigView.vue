<template>
  <v-card class="ma-4">
    <v-card-title>タイムライン設定</v-card-title>
    <v-card-actions>
      <v-col>
        <v-checkbox label="キーフレーム表示を相対表示にする"></v-checkbox>
        <v-checkbox label="デフォルトのフォント選択"></v-checkbox>
        <v-checkbox label="デフォルトのテキスト設定"></v-checkbox>
        <v-checkbox label="デフォルトのオブジェクトフレーム数"></v-checkbox>
      </v-col>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { useTimelineStore } from '@/stores/objectStore'
const timelineStore = useTimelineStore()
</script>
