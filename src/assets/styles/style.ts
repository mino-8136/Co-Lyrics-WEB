import { UIType } from '@/components/parameters/objectInfo'
import p5 from 'p5'

import { Inform, Transform } from '@/components/parameters/p5Info'
import gsap from 'gsap'

// この形に従う
export interface Style {
  name: string
  params: { [key: string]: any }
  description?: string
  parameters: { [key: string]: any } // 現在sliderとcheckboxのみに対応
}

export const styleList: Style[] = [
  {
    name: '縁取り',
    params: { line_width: 1, line_color: '#000000' },
    parameters: {
      line_width: { name: '線の太さ', type: UIType.slider, min: 0, max: 10 },
      line_color: { name: '線の色', type: UIType.color }
    }
  },
  {
    name: 'シャドー',
    params: { shadow_x: 0, shadow_y: 0, shadow_blur: 0, shadow_color: '#000000' },
    parameters: {
      shadow_x: { name: 'X座標', type: UIType.slider, min: -10, max: 10 },
      shadow_y: { name: 'Y座標', type: UIType.slider, min: -10, max: 10 },
      shadow_blur: { name: '影のぼかし', type: UIType.slider, min: 0, max: 10 },
      shadow_color: { name: '影の色', type: UIType.color }
    }
  }
]
