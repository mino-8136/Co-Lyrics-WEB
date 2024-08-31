<template>
  <menu-panel />
  <div class="d-flex">
    <preview-panel />
    <setting-panel />
  </div>
  <timeline-panel />

  <v-card class="mt-16 ma-8 pa-4 elevation-8" color="lime-lighten-4">
    <v-card-title>操作説明</v-card-title>
    <v-row>
      <v-col cols="6">
        <v-card rounded="xl">
          <template v-slot:prepend>
            <v-icon icon="mdi-television" class="mr-1"></v-icon>
          </template>
          <template v-slot:title> プレビュー画面 </template>
          <template v-slot:subtitle> 追加したオブジェクトが表示されます </template>
          <v-card-text>
            <v-list>
              <v-list-item> [ファイル]から保存・読み込みができます。 </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card rounded="xl">
          <template v-slot:prepend>
            <v-icon icon="mdi-cog" class="mr-1"></v-icon>
          </template>
          <template v-slot:title> 設定画面 </template>
          <template v-slot:subtitle> 選択したオブジェクトの設定を変更できます。</template>
          <v-card-text>
            <v-list>
              <v-list-item>各行に表示される2つの数値は、フレーム数と値を表しています。</v-list-item>
              <v-list-item
                ><v-icon>mdi-plus</v-icon
                >と<v-icon>mdi-delete</v-icon>を押すと、各パラメータのキーフレームを追加/削除できます。</v-list-item
              >
              <v-list-item
                >項目名の横の●をクリックすると、キーフレームの移動方法が設定できます。</v-list-item
              >
              <v-list-item
                ><v-icon>mdi-plus</v-icon
                >のある項目名(X,Yなど)をクリックすると、キーフレームのグラフの表示に切り替えられます。</v-list-item
              >
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card rounded="xl">
          <template v-slot:prepend>
            <v-icon icon="mdi-clock" class="mr-1"></v-icon>
          </template>
          <template v-slot:title> タイムライン </template>
          <template v-slot:subtitle> オブジェクトの操作ができます </template>
          <v-card-text>
            <v-list>
              <v-list-item
                >左上の<v-icon>mdi-play</v-icon>を押すと、再生/停止ができます。</v-list-item
              >
              <v-list-item>右上のスライダで表示する時間幅を変更できます。</v-list-item>
              <v-list-item
                >音声波形<v-icon>mdi-waveform</v-icon>をドラッグすると、再生位置を調整できます。</v-list-item
              >
              <v-list-item
                >タイムライン上で右クリックすると、オブジェクトを追加できます。下のレイヤーほど手前に表示されます。</v-list-item
              >
              <v-list-item
                >オブジェクトの左右の端をドラッグすると、オブジェクトの表示時間を変更できます。</v-list-item
              >
              <v-list-item
                >オブジェクトを上下にドラッグすると、表示するレイヤーを変更できます。</v-list-item
              >
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
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
