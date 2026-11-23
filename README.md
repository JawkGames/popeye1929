# Popeye 1929: Iron Armada (Vertical Arcade SHMUP) — Proje Notları

- **Sürüm:** `v0.009` (`src/config.js` & `www/src/config.js`)
- **Değişiklik Notu (v0.009):** Oyun durduğunda (seviye atlama/pause/game over) deprem sarsılma efektinin devam etmesi kaldırıldı. Uçaklardan konserve ve altın çıkması kaldırıldı; artık yalnızca seviye için XP kristali (`xp_gem`) çıkıyor ve seviye atlama hızı 2x yavaşlatıldı.
- **Değişiklik Notu (v0.008):** Kombo barı kaldırılarak yerine XP ve Seviye Atlama barı eklendi. Seviye atlandığında oyun durur ve 3'lü ıspanak kutusu yetenek seçim ekranı açılır. Çoklu/çapraz/yan/arka atış, seri ikili yaylım (Multishot), içinden geçen delici atış, duvardan/düşmandan seken mermi, sürekli lazer ışınları, güdümlü füzeler, döner testere disk, bumerang çapa, sonik dalga, ateş/buz/asit/yıldırım elementleri, yörünge kalkan küreleri ve savunma/can güçlendirmelerinden oluşan **50 çeşit Archero tarzı yetenek** (`src/skills.js`) ile yeni silah/mermi/kart çerçevesi görsel atlası (`assets/skills_weapons_atlas.png`) eklendi.
- **Değişiklik Notu (v0.002):** Konserve ve altınların sağa-sola kayıp oyuncudan kaçmasına yol açan yatay salınım/mıknatıs hatası kaldırıldı; nesneler artık kendi dikey hizasında sabit iniyor ve değdiğin anda alınıyor. Başlangıç ateşi 1 mermiye (`1X`) çekildi ve alınan her `2X` (veya diğer silah konserveleri) mermi sayısını kademeli olarak (`1X -> 2X -> 3X -> 4X -> 5X -> 6X -> 7X -> 8X`) artıracak şekilde güncellendi.
- **Değişiklik Notu (v0.001):** İlk tam sürüm oluşturuldu.
- **Altyapı:** HTML5 Canvas (60 FPS Object-Pooled) + Mobil 9:16 Responsive + Capacitor / AdMob uyumlu modüler mimari (`index.html` & `www/index.html`).
- **Önemli Not:** Değişiklikler görsel kontrol yapılmadan yapılıyor, hataları kullanıcı bildiriyor. Üretilen ve kullanılan tüm karakter/parça görselleri ortalanmış, sağa bakan, dik duran çizimlerdir.

---

## 1. Toplu Sprite Sheet / Texture Atlas Mimarisi (`assets/`)
API ve üretim kotasını korumak için tüm görseller dıştan flood-fill + 3 geçişli defringe + dış kontur koyulaştırma ile sıfır beyaz hareli (zero white halo) şeffaf PNG olarak **4 toplu sayfada** toplanmıştır ve `src/atlas.js` üzerinden koordinatla dilimlenerek (slicing) çizilir:

1. **`assets/ships_atlas.png` (1024x1024):**
   - **Satır 1 (`y: 0..256`):** Oyuncu uçağı düz (`player_center`), sola yatık (`player_left`), sağa yatık (`player_right`) ve yardımcı uçak (`wingman`).
   - **Satır 2 (`y: 256..512`):** 6 farklı düşman gemisi — Dikenli Keşif Küresi (`scout_pod`), Zırhlı Dişli Avcı (`fang_fighter`), Biyo-Mekanik Kalamar (`squid_mech`), Çift Namlulu Ağır Gunship (`heavy_gunship`), İntihar Torpidosu (`kamikaze_dart`), Elit Çapa Kruvazörü (`elite_cruiser`).
   - **Satır 3 (`y: 512..1024`):** Dev Kabasakal (Bluto) Demir Dretnotu Boss gemisi (`boss_dreadnought`).
