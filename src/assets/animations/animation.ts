import { UIType } from '@/components/parameters/objectInfo'
import { Inform, Transform } from '@/components/parameters/p5Info'
import gsap from 'gsap'

// この形に従う
export interface Animation {
  name: string
  params: { [key: string]: any }
  description: string
  tag?: [string]
  parameters: { [key: string]: any } // 現在sliderとcheckboxのみに対応
  applyEffect: (
    inform: Inform,
    baseObject: Transform, // readonlyなものとして扱うこと
    params: { [key: string]: any }
  ) => Transform
}

export const animationList: Animation[] = [
  {
    name: '文字送り',
    params: { time: 1, interval: 1, delay: 0 },
    description:
      '文字を一文字ずつ表示します。[時間]だけをマイナスにすると順番に文字が消えていきます。[遅延]を大きくして[間隔]だけをマイナスにすると後ろから文字が表れます。',
    parameters: {
      time: { name: '時間(f)', type: UIType.slider, min: -60, max: 60 },
      interval: { name: '間隔(f)', type: UIType.slider, min: -20, max: 20 },
      delay: { name: '遅延(f)', type: UIType.slider, min: -20, max: 20 }
    },
    applyEffect: (
      inform: Inform,
      baseObject: Transform,
      params: { [key: string]: any }
    ): Transform => {
      const transform = new Transform()
      const { time, interval, delay } = params

      let progress = (inform.currentFrame - inform.start - inform.id * interval - delay) / time
      if (progress >= 0) {
        progress = 1
      } // 進捗は0と1の間に正規化
      transform.opacity = baseObject.opacity * progress

      return transform
    }
  },
  {
    name: 'フェードイン',
    params: { time: 10, interval: 1 },
    description: '[時間]で指定したフレーム数で、不透明度が0→100に変化します。',
    tag: ['in'],
    parameters: {
      time: { name: '時間(f)', type: UIType.slider, min: 0, max: 60 },
      interval: { name: '間隔(f)', type: UIType.slider, min: 0, max: 20 }
    },
    applyEffect: (
      inform: Inform,
      baseObject: Transform,
      params: { [key: string]: any }
    ): Transform => {
      const transform = new Transform()
      const { time, interval } = params

      const progress = (inform.currentFrame - inform.start - inform.id * interval) / time
      transform.opacity = baseObject.opacity * progress

      return transform
    }
  },
  {
    name: '明滅登場',
    params: { time: 5, interval: 1 },
    description: '文字を一文字ずつ表示します',
    tag: ['in'],
    parameters: {
      time: { name: '登場時間(f)', type: UIType.slider, min: 0, max: 90 },
      interval: { name: '間隔(f)', type: UIType.slider, min: 0, max: 20 }
    },
    applyEffect: (
      inform: Inform,
      baseObject: Transform,
      params: { [key: string]: any }
    ): Transform => {
      const transform = new Transform()
      const { time, interval } = params

      const progress = inform.currentFrame - inform.start - inform.id * interval
      if (progress < 0) transform.opacity = 0
      else if (progress < time && Math.round(progress) % 2 === 0) {
        transform.opacity = 0
      }

      return transform
    }
  },
  {
    name: 'スライドイン',
    params: { time: 10, interval: 1, X: 50, Y: 0 },
    description: '指定した相対座標([X],[Y])からスライドインします。',
    tag: ['in'],
    parameters: {
      time: { name: '時間(f)', type: UIType.slider, min: 0, max: 60 },
      interval: { name: '間隔(f)', type: UIType.slider, min: 0, max: 20 },
      X: { name: 'X', type: UIType.slider, min: -500, max: 500 },
      Y: { name: 'Y', type: UIType.slider, min: -500, max: 500 }
    },
    applyEffect: (
      inform: Inform,
      baseObject: Transform,
      params: { [key: string]: any }
    ): Transform => {
      const transform = new Transform()
      const { time, interval, X, Y } = params

      const progress = inform.currentFrame - inform.start - inform.id * interval
      if (progress < 0) {
        transform.X = X
        transform.Y = Y
      } else if (progress < time) {
        transform.X = X * (1 - progress / time)
        transform.Y = Y * (1 - progress / time)
      }
      return transform
    }
  }
]
