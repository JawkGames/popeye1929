# Popeye 1929: Iron Armada — Oyun Notları

Bu dosya `README.md` ile senkron tutulmaktadır. Tüm güncel can, hasar, konserve, formasyon ve sürüm bilgileri için `README.md` dosyasına bakınız.

- **Güncel Sürüm:** `v0.021`
- **Not:** Değişiklikler görsel kontrol yapılmadan yapılıyor, hataları kullanıcı bildiriyor. Üretilen ve kullanılan tüm karakter/parça görselleri ortalanmış, sağa bakan, dik duran çizimlerdir.

## v0.021 — Dişli Çerçeveli Yeni Can & XP Bar Sistemi (Skorsuz), 16'lı Özel Arayüz/Reklam İkon Atlası ve 17 Dilli Dil Sistemi
- **Yeni Dişli Çerçeveli Can & Seviye Bar Sistemi (`assets/hud_bar_atlas.png`, `src/ui.js`):** Kullanıcının gönderdiği dolu (kırmızı can + mavi XP) ve boş dişli çerçeveli Popeye bar görselleri piksel hizalı şeffaf atlasa dönüştürüldü. Skor tutma ve ekranda skor gösterimi tamamen kaldırıldı (seviye `SV / LV` ve bölüm ana ilerleme göstergesidir).
- **16'lı (4x4) Özel Arayüz İkonları, Butonlar ve Game Over Rozeti (`assets/ui_icons_atlas.png`):** Tek sayfada 16 yeni arayüz görseli üretildi ve bağlandı:
  - Sağ üst metalik ikonlu butonlar: Duraklat (`icon_pause`), Ses Açık (`icon_sound_on`), Ses Kapalı (`icon_sound_off`), Tam Ekran (`icon_fullscreen`), Dil Küresi (`icon_lang`).
  - Aksiyon ikonları ve geniş butonlar: Kalpli Video Klaket Reklam İkonu (`icon_video_ad`), Yeniden Başla Oku (`icon_restart`), Oynat/Devam Üçgeni (`icon_play`), Yeşil/Mavi/Altın geniş metalik butonlar (`btn_green`, `btn_blue`, `btn_gold`) ve dişli köşeli modal çerçeve (`panel_modal`).
  - Rozetler: Özel Gemi Düştü / Game Over rozeti (`emblem_gameover`), Zafer Çapası (`emblem_victory`), Boss Kuru Kafa Dişli Uyarı rozeti (`emblem_boss_warn`) ve Kanatlı Kalp Kalkanı (`emblem_shield_heart`).
