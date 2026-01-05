# 🔐 Security Policy

Bu belge, **Diyalog** projesinin güvenlik kapsamını, sınırlarını ve sorumluluklarını açıkça belirtmek amacıyla hazırlanmıştır.

---

## 📌 Projenin Kapsamı

Diyalog:
- Yerel çalışan (local-first)
- Açık kaynak
- Ollama tabanlı
bir sohbet yapay zekâsı altyapısıdır.

Bu proje:
- Bir ürün değildir
- Ticari bir servis sunmaz
- Varsayılan olarak herkese açık bir API sağlamaz

---

## ⚠️ Sorumluluk Reddi (Disclaimer)

Bu projeyi kullanan herkes:

- Kendi sisteminde çalıştırdığını
- Kendi aldığı sunucu/VDS üzerinde barındırdığını
- Kendi yapılandırmalarından sorumlu olduğunu

kabul etmiş sayılır.

**Geliştirici:**
- Sunucu güvenliğinden
- Ağ yapılandırmasından
- Kullanıcı verilerinden
- Yetkisiz erişimlerden
- Hukuki kullanım biçimlerinden

**SORUMLU DEĞİLDİR.**

---

## 🧠 Yapay Zekâ Davranışı Hakkında

Diyalog:
- Kullanıcı girdilerine dayalı çıktı üretir
- Gerçek kişi değildir
- Bilinçli veya iradeli değildir
- Hukuki, tıbbi veya finansal tavsiye vermez

Üretilen cevapların sorumluluğu **kullanıcıya aittir**.

---

## 🔒 Güvenlik Önlemleri (Önerilen)

Eğer Diyalog’u herkese açık bir sistem olarak kullanacaksanız:

- Reverse proxy (Nginx / Caddy) kullanın
- Rate limiting uygulayın
- Firewall kuralları ekleyin
- SSH erişimini sınırlandırın
- Güncel işletim sistemi kullanın
- `.env` ve gizli dosyaları GitHub’a koymayın

---

## 🚫 Yasaklı Kullanım Alanları

Bu proje aşağıdaki amaçlarla KULLANILAMAZ:

- Yasadışı faaliyetler
- Zararlı yazılım üretimi
- İzinsiz erişim veya hackleme
- Kişisel veri toplama
- Kimlik avı (phishing)
- Nefret söylemi veya şiddet çağrısı
- Çocuk istismarı veya cinsel içerik

Bu tür kullanımlardan doğan tüm sorumluluk **kullanıcıya aittir**.

---

## 🧩 Açık Kaynak ve Değişiklikler

Diyalog MIT lisansı ile dağıtılmaktadır.

- Kodu değiştirebilirsiniz
- Kendi sisteminize uyarlayabilirsiniz
- Farklı modellerle kullanabilirsiniz

Ancak:
- Yapılan değişikliklerden geliştirici sorumlu tutulamaz
- Fork’lanan projeler ayrı sorumluluk taşır

---

## 🐞 Güvenlik Açığı Bildirimi

Eğer projede bir güvenlik açığı fark ederseniz:

- Lütfen doğrudan exploit yayınlamayın
- GitHub Issues üzerinden sorumlu şekilde bildirin

Amaç:
- Projeyi daha güvenli hale getirmek
- Kullanıcıları riske atmamak

---

## 👤 Geliştirici

- GitHub: **@y4gizbey**
- İsim: **Yağız Efe Ağcahan**

---

## 📜 Son Not

Bu proje:
- Deneysel
- Eğitsel
- Geliştirici odaklı

bir altyapıdır.

Kullanım sorumluluğu **tamamen kullanıcıya aittir**.
