<template>
  <v-container class="timeline-panel">
    <h3>Timeline</h3>

    <v-virtual-scroll :items="layers" height="200" item-height="40">
      <template v-slot="{ item, index }">
        <div class="layer">
          <div class="layerIndex">{{ item.name }} {{ index }}</div>
          <div class="layerTimeline" @contextmenu.prevent="openMenu($event, index)">
            <base-object
              v-for="object in objectStore.objects.filter((obj) => obj.layer === index)"
              :key="object.id"
              :object="object"
            ></base-object>
          </div>
        </div>
      </template>
    </v-virtual-scroll>
  </v-container>

  <v-menu v-model="menu" :offset-x="true" :offset-y="true" :position-x="menuX" :position-y="menuY">
    <v-list>
      <v-list-item @click="addObject(currentLayerIndex)">
        <v-list-item-title>オブジェクトを追加</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useObjectStore } from '@/stores/objectStore'
import BaseObject from '../objects/BaseObject.vue'

// メニューの表示制御
const menu = ref(false)
const menuX = ref(0)
const menuY = ref(0)
const currentLayerIndex = ref(0)
const openMenu = (event: any, index: number) => {
  menuX.value = event.clientX
  menuY.value = event.clientY
  currentLayerIndex.value = index
  menu.value = true
}

// TODO : 各レイヤーで保持する情報は今後Storeで管理する
const layers = ref(
  Array.from({ length: 10 }, () => ({
    name: 'Layer'
  }))
)

// オブジェクト情報の管理
const objectStore = useObjectStore()
const addObject = (layerIndex: number) => {
  objectStore.addObject({
    id: objectStore.counter,
    start: 0,
    end: 100,
    layer: layerIndex,
    selected: false
  })
  menu.value = false
}
</script>

<style scoped>
.timeline-panel {
  padding: 10px;
  border: 1px solid #ccc;
}

.layer {
  display: flex;
}

.layerIndex {
  border: 1px solid black;
  width: 80px;
  padding: 8px;
}

.layerTimeline {
  border: 1px solid black;
  background: linear-gradient(90deg, #ccc 1px, transparent 1px);
  background-size: 10px;
  width: 90%;
  padding: 8px;
}
</style>
