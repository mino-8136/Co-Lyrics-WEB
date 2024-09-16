import { KeyframeSettings } from '@/components/parameters/keyframeInfo'
import {
  Inform,
  Transform,
  lerpValue,
  getAnimationStateAtTime
} from '@/components/parameters/p5Info'
import { UIType } from '@/components/parameters/uiInfo'
import { clClamp, generateUniqueId } from '@/components/utils/common'

// この形に従う
export interface Animation {
  name: string
  params: { [key: string]: number | string | boolean | KeyframeSettings }
  description?: string
  tag?: string[]
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
      '文字を一文字ずつ表示します。[時間]だけをマイナスにすると順番に文字が消えていきます。[遅延]を大きくして[間隔]だけをマイナスにすると後ろから文字が表れます。他のエフェクトと組み合わせて使います。',
    tag: ['登場'],
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
    name: '明滅登場',
    params: { time: 5, interval: 1, out: false },
    description: '文字を一文字ずつ表示します。[退場]をONにすると明滅して消えるようになります。',
    tag: ['登場', '退場'],
    parameters: {
      time: { name: '登場時間(f)', type: UIType.slider, min: 0, max: 90 },
      interval: { name: '間隔(f)', type: UIType.slider, min: 0, max: 20 },
      out: { name: '退場', type: UIType.checkbox }
    },
    applyEffect: (
      inform: Inform,
      baseObject: Transform,
      params: { [key: string]: any }
    ): Transform => {
      const transform = new Transform()

      const progressFrame = params.out
        ? inform.end -
          inform.currentFrame -
          (inform.totalIndex - 1 - inform.index) * params.interval
        : inform.currentFrame - inform.start - inform.index * params.interval
      if (progressFrame < 0) transform.opacity = 0
      else if (progressFrame < params.time && Math.round(progressFrame) % 2 === 0) {
        transform.opacity = 0
      }

      return transform
    }
  },
  {
    name: 'フェードイン',
    params: { time: 10, interval: 1, out: false },
    description:
      '[時間]で指定したフレーム数で、不透明度が0→100に変化します。[退場]をONにするとオブジェクト終了地点を基準としたフェードアウトになります。フェードエフェクトを2個重ねるとフェードイン・フェードアウトができます。',
    tag: ['登場', '退場'],
    parameters: {
      time: { name: '時間(f)', type: UIType.slider, min: 0, max: 60 },
      interval: { name: '間隔(f)', type: UIType.slider, min: 0, max: 20 },
      out: { name: '退場', type: UIType.checkbox }
    },
    applyEffect: (
      inform: Inform,
      baseObject: Transform,
      params: { [key: string]: any }
    ): Transform => {
      const transform = new Transform()

      // out=trueの場合は1 → 0 に、 falseの場合は0 → 1 に変化する
      const progress = params.out
        ? (inform.end -
            inform.currentFrame -
            (inform.totalIndex - 1 - inform.index) * params.interval) /
          params.time
        : (inform.currentFrame - inform.start - inform.index * params.interval) / params.time
      transform.opacity = baseObject.opacity * clClamp(0, 1, progress)

      return transform
    }
  },
  {
    name: 'スライドイン',
    params: { time: 10, interval: 1, X: 50, Y: 0, out: false, ease: 'linear' },
    description: '指定した相対座標([X],[Y])からスライドインします。',
    tag: ['登場', '退場'],
    parameters: {
      time: { name: '時間(f)', type: UIType.slider, min: 0, max: 60 },
      interval: { name: '間隔(f)', type: UIType.slider, min: 0, max: 20 },
      X: { name: 'X', type: UIType.slider, min: -500, max: 500 },
      Y: { name: 'Y', type: UIType.slider, min: -500, max: 500 },
      ease: { name: 'イージング', type: UIType.easing },
      out: { name: '退場', type: UIType.checkbox }
    },
    applyEffect: (
      inform: Inform,
      baseObject: Transform,
      params: { [key: string]: any }
    ): Transform => {
      const transform = new Transform()

      // 0→1 に変化する
      const progress = params.out
        ? (inform.end -
            inform.currentFrame -
            (inform.totalIndex - 1 - inform.index) * params.interval) /
          params.time
        : (inform.currentFrame - inform.start - inform.index * params.interval) / params.time
      const easeProgress = getAnimationStateAtTime(clClamp(0, 1, progress), params.ease)

      if (progress < 0) {
        transform.X = params.X
        transform.Y = params.Y
      } else if (progress < params.time) {
        transform.X = params.X * (1 - easeProgress)
        transform.Y = params.Y * (1 - easeProgress)
      }
      return transform
    }
  },
  {
    name: '拡大回転登場',
    params: { time: 10, interval: 1, scale: 150, angle: 0, out: false, ease: 'linear' },
    description: '指定した指定した拡大率から登場します。',
    tag: ['登場', '退場'],
    parameters: {
      time: { name: '時間(f)', type: UIType.slider, min: 0, max: 60 },
      interval: { name: '間隔(f)', type: UIType.slider, min: 0, max: 20 },
      scale: { name: '拡大率', type: UIType.slider, min: 0, max: 500 },
      angle: { name: '回転角', type: UIType.slider, min: -500, max: 500 },
      ease: { name: 'イージング', type: UIType.easing },
      out: { name: '退場', type: UIType.checkbox }
    },
    applyEffect: (
      inform: Inform,
      baseObject: Transform,
      params: { [key: string]: any }
    ): Transform => {
      const transform = new Transform()

      // 0→1 に変化する
      const progress = params.out
        ? (inform.end -
            inform.currentFrame -
            (inform.totalIndex - 1 - inform.index) * params.interval) /
          params.time
        : (inform.currentFrame - inform.start - inform.index * params.interval) / params.time
      const easeProgress = getAnimationStateAtTime(clClamp(0, 1, progress), params.ease)

      if (progress < 0) {
        transform.scale = params.scale
        transform.angle = params.angle
      } else if (progress < params.time) {
        transform.scale = 100 + (params.scale - 100) * (1 - easeProgress) // 増分にイージングする
        transform.angle = params.angle * (1 - easeProgress)
      }
      return transform
    }
  },
  {
    name: 'ランダム配置',
    params: {
      X: new KeyframeSettings([{ frame: 0, value: 0, id: generateUniqueId() }]), // キーフレーム対応
      Y: new KeyframeSettings([{ frame: 0, value: 150, id: generateUniqueId() }]), // キーフレーム対応
      Time: new KeyframeSettings([{ frame: 0, value: 0, id: generateUniqueId() }]),
      Seed: 100,
      Side: true
    },
    description: 'オブジェクトをランダムに移動させます。[ゆらぎ]を大きくするとゆっくり動きます。',
    tag: ['配置'],
    parameters: {
      X: { name: 'X', type: UIType.keyframe, min: -2000, max: 2000 },
      Y: { name: 'Y', type: UIType.keyframe, min: -1000, max: 1000 },
      Time: { name: 'ゆらぎ', type: UIType.keyframe, min: 0, max: 100 },
      Seed: { name: 'シード値', type: UIType.slider, min: 0, max: 1000 },
      Side: { name: '両側', type: UIType.checkbox }
    },
    applyEffect: (
      inform: Inform,
      baseObject: Transform,
      params: { [key: string]: any }
    ): Transform => {
      const transform = new Transform()

      const lerpX = lerpValue(params.X.keyframes, inform.start, inform.currentFrame)
      const lerpY = lerpValue(params.Y.keyframes, inform.start, inform.currentFrame)
      const lerpTime = lerpValue(params.Time.keyframes, inform.start, inform.currentFrame)

      if (inform.p5) {
        const side = params.Side ? 0.5 : 0
        inform.p5.noiseSeed(params.Seed + inform.index)
        transform.X = (inform.p5.noise(10000 + inform.index + lerpTime / 100) - side) * lerpX
        transform.Y = (inform.p5.noise(10000 + inform.index + lerpTime / 100) - side) * lerpY
      }
      return transform
    }
  },
  {
    name: 'ランダム拡大回転',
    params: {
      scale: new KeyframeSettings([{ frame: 0, value: 150, id: generateUniqueId() }]), // キーフレーム対応
      angle: new KeyframeSettings([{ frame: 0, value: 0, id: generateUniqueId() }]), // キーフレーム対応
      Time: new KeyframeSettings([{ frame: 0, value: 0, id: generateUniqueId() }]),
      Seed: 100,
      Side: true
    },
    description:
      'オブジェクトをランダムに拡大・回転させます。[ゆらぎ]を大きくするとゆっくり動きます。',
    tag: ['配置'],
    parameters: {
      scale: { name: '拡大率', type: UIType.keyframe, min: 0, max: 500 },
      angle: { name: '回転角', type: UIType.keyframe, min: -500, max: 500 },
      Time: { name: 'ゆらぎ', type: UIType.keyframe, min: 0, max: 100 },
      Seed: { name: 'シード値', type: UIType.slider, min: 0, max: 1000 },
      Side: { name: '両側', type: UIType.checkbox }
    },
    applyEffect: (
      inform: Inform,
      baseObject: Transform,
      params: { [key: string]: any }
    ): Transform => {
      const transform = new Transform()

      const lerpScale = lerpValue(params.scale.keyframes, inform.start, inform.currentFrame)
      const lerpAngle = lerpValue(params.angle.keyframes, inform.start, inform.currentFrame)
      const lerpTime = lerpValue(params.Time.keyframes, inform.start, inform.currentFrame)

      if (inform.p5) {
        const side = params.Side ? 0.5 : 0
        inform.p5.noiseSeed(params.Seed + inform.index)
        transform.scale = 100 + (inform.p5.noise(10000 + inform.index + lerpTime / 100) - side) * (lerpScale-100)
        transform.angle = (inform.p5.noise(10000 + inform.index + lerpTime / 100) - side) * lerpAngle
      }
      return transform
    }
  }
]