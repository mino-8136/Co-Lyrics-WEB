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
        <v-checkbox
          label="軽量化されたフォントのみを読み込む (ブラウザ上でキャッシュの削除をしてから選択してください)"
          v-model="configStore.isLoadSubsetFont"
        ></v-checkbox>

        <!--
          <v-text-field
          type="number"
          variant="outlined"
          density="compact"
          class="mb-8"
          hide-details
          single-line
          style="width: 400px"
          step="1"
          v-model.number="configStore.timelineLayerNumbers"
          @change="
          configStore.timelineLayerNumbers = clClamp(20, 50, configStore.timelineLayerNumbers)
          "
          >
          <template v-slot:append>タイムラインのレイヤー数(初期値:40)</template>
        </v-text-field>
        -->

        <v-text-field
          type="number"
          variant="outlined"
          density="compact"
          hide-details
          single-line
          style="width: 400px"
          step="10"
          v-model.number="configStore.upperSideHeight"
          @change="configStore.upperSideHeight = clClamp(100, 1000, configStore.upperSideHeight)"
        >
          <template v-slot:append>プレビューパネルの高さ(初期値:400)</template>
        </v-text-field>
      </v-col>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { useTimelineStore, useConfigStore } from '@/stores/objectStore'
import { clClamp } from '@/components/utils/common'
const timelineStore = useTimelineStore()
const configStore = useConfigStore()
</script>
