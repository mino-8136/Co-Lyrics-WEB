<template>
  <v-card>
    <v-card-title>Timeline</v-card-title>
    <v-card-text>
      <v-virtual-scroll :items="layers" height="200" item-height="40">
        <template v-slot="{ item, index }">
          <v-sheet
            :key="index"
            class="pa-2 grid-line"
            outlined
            tile
            @contextmenu.prevent="openMenu($event, index)"
          >
            Layer {{ index + 1 }}: {{ item.name }}
            <div class="objects-container">
              <base-object
                v-for="object in objectStore.objects.filter((o) => o.layer === index)"
                :key="object.id"
                :object="object"
              ></base-object>
            </div>
          </v-sheet>
        </template>
      </v-virtual-scroll>
    </v-card-text>
  </v-card>

  <v-menu class="menu" v-model="menu" :position-x="menuX" :position-y="menuY" absolute offset-y>
    <v-list>
      <v-list-item @click="addObject(currentLayerIndex)">
        <v-list-item-title>オブジェクトを追加</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseObject from './objects/BaseObject.vue'
import { useObjectStore } from '@/stores/objectStore'

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
    name: 'Layer',
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
    selected:false
  })
  menu.value = false
}
</script>

<style scoped>
.objects-container {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}

.menu {
  position: absolute;
}

.grid-line {
  background-image: linear-gradient(90deg, #ccc 1px, transparent 1px);
  background-size: 10px 10px;
}
</style>
