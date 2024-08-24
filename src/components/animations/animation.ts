import { reactive } from 'vue'
import { UIType } from '@/components/parameters/parameterInfo'
import type { BaseObject, Transform, TextObject } from '../parameters/objectInfo'
import { useTimelineStore } from '@/stores/objectStore'
const timelineStore = useTimelineStore()

export const effects = [
  {
    name: '文字送り',
    params: reactive({ time: 30, span: 10, delay: 5 }),
    parameters: {
      time: { min: 1, max: 60, label: '時間', uiType: UIType.slider },
      span: { min: 1, max: 20, label: 'スパン', uiType: UIType.slider },
      delay: { min: 0, max: 30, label: '遅延', uiType: UIType.slider }
    },
    applyEffect: (object: TextObject, params: any) => {
      const { time, span, delay } = params
      let progress = (timelineStore.currentFrame - object.start - object.id * span - delay) / time
      progress = Math.min(Math.max(progress, 0), 1) // 進捗は0と1の間に正規化

      const 
      if (progress > 0) {
        object.X = progress * 100 // X座標を progress * 100 だけ移動
      }
      return object
    }
  }
]
