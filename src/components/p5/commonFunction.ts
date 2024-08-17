import p5 from 'p5'
import * as objInfo from '@/components/objects/objectInfo'

// p5.jsで1文字単位でテキストを扱う際の保持情報
interface p5TextCharacterSettings {
  id: number
  X: number
  Y: number
  scale: number
  opacity: number
  angle: number
  size: number
  color: string
  font: string
  text: string
}

// 受け取ったオブジェクトの中から、テキストを1文字ずつ分解する関数
function splitText(obj: objInfo.TextObject) {
  const textArray: string[] = obj.text.split('')
  return textArray
}
