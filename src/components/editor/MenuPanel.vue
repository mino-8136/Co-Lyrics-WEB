<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn color="primary" v-bind="props" density="comfortable"> ファイル </v-btn>
    </template>

    <v-list>
      <v-list-item @click="openFile">
        <v-list-item-title>ファイルを開く</v-list-item-title>
      </v-list-item>
      <v-list-item @click="saveFile">
        <v-list-item-title>ファイルを保存</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
const saveFile = () => {
  // TODO: データを保存する処理を追加
}

const openFile = () => {
  // TODO: データを読み込む処理を追加
}
</script>
