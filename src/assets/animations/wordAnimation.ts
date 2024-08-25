// 波のように文字を動かすアニメーション
function hopping() {
  const text = document.querySelector('.text')
  const startFrame = 0
  const hopSpeed = 0.1
  const hopHeight = 10
  const hopLength = 100

  // 波の高さを計算する関数
  const calculateWaveHeight = (frame: number) => {
    return Math.sin(frame * hopSpeed) * hopHeight
  }
}

// 文字の位置がバラバラになるアニメーション
function randomCharactors(){
    const text = document.querySelector('.text')
    const startFrame = 0
    const randomSpeed = 0.1
    const randomRange = 10
    
    // 文字の位置を計算する関数
    const calculateRandomPosition = (frame: number) => {
        return Math.sin(frame * randomSpeed) * randomRange
    }
}
