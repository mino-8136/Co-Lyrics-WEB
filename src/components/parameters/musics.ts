export interface Music {
  name: string
  bpm: number
  offset: number
  audioPath: string
  lyricPath: string
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
    offset: 1.80,
    audioPath: '/assets/music/誘閃光/誘閃光_192k.mp3',
    lyricPath: '/assets/music/誘閃光/誘閃光.json'
  }
]
