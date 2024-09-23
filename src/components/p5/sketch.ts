import p5 from 'p5'
import {
  type TextObject,
  ShapeObject,
  ImageObject,
  BaseObject,
  GroupObject,
  type RenderObject
} from '@/components/parameters/objectInfo'
import {
  Inform,
  ShapeType,
  TextAlignX,
  TextAlignY,
  lerpValue,
  convertToPercentage,
  Transform
} from '@/components/parameters/p5Info'
import { fontListData, setFonts } from '@/components/parameters/fonts'

let renderObjects: RenderObject[] = []
const selectedObject = {
  object: null as RenderObject | null,
  startMouseX: 0,
  startMouseY: 0,
  startObjectX: 0,
  startObjectY: 0
}
let currentFrame = 0
let backgroundColor = '#80'

let isFontLoaded = false
let loadedFontName = ''
let loadedFontCount = 0
let showCollisionBox = true

const punctuationCharacter = '、。，．､｡,.'
const verticalCharacter =
  'ｰー-‐―─~～=＝;:：；…‥()[]{}｢｣<>（）〔〕［］｛｝〈〉《》「」『』【】＜＞≪≫'
// 長音(半全)・ハイフン(半全)・ダッシュ・罫線の順

export function defineSketch(project: any, isLoadSubsetFonts: boolean = false) {
  // 実際はtimelineStoreを引数に取る
  return function sketch(p: p5) {
    p.preload = () => {
      // 全フォントデータの読み込みを行う(TODO:プロジェクトに読み込まれているものだけに限定する？)
      isFontLoaded = false
      const onProgress = (loadedName: string, loadedCount: number) => {
        loadedFontName = loadedName
        loadedFontCount = loadedCount
      }

      const asyncFunc = async () => {
        try {
          const fetchDone = await setFonts(fontListData, onProgress, isLoadSubsetFonts)
          if (fetchDone) {
            isFontLoaded = true
          }
        } catch (error) {
          console.error('フォントの読み込みに失敗しました:', error)
          // 必要に応じて、エラーメッセージを表示したり、フォールバック処理を行う
        }
      }
      asyncFunc()
    }
    p.setup = () => {
      const canvas = p.createCanvas(
        project.width * project.canvasScale,
        (project.width / 16) * 9 * project.canvasScale
      )
      canvas.parent('canvas')

      p.smooth()
      p.angleMode(p.DEGREES)
      p.colorMode(p.RGB, 255, 255, 255, 100)
      p.strokeWeight(0)
      p.rectMode(p.CENTER)
      p.frameRate(project.framerate)
      p.textAlign(p.CENTER, p.CENTER)

      p.background(backgroundColor)
    }

    p.draw = () => {
      p.background(backgroundColor)

      // デバッグ用
      p.fill(255)
      //p.ellipse(p.mouseX, p.mouseY, 50 * project.canvasScale)

      // メインの描画
      p.push()
      p.translate(p.width / 2, p.height / 2)
      p.scale(project.canvasScale)

      let region = 0
      let isGroupEffect = false
      renderObjects.forEach((object) => {
        // グループの終了処理
        if (object.layer > region && isGroupEffect) {
          p.pop()
          isGroupEffect = false
        }
        switch (object.type) {
          case 'text':
            renderText(object as TextObject)
            break
          case 'image':
            renderImage(object as ImageObject)
            break
          case 'shape':
            renderShape(object as ShapeObject)
            break
          case 'group':
            p.push()
            isGroupEffect = true
            region = renderGroup(object as GroupObject)
            break
        }
      })
      // グループの終了処理
      if (isGroupEffect) {
        p.pop()
        isGroupEffect = false
      }

      if (showCollisionBox) {
        renderObjects.forEach((object) => {
          if (!('standardRenderSettings' in object)) return
          //if (object.type == 'group') return
          p.push()
          p.strokeWeight(3)
          p.stroke(255, 0, 0)
          p.noFill()
          p.rect(
            lerpValue(object.standardRenderSettings.X.keyframes, object.start, currentFrame),
            lerpValue(object.standardRenderSettings.Y.keyframes, object.start, currentFrame),
            50,
            50
          )
          p.pop()
        })
      }

      p.pop()

      if (!isFontLoaded) {
        p.push()
        p.textSize(10)
        p.text(
          `フォントを読み込みました: ${loadedFontName} (${Math.floor((loadedFontCount / fontListData.length) * 100)}%) `,
          p.width / 2,
          10
        )
        p.pop()
      }
    }

    ////////////////////////
    // ドラッグして位置変更 //
    ////////////////////////

    p.mousePressed = () => {
      let nearestObject: RenderObject | null = null
      let minDistance = Infinity
      const mouseX = (p.mouseX - p.width / 2) / project.canvasScale
      const mouseY = (p.mouseY - p.height / 2) / project.canvasScale

      renderObjects.forEach((object) => {
        if (!('standardRenderSettings' in object)) return

        const objectX =
          lerpValue(object.standardRenderSettings.X.keyframes, object.start, currentFrame) +
          object.standardRenderSettings.relativeX
        const objectY =
          lerpValue(object.standardRenderSettings.Y.keyframes, object.start, currentFrame) +
          object.standardRenderSettings.relativeY

        const distance = p.dist(mouseX, mouseY, objectX, objectY)
        if (distance < minDistance) {
          minDistance = distance
          nearestObject = object
          selectedObject.startObjectX = objectX
          selectedObject.startObjectY = objectY
        }
      })

      if (minDistance < 50 && nearestObject) {
        selectedObject.object = nearestObject
        selectedObject.startMouseX = mouseX
        selectedObject.startMouseY = mouseY
      } else {
        selectedObject.object = null
      }
    }

    p.mouseDragged = () => {
      if (selectedObject.object && 'standardRenderSettings' in selectedObject.object) {
        const mouseX = (p.mouseX - p.width / 2) / project.canvasScale
        const mouseY = (p.mouseY - p.height / 2) / project.canvasScale

        selectedObject.object.standardRenderSettings.X.keyframes.forEach((keyframe) => {
          keyframe.value += mouseX - selectedObject.startMouseX
        })
        selectedObject.object.standardRenderSettings.Y.keyframes.forEach((keyframe) => {
          keyframe.value += mouseY - selectedObject.startMouseY
        })

        // マウスの現在位置を更新
        selectedObject.startMouseX = mouseX
        selectedObject.startMouseY = mouseY
      }
    }

    p.mouseReleased = () => {
      selectedObject.object = null
    }

    //////////////////////////
    // 画像レンダリングの関数 //
    //////////////////////////
    const renderImage = (object: ImageObject) => {
      return null
    }

    const renderGroup = (object: GroupObject) => {
      // 2. 全体的なトランスフォームの実行(renderTextと同様)
      p.translate(
        lerpValue(object.standardRenderSettings.X.keyframes, object.start, currentFrame),
        lerpValue(object.standardRenderSettings.Y.keyframes, object.start, currentFrame)
      )
      p.rotate(lerpValue(object.standardRenderSettings.angle.keyframes, object.start, currentFrame))
      p.scale(
        lerpValue(
          convertToPercentage(object.standardRenderSettings.scale.keyframes),
          object.start,
          currentFrame
        )
      )
      return object.layer + object.groupSettings.affectLayerNum - 1
    }

    //////////////////////////
    // 図形レンダリングの関数 //
    //////////////////////////

    const renderShape = (object: ShapeObject) => {
      p.push()

      // 1. スタイルの適用
      const informStyle = new Inform(0, 0, object.start, object.end, currentFrame, p)
      object.styleSettings.stylize(informStyle)

      // 2. 全体的なトランスフォームの実行(renderTextと同様)
      p.translate(
        lerpValue(object.standardRenderSettings.X.keyframes, object.start, currentFrame),
        lerpValue(object.standardRenderSettings.Y.keyframes, object.start, currentFrame)
      )
      p.rotate(lerpValue(object.standardRenderSettings.angle.keyframes, object.start, currentFrame))
      p.scale(
        lerpValue(
          convertToPercentage(object.standardRenderSettings.scale.keyframes),
          object.start,
          currentFrame
        )
      )

      // 3. エフェクト値の計算
      const inform = new Inform(
        0,
        1, // TODO: 改行などの文字数も入っている
        object.start,
        object.end,
        currentFrame,
        p
      )
      const effectValue = object.animationSettings.animate(inform, object.animationSettings)
      //if (effectValue.opacity == 0) return
      //if (effectValue.scale == 0) return

      // 4. エフェクトの影響の適用
      p.translate(effectValue.X, effectValue.Y)
      p.rotate(effectValue.angle)
      p.scale(effectValue.scale / 100)

      // 5. 色の設定
      const col = p.color(object.shapeSettings.fill_color)
      col.setAlpha(
        (lerpValue(object.standardRenderSettings.opacity.keyframes, object.start, currentFrame) /
          100) *
          (effectValue.opacity / 100) *
          p.alpha(col)
      )
      p.fill(col)

      // S1. 図形のレンダリングの実行
      switch (object.shapeSettings.shape) {
        case ShapeType.background:
          p.background(object.shapeSettings.fill_color)
          break
        case ShapeType.rect:
          p.rect(
            0,
            0,
            lerpValue(object.shapeSettings.width.keyframes, object.start, currentFrame),
            lerpValue(object.shapeSettings.height.keyframes, object.start, currentFrame)
          )
          break
        case ShapeType.ellipse:
          p.ellipse(
            0,
            0,
            lerpValue(object.shapeSettings.width.keyframes, object.start, currentFrame),
            lerpValue(object.shapeSettings.height.keyframes, object.start, currentFrame)
          )
          break
      }
      p.pop()
    }

    //////////////////////////////
    // テキストレンダリングの関数 //
    //////////////////////////////

    const renderText = (object: TextObject) => {
      p.push()

      // 1️. スタイルの適用
      const informStyle = new Inform(0, 0, object.start, object.end, currentFrame, p)
      object.styleSettings.stylize(informStyle)

      // 2. 全体的なトランスフォームの実行
      p.translate(
        lerpValue(object.standardRenderSettings.X.keyframes, object.start, currentFrame),
        lerpValue(object.standardRenderSettings.Y.keyframes, object.start, currentFrame)
      )
      p.rotate(lerpValue(object.standardRenderSettings.angle.keyframes, object.start, currentFrame))
      p.scale(
        lerpValue(
          convertToPercentage(object.standardRenderSettings.scale.keyframes),
          object.start,
          currentFrame
        )
      )

      // T1. フォントの設定
      const foundFont = fontListData.find(
        (e) => object.textSettings.font == e.displayName
      )?.displayName
      //console.log(foundFont)
      p.textFont(foundFont ?? 'Arial')
      p.textSize(object.textSettings.textSize)
      if (!object.textSettings.individual_object) {
        p.textAlign(
          object.textSettings.align_x == TextAlignX.center
            ? p.CENTER
            : object.textSettings.align_x == TextAlignX.right
              ? p.RIGHT
              : p.LEFT,
          object.textSettings.align_y == TextAlignY.center
            ? p.CENTER
            : object.textSettings.align_y == TextAlignY.bottom
              ? p.BOTTOM
              : p.TOP
        )
      }

      // T2. 文字の二重配列化(再生途中で変わることはない…)
      const characterLines = ((text) => {
        if (!object.textSettings.individual_object) return [[text]]
        const lines = text.split(/\r?\n/)
        const lineCharacters = lines.map((line) => Array.from(line))
        return lineCharacters
      })(object.textSettings.text)

      // T3. 文字ごとの描画開始
      characterLines.forEach((characters, lineIndex) => {
        const textAnchorX = () => {
          if (object.textSettings.align_x == TextAlignX.center) return (characters.length - 1) / 2
          if (object.textSettings.align_x == TextAlignX.right) return characters.length - 1
          return 0
        }
        const textAnchorY = () => {
          if (object.textSettings.align_y == TextAlignY.center)
            return (characterLines.length - 1) / 2
          if (object.textSettings.align_y == TextAlignY.bottom) return characterLines.length - 1
          return 0
        }

        characters.forEach((character, characterIndex) => {
          p.push()

          // 3. エフェクト値の計算
          const inform = new Inform(
            characterIndex,
            characters.length,
            object.start,
            object.end,
            currentFrame,
            p
          )
          const effectValue = object.animationSettings.animate(inform, object.animationSettings)
          //if (effectValue.opacity == 0) return
          //if (effectValue.scale == 0) return

          // 4. エフェクトの影響の適用
          if (object.textSettings.isVertical) {
            p.translate(
              -lerpValue(object.textSettings.spacing_x.keyframes, object.start, currentFrame) *
                (lineIndex - textAnchorY()) +
                effectValue.Y,
              lerpValue(object.textSettings.spacing_y.keyframes, object.start, currentFrame) *
                (characterIndex - textAnchorX()) +
                effectValue.X
            )
            if (verticalCharacter.includes(character)) {
              p.rotate(90)
              if ('ｰー~～'.includes(character)) {
                p.scale(1, -1)
              }
            }
            if (punctuationCharacter.includes(character)) {
              p.textAlign(p.LEFT, p.BOTTOM)
            }
          } else {
            p.translate(
              lerpValue(object.textSettings.spacing_x.keyframes, object.start, currentFrame) *
                (characterIndex - textAnchorX()) +
                effectValue.X,
              lerpValue(object.textSettings.spacing_y.keyframes, object.start, currentFrame) *
                (lineIndex - textAnchorY()) +
                effectValue.Y
            )
          }
          p.rotate(effectValue.angle)
          p.scale(effectValue.scale / 100)

          // 5. 色の設定
          const col = p.color(object.textSettings.fill_color)
          col.setAlpha(
            (lerpValue(
              object.standardRenderSettings.opacity.keyframes,
              object.start,
              currentFrame
            ) /
              100) *
              (effectValue.opacity / 100) *
              p.alpha(col)
          )
          p.fill(col)

          // 6. テキストの描画
          if (object.textSettings.individual_object) {
            p.text(character, 0, 0)
          } else {
            // バラバラじゃない場合
            const textWidth = p.drawingContext.measureText('あ').width
            p.drawingContext.letterSpacing =
              lerpValue(object.textSettings.spacing_x.keyframes, object.start, currentFrame) + 'px'
            p.textLeading(
              lerpValue(object.textSettings.spacing_y.keyframes, object.start, currentFrame)
            )
            p.text(object.textSettings.text, 0, 0)
          }
          p.pop()
        })
      })
      p.pop()
    }

    ////////////////////////////
    // 外部に公開するための関数 //
    ////////////////////////////

    p.addRenderObjects = (currentObjects: RenderObject[]) => {
      //console.log(objects)
      renderObjects = currentObjects
      renderObjects.sort((a, b) => a.layer - b.layer)
    }

    p.updateCurrentFrame = (frame: number) => {
      currentFrame = frame
    }

    p.updateBackgroundColor = (color: string) => {
      backgroundColor = color
    }

    p.updateShowCollisionBox = (show: boolean) => {
      showCollisionBox = show
    }

    p.updateCanvasScale = () => {
      p.resizeCanvas(project.width * project.canvasScale, project.height * project.canvasScale)
    }
  }
}
// export function hoge(){} で公開して呼び出してもいい

declare module 'p5' {
  interface p5InstanceExtensions {
    addRenderObjects: (currentObjects: RenderObject[]) => void
    updateCurrentFrame: (frame: number) => void
    updateBackgroundColor: (color: string) => void
    updateShowCollisionBox: (show: boolean) => void
    updateCanvasScale: () => void
  }
}
