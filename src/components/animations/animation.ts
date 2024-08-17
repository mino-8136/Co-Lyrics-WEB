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


function setupAppearance(obj: any, objIndex: number, objTotal: number, tracks: any, dialogSettings: any) {
  const time = tracks[0]; // 時間[s]
  const interval = tracks[1]; // 間隔[s]
  const scale = tracks[2]; // 拡大率
  const order = tracks[3]; // 登場順

  let mode: number;
  if (order < 1) {
      mode = objIndex; // 順番に登場
  } else if (order < 2) {
      mode = objTotal - 1 - objIndex; // 後ろから登場
  } else if (order < 3) {
      let indexes: number[] = Array.from({ length: objTotal }, (_, i) => i);
      for (let i = 0; i < objTotal; i++) {
          const dest = Math.floor(Math.random() * objTotal);
          [indexes[i], indexes[dest]] = [indexes[dest], indexes[i]];
      }
      mode = indexes[objIndex]; // ランダム順に登場
  } else if (order < 4) {
      mode = Math.random() * (objTotal - 1); // ランダム間隔に登場
  } else if (order < 5) {
      mode = Math.abs((objTotal - 1) / 2 - objIndex); // 内側から登場
  } else {
      mode = (objTotal - 1) / 2 - Math.abs((objTotal - 1) / 2 - objIndex); // 外側から登場
  }

  let ta = time;
  let tb = interval;
  if (dialogSettings.type < 1) {
      ta = time;
      tb = interval;
  } else {
      ta = time * (1 - mode / objTotal);
      tb = interval / objTotal;
  }

  let i = ta < 0 ? (ta - objTotal * tb - obj['time'] + obj['totalTime'] + mode * tb) / ta : (ta - obj['time'] + mode * tb) / ta;

  if (i > 0) {
      if (i > 1) {
          obj['alpha'] = 0;
          i = 1;
      }
      i = Math.pow(i, dialogSettings['beki']);
      obj['ox'] += dialogSettings['x'] * i;
      obj['oy'] += dialogSettings['y'] * i;
      obj['oz'] += dialogSettings['z'] * i;
      obj['rx'] += dialogSettings['rx'] * i;
      obj['ry'] += dialogSettings['ry'] * i;
      obj['rz'] += dialogSettings['rz'] * i;
      obj['zoom'] += i * (scale - 100) / 100;
      if (dialogSettings['fade'] === 1) {
          obj['alpha'] *= 1 - i;
      }
  }
}