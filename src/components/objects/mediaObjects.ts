// settingsをuserdataに移設

export interface TrackSettings {
  id: number
  start: number
  end: number
  layer: number
  //overlay: number
  //camera: number
}

export interface AnimationSettings {
  name: string
  parameters: {}
}

export interface StandardRenderSettings {
  X: number
  Y: number
  //Z: number
  scale: number
  transparency: number
  rotation: number
  //blend: number
}

export interface TextSettings extends TrackSettings, AnimationSettings, StandardRenderSettings {
  //type: string
  //name: string
  size: number
  //display_speed: number
  individual_object: boolean
  //display_coordinates: boolean
  //auto_scroll: boolean
  //bold: boolean
  //italic: boolean
  //autoadjust: boolean
  //soft: boolean
  //monospace: boolean
  align: number
  spacing_x: number
  spacing_y: number
  //precision: number
  color: string
  //color2: '000000'
  font: string
  text: string
}

class TextObject implements TextSettings {
  id: number
  start: number
  end: number
  layer: number
  X: number
  Y: number
  scale: number
  transparency: number
  rotation: number
  name: string
  parameters: any
  size: number
  individual_object: boolean
  align: number
  spacing_x: number
  spacing_y: number
  color: string
  font: string
  text: string

  constructor(settings: TextSettings) {
    this.id = settings.id
    this.start = settings.start
    this.end = settings.end
    this.layer = settings.layer
    this.X = settings.X
    this.Y = settings.Y
    this.scale = settings.scale
    this.transparency = settings.transparency
    this.rotation = settings.rotation
    this.name = settings.name
    this.parameters = settings.parameters
    this.size = settings.size
    this.individual_object = settings.individual_object
    this.align = settings.align
    this.spacing_x = settings.spacing_x
    this.spacing_y = settings.spacing_y
    this.color = settings.color
    this.font = settings.font
    this.text = settings.text
  }

  render(): void {
    // ここでテキストオブジェクトのレンダリングロジックを実装する
  }
}

export interface ImageSettings extends TrackSettings, AnimationSettings, StandardRenderSettings {
  file: string
}

class ImageObject implements ImageSettings {
  id: number
  start: number
  end: number
  layer: number
  X: number
  Y: number
  scale: number
  transparency: number
  rotation: number
  file: string
  name: string
  parameters: any

  constructor(settings: ImageSettings) {
    this.id = settings.id
    this.start = settings.start
    this.end = settings.end
    this.layer = settings.layer
    this.X = settings.X
    this.Y = settings.Y
    this.scale = settings.scale
    this.transparency = settings.transparency
    this.rotation = settings.rotation
    this.file = settings.file
    this.name = settings.name
    this.parameters = settings.parameters
  }
}
