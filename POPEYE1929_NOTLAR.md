# Popeye 1929: Iron Armada — Oyun Notları

Bu dosya `README.md` ile senkron tutulmaktadır. Tüm güncel can, hasar, konserve, formasyon ve sürüm bilgileri için `README.md` dosyasına bakınız.

- **Güncel Sürüm:** `v0.005`
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
