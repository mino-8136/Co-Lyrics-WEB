import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { BaseObject } from '@/components/objects/mediaObjects'

export const useObjectStore = defineStore('objects', () => {
  // 全体の情報を管理する
  const currentFrame = ref(0)
  const objects = ref<BaseObject[]>([]) // 全体のオブジェクト

  const currentObjects = computed(() => {
    if (objects.value === null) return []
    return objects.value.filter((object) => {
      return object.start <= currentFrame.value && object.end >= currentFrame.value
    })
  })

  const selectedObject = computed(() => {
    return objects.value.filter((object) => object.selected)
  })

  function addObject(object: BaseObject) {
    objects.value.push(object)
  }
  function removeObject(index: number) {
    objects.value.splice(index, 1)
  }
  return { objects, addObject, removeObject, currentObjects, selectedObject }
})
