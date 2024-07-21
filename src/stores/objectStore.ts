import { defineStore } from 'pinia'
import { BaseObject } from '@/components/objects/mediaObjects'

export const useObjectStore = defineStore('objects', {
  state: () => ({
    currentFrame: 0,
    counter: 0,
    objects: [] as BaseObject[]
  }),
  getters: {
    currentObjects: (state) => {
      return state.objects.filter(
        (object) => object.start <= state.currentFrame && object.end >= state.currentFrame
      )
    },
    selectedObject: (state) => {
      const selectedObjects = state.objects.filter((object) => object.selected)
      return selectedObjects.length > 0 ? selectedObjects[0] : null
    }
  },
  actions: {
    addObject(object: BaseObject) {
      this.objects.push(object)
      this.counter++
    },
    removeObject(index: number) {
      this.objects.splice(
        this.objects.findIndex((object) => object.id === index),
        1
      )
    }
  }
})
