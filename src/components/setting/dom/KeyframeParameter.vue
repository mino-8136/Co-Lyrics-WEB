<template>
  <v-row>
    <!-- キーフレームビューの表示 -->
    <KeyframeGraph
      v-if="parameter.isGraphOpen"
      :start="selectedObject.start"
      :end="selectedObject.end"
      :panelWidth="getBoundingClientRect() * 0.7"
      v-model:keyframes="parameter.keyframes"
    />

    <transition-group v-else name="list" tag="div" style="width: 100%">
      <v-col v-for="(keyframe, idx) in parameter.keyframes" :key="keyframe.id" class="pt-1 pb-2">
        <v-slider
          v-model="keyframe.value"
          :min="prop.min"
          :max="prop.max"
          step="1"
          append-icon="mdi-plus"
          @click:append="parameter.addKeyframe(idx)"
          hide-details
        >
          <template v-slot:prepend>
            <!-- イージング設定 -->
            <div
              class="ease-setting"
              :style="{
                backgroundColor: keyframe.easeType ? '#09b7f6' : '#ccc'
              }"
              @click="openEasingDialog(keyframe)"
            ></div>

            <!-- キーフレームのフレーム数と値 -->
            <input
              type="number"
              class="parameter-value"
              style="margin-right: 2px; width: 50px"
              v-model.number="keyframe.frame"
              @change="parameter.sortKeyframes()"
            />
            <p>→</p>
            <input
              type="number"
              style="width: 60px"
              class="parameter-value"
              v-model.number="keyframe.value"
            />
          </template>
          <template v-slot:append>
            <v-icon v-if="idx > 0" @click="parameter.deleteKeyframe(idx)">mdi-delete</v-icon>
            <v-icon v-else></v-icon>
          </template>
        </v-slider>
      </v-col>
    </transition-group>
  </v-row>

  <!-- イージング設定の呼び出し -->
  <EasingPanel v-model:show="showEasingPanel" v-model:easing="currentKeyframe" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useObjectStore, useTimelineStore } from '@/stores/objectStore'
import { type KeyframeSetting, KeyframeSettings } from '@/components/parameters/objectInfo'

import KeyframeGraph from '@/components/setting/KeyframeGraph.vue'
import EasingPanel from '@/components/setting/EasingPanel.vue'

const objectStore = useObjectStore()
const timelineStore = useTimelineStore()

const parameter = defineModel<KeyframeSettings>({ type: KeyframeSettings, required: true })
const prop = defineProps(['min', 'max'])

// 選択されたオブジェクトの情報(setting panelと同じ)
const selectedObject: Record<string, any> = computed(() => {
  return objectStore.objects.find((obj) => obj.id === timelineStore.selectedObjectId)
})

// ウィンドウの幅を求める関数
// TODO: もう少しスマートにする
function getBoundingClientRect() {
  const parent = document.querySelector('.setting-panel')
  if (!parent) return 300
  return parent.getBoundingClientRect().width
}

//////////////////////////////
// イージング設定に関する記述 //
//////////////////////////////
const showEasingPanel = ref(false)
const currentKeyframe = ref<KeyframeSetting>({} as KeyframeSetting)
function openEasingDialog(keyframe: KeyframeSetting) {
  currentKeyframe.value = keyframe
  showEasingPanel.value = true
}
</script>

<style scoped>
div.ease-setting {
  width: 12px;
  height: 12px;
  border-radius: 100%;
  margin-right: 10px;
  background-color: #09b7f6;
}

.parameter-value {
  width: 40px;
  color: #555;
  text-align: right;
}

/* リストアニメーション */
.list-move,
/* 移動する要素にトランジションを適用 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}
</style>
