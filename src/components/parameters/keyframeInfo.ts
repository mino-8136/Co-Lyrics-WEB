// キーフレームの情報管理
import { generateUniqueId } from '@/components/utils/common'

export interface KeyframeSetting {
  value: number
  frame: number
  id: string
  easeType?: string
}
export class KeyframeSettings {
  keyframes: KeyframeSetting[]
  isGraphOpen: boolean = false
  constructor(keyframes: KeyframeSetting[] = []) {
    this.keyframes = keyframes
  }

  // 適当な順番にキーフレームを追加するメソッド
  addKeyframe(index: number): void {
    const newKeyframe =
      this.keyframes.length - 1 !== index
        ? Math.floor((this.keyframes[index].frame + this.keyframes[index + 1].frame) / 2)
        : this.keyframes[index].frame + 20
    this.keyframes.splice(index + 1, 0, {
      frame: newKeyframe,
      value: this.keyframes[index].value,
      id: generateUniqueId()
    })
  }
  // 指定した位置のキーフレームを削除するメソッド
  deleteKeyframe(index: number): void {
    this.keyframes.splice(index, 1)
  }
  // キーフレームをソートするメソッド
  sortKeyframes(): void {
    this.keyframes.sort((a, b) => a.frame - b.frame)
  }
}
