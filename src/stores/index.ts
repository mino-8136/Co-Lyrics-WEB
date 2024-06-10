import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    objects: [] as any[] // オブジェクトの状態を管理
  }),
  actions: {
    addObject(object: any) {
      this.objects.push(object)
    },
    removeObject(index: number) {
      this.objects.splice(index, 1)
    }
  }
})

export const useStore = defineStore('main', {
  state: () => ({
    objects: [],
    selectedObjectId: null
  }),
  actions: {
    applyEffect(objectId, effect) {
      const object = this.objects.find((o) => o.id === objectId)
      if (object) {
        object.effects.push(effect)
      }
    }
  }
})