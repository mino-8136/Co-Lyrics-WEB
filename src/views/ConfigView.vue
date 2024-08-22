<template>
  <v-card class="ma-4">
    <v-card-title>タイムライン設定</v-card-title>
    <v-card-actions>
      <v-checkbox label="キーフレーム表示を相対表示にする"></v-checkbox>
    </v-card-actions>

    <v-card-title>ゲームプレイ設定</v-card-title>
    <v-card-actions>
      <v-checkbox label="判定を調整する"></v-checkbox>
    </v-card-actions>
    <v-divider></v-divider>
    <v-card-text>
      このシステムは一般的な動画編集ソフトの使用感をベースに開発されている動画作成ソフトウェアとなっています。テキスト編集に特化した動画編集作業と、インタラクティブコンテンツ作成を連結する試みに挑戦しています。
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useTimelineStore } from '@/stores/objectStore'
const timelineStore = useTimelineStore()
</script>
