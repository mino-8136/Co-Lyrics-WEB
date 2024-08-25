// 一意のキーフレームIDを生成する関数
export function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36)
}
