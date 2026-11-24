// Popeye 1929: Vertical Arcade SHMUP — Yapılandırma ve Sürüm Bilgisi
window.GAME_CONFIG = {
  VERSION: 'v0.013',
  TITLE: 'POPEYE 1929: IRON ARMADA',

  // 9:16 Dikey Mobil Referans Çözünürlük (Tüm ekranlara responsive ölçeklenir)
  WIDTH: 540,
  HEIGHT: 960,      // Çalışırken ekran oranına göre otomatik güncellenir (BASE_HEIGHT referanstır)
  BASE_HEIGHT: 960,
  MIN_HEIGHT: 800,
  MAX_HEIGHT: 1400,

  // Normal düşmanların vuruş hasarı çarpanı
  ENEMY_DAMAGE_MULT: 1.5,
  // Boss güç çarpanı (can ve mermi hasarı)
  BOSS_POWER: 2,

  // Varsayılan Dil
  DEFAULT_LANG: 'TR',

  // XP ve Seviye Atlama Ayarları (2x yavaşlatılmış seviye hızı, alt ekran mıknatıslı XP elmasları)
  XP: {
    START_NEEDED: 180,
    STEP_INC: 95,
    GEM_VALUE: 22
  },

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
    FIRE_INTERVAL: 0.145,
    INVULN_TIME: 1.1,
    SHIELD_DURATION: 8.5
  },

  // Yardımcı Uçak (Wingman / Companion) Ayarları
  WINGMAN: {
    MAX_COUNT: 4,
    FOLLOW_LERP: 9.5,
    FIRE_INTERVAL: 0.28,
    DAMAGE: 11,
    OFFSETS: [
      { x: -64, y: 24 },
      { x: 64, y: 24 },
      { x: -108, y: 52 },
      { x: 108, y: 52 }
    ]
  },

  // Silah Merdiveni: her adım şeritler (T = ince, K = kalın)
  WEAPON_LADDER: [
    null,
    'T',          // 1
    'TT',         // 2
    'K',          // 3
    'TKT',        // 4
    'TTKTT',      // 5
    'KKK',        // 6
    'TKKKT',      // 7
    'KKKKK'       // 8
  ],
  WEAPON_THIN:  { damage: 20, w: 20, h: 44, speed: 900 },
  WEAPON_THICK: { damage: 36, w: 34, h: 50, speed: 940 },
  WINGMAN_THICK_LEVEL: 6,
  FIRE_RATE_STEP: 0.15,
  FIRE_RATE_MAX: 3,
  DAMAGE_STEP: 0.15,
  WINGMAN_BOOST: 0.25,

  // Konserve & Güçlendirme Ayarları
  PICKUPS: {
    FALL_SPEED: 140,
    TOUCH_RADIUS: 56,
    SPINACH_HEAL: 35,
    BOMB_DAMAGE: 420,
    SCORE_BONUS: 250,
    COIN_SCORE: 100
  },

  // Bölüm Zaman Çizelgesi (Sonraki bölümlere ve yeni 5'li düşman gruplarına akıcı geçiş için 90 sn + Boss)
  TIMELINE: {
    PHASE_1_END: 25,
    PHASE_2_END: 60,
    PHASE_3_END: 95,
    BOSS_WARNING_DURATION: 3.4
  },

  // Düşman Tipleri: Bölüm 1'in 6 düşmanı + Bölüm 2 ve sonrası için 5'li 4 Grup halinde (20 Yeni Düşman: e2_1..e2_20)
  // ve 10 Yeni Boss (boss_1..boss_10)
  ENEMIES: {
    // --- BÖLÜM 1 DÜŞMANLARI ---
    scout_pod:      { hp: 34,  score: 120, xp: 20, radius: 26, w: 62,  h: 66,  fireRate: 2.2,  bulletSpeed: 290, damage: 14, bullet: 'bullet_enemy_dart', style: 'single' },
    fang_fighter:   { hp: 68,  score: 220, xp: 28, radius: 30, w: 72,  h: 78,  fireRate: 1.7,  bulletSpeed: 340, damage: 16, bullet: 'bullet_enemy_dart', style: 'aimed' },
    squid_mech:     { hp: 95,  score: 310, xp: 34, radius: 34, w: 82,  h: 90,  fireRate: 1.5,  bulletSpeed: 320, damage: 18, bullet: 'bullet_enemy_orb',  style: 'twin' },
    heavy_gunship:  { hp: 155, score: 450, xp: 45, radius: 38, w: 88,  h: 88,  fireRate: 1.35, bulletSpeed: 310, damage: 20, bullet: 'bullet_enemy_dart', style: 'spread3' },
    kamikaze_dart:  { hp: 42,  score: 180, xp: 22, radius: 22, w: 54,  h: 68,  fireRate: 99,   bulletSpeed: 0,   damage: 24, bullet: 'bullet_enemy_dart', style: 'none' },
    elite_cruiser:  { hp: 340, score: 900, xp: 90, radius: 48, w: 108, h: 112, fireRate: 1.1,  bulletSpeed: 350, damage: 22, bullet: 'bullet_enemy_orb',  style: 'spread5' },

    // --- GRUP 1 (BÖLÜM 2: KIZIL MARS FİLOSU — e2_1..e2_5, 5 Farklı Güç) ---
    e2_1:  { hp: 55,  score: 180, xp: 24, radius: 28, w: 72,  h: 78,  fireRate: 1.8,  bulletSpeed: 330, damage: 16, bullet: 'ebul_1', style: 'single' },
    e2_2:  { hp: 90,  score: 260, xp: 30, radius: 32, w: 78,  h: 84,  fireRate: 1.55, bulletSpeed: 350, damage: 18, bullet: 'ebul_2', style: 'aimed' },
    e2_3:  { hp: 70,  score: 230, xp: 28, radius: 26, w: 68,  h: 86,  fireRate: 1.9,  bulletSpeed: 380, damage: 22, bullet: 'ebul_1', style: 'twin' },
    e2_4:  { hp: 190, score: 520, xp: 48, radius: 40, w: 92,  h: 92,  fireRate: 1.3,  bulletSpeed: 330, damage: 22, bullet: 'ebul_2', style: 'spread3' },
    e2_5:  { hp: 390, score: 980, xp: 95, radius: 48, w: 110, h: 116, fireRate: 1.05, bulletSpeed: 360, damage: 25, bullet: 'ebul_9', style: 'spread5' },

    // --- GRUP 2 (BÖLÜM 3: ZÜMRÜT BİYO-SİBER FİLO — e2_6..e2_10, 5 Farklı Güç) ---
    e2_6:  { hp: 72,  score: 220, xp: 26, radius: 28, w: 74,  h: 78,  fireRate: 1.7,  bulletSpeed: 340, damage: 18, bullet: 'ebul_3', style: 'single' },
    e2_7:  { hp: 120, score: 340, xp: 34, radius: 34, w: 84,  h: 90,  fireRate: 1.45, bulletSpeed: 340, damage: 20, bullet: 'ebul_4', style: 'twin' },
    e2_8:  { hp: 145, score: 390, xp: 38, radius: 34, w: 82,  h: 88,  fireRate: 1.4,  bulletSpeed: 360, damage: 22, bullet: 'ebul_3', style: 'aimed2' },
    e2_9:  { hp: 230, score: 600, xp: 52, radius: 40, w: 94,  h: 94,  fireRate: 1.25, bulletSpeed: 350, damage: 24, bullet: 'ebul_4', style: 'spread3' },
    e2_10: { hp: 460, score: 1150,xp: 105,radius: 50, w: 112, h: 118, fireRate: 1.0,  bulletSpeed: 370, damage: 27, bullet: 'ebul_4', style: 'ring6' },

    // --- GRUP 3 (BÖLÜM 4: AMETİST HİÇLİK FİLOSU — e2_11..e2_15, 5 Farklı Güç) ---
    e2_11: { hp: 92,  score: 270, xp: 30, radius: 28, w: 72,  h: 86,  fireRate: 1.55, bulletSpeed: 370, damage: 20, bullet: 'ebul_5', style: 'aimed' },
    e2_12: { hp: 155, score: 420, xp: 38, radius: 35, w: 86,  h: 92,  fireRate: 1.35, bulletSpeed: 350, damage: 22, bullet: 'ebul_8', style: 'twin' },
    e2_13: { hp: 185, score: 490, xp: 42, radius: 35, w: 84,  h: 90,  fireRate: 1.3,  bulletSpeed: 375, damage: 24, bullet: 'ebul_5', style: 'spread3' },
    e2_14: { hp: 280, score: 720, xp: 58, radius: 42, w: 96,  h: 96,  fireRate: 1.15, bulletSpeed: 365, damage: 26, bullet: 'ebul_10',style: 'spread4' },
    e2_15: { hp: 540, score: 1350,xp: 115,radius: 50, w: 114, h: 120, fireRate: 0.95, bulletSpeed: 385, damage: 30, bullet: 'ebul_8', style: 'spread5' },

    // --- GRUP 4 (BÖLÜM 5+: ALTIN İMPARATORLUK FİLOSU — e2_16..e2_20, 5 Farklı Güç) ---
    e2_16: { hp: 115, score: 330, xp: 34, radius: 30, w: 78,  h: 86,  fireRate: 1.45, bulletSpeed: 385, damage: 22, bullet: 'ebul_6', style: 'aimed2' },
    e2_17: { hp: 195, score: 520, xp: 44, radius: 38, w: 92,  h: 94,  fireRate: 1.25, bulletSpeed: 370, damage: 25, bullet: 'ebul_7', style: 'spread3' },
    e2_18: { hp: 240, score: 640, xp: 50, radius: 38, w: 92,  h: 96,  fireRate: 1.2,  bulletSpeed: 380, damage: 27, bullet: 'ebul_6', style: 'spread4' },
    e2_19: { hp: 360, score: 890, xp: 68, radius: 46, w: 106, h: 112, fireRate: 1.05, bulletSpeed: 390, damage: 29, bullet: 'ebul_9', style: 'spread5' },
    e2_20: { hp: 660, score: 1650,xp: 130,radius: 52, w: 118, h: 124, fireRate: 0.90, bulletSpeed: 405, damage: 33, bullet: 'ebul_10',style: 'ring8' },

    // --- DEV BOSSLAR (Bölüm 1 Boss + 10 Yeni Dev Boss: boss_1..boss_10) ---
    boss_dreadnought: { hp: 4200, score: 10000, xp: 360, radius: 95, w: 250, h: 210, damage: 28, bullet1: 'bullet_enemy_dart', bullet2: 'bullet_enemy_orb' },
    boss_1:  { hp: 4600, score: 12000, xp: 380, radius: 96, w: 248, h: 224, damage: 30, bullet1: 'ebul_1', bullet2: 'ebul_2' },
    boss_2:  { hp: 5000, score: 14000, xp: 400, radius: 96, w: 248, h: 228, damage: 32, bullet1: 'ebul_3', bullet2: 'ebul_4' },
    boss_3:  { hp: 5400, score: 16000, xp: 420, radius: 98, w: 250, h: 230, damage: 34, bullet1: 'ebul_5', bullet2: 'ebul_8' },
    boss_4:  { hp: 5800, score: 18000, xp: 440, radius: 98, w: 250, h: 228, damage: 36, bullet1: 'ebul_7', bullet2: 'ebul_6' },
    boss_5:  { hp: 6200, score: 20000, xp: 460, radius: 98, w: 252, h: 230, damage: 38, bullet1: 'ebul_2', bullet2: 'ebul_9' },
    boss_6:  { hp: 6600, score: 22000, xp: 480, radius: 98, w: 252, h: 232, damage: 40, bullet1: 'ebul_7', bullet2: 'ebul_10'},
    boss_7:  { hp: 7000, score: 24000, xp: 500, radius: 98, w: 252, h: 232, damage: 42, bullet1: 'ebul_4', bullet2: 'ebul_3' },
    boss_8:  { hp: 7500, score: 26000, xp: 520, radius: 98, w: 254, h: 234, damage: 44, bullet1: 'ebul_9', bullet2: 'ebul_1' },
    boss_9:  { hp: 8000, score: 28000, xp: 540, radius: 98, w: 254, h: 234, damage: 46, bullet1: 'ebul_8', bullet2: 'ebul_10'},
    boss_10: { hp: 8600, score: 32000, xp: 600, radius: 100,w: 256, h: 238, damage: 50, bullet1: 'ebul_6', bullet2: 'ebul_9' }
  },

  ADMOB: {
    IS_TEST: false,
    APP_ID: 'ca-app-pub-7983529419004158~9792828487',
    REWARDED_REVIVE: 'ca-app-pub-7983529419004158/1726762511',     // popeye1929_rewarded_revive
    INTERSTITIAL_STAGE: 'ca-app-pub-7983529419004158/8531717703'   // popeye1929_interstitial_stage
  }
};
