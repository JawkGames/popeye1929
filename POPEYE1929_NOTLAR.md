# Popeye 1929: Iron Armada — Oyun Notları

Bu dosya `README.md` ile senkron tutulmaktadır. Tüm güncel can, hasar, konserve, formasyon ve sürüm bilgileri için `README.md` dosyasına bakınız.

- **Güncel Sürüm:** `v0.007`
- **Not:** Değişiklikler görsel kontrol yapılmadan yapılıyor, hataları kullanıcı bildiriyor. Üretilen ve kullanılan tüm karakter/parça görselleri ortalanmış, sağa bakan, dik duran çizimlerdir.

## v0.003
- Ekran: genişlik 540 sabit, yükseklik telefon oranına göre dinamik (MIN 800 / MAX 1400, `GAME_CONFIG.HEIGHT` resize'da güncellenir). Üst/alt kesilmez. HUD sol üst, butonlar sağ üst köşede; menü/pause/gameover ortası `ui.midOff` ile dikeyde ortalanır.
- Silah konserveleri (2X/3X/4X/6X) ~5 kat azaltıldı: `WEAPON_CAN_RATE: 0.2` (rastgele/düşman/garantili düşüşlerde %80'i altına döner). Zaman çizelgesinde sadece 1 adet 2X (60. sn).
- Boss gücü 2 kat: `BOSS_POWER: 2` (can ve tüm boss mermi hasarı).

## v0.004
- Wingman konservesi artık 1 uçak ekler; sırayla sol, sağ, sol, sağ (maks 4).

## v0.005
- Silah konservesi oranı 0.05 (önceki 0.2nin 4te 1i). Stage 1de (boss öncesi) sadece 2X çıkar; boss sonrası tek 4X düşer.
- Her silah konservesi sadece +1 atış ekler (1,2,3,4,5...), seviye atlamaz.
- Ispanak yarı yarıya az: `HP_CAN_RATE: 0.5`, 142. sn garantili ıspanak kaldırıldı.
- Normal düşman hasarı x1.5: `ENEMY_DAMAGE_MULT`.

## v0.006 — Silah merdiveni ve konserve tablosu
- `WEAPON_LADDER` (T ince, K kalın): 1 T · 2 TT · 3 K · 4 TKT · 5 TTKTT · 6 KKK · 7 TKKKT · 8 KKKKK (max). Seviye 6+ yardımcı uçaklar da kalın atar.
- 2X: +1 adım · 3X: +1 adım + hasar %15 (max 4 kez) · 4X: atış hızı +%15 (max 3) · 6X: hepsi. Hepsi full iken gelen silah konservesi: uçak varsa uçak hasarı +%25, yoksa skor.
- Düşüş: düşman öldürünce %10 konserve (`CAN_TABLE`: hp 25, 2x 25, kalkan 13, 3x 12, uçak 10, 4x 8, bomba 4, 6x 3), %34 altın. Stage 1'de 6X yok.
- Zamanlı/periyodik konserveler kaldırıldı; sadece 20. sn garantili ıspanak. Boss faz geçişi ıspanak/kalkan ve boss sonrası 4X duruyor.
- (v0.007) Hasar alınca silaha bir şey olmaz; sadece ölüp baştan başlayınca her şey sıfırlanır. Reklamla canlanmada güç korunur.
