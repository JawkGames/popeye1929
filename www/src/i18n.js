// Çoklu Dil Desteği (TR / EN)
window.I18N = {
  lang: (window.GAME_CONFIG && window.GAME_CONFIG.DEFAULT_LANG) || 'TR',

  strings: {
    TR: {
      SCORE: 'SKOR',
      COMBO: 'KOMBO',
      STAGE: 'STAGE',
      TAP_TO_START: 'BAŞLAMAK İÇİN DOKUN VE SÜRÜKLE',
      SUBTITLE: 'DİKEY ARCADE HAVA & UZAY SAVAŞI',
      CONTROL_HINT: 'Parmağını ekranın herhangi bir yerine koy ve sürükle.\nOtomatik ateş aktiftir. Konserveleri topla, filoyu yok et!',
      START_BTN: 'SAVAŞA BAŞLA',
      PAUSED: 'OYUN DURAKLATILDI',
      RESUME_BTN: 'DEVAM ET',
      RESTART_BTN: 'YENİDEN BAŞLA',
      GAME_OVER: 'GEMİ DÜŞTÜ!',
      FINAL_SCORE: 'TOPLAM SKOR',
      REVIVE_AD_BTN: 'REKLAM İZLE & CANLAN (+%100 CAN)',
      WARNING_BOSS: 'UYARI! KABASAKAL DRETNOTU YAKLAŞIYOR!',
      BOSS_NAME: 'KABASAKAL DEMİR DRETNOTU',
      STAGE_CLEAR: 'BÖLÜM TAMAMLANDI!',
      PICKUP_HP: '+ISPANAK CAN!',
      PICKUP_2X: '2X ÇİFT ATIŞ!',
      PICKUP_3X: '3X YELPAZE ATIŞI!',
      PICKUP_4X: '4X YOĞUN ATEŞ!',
      PICKUP_6X: '6X SÜPER YAYLIM!',
      PICKUP_WINGMAN: 'YARDIMCI UÇAK!',
      PICKUP_SHIELD: 'ENERJİ KALKANI!',
      PICKUP_BOMB: 'SÜPER ISPANAK BOMBASI!',
      MAX_POWER: 'MAKSİMUM GÜÇ +500!'
    },
    EN: {
      SCORE: 'SCORE',
      COMBO: 'COMBO',
      STAGE: 'STAGE',
      TAP_TO_START: 'TOUCH & DRAG ANYWHERE TO FLY',
      SUBTITLE: 'VERTICAL ARCADE SPACE & AIR SHMUP',
      CONTROL_HINT: 'Place your finger anywhere on screen and drag relatively.\nAuto-fire is engaged. Collect spinach cans & crush the armada!',
      START_BTN: 'LAUNCH FIGHTER',
      PAUSED: 'GAME PAUSED',
      RESUME_BTN: 'RESUME',
      RESTART_BTN: 'RESTART',
      GAME_OVER: 'FIGHTER DOWN!',
      FINAL_SCORE: 'FINAL SCORE',
      REVIVE_AD_BTN: 'WATCH AD & REVIVE (FULL HP)',
      WARNING_BOSS: 'WARNING! BLUTO DREADNOUGHT APPROACHING!',
      BOSS_NAME: 'IRON DREADNOUGHT FORTRESS',
      STAGE_CLEAR: 'STAGE CLEAR!',
      PICKUP_HP: '+SPINACH REPAIR!',
      PICKUP_2X: '2X TWIN FIRE!',
      PICKUP_3X: '3X SPREAD SHOT!',
      PICKUP_4X: '4X QUAD STREAM!',
      PICKUP_6X: '6X MAX BARRAGE!',
      PICKUP_WINGMAN: 'WINGMAN DRONE!',
      PICKUP_SHIELD: 'ENERGY SHIELD!',
      PICKUP_BOMB: 'SUPER SPINACH BLAST!',
      MAX_POWER: 'MAX POWER +500!'
    }
  },

  t(key) {
    const dict = this.strings[this.lang] || this.strings.TR;
    return dict[key] || key;
  },

  toggleLang() {
    this.lang = this.lang === 'TR' ? 'EN' : 'TR';
    return this.lang;
  }
};
