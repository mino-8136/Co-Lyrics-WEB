import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('objects', () => {
  const objects = [] as any[] // オブジェクトの状態を管理

  function addObject(object: any) {
    objects.push(object)
  }
  function removeObject(index: number) {
    objects.splice(index, 1)
  }

  return { objects, addObject, removeObject }
})
