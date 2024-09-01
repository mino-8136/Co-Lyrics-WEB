import { defineStore } from 'pinia'
import { createObjectFromJson, type RenderObject } from '@/components/parameters/objectInfo'

export const useObjectStore = defineStore('objects', {
  state: () => ({
    counter: 0,
    objects: [] as RenderObject[]
  }),
  getters: {
    currentObjects: (state) => (frame: number) => {
      return state.objects.filter((object) => object.start <= frame && object.end >= frame)
    },
    findLastId: (state): number => {
      return Math.max(Math.max(...state.objects.map((object) => object.id)), -1)
    }
  },
  actions: {
    addNewObject(object: RenderObject) {
      this.counter = this.findLastId + 1
      object.id = this.counter
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
  },
  persist: {
    afterHydrate(store) {
      if ('objects' in store) {
        store.objects = (store.objects as any).map((object: RenderObject) =>
          createObjectFromJson(object)
        )
        // カウンターはもとから保存されている
      }
    }
  }
})

export const useTimelineStore = defineStore('timeline', {
  state: () => ({
    width: 1280,
    height: 720,
    framerate: 30,
    title: 'New Project',
    audioPath: '/assets/music/レターポスト_192k.mp3',
    ////////
    currentFrame: 0,
    canvasScale: 1,
    pxPerSec: 90,
    selectedObjectId: 0,
    selectedObjectIds: [] as number[], // 複数選択用
    isRedrawNeeded: false
  }),
  actions: {
    setCurrentFrame(frame: number) {
      this.currentFrame = frame
    },
    updateCanvasScale(receivedWidth: number) {
      this.canvasScale = receivedWidth / this.width
    }
  },
  persist: true
})

export const useConfigStore = defineStore('config', {
  state: () => ({
    isShowCollisionBox: false,
    isShowKeyframe: true
  }),
  actions: {},
  persist: true
})

/*
 /assets/music/demo.mp3
*/
