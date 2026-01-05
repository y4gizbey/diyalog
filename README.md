# 🧠 Diyalog — Yerel, Açık Kaynak Sohbet Yapay Zekâsı

Diyalog, tamamen **yerel çalışan**, **Ollama tabanlı**, **açık kaynak** bir sohbet yapay zekâsı projesidir.
Bu proje; bulut bağımlılığı olmadan, API anahtarı gerektirmeden, kendi bilgisayarınızda veya sunucunuzda
özgürce çalıştırabileceğiniz modern bir AI altyapısı sunar.

---

## 🎯 Projenin Vizyonu

Bu proje özellikle **Türk girişimci geliştiricilere** ilham vermek amacıyla hazırlanmıştır.
Amaç; herkesin kendi yapay zekâ ürününü, kendi kurallarıyla ve tam kontrolle inşa edebilmesidir.

Diyalog bir “oyuncak AI” değil;  
- geliştirilebilir  
- ölçeklenebilir  
- farklı modellere uyarlanabilir  
bir altyapı sunar.

---

## 🧩 Kullanılan Teknolojiler

- **Backend:** Python + FastAPI
- **LLM Runtime:** Ollama
- **Varsayılan Model:** Qwen2.5
- **Frontend:** Web tabanlı (HTML / CSS / JS)
- **Lisans:** MIT

---

## 😎 Önizleme
<img width="1876" height="973" alt="image" src="https://github.com/user-attachments/assets/b2423341-3fc2-482a-9b47-e3372e1adf71" />


---

## 📦 Kurulum — Yerel Makine

### 1️⃣ Python Kurulumu

Python 3.10+ önerilir.

```bash
python --version
```

Eğer yüklü değilse:
👉 https://www.python.org/downloads/

---

### 2️⃣ Sanal Ortam (Önerilir)

```bash
python -m venv .venv
source .venv/bin/activate  # Linux / macOS
.venv\Scripts\activate   # Windows
```

---

### 3️⃣ Gerekli Paketler

```bash
pip install fastapi uvicorn requests
```

---

## 🧠 Ollama Nedir?

**Ollama**, büyük dil modellerini (LLM) **yerel olarak** çalıştırmanızı sağlayan bir runtime sistemidir.

- Bulut yok
- API anahtarı yok
- Tam kontrol sizde

👉 https://ollama.com

---

## ⚙️ Ollama Kurulumu

### Windows / macOS / Linux

```bash
ollama --version
```

Yüklü değilse:
👉 https://ollama.com/download

---

### Model Kurulumu (Varsayılan)

```bash
ollama pull qwen2.5
```

---

## 🖥️ Minimum Sistem Gereksinimleri (Qwen2.5)

| Bileşen | Minimum |
|------|------|
| CPU | 6 çekirdek |
| RAM | 16 GB |
| GPU | Opsiyonel |
| VRAM | 8 GB (GPU varsa önerilir) |
| Disk | ~10 GB |

> 💡 GPU olmadan da çalışır, ancak GPU performansı ciddi şekilde artırır.

---

## 🔁 Model Değiştirme

Diyalog **model bağımsızdır**.

Ancak:
- Her model aynı backend davranışını vermez
- Bazı modeller farklı prompt yapısı ister
- Bazı modeller için ek optimizasyon gerekir

Model değiştirmek için:

```python
MODEL_NAME = "qwen2.5"
```

Değiştirmeniz yeterlidir.

---

## 📂 Prompts Sistemi

`prompts/` klasörü Diyalog’un **beyni**dir.

Burada:
- System promptlar
- Davranış kuralları
- Güvenlik politikaları
- Psikoloji ve ton modülleri

bulunur.

### Prompt Düzenleme

- Her `.prompt` dosyası ayrı bir modüldür
- Değişiklik yaptıktan sonra sunucuyu yeniden başlatın
- Promptlar zincirleme çalışır

---

## 🧩 System Prompt Nedir?

System prompt:
- Yapay zekânın **nasıl davranacağını**
- **Neye cevap verip veremeyeceğini**
- **Tonunu, sınırlarını, karakterini**

belirleyen ana metindir.

Diyalog’ta bu sistem **modülerdir**.

---

## 🌐 Herkese Açık Yapay Zekâ Yapmak

### 1️⃣ VDS / Sunucu Seçimi

Önerilen minimum:

| Özellik | Değer |
|------|------|
| CPU | 8 Core |
| RAM | 32 GB |
| Disk | 100 GB SSD |
| GPU | Opsiyonel (NVIDIA tercih edilir) |

---

### 2️⃣ Sunucuya Kurulum

- Ubuntu 22.04 önerilir
- Python + Ollama kur
- Projeyi `git clone` ile al
- Uvicorn ile çalıştır

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

### 3️⃣ Güvenlik

- Reverse proxy (Nginx)
- Firewall
- Rate limit önerilir

---

## 🧑‍💻 Geliştirici

- **Kullanıcı adı:** [y4gizbey](https://github.com/y4gizbey)
- **İsim:** Yağız Efe AĞCAHAN
- **Kullanıcı adı:** [Sefflex](https://github.com/Sefflex)
- **İsim:** Rahmi Çınar SARİ

Bu proje; deneye deneye, bozula bozula,
gerçek bir ürün ortaya koymak isteyen herkes içindir.

---

## 📜 Lisans

MIT License  
İstediğin gibi kullan, değiştir, dağıt.

Ama:
> **Bir şey inşa ediyorsan, arkasında dur.**

---

## ⭐ Son Söz

Diyalog bir “hazır AI” değil.  
Diyalog bir **altyapı**.

Gerisi:
- Senin hayal gücün
- Senin disiplinin
- Senin cesaretin


