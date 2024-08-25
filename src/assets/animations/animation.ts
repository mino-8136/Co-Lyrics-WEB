import { reactive } from 'vue'
import { UIType } from '@/components/parameters/objectInfo'
import { Transform } from '@/components/parameters/p5Info'
import gsap from 'gsap'

// この形に従う
export interface Effect {
  name: string
  params: { [key: string]: any }
  parameters: { [key: string]: any }
  applyEffect: (
    currentFrame: number,
    baseObject: Transform,
    params: { [key: string]: any }
  ) => Transform
}

export const effects: Effect[] = [
  {
    name: '文字送り',
    params: reactive({ time: 30, span: 10, delay: 5 }),
    parameters: {
      time: { min: 1, max: 60, label: '時間', uiType: UIType.slider },
      span: { min: 1, max: 20, label: 'スパン', uiType: UIType.slider },
      delay: { min: 0, max: 30, label: '遅延', uiType: UIType.slider }
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
    params: reactive({ entrance: 150, exit: 150 }),
    parameters: {
      enter: { min: 0, max: 300, label: '登場', uiType: UIType.slider }
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
