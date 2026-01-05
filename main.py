from pathlib import Path
import json
import requests
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "qwen2.5"  # Yerel, tutarlı ve Türkçe destekli model
PROMPT_DIR = Path(__file__).parent / "prompts"

app.mount("/static", StaticFiles(directory="static"), name="static")


def read_module(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except FileNotFoundError:
        return ""
    except Exception as exc:
        return f"# Modül okunamadı ({path.name}): {exc}"


def detect_intents(user_message: str, history: list) -> dict:
    text = (user_message + " " + " ".join([msg.get("content", "") for msg in history[-3:]])).lower()
    intents = {
        "truth_guard": any(
            kw in text
            for kw in [
                "atatürk",
                "savaş",
                "istanbul",
                "tbmm",
                "osmanlı",
                "cumhuriyet",
                "seçim",
                "devlet",
                "tarih",
                "1923",
                "ankara",
            ]
        ),
        "science_health": any(
            kw in text
            for kw in [
                "ağrı",
                "hastalık",
                "ilaç",
                "doz",
                "belirti",
                "tanı",
                "psikiyatri",
                "depresyon",
                "panik",
                "kireçlenme",
            ]
        ),
        "psychology": any(
            kw in text
            for kw in [
                "kaygı",
                "özgüven",
                "ilişki",
                "manipülasyon",
                "duygu",
                "pişmanlık",
                "özlem",
                "travma",
            ]
        ),
        "memory": any(
            kw in text
            for kw in ["hatırla", "kaydet", "aklında tut", "unutma", "hafıza", "remember"]
        ),
    }
    return intents


def build_system_prompt(user_message: str, history: list, workspace: str = None, memory_items: list = None) -> str:
    intents = detect_intents(user_message, history)
    modules = []
    order = [
        "00_core_identity.prompt",
        "03_ethics_security.prompt",
        "01_behavior_tone.prompt",
    ]
    if intents.get("truth_guard"):
        order.append("04_truth_guard.prompt")
    if intents.get("science_health"):
        order.append("05_science_health_lock.prompt")
    if intents.get("psychology"):
        order.append("06_human_psychology.prompt")
    if intents.get("memory"):
        order.append("07_memory_manager.prompt")
    order.extend(["02_format_engine.prompt", "08_self_critique_filter.prompt"])

    for fname in order:
        content = read_module(PROMPT_DIR / fname)
        if content:
            modules.append(content)

    prompt_sections = list(modules)

    if workspace:
        prompt_sections.append(f"Çalışma alanı: {workspace}")

    if memory_items:
        mem_lines = ["Hafızadaki notlar (ilgili özetler):"]
        for item in memory_items[-5:]:
            title = item.get("title", "")
            content = item.get("content", "")
            mem_lines.append(f"- {title}: {content}")
        prompt_sections.append("\n".join(mem_lines))

    for msg in history:
        role = msg.get("role")
        content = msg.get("content", "")
        if role == "user":
            prompt_sections.append(f"Kullanıcı: {content}")
        elif role == "assistant":
            prompt_sections.append(f"Asistan: {content}")
    prompt_sections.append(f"Kullanıcı: {user_message}")
    prompt_sections.append("Asistan:")
    return "\n\n".join(prompt_sections)


@app.get("/")
async def root():
    return FileResponse("static/index.html")


@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    user_message = data.get("message", "")
    history = data.get("history", [])
    workspace = data.get("workspace")
    memory_items = data.get("memory", [])

    system_prompt = build_system_prompt(user_message, history, workspace, memory_items)

    payload = {
        "model": MODEL_NAME,
        "prompt": system_prompt,
        "stream": True,
    }

    def generate():
        try:
            response = requests.post(OLLAMA_URL, json=payload, stream=True, timeout=120)
            response.raise_for_status()
            for line in response.iter_lines():
                if not line:
                    continue
                try:
                    data = json.loads(line.decode("utf-8"))
                    if "response" in data:
                        yield data["response"]
                    if data.get("done"):
                        break
                except json.JSONDecodeError:
                    continue
        except requests.exceptions.RequestException as e:
            yield (
                f"Hata: Ollama bağlantısı sağlanamadı. "
                f"Lütfen '{MODEL_NAME}' modelinin yüklü ve çalışır olduğundan emin olun. "
                f"Detay: {str(e)}"
            )
        except Exception as e:
            yield f"Hata: Beklenmeyen bir sorun oluştu. {str(e)}"

    return StreamingResponse(generate(), media_type="text/plain")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)

# Test senaryoları:
# 1) "Atatürk kimdir?" → kurgu yok, doğru ve net
# 2) "Şu ilacı kaç mg alayım?" → reddet + doktora yönlendir
# 3) "Kanka naber?" → rahat mod
# 4) "Bunu hatırla adım Yağız" → “hatırlamamı ister misin?” sorusu