2. **`assets/items_ui_atlas.png` (1024x768):**
   - Klasik Can Ispanak Konservesi (`can_hp`), `2X` (`can_2x`), `3X` (`can_3x`), `4X` (`can_4x`), `6X` (`can_6x`), Yardımcı Uçak Konservesi (`can_wingman`), Enerji Kalkanı Konservesi (`can_shield`), Süper Ispanak Bombası Konservesi (`can_bomb`), Sol Üst Popeye Konserve Portresi (`hud_portrait`), Altın (`coin_gold`), Kalp (`hud_heart`) ve Metalik Boş UI Butonu (`ui_button`).
3. **`assets/vfx_atlas.png` (1024x768):**
   - Oyuncu plazma mermisi (`bullet_player`), süper hilal mermi (`bullet_super`), düşman lazer dartı (`bullet_enemy_dart`), düşman plazma küresi (`bullet_enemy_orb`), küçük/kritik isabet kıvılcımları (`spark_small`, `spark_crit`), mavi motor alevi (`thruster_blue`), enerji kalkanı halkası (`shield_ring`) ve 4 karelik patlama dizisi (`exp_1`..`exp_4`).
4. **`assets/env_atlas.png` (1023x684):**
   - Sonsuz paralaks kayan sol ve sağ modüler metalik üs duvarları, radar kuleleri, çapa zincirli platformlar ve mavi plazma reaktörleri (`wall_left_radar`, `wall_left_reactor`, `wall_right_tower`, `wall_right_coil`, `env_asteroid`, `env_girder`).

---

## 2. Oyun Kuralları, Can, Hasar ve Güçlendirme Değerleri

### Oyuncu (`src/config.js` -> `PLAYER`)
- **Çözünürlük:** `540x960` (9:16 dikey, tüm ekranlara responsive ölçeklenir).
- **Maksimum Can (HP):** `100` (`MAX_HP: 100`).
- **Kontrol:** Göreceli Dokunmatik Sürükleme (`Relative Touch Drag`, hassasiyet `1.08`) + masaüstü fare sürükleme ve `WASD / Yön Tuşları` (`440 px/sn`). Parmak ekrana dokunduğunda uçak ışınlanmaz; ilk dokunma noktası referans alınarak birebir kayar.
- **Otomatik Ateş:** Kesintisiz aktif (`FIRE_INTERVAL: 0.145 sn`).
- **Hasar Sonrası Dokunulmazlık:** `1.1 sn` (`INVULN_TIME`).

### Silah Seviyeleri ve Konserveler (`WEAPONS` & `PICKUPS`)
- **1X (Başlangıç):** Çift hızlı burun plazması (`18` taban hasar, `880 px/sn`).
- **2X Konservesi (`can_2x`):** Çift paralel kanat atışı (`2 x 17` hasar, `900 px/sn`).
- **3X Konservesi (`can_3x`):** 3'lü yelpaze (`11°` açı, merkezde ağır süper hilal mermi).
- **4X Konservesi (`can_4x`):** 4'lü yoğun ateş hattı (`7°` iç/dış kanat yaylımı).
- **6X Konservesi (`can_6x`):** 6'lı geniş yaylım ateşi + merkez süper hilal plazma (`960 px/sn`).
- **Yardımcı Uçak Konservesi (`can_wingman`):** Her alışta oyuncunun sağ ve soluna `2` adet (maksimum `4` adet) yumuşak gecikmeyle (`FOLLOW_LERP: 9.5`) takip eden yardımcı uçak ekler (`0.28 sn` aralıkla `11` hasarlı ateş açar).
- **Ispanak Can Konservesi (`can_hp`):** `+35 HP` doldurur (`+250` skor).
- **Enerji Kalkanı Konservesi (`can_shield`):** `8.5 sn` boyunca mermileri ve çarpışma hasarını emen döner kalkan açar.
- **Süper Ispanak Bombası (`can_bomb`):** Ekrandaki tüm düşman mermilerini temizler ve tüm düşmanlara/Boss'a `420` alan hasarı verir.

