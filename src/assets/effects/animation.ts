import { Inform, Transform } from '@/components/parameters/p5Info'
import { UIType } from '@/components/parameters/uiInfo'
import gsap from 'gsap'
import p5 from 'p5'

// この形に従う
export interface Animation {
  name: string
  params: { [key: string]: any }
  description?: string
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
    tag: ['in'],
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

      let progress =
        (inform.currentFrame - inform.start - inform.index * params.interval - params.delay) /
        params.time
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

      const progress =
        (inform.currentFrame - inform.start - inform.index * params.interval) / params.time
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

      const progress = inform.currentFrame - inform.start - inform.index * params.interval
      if (progress < 0) transform.opacity = 0
      else if (progress < params.time && Math.round(progress) % 2 === 0) {
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

      const progress = inform.currentFrame - inform.start - inform.index * params.interval
      if (progress < 0) {
        transform.X = params.X
        transform.Y = params.Y
      } else if (progress < params.time) {
        transform.X = params.X * (1 - progress / params.time)
        transform.Y = params.Y * (1 - progress / params.time)
      }
      return transform
    }
  },
  {
    name: 'ランダム配置',
    params: { X: 150, Y: 0, Seed: 100, Time: 10 },
    description: 'オブジェクトをランダムに移動させます',
    tag: ['other'],
    parameters: {
      X: { name: 'X', type: UIType.slider, min: -500, max: 500 },
      Y: { name: 'Y', type: UIType.slider, min: -500, max: 500 },
      Seed: { name: 'シード値', type: UIType.slider, min: 0, max: 1000 },
      Time: { name: '進行度', type: UIType.slider, min: 0, max: 60 }
    },
    applyEffect: (
      inform: Inform,
      baseObject: Transform,
      params: { [key: string]: any }
    ): Transform => {
      const transform = new Transform()
      if (inform.p5Canvas) {
        inform.p5Canvas.noiseSeed(params.Seed)
        transform.X = inform.p5Canvas.noise(inform.index * params.Time + 10000) * params.X
        transform.Y = inform.p5Canvas.noise(inform.index * params.Time + 10000) * params.Y
      }
      return transform
    }
  }
]
