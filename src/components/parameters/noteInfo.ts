interface NoteSettings {
  judge: string
}

export class Note implements NoteSettings {
  judge: string

  constructor() {
    this.judge = ''
  }
}
