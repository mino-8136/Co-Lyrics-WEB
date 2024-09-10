<template>
  <v-row align="center" class="pt-2 mb-3">
    <template v-for="(param, label) in parameters" :key="label">
      <!-- パラメータ名とDOMの幅を動的に設定 -->
      <v-col
        :cols="getColSpan((parameters.constructor as typeof PropertyMethod).getUIType(label))"
        v-if="(parameters.constructor as typeof PropertyMethod).getUIType(label) != UIType.none"
        style="border: 0.1px #ccc solid"
      >
        <v-row align="center" style="min-height: 50px">
          <!-- パラメータ名の表示 -->
          <v-chip
            v-if="
              (parameters.constructor as typeof PropertyMethod).getUIType(label) == UIType.keyframe
            "
            class="parameter-name"
            variant="outlined"
            size="small"
            @click="
              (param as KeyframeSettings).isGraphOpen = !(param as KeyframeSettings).isGraphOpen
            "
            >{{ (parameters.constructor as typeof PropertyMethod).getParameterName(label) }}
          </v-chip>
          <v-chip v-else class="parameter-name" variant="outlined" size="small">{{
            (parameters.constructor as typeof PropertyMethod).getParameterName(label)
          }}</v-chip>

          <!-- キーフレーム対応の場合 -->
          <v-col
            v-if="
              (parameters.constructor as typeof PropertyMethod).getUIType(label) == UIType.keyframe
            "
          >
            <KeyframeParameter
              v-model="parameters[label]"
              :min="(parameters.constructor as typeof PropertyMethod).getMinValue(label)"
              :max="(parameters.constructor as typeof PropertyMethod).getMaxValue(label)"
            >
            </KeyframeParameter>
          </v-col>

          <!-- 数値型パラメータの場合 -->
          <v-col
            v-if="
              (parameters.constructor as typeof PropertyMethod).getUIType(label) == UIType.slider
            "
          >
            <SliderParameter
              v-model="parameters[label]"
              :min="(parameters.constructor as typeof PropertyMethod).getMinValue(label)"
              :max="(parameters.constructor as typeof PropertyMethod).getMaxValue(label)"
            />
          </v-col>

          <!-- テキスト型パラメータの場合 -->
          <v-col
            class="pb-0"
            v-if="(parameters.constructor as typeof PropertyMethod).getUIType(label) == UIType.text"
          >
            <TextParameter v-model="parameters[label]" class="w-100" />
          </v-col>

          <!-- セレクト型パラメータの場合 -->
          <v-col
            class="py-0"
            v-if="
              (parameters.constructor as typeof PropertyMethod).getUIType(label) === UIType.select
            "
          >
            <SelectParameter v-model="parameters[label]" :param="label" class="w-100" />
          </v-col>

          <!-- カラー型パラメータの場合 -->
          <v-col
            class="py-0"
            v-if="
              (parameters.constructor as typeof PropertyMethod).getUIType(label) === UIType.color
            "
          >
            <ColorParameter v-model="parameters[label]"></ColorParameter>
          </v-col>

          <!-- チェックボックス型パラメータの場合 -->
          <v-col
            class="py-0"
            v-if="
              (parameters.constructor as typeof PropertyMethod).getUIType(label) === UIType.checkbox
            "
          >
            <CheckboxParameter v-model="parameters[label]"></CheckboxParameter>
          </v-col>
        </v-row>
      </v-col>
    </template>
  </v-row>
</template>

<script setup lang="ts">
import {
  StandardRenderSettings,
  type KeyframeSettings,
  TextSettings,
  PropertyMethod
} from '@/components/parameters/objectInfo'
import { UIType } from '@/components/parameters/uiInfo'

import KeyframeParameter from './dom/KeyframeParameter.vue'
import SliderParameter from './dom/SliderParameter.vue'
import TextParameter from './dom/TextParameter.vue'
import SelectParameter from './dom/SelectParameter.vue'
import ColorParameter from './dom/ColorParameter.vue'
import CheckboxParameter from './dom/CheckboxParameter.vue'

const parameters = defineModel<StandardRenderSettings | TextSettings>('params', { required: true })

function getColSpan(uiType: UIType) {
  if (uiType === UIType.keyframe) {
    return 12
  } else if (uiType === UIType.color || uiType === UIType.checkbox || uiType === UIType.select) {
    return 6
  }
  return 12 // デフォルトはフル幅
}
</script>

<style scoped>
.parameter-name {
  width: 80px;
  font-weight: bold;
  margin-left: 20px;
  justify-content: center;
  text-align: center;
}
</style>
