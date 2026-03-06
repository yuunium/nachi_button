#!/usr/bin/env python3

import json
from pathlib import Path

SOUNDS_DIR = Path("sounds")
JSON_FILE = Path("sounds.json")

# 既存データ読み込み
if JSON_FILE.exists():
    with open(JSON_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
else:
    data = []

# 既存ファイル名セット
existing_files = existing_files = set(data)

# soundsフォルダのmp3取得
mp3_files = sorted(p.name for p in SOUNDS_DIR.glob("*.mp3"))

added = 0

for file in mp3_files:
    if file not in existing_files:
        name = file.rsplit(".", 1)[0]

        data.append(file)

        added += 1

# JSON保存
with open(JSON_FILE, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"{added} 件追加しました")