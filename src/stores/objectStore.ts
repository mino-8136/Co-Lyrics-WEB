import { defineStore } from 'pinia'
import { BaseObject, TextObject, ImageObject } from '@/components/objects/objectInfo'

export const useObjectStore = defineStore('objects', {
  state: () => ({
    counter: 0,
    objects: [] as (TextObject | ImageObject | BaseObject)[]
  }),
  getters: {
    currentObjects: (state) => (frame: number) => {
      return state.objects.filter((object) => object.start <= frame && object.end >= frame)
    }
  },
  actions: {
    addObject(object: TextObject | ImageObject | BaseObject) {
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
    height: 720,
    framerate: 30,
    title: 'New Project',
    audioPath: '/src/assets/music/LetterPost.wav',
    ////////
    currentFrame: 0,
    canvasScale: 1,
    pxPerSec: 90,
    selectedObjectId: 0
  }),
  actions: {
    setCurrentFrame(frame: number) {
      this.currentFrame = frame
    },
    updateCanvasScale(receivedWidth: number) {
      this.canvasScale = receivedWidth / this.width
    }
  }
})

/*
 /src/assets/music/demo.mp3
*/
