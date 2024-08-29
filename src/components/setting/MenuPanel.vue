<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn color="secondary" v-bind="props" density="comfortable"> ファイル </v-btn>
    </template>

    <v-list>
      <v-list-item @click="saveFile()">
        <v-list-item-title><v-icon>mdi-download</v-icon> ファイルを保存</v-list-item-title>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item @click="openFile('open')">
        <v-list-item-title>別のファイルを開く</v-list-item-title>
      </v-list-item>
      <v-list-item @click="openFile('add')">
        <v-list-item-title>別のファイルから追加</v-list-item-title>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item @click="clearObjects()">
        <v-list-item-title>オブジェクト全削除</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { useObjectStore, useTimelineStore } from '@/stores/objectStore'
import {
  StandardRenderSettings,
  TextSettings,
  type RenderObject,
  createObject
} from '../parameters/objectInfo'
const objectStore = useObjectStore()
const timelineStore = useTimelineStore()

const saveFile = () => {
  // ストアのオブジェクトデータのみをJSONに変換
  let jsonData = JSON.stringify(objectStore.objects)
  const blob = new Blob([jsonData], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'data.json' // ダウンロードするファイル名

  // リンクをクリックしてダウンロードをトリガー
  document.body.appendChild(a)
  a.click()

  // リンクを削除
  document.body.removeChild(a)
  // メモリを解放
  URL.revokeObjectURL(url)
}

const openFile = (state: string) => {
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

      if (state === 'open') {
        // 新規に開く場合はオブジェクトを全削除
        objectStore.clearObjects()
      } else {
        // 最後のインデックスを取得してその次から追加する
        objectStore.counter = objectStore.findLastId + 1
        console.log(objectStore.counter)
      }

      objData.forEach((obj: RenderObject) => {
        let newObj = createObject(obj)

        if ('standardRenderSettings' in obj) {
          newObj.standardRenderSettings = new StandardRenderSettings(obj.standardRenderSettings)
        }
        if ('textSettings' in obj) {
          newObj.textSettings = new TextSettings(obj.textSettings)
        }
        if ('styleSettings' in obj) {
          newObj.styleSettings = obj.styleSettings
        }
        if ('animations' in obj) {
          newObj.animations = obj.animations
        }

        objectStore.addObject(newObj)
      })
      timelineStore.selectedObjectId = -1
    }

    reader.readAsText(file)
  }
  // ファイル選択ダイアログを開く
  input.click()
}

const clearObjects = () => {
  objectStore.clearObjects()
  timelineStore.selectedObjectId = -1
}
</script>
