type FadeAnimationFunction = (startFrame: number, endFrame: number, currentFrame: number) => number

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
const fadeIn: FadeAnimationFunction = (startFrame, endFrame, currentFrame) => {
  const progress = calculateAnimationProgress(startFrame, endFrame, currentFrame)
  return progress // 進行度そのままがオペーシティ
}

// フェードアウトの進行度を計算する関数
const fadeOut: FadeAnimationFunction = (startFrame, endFrame, currentFrame) => {
  const progress = calculateAnimationProgress(startFrame, endFrame, currentFrame)
  return 1 - progress // 進行度を反転させてオペーシティとする
}

export { fadeIn, fadeOut }
