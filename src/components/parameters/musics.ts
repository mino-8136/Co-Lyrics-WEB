export interface Music {
  name: string
  bpm: number
  offset: number
  audioPath: string
  lyricPath: string
}

export interface Note {
  note: number
  start_time: number
  end_time: number
  lyric?: string
}

export async function getLyricMarker(lyricPath: string) {
  // 歌詞データを読み込み

  let noteData: Note[] = []
  try {
    const response = await fetch(lyricPath)
    noteData = await response.json()
  } catch (error) {
    console.error('Error loading JSON:', error)
  }
  return noteData.filter((noteData) => noteData.lyric)
}

export const musicListData: Music[] = [
  {
    name: 'レターポスト',
    bpm: 108,
    offset: 2.2,
    audioPath: '/assets/music/レターポスト/レターポスト_192k.mp3',
    lyricPath: '/assets/music/レターポスト/レターポスト_melody.json'
  },
  {
    name: '誘閃光',
    bpm: 67,
    offset: 1.8,
    audioPath: '/assets/music/誘閃光/誘閃光_192k.mp3',
    lyricPath: '/assets/music/誘閃光/誘閃光.json'
  }
]
