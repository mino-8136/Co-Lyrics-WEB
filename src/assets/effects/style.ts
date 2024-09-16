import { type StyleSetting } from '@/components/parameters/objectInfo'
import { KeyframeSettings } from '@/components/parameters/keyframeInfo'
import { Inform, lerpValue } from '@/components/parameters/p5Info'
import { UIType } from '@/components/parameters/uiInfo'
import { generateUniqueId } from '@/components/utils/common'

// この形に従う
export interface Style {
  name: string
  params: { [key: string]: number | string | boolean | KeyframeSettings }
  description?: string
  tag?: string[]
  parameters: { [key: string]: any } // 現在sliderとcheckboxのみに対応
  applyStyle: (inform: Inform, style: StyleSetting) => void
}

export const styleList: Style[] = [
  {
    name: '縁取り',
    params: {
      line_width: new KeyframeSettings([{ frame: 0, value: 1, id: generateUniqueId() }]), // キーフレーム対応
      line_color: '#000000'
    },
    parameters: {
      line_width: { name: '線の太さ', type: UIType.keyframe, min: 0, max: 100 }, // キーフレーム対応
      line_color: { name: '線の色', type: UIType.color }
    },
    applyStyle: (inform: Inform, style: StyleSetting) => {
      const lineWidth = lerpValue(
        (style.parameters.line_width as KeyframeSettings).keyframes,
        inform.start,
        inform.currentFrame
      )
      inform.p5.stroke(style.parameters.line_color as string)
      inform.p5.strokeWeight(lineWidth)
    }
  },
  {
    name: 'シャドー',
    params: {
      shadow_x: new KeyframeSettings([{ frame: 0, value: 0, id: generateUniqueId() }]), // キーフレーム対応
      shadow_y: new KeyframeSettings([{ frame: 0, value: 0, id: generateUniqueId() }]), // キーフレーム対応
      shadow_blur: new KeyframeSettings([{ frame: 0, value: 5, id: generateUniqueId() }]), // キーフレーム対応
      shadow_color: '#000000'
    },
    parameters: {
      shadow_x: { name: 'X座標', type: UIType.keyframe, min: -100, max: 100 }, // キーフレーム対応
      shadow_y: { name: 'Y座標', type: UIType.keyframe, min: -100, max: 100 }, // キーフレーム対応
      shadow_blur: { name: '影のぼかし', type: UIType.keyframe, min: 0, max: 100 }, // キーフレーム対応
      shadow_color: { name: '影の色', type: UIType.color }
    },
    applyStyle: (inform: Inform, style: StyleSetting) => {
      const shadowX = lerpValue(
        (style.parameters.shadow_x as KeyframeSettings).keyframes,
        inform.start,
        inform.currentFrame
      )
      const shadowY = lerpValue(
        (style.parameters.shadow_y as KeyframeSettings).keyframes,
        inform.start,
        inform.currentFrame
      )
      const shadowBlur = lerpValue(
        (style.parameters.shadow_blur as KeyframeSettings).keyframes,
        inform.start,
        inform.currentFrame
      )
      inform.p5.drawingContext.shadowOffsetX = shadowX
      inform.p5.drawingContext.shadowOffsetY = shadowY
      inform.p5.drawingContext.shadowBlur = shadowBlur
      inform.p5.drawingContext.shadowColor = style.parameters.shadow_color
    }
  },
  {
    name: 'ぼかし効果',
    params: { blur_amount: new KeyframeSettings([{ frame: 0, value: 0, id: generateUniqueId() }]) },
    parameters: {
      blur_amount: { name: 'ぼかし量', type: UIType.keyframe, min: 0, max: 100 }
    },
    applyStyle: (inform: Inform, style: StyleSetting) => {
      const blur = lerpValue(
        (style.parameters.blur_amount as KeyframeSettings).keyframes,
        inform.start,
        inform.currentFrame
      )
      inform.p5.drawingContext.filter = `blur(${blur}px)`
    }
  },
  {
    name: '合成モード',
    params: { blend_mode: 'multiply' },
    parameters: {
      blend_mode: {
        name: '合成モード',
        type: UIType.select,
        options: ['source-over', 'multiply', 'screen', 'overlay', 'darken', 'lighten']
      }
    },
    applyStyle: (inform: Inform, style: StyleSetting) => {
      inform.p5.drawingContext.globalCompositeOperation = style.parameters.blend_mode
    }
  }
]
