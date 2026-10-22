"""Записывает озвучку приложения нейросетевым голосом в public/audio/*.mp3.

Запуск из корня проекта:  .venv\\Scripts\\python.exe tools\\make_audio.py [--force]

Список текстов берётся из src/content.ts (allUtterances). Уже записанные файлы
не трогаются; --force перезаписывает всё (нужно после смены голоса или темпа).
Итог — src/audio.json: «текст → файл»; чего там нет, приложение читает
синтезатором устройства.

Тексты уходят в онлайн-сервис Microsoft Edge TTS — нужен интернет.
"""
import asyncio
import hashlib
import json
import subprocess
import sys
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent.parent
AUDIO_DIR = ROOT / "public" / "audio"
MANIFEST = ROOT / "src" / "audio.json"

VOICE = "ru-RU-SvetlanaNeural"
RATE = "-12%"        # фразы и слова — чуть медленнее обычной речи
RATE_SHORT = "-25%"  # отдельные слоги и буквы — ещё медленнее, чтобы расслышать
PITCH = "+4Hz"       # немного выше — голос звучит мягче

# Слова, которые вне фразы читаются с неверным ударением: «на горе́», но «го́ре».
STRESS = {"горе": "горе́", "села": "се́ла"}


def file_name(text: str) -> str:
    return hashlib.md5(text.encode("utf-8")).hexdigest()[:12] + ".mp3"


async def record(text: str, path: Path, gate: asyncio.Semaphore) -> bool:
    short = " " not in text and len(text) <= 4
    last: object = "пустой файл"
    async with gate:
        for attempt in range(3):
            try:
                tts = edge_tts.Communicate(STRESS.get(text, text), VOICE, rate=RATE_SHORT if short else RATE, pitch=PITCH)
                await tts.save(str(path))
                if path.stat().st_size > 0:
                    return True
            except Exception as exc:  # сеть или сервис: пробуем ещё раз
                last = exc
                await asyncio.sleep(1 + attempt)
        print(f"  НЕ ЗАПИСАНО: {text!r} ({last})")
        path.unlink(missing_ok=True)
        return False


async def main() -> int:
    force = "--force" in sys.argv
    listing = subprocess.run(["node", "tools/utterances.mjs"], cwd=ROOT, capture_output=True, check=True)
    texts: list[str] = json.loads(listing.stdout.decode("utf-8"))
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)

    gate = asyncio.Semaphore(4)
    todo = [t for t in texts if force or not (AUDIO_DIR / file_name(t)).exists()]
    print(f"текстов: {len(texts)}, записать: {len(todo)}")
    await asyncio.gather(*(record(t, AUDIO_DIR / file_name(t), gate) for t in todo))

    manifest = {t: file_name(t) for t in texts if (AUDIO_DIR / file_name(t)).exists()}
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=0, sort_keys=True) + "\n", encoding="utf-8")

    # файлы от текстов, которых в приложении больше нет
    keep = set(manifest.values())
    stale = [f for f in AUDIO_DIR.glob("*.mp3") if f.name not in keep]
    for f in stale:
        f.unlink()

    missing = len(texts) - len(manifest)
    print(f"в манифесте: {len(manifest)}, удалено устаревших: {len(stale)}, без записи: {missing}")
    return 1 if missing else 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