- **Game Over Ekranı Düzeni (`src/ui.js`):** Dişli köşeli modal panel üzerine özel Game Over rozeti, ulaşılan seviye/bölüm (`SV X · BÖLÜM Y`), solunda video klaket reklam ikonu bulunan yeşil `REKLAMLA CANLAN` (`+%100 CAN` yazısı kaldırıldı, butona otomatik sığan taşmasız yazı) ve döner oklu mavi `YENİDEN BAŞLA` butonu yerleştirildi.
- **17 Dilli Çoklu Dil Sistemi (`src/i18n.js`):** `TR, EN, ES, HI, PT, FIL, ID, AF, RU, KO, MS, IT, DE, EL, FR, AR, UR` olmak üzere 17 dil desteği ve `localStorage` dil kaydı eklendi (`STAGE` Türkçe'de `BÖLÜM` olarak düzeltildi).

## v0.020 — Yeni Kokpit Oyun İkonu (Köşe Beyazlıkları Silinmiş) ve Soldan Sağa Renklenen 9:16 Loading Ekranı
- **Oyun İkonu (`magaza/icon-512.png`, `android/app/src/main/res/mipmap-*`, `www/favicon.png`, `www/apple-touch-icon.png`):** Kullanıcının gönderdiği kokpit içi Popeye oyun ikonunun 4 dış köşesindeki beyazlıklar flood-fill + 4 geçişli defringe ile sıfır kenar beyazlığı kalacak şekilde şeffaflaştırıldı ve tüm mağaza/Android ikonlarına uygulandı.
- **Soldan Sağa Renklenen 9:16 Loading Ekranı (`index.html`, `src/main.js`, `assets/acilis.jpg`):** Kullanıcının gönderdiği 9:16 açılış görseli (`#acilis` + `#ac_gri`) oyuna eklendi. Yükleme boşken görsel tamamen siyah-beyaz (`grayscale(1)`) başlar, yükleme doldukça `--p` maskesiyle soldan sağa doğru renklenir ve tamamlandığında yumuşakça açılarak menüye geçer.

## v0.019 — Ortak Keyli (`com.jawk.popeye1929`) Android / AAB Kurulumu ve Oyun İkonu
- **Capacitor & Ortak Keyli AAB Derleme Sistemi (`android/`, `.github/workflows/android.yml`, `capacitor.config.json`):** Paket adı `com.jawk.popeye1929`, JawkGames ortak upload key (`secrets.UPLOAD_KEYSTORE_BASE64` + `secrets.UPLOAD_KEY_PASSWORD`, alias: `upload`), R8 kod ve kaynak küçültme (`minifyEnabled true`, `shrinkResources true`, `proguard-rules.pro`), opsiyonel donanım özellikleri (`android:required="false"`), gerçek AdMob App ID (`ca-app-pub-7983529419004158~9792828487`), dikey immersive tam ekran (`MainActivity.java`), Android geri tuşu (`window.geriTus()`) ve arka plana geçince otomatik duraklatma eklendi.
- **Oyun İkonu ve Açılış Görselleri (`magaza/icon-512.png`, `android/app/src/main/res/mipmap-*`, `drawable*/splash.png`, `www/favicon.png`):** 3D Popeye pilot portresi ve savaş uçağı rozetiyle 512x512 Play Store ikonu, tüm Android `mipmap-mdpi..xxxhdpi` ikonları, 1024x500 mağaza görseli ve dikey açılış ekranı (`splash.png`) oluşturuldu.

## v0.018 — Lineer Gelişim, 8X Silah Evrimi, Yetenek Dengesi, 3D Popeye Portre Tamamlaması ve AdMob Güçlendirmesi
- **15 Bölümlü Lineer Düşman İlerlemesi (`src/enemies.js`):** Stage 5 sonrası Stage 6'da düşmanların tekrar Stage 2 seviyesine düşmesi düzeltildi. 26 düşman tipi Stage 1'den Stage 15'e kadar hiçbir bölümde geriye düşmeden kademeli olarak güçlenecek şekilde dağıtıldı.
- **Silah Merdiveninin (`1X` → `8X`) Tam Açılması (`src/skills.js`, `src/enemies.js`):** `fan_spread`, `side_shot`, `rapid_fire_2`, `damage_up_1` yeteneklerine ve her 2 Boss galibiyetine `+1` ana silah kademesi evrimi eklendi; böylece `8X (KKKKK)` maksimum silah kademesi ve `6X+` kalın Wingman atışı oyun içinde lineer olarak açılır.
- **3D Popeye Portresinin Tüm Ekranlara Bağlanması (`src/ui.js`, `src/skills.js`):** Ana Menü, Game Over ekranı ve can/onarım yetenek kartlarında kalan eski `can_hp` (konserve üstü Popeye) referanslarının tamamı yeni 3D Popeye portresi (`hud_portrait`) ve yetenek konserveleriyle değiştirildi.
- **Yetenek Açıklaması ve Kod Eşitlemesi (`src/player.js`):** Güdümlü füze bataryası (2'li füze), Dev Kalibre (`+%35 boyut / +%25 hasar`), Süpersonik Namlu (`+%40 hız / +%20 hasar`), Korozif Asit (`+%30 hasar`), Sarsıcı İtme (`+%20 hasar`), Temel Reis Öfkesi (`+%65'e kadar`), Otomatik Tamir Botları (`+3 HP/sn`) ve Hayalet Manevra (`%22 Dodge`) kod değerleri kart açıklamalarıyla birebir eşitlendi.
- **Boss Ödülleri, Bölüm Başlığı ve Klavye Temizliği:** Boss skor yazısı gerçek Boss puanını (`+10,000`..`+40,000`) gösterecek ve Boss XP kristalleri bölüme göre artacak şekilde güncellendi. Yeni bölüme geçildiğinde ekranda bölüm adı (`STAGE 2: HURDA TERSANESİ` vb.) gösterilir. Klavyedeki `[` / `]` Boss atlama kısayolları kaldırıldı.
- **AdMob Reklam Sistemi (`src/ads.js`, `src/config.js`):** Gerçek AdMob App ID (`ca-app-pub-7983529419004158~9792828487`), Ödüllü Canlanma (`ca-app-pub-7983529419004158/1726762511`) ve Bölüm Sonu/Yeniden Başlatma Geçiş Reklamı (`ca-app-pub-7983529419004158/8531717703`) aktif (`IS_TEST: false`). Reklam gösterimi sırasında oyun sesinin otomatik susturulup reklam kapanınca geri açılması, hazır olmayan reklamı anında yükleme (`on-demand prepare`) ve reklam yüklenemezse kullanıcıya bildirim gösterilmesi eklendi.

## v0.017
- Ekranın sol ve sağ altındaki bölüm/Boss atlama ok butonları (`◀` / `▶`) kaldırıldı.

## v0.016
- **Anında Açılış & Atlas Yükleme Güvenliği (`src/main.js`, `src/atlas.js`, `src/ui.js`):** `DOMContentLoaded` yarış durumu (betikler geç yüklendiğinde oyunun hiç başlamaması) ve 8 büyük PNG atlasının tamamı inene kadar oyun döngüsünün/menünün kilitli kalması düzeltildi. Oyun döngüsü ve menü artık ilk karede anında açılır; görseller arka planda indikçe kesintisiz çizilir.

## v0.015
- **Stage 11 Uzuv / Ahtapot Kolu & Sarmaşık Nesnesi:** Stage 11'deki dikdörtgen ekran kesiti kaldırıldı; yerine soldan ve sağdan uzanan izole ahtapot kolu, dikenli sarmaşık ve parlayan spor kesesi (`env2_bioroot` -> `assets/stage_env_atlas.png`) üretilip gömüldü.
- **Stage 3 Fabrika İç Beyazlık Temizliği:** `env2_furnace` (buhar kazanı/fabrika) görselindeki vana tekerlekleri ve boru kıvrımları arasında kalan kapalı beyaz boşluklar tamamen şeffaflaştırıldı.
- **3D Popeye Profil Portresi (`hud_portrait` -> `assets/items_ui_atlas.png`):** Konserve üzerindeki düz Popeye görseli kaldırılarak yerine altın-lacivert madalyon çerçeveli 3D görünümlü Popeye profil portresi üretildi ve sol üst HUD ile duraklatma ekranına bağlandı.
- **Ses Efektleri ve Bölüm/Boss Müzikleri (`src/audio.js`):** Shuffle-bag (karışık torba) ton varyasyonlu ateş, mermi vuruş/kritik, düşman/Boss patlama, XP kristali toplama, seviye atlama fanfarı, yetenek seçimi, Boss uyarı sireni, Boss top ateşi, kalkan/hasar sesleri ve 15 bölüme göre değişen dinamik bölüm müzikleri + hızlı Boss savaşı müziği eklendi. Sağ üste ses açma/kapatma (`🔊 / 🔇`) butonu eklendi.

## v0.014 — 15 Farklı Zeminli/Zeminsiz Bölüm Çevresi, 15 Kademeli Heybetlenen Boss ve Sol-Sağ Alt Oklarla Geçiş
- **15 Bölümlü Çevre ve Zemin Motoru (`src/stages.js` & `assets/stage_env_atlas.png`):** Tek sayfada 16 yeni modüler bölüm kenar nesnesi üretildi ve 15 farklı bölüme bağlandı:
  1. Uzay Üssü & Asteroitler (Zeminsiz)
  2. Hurda Tersanesi & Paslı Güverte (Zeminli — ikaz şeritli paslı plakalar)
  3. Buhar & Boru Fabrikası (Zeminli — çelik boru ızgaraları ve buhar kazanları)
  4. Maden Kuyusu & Dev Matkap (Zeminsiz — zincirli maden uçurumu ve sarı matkaplı vinçler)
  5. Karlı & Buzullu Kutup Vadisi (Zeminli — kar yağışlı, buz çatlaklı vadi ve sarkıtlı buzul kayalıkları)
  6. Uydu & Hologram Gözlemevi (Zeminli — radar çanakları ve hologram ekranlar)
  7. Neon Siber Gece Şehri (Zeminsiz — cyan/magenta neon gökdelenler ve reklam kuleleri)
  8. Erimiş Bakır & Tesla Reaktörü (Zeminli — kızgın bakır borular ve elektrik bobinleri)
  9. Mor Nebula & Kozmik Asteroit Boşluğu (Zeminsiz — mor kristalli meteorlar ve nebula)
  10. Zümrüt Kristal Mağarası (Zeminli — parlayan kuvars kristalleri ve ışık huzmeleri)
  11. Biyo-Organik Asit Ormanı (Zeminli — dev kökler, spor keseleri ve asit göletleri)
  12. Boyutlar Arası Mor Damarlı Geçit (Zeminsiz — mor enerji damarlı monolitler)
  13. Antik Rünlü Taş Tapınak (Zeminli — rün çemberli taş zemin ve parlayan dikilitaşlar)
  14. Volkanik Lav & Magma Kanyonu (Zeminli — akan lav nehri ve bazalt lav kayalıkları)
  15. Omega Karadelik & Karanlık Kuleler (Zeminsiz — merkezde dönen karadelik girdabı ve tesla kuleleri)
- **15 Kademeli Heybetlenen Boss (`assets/bosses_atlas.png`):** Yeni üretilen Boss sayfasıyla toplam 15 farklı Boss (`boss_dreadnought` + `boss_1`..`boss_14`) bölümlere bağlandı. Kabasakal'ın yüz/sakal renginin maviye dönmesi tamamen engellendi (Bölüm 5 Buzul Boss'u ve Bölüm 15 Omega İmparator Boss'unda Kabasakal doğal ten ve kahverengi sakal rengindedir). Boss boyutları ve canları Bölüm 1'den (`206x182`) Bölüm 5'e (`228x208`) ve Bölüm 15'e (`312x282`) doğru kademeli olarak büyür ve heybetlenir.
- **Sol Alt (`◀`) ve Sağ Alt (`▶`) Bölüm/Boss Geçiş Okları:** Üstteki `1..5` butonları kaldırıldı; ekranın sol altına `◀` ve sağ altına `▶` ok butonları eklendi. Bastıkça 1'den 15'e kadar tüm bölümlerin çevresi ve Boss savaşı arasında ileri/geri geçiş yapılır.

## v0.013
- 1, 2, 3, 4, 5 numaralı bölümlerin Boss savaşına doğrudan ışınlanma (`warpToBoss`) eklendi. Hem ekranın üst kısmındaki `1 2 3 4 5` dokunmatik butonlarına basarak hem de klavyeden `1..5` tuşlarına basarak ilgili bölümün arka plan temasıyla birlikte Boss savaşı doğrudan açılır.

## v0.012
- Gerçek AdMob birimleri (`src/ads.js` — ödüllü canlanma ve bölüm/yeniden başlatma geçiş reklamı) entegre edildi.

## v0.011
- Arka plandaki aydınlık gezegen görselleri kaldırıldı.
- Arka plan uzay/yıldız renkleri zamanla sürekli değişmek yerine yalnızca Boss yenildikten sonra (yeni bölüme geçerken) karanlık atmosferik modlar arasında değişecek şekilde ayarlandı.
- Seviye atlama (`LEVELUP` yetenek seçimi) ve duraklatma ekranlarında oyun durduğunda arkada akan yıldızlar, nebulalar ve üs duvarları da tamamen duracak şekilde güncellendi.

## v0.010 — 20 Yeni Düşman + 10 Yeni Mermi, 10 Dev Boss, Gezegenli Değişen Uzay, Alt Mıknatıslı XP ve Tek Seferlik Yetenekler
- **Tek Seferlik Yetenekler:** 50 yeteneğin tamamı `max: 1` yapıldı; bir kez seçilen yetenek bir daha asla seçime gelmez.
- **Alt Mıknatıslı XP Elmasları:** XP elmasları ekranın en altına (`H - 115`) indiğinde yok olmaz; mıknatısla otomatik olarak oyuncuya doğru hızla çekilir ve uçağa yapışır.
- **20 Yeni Düşman + 10 Yeni Düşman Mermisi (`assets/enemies_bullets_atlas.png`):** Tek toplu sayfada 20 kademeli düşman (`e2_1`..`e2_20`) ve altında 10 yeni düşman mermisi (`ebul_1`..`ebul_10`) üretildi. Bölümlerde 5'erli gruplar halinde (Bölüm 2: `e2_1..e2_5`, Bölüm 3: `e2_6..e2_10`, Bölüm 4: `e2_11..e2_15`, Bölüm 5+: `e2_16..e2_20`) 5 farklı güç ve saldırı stiliyle devreye girer.
- **10 Yeni Dev Boss (`assets/bosses_atlas.png`):** Tek toplu sayfada 5 üstte, 5 altta olmak üzere 10 dev Boss (`boss_1`..`boss_10`) üretildi ve bölümlere bağlandı.
- **Sürekli Değişen Gezegenli Uzay Arka Planı:** Gökyüzü gradyanı, yıldız renkleri, nebulalar ve halkalı/kraterli gezegenler oyun boyunca sürekli renk ve tema değiştirerek akar.
- **Bölüm 1 Bina/Duvar İç Beyazlık Temizliği:** `assets/env_atlas.png` içindeki boru ve zincir halkalarının arasında kalan kapalı beyaz arka plan adaları tamamen şeffaflaştırıldı ve 4 geçişli defringe uygulandı.

## v0.009
- Oyun durduğunda (seviye atlama, pause, game over) ekran sarsılma/deprem efektinin takılı kalması engellendi; sarsıntı yalnızca aktif oynanışta (`PLAYING`) uygulanır ve duraklatmalarda sıfırlanır.
- Uçaklardan ve zamandan konserve/altın düşmesi tamamen kaldırıldı; vurulan uçaklardan yalnızca seviye atlamak için XP kristali (`xp_gem`) çıkar.
- Seviye atlama hızı 2 kat yavaşlatıldı (`START_NEEDED: 180`, `STEP_INC: 95` ve hem ölümde hem kristalde çifte XP verilmesi kaldırılıp yalnızca düşen XP kristaline bağlandı).

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
