import { type StyleSetting } from '@/components/parameters/objectInfo'
import { UIType } from '@/components/parameters/uiInfo'
import p5 from 'p5'

// この形に従う
export interface Style {
  name: string
  params: { [key: string]: any }
  description?: string
  parameters: { [key: string]: any } // 現在sliderとcheckboxのみに対応
  applyStyle: (p: p5, style: StyleSetting) => void
}

export const styleList: Style[] = [
  {
    name: '縁取り',
    params: { line_width: 1, line_color: '#000000' },
    parameters: {
      line_width: { name: '線の太さ', type: UIType.slider, min: 0, max: 100 },
      line_color: { name: '線の色', type: UIType.color }
    },
    applyStyle: (p: p5, style: StyleSetting) => {
      p.stroke(style.parameters.line_color)
      p.strokeWeight(style.parameters.line_width)
    }
  },
  {
    name: 'シャドー',
    params: { shadow_x: 0, shadow_y: 0, shadow_blur: 5, shadow_color: '#000000' },
    parameters: {
      shadow_x: { name: 'X座標', type: UIType.slider, min: -100, max: 100 },
      shadow_y: { name: 'Y座標', type: UIType.slider, min: -100, max: 100 },
      shadow_blur: { name: '影のぼかし', type: UIType.slider, min: 0, max: 100 },
      shadow_color: { name: '影の色', type: UIType.color }
    },
    applyStyle: (p: p5, style: StyleSetting) => {
      p.drawingContext.shadowOffsetX = style.parameters.shadow_x
      p.drawingContext.shadowOffsetY = style.parameters.shadow_y
      p.drawingContext.shadowBlur = style.parameters.shadow_blur
      p.drawingContext.shadowColor = style.parameters.shadow_color
    }
  },
  {
    name: 'グラデーション',
    params: { start_color: '#ff0000', end_color: '#0000ff', gradient_type: 'linear' },
    parameters: {
      start_color: { name: '開始色', type: UIType.color },
      end_color: { name: '終了色', type: UIType.color },
      gradient_type: {
        name: 'グラデーションのタイプ',
        type: UIType.select,
        options: ['linear', 'radial']
      }
    },
    applyStyle: (p: p5, style: StyleSetting) => {
      let gradient
      if (style.parameters.gradient_type === 'linear') {
        gradient = p.drawingContext.createLinearGradient(0, 0, p.width, 0)
      } else {
        gradient = p.drawingContext.createRadialGradient(
          p.width / 2,
          p.height / 2,
          0,
          p.width / 2,
          p.height / 2,
          p.width / 2
        )
      }
      gradient.addColorStop(0, style.parameters.start_color)
      gradient.addColorStop(1, style.parameters.end_color)
      p.drawingContext.fillStyle = gradient
    }
  },
  {
    name: 'ぼかし効果',
    params: { blur_amount: 5 },
    parameters: {
      blur_amount: { name: 'ぼかし量', type: UIType.slider, min: 0, max: 100 }
    },
    applyStyle: (p: p5, style: StyleSetting) => {
      p.drawingContext.filter = `blur(${style.parameters.blur_amount}px)`
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
    applyStyle: (p: p5, style: StyleSetting) => {
      p.drawingContext.globalCompositeOperation = style.parameters.blend_mode
    }
  }
]
