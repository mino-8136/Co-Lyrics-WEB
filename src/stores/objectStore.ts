import { defineStore } from 'pinia'
import { BaseObject, TextObject } from '@/components/objects/objectInfo'

export const useObjectStore = defineStore('objects', {
  state: () => ({
    counter: 0,
    objects: [] as (BaseObject | TextObject)[]
  }),
  getters: {
    currentObjects: (state) => (frame: number) => {
      return state.objects.filter(
        (object) => object.start <= frame && object.end >= frame
      )
    },
    selectedObject: (state) => {
      const selectedObjects = state.objects.filter((object) => object.selected)
      return selectedObjects.length > 0 ? selectedObjects[0] : null
    }
  },
  actions: {
    addObject(object: BaseObject | TextObject) {
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

export const useTimelineStore = defineStore('timeline', {
  state: () => ({
    width: 1280,
    height: 1080,
    rate: 30,
    length: 60,
    currentFrame: 0
  }),
  actions: {
    setCurrentFrame(frame: number) {
      this.currentFrame = frame
    },
    incrementFrame() {
      this.currentFrame++
    }
  }
})
