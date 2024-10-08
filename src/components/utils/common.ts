import { KeyframeSettings } from '../parameters/keyframeInfo'

// 一意のキーフレームIDを生成する関数
export function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36)
}

export function deepCopy(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  // KeyframeSettingsの場合は、再帰的にdeepCopyを適用する
  if ('keyframes' in obj) {
    return new KeyframeSettings((obj as KeyframeSettings).keyframes.map((item) => deepCopy(item)))
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepCopy(item))
  }

  const newObj = { ...obj }

  for (const key in newObj) {
    if (Object.prototype.hasOwnProperty.call(newObj, key)) {
      newObj[key] = deepCopy(newObj[key])
    }
  }

  return newObj
}

export function clClamp(min: number, max: number, value: number): number {
  return Math.min(Math.max(value, min), max)
}