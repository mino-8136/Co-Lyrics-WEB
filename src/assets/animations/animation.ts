import { reactive } from 'vue'
import { UIType } from '@/components/parameters/objectInfo'
import { Transform } from '@/components/parameters/p5Info'
import gsap from 'gsap'

// この形に従う
export interface Effect {
  name: string
  params: { [key: string]: any }
  parameters: { [key: string]: any } // 現在sliderとcheckboxのみに対応
  applyEffect: (
    currentFrame: number,
    baseObject: Transform,
    params: { [key: string]: any }
  ) => Transform
}

export const effects: Effect[] = [
  {
    name: '文字送り',
    params: reactive({ time: 0, span: 1, delay: 0 }),
    parameters: {
      time: { name: '時間(f)', type: UIType.slider, min: 0, max: 60 },
      span: { name: '間隔(f)', type: UIType.slider, min: 0, max: 20 },
      delay: { name: '遅延(f)', type: UIType.slider, min: 0, max: 30 }
    },
    applyEffect: (
      currentFrame: number,
      baseObject: Transform,
      params: { [key: string]: any }
    ): Transform => {
      const transform = new Transform(baseObject.id, baseObject.start)
      const { time, span, delay } = params
      let progress = (currentFrame - baseObject.start - baseObject.id * span - delay) / time
      progress = gsap.utils.clamp(progress, 0, 1) // 進捗は0と1の間に正規化

      transform.opacity = baseObject.opacity * progress

      return transform
    }
  },
  {
    name: '明滅登場',
    params: reactive({ entrance: 150 }),
    parameters: {
      entrance: { name: '登場', type: UIType.slider, min: 0, max: 300 }
    },
    applyEffect: (
      currentFrame: number,
      baseObject: Transform,
      params: { [key: string]: any }
    ): Transform => {
      const transform = new Transform(baseObject.id, baseObject.start)
      const { entrance } = params

      if (entrance > 0 && currentFrame <= entrance && currentFrame % 2 === 1) {
        transform.opacity = 0
      }
      return transform
    }
  }
]
