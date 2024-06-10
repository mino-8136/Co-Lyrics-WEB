<template>
  <v-dialog v-model="showEffects" max-width="500px">
    <v-card>
      <v-card-title>
        テキストエフェクトを選択
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col
              v-for="effect in effects"
              :key="effect.id"
              cols="4"
              @click="applyEffect(effect)">
              <v-btn block>
                {{ effect.name }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" text @click="close">閉じる</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from '@/store';

export default defineComponent({
  name: 'EffectPanel',
  setup() {
    const showEffects = ref(false);
    const store = useStore();
    const effects = ref([
      { id: 1, name: 'フェードイン' },
      { id: 2, name: 'ズーム' },
      { id: 3, name: '回転' }
    ]);

    function applyEffect(effect) {
      store.applyEffect(store.selectedObjectId, effect);
      showEffects.value = false;
    }

    function close() {
      showEffects.value = false;
    }

    return { showEffects, effects, applyEffect, close };
  }
});
</script>