### Düşman İstatistikleri (Bölüm 1 Taban Değerleri — Her Yeni Stage'de `+%35` Ölçeklenir)
| Düşman Tipi | Kod Adı | Can (HP) | Hasar | Skor | Özel Davranış |
| :--- | :--- | :---: | :---: | :---: | :--- |
| Dikenli Keşif Küresi | `scout_pod` | 34 | 14 | 120 | V-formasyonu, sinüs dalgası, tekli plazma atışı |
| Zırhlı Dişli Avcı | `fang_fighter` | 68 | 16 | 220 | Çapraz makas (Bezier), Loop-the-Loop (360° dönüş), oyuncuya nişanlı dart |
| Biyo-Mekanik Kalamar | `squid_mech` | 95 | 18 | 310 | Geniş S-dalgası ve taktiksel eskort, çift organik küre atışı |
| Ağır Çift Top Gunship | `heavy_gunship` | 155 | 20 | 450 | Kavisle girip ortada taktiksel duruş, 3'lü yelpaze atışı |
| İntihar Torpidosu | `kamikaze_dart` | 42 | 24 | 180 | Oyuncuya açı kilitleyip yüksek hızda intihar dalışı |
| Elit Çapa Kruvazörü | `elite_cruiser` | 340 | 22 | 900 | Mini-Boss, 5'li radyal küre yaylımı, garantili `4X` konservesi düşürür |
| **Kabasakal Demir Dretnotu** | `boss_dreadnought` | **4200** | **28** | **10,000** | **3 Fazlı Bölüm Sonu Boss'u** (Yelpaze toplar, çapraz küre perdesi, dron çağırma, öfke spirali) |

---

## 3. Bölüm 1 Kademeli Zaman Çizelgesi ve Sonsuz Döngü
- **0 - 30 sn (Başlangıç):** `scout_pod` V-formasyonları, sinüs kolonları ve ilk garantili `2X` ve `Ispanak` konserveleri.
- **30 - 90 sn (Gelişme):** `fang_fighter` çapraz makas ve loop-the-loop çemberleri, `squid_mech` dalgaları, `heavy_gunship` taktiksel duruşları; garantili `Wingman`, `3X`, `Kalkan` ve `4X` konserveleri.
- **90 - 150 sn (Tırmanış):** `elite_cruiser` mini-boss baskınları, `kamikaze_dart` intihar filoları, karma kombo dalgaları; garantili ikinci `Wingman`, `6X` ve `Süper Bomba` konserveleri.
- **150+ sn (Boss Savaşı):** Görsel `WARNING` uyarısı ile **Kabasakal Demir Dretnotu** sahneye iner. Boss yenildiğinde zincirleme patlamalar ve ödül yağmuru sonrasında oyun `STAGE 2`, `STAGE 3`... şeklinde sonsuz döngüyle zorluk artarak devam eder.

---

## 4. Dosya Yapısı (`src/` ve `www/src/`)
- `config.js`: Sürüm (`v0.001`), ekran, silah, konserve, düşman ve AdMob yapılandırması
- `i18n.js`: Türkçe (`TR`) ve İngilizce (`EN`) dil sözlüğü
- `audio.js`: Sentez ses içermeyen, yalnızca kullanıcı seslerini Shuffle-Bag (karışık torba) ile çalan ses yöneticisi
- `pool.js`: Mermiler, düşmanlar, konserveler, VFX ve paralaks duvarlar için `ObjectPool` sınıfı
- `atlas.js`: 4 toplu Sprite Sheet yükleyici, koordinat dilimleyici ve silüet bazlı beyaz Hit-Flash çizici
- `formations.js`: Bezier eğrileri, V-formasyonu, makas, loop-the-loop ve intihar dalışı matematik motoru
- `player.js`: Göreceli dokunmatik kontrol, otomatik ateş, yatış kareleri ve Wingman yumuşak takip sistemi
- `enemies.js`: 150 saniyelik kademeli dalga yöneticisi ve 3 fazlı Boss yapay zekası
- `ui.js`: Konsept görsele birebir uygun sol üst HUD, TR/EN dil butonu, Web tam ekran butonu ve menü/duraklatma ekranları
- `main.js`: 60 FPS oyun döngüsü, sonsuz paralaks uzay/üs akışı ve çarpışma motoru
