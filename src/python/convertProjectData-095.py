import json
import os


def convert_keyframes(settings, keys_to_convert):
    for key in keys_to_convert:
        if key in settings and isinstance(settings[key], list):
            settings[key] = {"keyframes": settings[key]}

def convert_to_standard_format(data):
    for item in data:
        # standardRenderSettings の処理
        if "standardRenderSettings" in item:
            convert_keyframes(item["standardRenderSettings"], ["X", "Y", "scale", "opacity", "angle"])

        # textSettings の処理
        if "textSettings" in item:
            convert_keyframes(item["textSettings"], ["spacing_x", "spacing_y"])

        # shapeSettings の処理
        if "shapeSettings" in item:
            convert_keyframes(item["shapeSettings"], ["width", "height"])

    return data

def convert_json_file(file_path):
    # ファイルの読み込み
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
    except FileNotFoundError:
        print(f"指定されたファイルが見つかりません: {file_path}")
        return
    except json.JSONDecodeError:
        print(f"ファイルの形式が正しくありません: {file_path}")
        return

    # データを変換
    converted_data = convert_to_standard_format(data)
    
    # 新しいファイル名を作成
    base_name, ext = os.path.splitext(file_path)
    new_file_path = f"{base_name}_convert{ext}"
    
    # 変換されたデータを新しいファイルに保存
    try:
        with open(new_file_path, 'w', encoding='utf-8') as new_file:
            json.dump(converted_data, new_file, ensure_ascii=False, indent=4)
        print(f"変換が完了しました: {new_file_path}")
    except IOError:
        print(f"ファイルの書き込みに失敗しました: {new_file_path}")

if __name__ == "__main__":
    # 標準入力でファイルパスを受け取る
    file_path = input("変換するJSONファイルのパスを入力してください: ").strip()

    # ファイルを変換
    convert_json_file(file_path)
