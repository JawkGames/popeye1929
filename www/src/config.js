// Popeye 1929: Vertical Arcade SHMUP — Yapılandırma ve Sürüm Bilgisi
window.GAME_CONFIG = {
  VERSION: 'v0.005',
  TITLE: 'POPEYE 1929: IRON ARMADA',

  // 9:16 Dikey Mobil Referans Çözünürlük (Tüm ekranlara responsive ölçeklenir)
  WIDTH: 540,
  HEIGHT: 960,      // Çalışırken ekran oranına göre otomatik güncellenir (BASE_HEIGHT referanstır)
  BASE_HEIGHT: 960,
  MIN_HEIGHT: 800,
  MAX_HEIGHT: 1400,

  // Silah konservesi (2X/3X/4X/6X) çıkma oranı (1 = eski, 0.2 = 5 kat az)
  WEAPON_CAN_RATE: 0.05,
  // Ispanak (can_hp) çıkma oranı (0.5 = yarı yarıya az)
  HP_CAN_RATE: 0.5,
  // Normal düşmanların vuruş hasarı çarpanı
  ENEMY_DAMAGE_MULT: 1.5,
  // Boss güç çarpanı (can ve mermi hasarı)
  BOSS_POWER: 2,

  // Varsayılan Dil ('TR' konsept görsele birebir uygun, sağ üstten TR/EN değiştirilebilir)
  DEFAULT_LANG: 'TR',

  // Oyuncu Ayarları
  PLAYER: {
    START_X: 270,
    START_Y: 815,
    WIDTH: 76,
    HEIGHT: 86,
    HITBOX_RADIUS: 18,
    MAX_HP: 100,
    DRAG_SENSITIVITY: 1.08,
    KEYBOARD_SPEED: 440,
    BANK_THRESHOLD: 35,
    FIRE_INTERVAL: 0.145, // Otomatik ateş aralığı (sn)
    INVULN_TIME: 1.1,     // Hasar sonrası dokunulmazlık süresi
    SHIELD_DURATION: 8.5  // Kalkan konservesi süresi (sn)
  },

  // Yardımcı Uçak (Wingman / Companion) Ayarları
  WINGMAN: {
    MAX_COUNT: 4,
    FOLLOW_LERP: 9.5,     // Yumuşak takip hızı
    FIRE_INTERVAL: 0.28,
    DAMAGE: 11,
    OFFSETS: [
      { x: -64, y: 24 },
      { x: 64, y: 24 },
      { x: -108, y: 52 },
      { x: 108, y: 52 }
    ]
  },

  // Silah Seviyeleri (1x..8x Mermi Sayısı ve Hasar Tablosu)
  WEAPONS: {
    1: { level: 1, label: '1X', count: 1, spreadDeg: 0,  damage: 22, speed: 890 },
    2: { level: 2, label: '2X', count: 2, spreadDeg: 0,  damage: 19, speed: 900 },
    3: { level: 3, label: '3X', count: 3, spreadDeg: 10, damage: 18, speed: 920 },
    4: { level: 4, label: '4X', count: 4, spreadDeg: 7,  damage: 17, speed: 940 },
    5: { level: 5, label: '5X', count: 5, spreadDeg: 8,  damage: 17, speed: 950 },
    6: { level: 6, label: '6X', count: 6, spreadDeg: 8,  damage: 17, speed: 960 },
    7: { level: 7, label: '7X', count: 7, spreadDeg: 7,  damage: 18, speed: 970 },
    8: { level: 8, label: '8X', count: 8, spreadDeg: 7,  damage: 19, speed: 980 }
  },

  // Konserve & Güçlendirme Ayarları
  PICKUPS: {
    FALL_SPEED: 130,
    TOUCH_RADIUS: 54,
    SPINACH_HEAL: 35,
    BOMB_DAMAGE: 420,
    SCORE_BONUS: 250,
    COIN_SCORE: 100
  },

  // Bölüm 1 Zaman Çizelgesi (Kurula kurula gelen 150 sn + Boss Savaşı)
  TIMELINE: {
    PHASE_1_END: 30,   // 0-30 sn: Başlangıç (Keşif düşmanları, V formasyonları, ilk 2x konservesi)
    PHASE_2_END: 90,   // 30-90 sn: Gelişme (Zırhlı avcılar, kalamar meka, ağır taretler, Wingman, 3x/4x)
    PHASE_3_END: 150,  // 90-150 sn: Tırmanış (Yoğun kombo dalgaları, elit kruvazör, intihar dalışları, 6x)
    BOSS_WARNING_DURATION: 3.6
  },

  // Düşman Tipleri ve İstatistikleri
  ENEMIES: {
    scout_pod: {
      hp: 34, score: 120, radius: 26, w: 62, h: 66,
      fireRate: 2.2, bulletSpeed: 290, damage: 14
    },
    fang_fighter: {
      hp: 68, score: 220, radius: 30, w: 72, h: 78,
      fireRate: 1.7, bulletSpeed: 340, damage: 16
    },
    squid_mech: {
      hp: 95, score: 310, radius: 34, w: 82, h: 90,
      fireRate: 1.5, bulletSpeed: 320, damage: 18
    },
    heavy_gunship: {
      hp: 155, score: 450, radius: 38, w: 88, h: 88,
      fireRate: 1.35, bulletSpeed: 310, damage: 20
    },
    kamikaze_dart: {
      hp: 42, score: 180, radius: 22, w: 54, h: 68,
      fireRate: 99, bulletSpeed: 0, damage: 24
    },
    elite_cruiser: {
      hp: 340, score: 900, radius: 48, w: 108, h: 112,
      fireRate: 1.1, bulletSpeed: 350, damage: 22
    },
    boss_dreadnought: {
      hp: 4200, score: 10000, radius: 95, w: 250, h: 210,
      damage: 28
    }
  },

  // AdMob Yapılandırması (Test ID'leri - AAB öncesi gerçek ID girilir)
  ADMOB: {
    IS_TEST: true,
    APP_ID: 'ca-app-pub-3940256099942544~3347511713',
    REWARDED_REVIVE: 'ca-app-pub-3940256099942544/5224354917',
    INTERSTITIAL_STAGE: 'ca-app-pub-3940256099942544/1033173712'
  }
};
