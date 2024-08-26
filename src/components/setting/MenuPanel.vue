<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn color="secondary" v-bind="props" density="comfortable"> ファイル </v-btn>
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
import { useObjectStore, useTimelineStore } from '@/stores/objectStore'
const objectStore = useObjectStore()

const saveFile = () => {
  // ストアのデータをJSONに変換
  let jsonData = JSON.stringify(objectStore)
  const blob = new Blob([jsonData], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'data.json'  // ダウンロードするファイル名
  
  // リンクをクリックしてダウンロードをトリガー
  document.body.appendChild(a)
  a.click()
  
  // リンクを削除
  document.body.removeChild(a)
  // メモリを解放
  URL.revokeObjectURL(url)
}
const openFile = () => {
  // TODO: jsonのデータを読み込む処理を追加
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'application/json'

  input.onchange = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = () => {
      const jsonData = reader.result as string
      const objData = JSON.parse(jsonData)
      
      // ストアにデータを反映させる処理

      objectStore.objects = objData.objects
      objectStore.counter = objData.counter
    }
    
    reader.readAsText(file)
  }
  // ファイル選択ダイアログを開く
  input.click()
}
</script>
