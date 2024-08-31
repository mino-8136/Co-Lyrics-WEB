<template>
  <v-card class="ma-4">
    <v-card-title>表示設定</v-card-title>
    <v-card-actions>
      <v-col>
        <!--
          <v-checkbox label="キーフレーム表示を相対表示にする"></v-checkbox>
          <v-checkbox label="デフォルトのフォント選択"></v-checkbox>
          <v-checkbox label="デフォルトのテキスト設定"></v-checkbox>
          <v-checkbox label="デフォルトのオブジェクトフレーム数"></v-checkbox>
          -->
        <v-checkbox
          label="動画編集画面でドラッグ可能領域を表示する"
          v-model="configStore.isShowCollisionBox"
          @change="timelineStore.isRedrawNeeded = true"
        ></v-checkbox>
        <v-checkbox
          label="オブジェクト上でキーフレームを表示する"
          v-model="configStore.isShowKeyframe"
        ></v-checkbox>
      </v-col>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { useTimelineStore, useConfigStore } from '@/stores/objectStore'
const timelineStore = useTimelineStore()
const configStore = useConfigStore()
</script>
