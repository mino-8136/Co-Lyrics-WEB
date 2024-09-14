import mido
import json
import os

def ticks_to_seconds(ticks, ticks_per_beat, tempo):
    # Convert ticks to seconds
    return mido.tick2second(ticks, ticks_per_beat, tempo)

def get_note_and_lyrics_times(midi_file_path):
    midi = mido.MidiFile(midi_file_path)
    notes = []
    time = 0
    note_on_times = {}
    current_tempo = 500000  # default tempo is 500,000 microseconds per beat (120 BPM)
    current_lyrics = None  # 現在の歌詞を一時保存する変数
    
    for track in midi.tracks:
        for msg in track:
            time += ticks_to_seconds(msg.time, midi.ticks_per_beat, current_tempo)
            if msg.type == 'set_tempo':
                current_tempo = msg.tempo
            elif msg.type == 'note_on' and msg.velocity > 0:
                note_on_times[msg.note] = {
                    'start_time': time,
                    'lyrics': current_lyrics  # 歌詞がある場合はここに保存
                }
                current_lyrics = None  # 歌詞をリセット
            elif msg.type == 'note_off' or (msg.type == 'note_on' and msg.velocity == 0):
                if msg.note in note_on_times:
                    note_on_time = note_on_times.pop(msg.note)
                    notes.append({
                        'note': msg.note,
                        'start_time': note_on_time['start_time'],
                        'end_time': time,
                        'letter': note_on_time['lyrics']  # ノートに対応する歌詞を追加
                    })
            elif msg.type == 'lyrics':
                current_lyrics = msg.text.encode('latin1').decode('utf-8')  # 歌詞を一時的に保持し、次のノートと結びつける

    return notes

def save_notes_to_json(notes, output_file_path):
    with open(output_file_path, 'w', encoding='utf-8') as f:
        json.dump(notes, f, indent=4, ensure_ascii=False)

if __name__ == "__main__":
    # 標準入力でファイルパスを受け取る
    midi_file_path = input("MIDIファイルのパスを入力してください: ").strip()

    # 出力ファイルのパスを入力ファイルと同じディレクトリに作成
    base_name, _ = os.path.splitext(midi_file_path)
    output_file_path = f"{base_name}.json"

    # MIDIファイルからノートと歌詞の時間情報を取得
    note_times = get_note_and_lyrics_times(midi_file_path)

    # JSONファイルに保存
    save_notes_to_json(note_times, output_file_path)

    print(f"ノートと歌詞の時間情報が {output_file_path} に保存されました。")
