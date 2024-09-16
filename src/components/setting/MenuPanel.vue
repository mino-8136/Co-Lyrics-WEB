<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn color="secondary" v-bind="props" density="comfortable"> ファイル </v-btn>
    </template>

    <v-list>
      <v-list-item @click="saveFile('all')">
        <v-list-item-title><v-icon>mdi-download</v-icon> ファイルを保存</v-list-item-title>
      </v-list-item>
      <v-list-item
        @click="saveFile('selected')"
        :disabled="
          timelineStore.selectedObjectIds.length == 0 && timelineStore.selectedObjectId == -1
        "
      >
        <v-list-item-title> 複数選択中のオブジェクトのみを保存</v-list-item-title>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item @click="openFile('open')">
        <v-list-item-title><v-icon>mdi-file-outline</v-icon> 別のファイルを開く</v-list-item-title>
      </v-list-item>
      <v-list-item @click="openFile('add')">
        <v-list-item-title><v-icon>mdi-plus</v-icon> 別のファイルから追加</v-list-item-title>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item @click="deleteDialog = true">
        <v-list-item-title>オブジェクト全削除</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>

  <v-dialog v-model="deleteDialog" class="dialog">
    <v-card>
      <v-card-title>本当に削除しますか？</v-card-title>
      <v-card-actions>
        <v-btn variant="tonal" @click="deleteDialog = false">いいえ</v-btn>
        <v-btn variant="tonal" @click="clearObjects()"><v-icon>mdi-delete</v-icon>はい</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useObjectStore, useTimelineStore } from '@/stores/objectStore'
import { type RenderObject, createObjectFromJson } from '../parameters/objectInfo'
const objectStore = useObjectStore()
const timelineStore = useTimelineStore()
const deleteDialog = ref(false)

const saveFile = (state: string = 'all') => {
  // ストアのオブジェクトデータのみをJSONに変換

  // 保存するオブジェクトを選択
  let objects: RenderObject[] = []
  if (state === 'selected') {
    if (timelineStore.selectedObjectIds.length > 0) {
      objects = objectStore.objects.filter((obj) =>
        timelineStore.selectedObjectIds.includes(obj.id)
      )
    } else if (timelineStore.selectedObjectId !== -1) {
      objects = objectStore.objects.filter((obj) => obj.id === timelineStore.selectedObjectId)
    }
  } else {
    objects = objectStore.objects
  }

  // 楽曲名と現在の日時を使ってファイル名を生成
  const musicName = timelineStore.musicData.name || 'music' // 楽曲名が存在しない場合のデフォルト
  const now = new Date()
  const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}_${now
    .getHours()
    .toString()
    .padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}`
  const fileName = `${musicName}_${formattedDate}_${state}.json`

  // JSONファイルを作成
  let jsonData = JSON.stringify(objects)
  const blob = new Blob([jsonData], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName // ダウンロードするファイル名

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
        // 追加ファイルの場合、そのまま追加する(カウンタ更新はstoreで管理する)
        // console.log(objectStore.counter)
      }

      objData.forEach((obj: RenderObject) => {
        let newObj = createObjectFromJson(obj)
        objectStore.addNewObject(newObj) // カウンターも更新される
      })

      timelineStore.selectedObjectId = -1
      timelineStore.isRedrawNeeded = true
    }

    reader.readAsText(file)
  }
  // ファイル選択ダイアログを開く
  input.click()
}

const clearObjects = () => {
  objectStore.clearObjects()
  deleteDialog.value = false
  timelineStore.selectedObjectId = -1
  timelineStore.isRedrawNeeded = true
}
</script>

<style scoped>
.dialog {
  width: 300px;
}
</style>
