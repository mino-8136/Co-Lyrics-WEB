<template>
  <div>
    <v-menu v-model="easingMenu" :close-on-content-click="false">
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" width="110px" class="border">
          {{ parameter }}
        </v-btn>
      </template>
      <EasingPanel v-model:show="easingMenu" v-model:easing="parameter" />
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EasingPanel from '@/components/setting/EasingPanel.vue'

// easeTypeを受け取る
const parameter = defineModel({ type: String, required: true, default: 'linear' })
const easingMenu = ref(false)
</script>
