import { defineStore } from 'pinia'
import { type RenderObject } from '@/components/parameters/objectInfo'

export const useObjectStore = defineStore('objects', {
  state: () => ({
    counter: 0,
    objects: [] as RenderObject[]
  }),
  getters: {
    currentObjects: (state) => (frame: number) => {
      return state.objects.filter((object) => object.start <= frame && object.end >= frame)
    },
    findLastId: (state) => {
      return Math.max(...state.objects.map((object) => object.id))
    }
  },
  actions: {
    addObject(object: RenderObject) {
      this.objects.push(object)
      this.counter++
    },
    removeObject(index: number) {
      this.objects.splice(
        this.objects.findIndex((object) => object.id === index),
        1
      )
    },
    clearObjects() {
      this.objects.splice(0)
      this.counter = 0
    }
  }
})

export const useTimelineStore = defineStore('timeline', {
  state: () => ({
    width: 1280,
    height: 720,
    framerate: 30,
    title: 'New Project',
    audioPath: '/assets/music/LetterPost.wav',
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
 /assets/music/demo.mp3
*/
