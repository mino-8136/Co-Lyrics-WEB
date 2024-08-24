import type { RelativeParameters } from '../parameters/objectInfo'
type FadeAnimationFunction = (startFrame: number, endFrame: number, currentFrame: number) => number

function starndardFunction(
  obj: any,
  objIndex: number,
  tracks: any,
  dialogSettings: any
): RelativeParameters {
  const effectParameter: RelativeParameters = {
    X: 0,
    Y: 0,
    scale: 0,
    opacity: 0,
    angle: 0
  }
  effectParameter.X += 40

  return effectParameter
}

const calculateAnimationProgress: FadeAnimationFunction = (startFrame, endFrame, currentFrame) => {
  if (currentFrame <= startFrame) {
    return 0
  } else if (currentFrame >= endFrame) {
    return 1
  } else {
    return (currentFrame - startFrame) / (endFrame - startFrame)
  }
}

// フェードインの進行度を計算する関数
export const fadeIn: FadeAnimationFunction = (startFrame, endFrame, currentFrame) => {
  const progress = calculateAnimationProgress(startFrame, endFrame, currentFrame)
  return progress // 進行度そのままがオペーシティ
}

// フェードアウトの進行度を計算する関数
export const fadeOut: FadeAnimationFunction = (startFrame, endFrame, currentFrame) => {
  const progress = calculateAnimationProgress(startFrame, endFrame, currentFrame)
  return 1 - progress // 進行度を反転させてオペーシティとする
}

// TODO: ここは別のファイルで管理したほうがやりやすいかも
const effectsMap = {
  フェードイン: fadeIn,
  フェードアウト: fadeOut,
  標準登場: standardAnimation
}

// function executeEffect(effectName: keyof typeof effectsMap, ...effectParameters: any[] ){
//   // 関数を呼び出す
//   const effectFunction = effectsMap[effectName]
//   return effectFunction(...effectParameters)
// }

function standardAnimation(obj: any, objIndex: number, tracks: any, dialogSettings: any) {
  const time = tracks[0] // 時間[s]
  const interval = tracks[1] // 間隔[s]

  const ta = time
  const tb = interval

  let i = (ta - obj['time'] + objIndex * tb) / ta

  if (i > 0) {
    if (i > 1) {
      obj['alpha'] = 0
      i = 1
    }
    i = Math.pow(i, dialogSettings['beki'])
    obj['ox'] += dialogSettings['x'] * i
    obj['oy'] += dialogSettings['y'] * i
  }
}
