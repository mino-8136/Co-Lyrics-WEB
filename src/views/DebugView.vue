<template>
  <div>
    <h3>アニメーション効果の制御</h3>
    <select v-model="selectedEffectName">
      <option disabled value="">エフェクトを選択してください</option>
      <option v-for="effect in effects" :key="effect.name" :value="effect.name">
        {{ effect.name }}
      </option>
    </select>
    <button @click="addEffect">エフェクトを追加</button>

    <div v-for="(effect, index) in selectedEffects" :key="index">
      <h4>{{ effect.name }}</h4>
      <div v-for="(param, key) in effect.parameters" :key="key">
        <label :for="'effect-' + index + '-' + key">{{ param.label }}</label>
        <input
          v-if="param.uiType === UIType.slider"
          type="range"
          :id="'effect-' + index + '-' + key"
          :min="param.min"
          :max="param.max"
          v-model.number="effect.params[key]"
        />
        <select v-else-if="param.uiType === UIType.select" v-model="effect.params[key]">
          <option v-for="option in param.options" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
        <input
          v-else-if="param.uiType === UIType.color"
          type="color"
          v-model="effect.params[key]"
        />
        <input
          v-else-if="param.uiType === UIType.checkbox"
          type="checkbox"
          v-model="effect.params[key]"
        />
        <input v-else-if="param.uiType === UIType.text" type="text" v-model="effect.params[key]" />
        <span>{{ effect.params[key] }}</span>
      </div>
    </div>
    <button @click="applyEffects">全効果を適用</button>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useTimelineStore } from '@/stores/objectStore'
import { UIType } from '@/components/parameters/parameterInfo'

const timelineStore = useTimelineStore()

const effects = [
  {
    name: '文字送り',
    params: reactive({ time: 30, span: 10, delay: 5 }),
    parameters: {
      time: { min: 1, max: 60, label: '時間', uiType: UIType.slider },
      span: { min: 1, max: 20, label: 'スパン', uiType: UIType.slider },
      delay: { min: 0, max: 30, label: '遅延', uiType: UIType.slider }
    },
    applyEffect: (object, params) => {
      let { time, span, delay } = params
      let progress = (timelineStore.currentFrame - object.start - object.id * span - delay) / time
      progress = Math.min(Math.max(progress, 0), 1) // 進捗は0と1の間に正規化

      if (progress > 0) {
        object.x += progress * 100 // X座標を progress * 100 だけ移動
      }
      return object
    }
  }
  // 他の効果定義...
]

const selectedEffectName = ref('')
const selectedEffects = ref([])

function addEffect() {
  const effectToAdd = effects.find(effect => effect.name === selectedEffectName.value);
  if (effectToAdd) {
    selectedEffects.value.push({
      ...effectToAdd,
      params: reactive({ ...effectToAdd.params })
    });
  }
}

const baseObject = ref({ x: 300, y: 300, start: 100, id: 1 })

function applyEffects() {
  let currentObject = { ...baseObject.value }
  selectedEffects.value.forEach((effect) => {
    currentObject = effect.applyEffect(currentObject, effect.params)
  })
  console.log('Updated Object with All Effects:', currentObject)
}
</script>
