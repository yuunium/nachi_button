from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import time
import subprocess

last_run = 0

class Handler(FileSystemEventHandler):
    def on_created(self, event):
        global last_run

        # フォルダは無視（ファイルだけ）
        if event.is_directory:
            return

        now = time.time()

        # 2秒以内は無視（連続実行防止）
        if now - last_run < 2:
            return

        print("ファイル追加:", (event.src_path)[8:])

        subprocess.run(["python3", "./make_json.py"])

        last_run = now

observer = Observer()
observer.schedule(Handler(), path="./sounds", recursive=False)
observer.start()

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    observer.stop()

observer.join()