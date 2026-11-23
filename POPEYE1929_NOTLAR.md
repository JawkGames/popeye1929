# Popeye 1929: Iron Armada — Oyun Notları

Bu dosya `README.md` ile senkron tutulmaktadır. Tüm güncel can, hasar, konserve, formasyon ve sürüm bilgileri için `README.md` dosyasına bakınız.

- **Güncel Sürüm:** `v0.008`
- **Not:** Değişiklikler görsel kontrol yapılmadan yapılıyor, hataları kullanıcı bildiriyor. Üretilen ve kullanılan tüm karakter/parça görselleri ortalanmış, sağa bakan, dik duran çizimlerdir.

## v0.008 — Archero Tarzı 50 Yetenek, XP Barı ve 3'lü Ispanak Seçim Ekranı
- **HUD XP Barı:** Sol üstteki `KOMBO` barı kaldırıldı, yerine `SV / LV` göstergeli zümrüt yeşili **XP Barı** eklendi. Düşman öldürdükçe, altın/konserve ve düşen `xp_gem` kristallerini topladıkça XP barı dolar.
- **Seviye Atlama & 3'lü Ispanak Kutusu Seçimi:** XP barı dolduğunda oyun otomatik duraklatılır (`LEVELUP` durumu) ve ekrana `ui_skill_card` çerçevesi içinde **3 farklı ıspanak yetenek kartı** gelir. Seçim yapılınca yetenek uçağa anında uygulanır ve oyun devam eder.
- **50 Çeşit Yetenek (`src/skills.js`):**
  - Çoklu/Yönlü Atışlar: Ön ekstra namlu, çapraz yaylım, yan kanat topları, arka kuyruk topu, seri ikili yaylım (Multishot), geniş yelpaze, 360° yıldız halkası, çifte namlu evrimi.
  - Mermi Fiziği: İçinden geçen delici atış (`piercing_shot`), duvardan seken mermi (`bouncy_walls`), düşmandan düşmana zincirleme sekme (`ricochet_shot`), güdümlü mermiler, şarapnel bölünmesi, dev kalibre, süpersonik namlu, sarsıcı geri itme.
  - Özel Silahlar: Merkez sürekli lazer ışını (`laser_beam`), çift kanat lazeri (`twin_laser`), mega lazer reaktörü, güdümlü füze bataryası (`homing_missiles`), döner testere disk (`sawblade_disc`), bumerang savaş çapası (`boomerang_anchor`), sonik hilal dalgası (`sonic_wave`), ıspanak roket yağmuru, otonom omuz tareti, ağır plazma topu.
  - Elementler & Efektler: Ejder ateşi napalm (`fire_rounds`), buzul dondurucu (`ice_rounds`), korozif asit (`acid_rounds`), zincirleme yıldırım (`chain_lightning`), yıldırım fırtınası (`lightning_storm`), patlayıcı çekirdek, infazcı (`headshot_kill`), dretnot avcısı (`boss_hunter`).
  - Hız, Kritik, Yörünge & Savunma: Hızlı atış (Turbo/Gatling), saf ateş gücü, kritik şans/hasar, Temel Reis öfkesi (Berserker), yardımcı uçak filosu, yörünge kalkan küreleri (`orbital_orbs`), döner çapa testeresi (`orbital_anchors`), maksimum can artışları, vampirik can çalma, otomatik tamir botları, hayalet manevra (Dodge), periyodik kalkan ve XP bilgeliği.
- **Yeni Görsel Atlası (`assets/skills_weapons_atlas.png`):** Lazer ışını, güdümlü füze, döner testere, bumerang çapa, alev topu, buz kristali, asit mermisi, yıldırım arkı, 3 özel renkli ıspanak yetenek konservesi (kırmızı, mor, altın), yörünge küresi, 3'lü seçim kartı çerçevesi, XP kristali, sonik hilal dalgası ve seviye atlama rozeti eklendi.

## v0.007
- Hasar alınca silaha bir şey olmaz; sadece ölüp baştan başlayınca her şey sıfırlanır. Reklamla canlanmada güç korunur.

## v0.006 — Silah merdiveni ve konserve tablosu
- `WEAPON_LADDER` (T ince, K kalın): 1 T · 2 TT · 3 K · 4 TKT · 5 TTKTT · 6 KKK · 7 TKKKT · 8 KKKKK (max). Seviye 6+ yardımcı uçaklar da kalın atar.
- 2X: +1 adım · 3X: +1 adım + hasar %15 (max 4 kez) · 4X: atış hızı +%15 (max 3) · 6X: hepsi. Hepsi full iken gelen silah konservesi: uçak varsa uçak hasarı +%25, yoksa skor.
- Düşüş: düşman öldürünce %10 konserve (`CAN_TABLE`: hp 25, 2x 25, kalkan 13, 3x 12, uçak 10, 4x 8, bomba 4, 6x 3), %34 altın. Stage 1'de 6X yok.
- Zamanlı/periyodik konserveler kaldırıldı; sadece 20. sn garantili ıspanak. Boss faz geçişi ıspanak/kalkan ve boss sonrası 4X duruyor.

## v0.005
- Silah konservesi oranı 0.05 (önceki 0.2nin 4te 1i). Stage 1de (boss öncesi) sadece 2X çıkar; boss sonrası tek 4X düşer.
- Her silah konservesi sadece +1 atış ekler (1,2,3,4,5...), seviye atlamaz.
- Ispanak yarı yarıya az: `HP_CAN_RATE: 0.5`, 142. sn garantili ıspanak kaldırıldı.
- Normal düşman hasarı x1.5: `ENEMY_DAMAGE_MULT`.

## v0.004
- Wingman konservesi artık 1 uçak ekler; sırayla sol, sağ, sol, sağ (maks 4).

## v0.003
- Ekran: genişlik 540 sabit, yükseklik telefon oranına göre dinamik (MIN 800 / MAX 1400, `GAME_CONFIG.HEIGHT` resize'da güncellenir). Üst/alt kesilmez. HUD sol üst, butonlar sağ üst köşede; menü/pause/gameover ortası `ui.midOff` ile dikeyde ortalanır.
- Silah konserveleri (2X/3X/4X/6X) ~5 kat azaltıldı: `WEAPON_CAN_RATE: 0.2`.
- Boss gücü 2 kat: `BOSS_POWER: 2` (can ve tüm boss mermi hasarı).
