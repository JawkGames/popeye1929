// Çoklu Dil Desteği (TR / EN)
window.I18N = {
  lang: (window.GAME_CONFIG && window.GAME_CONFIG.DEFAULT_LANG) || 'TR',

  strings: {
    TR: {
      SCORE: 'SKOR',
      XP_LABEL: 'SV',
      STAGE: 'STAGE',
      TAP_TO_START: 'BAŞLAMAK İÇİN DOKUN VE SÜRÜKLE',
      SUBTITLE: 'DİKEY ARCADE HAVA & UZAY SAVAŞI',
      CONTROL_HINT: 'Parmağını ekranın herhangi bir yerine koy ve sürükle.\nSeviye atladıkça 50 çeşit ıspanak yeteneğinden birini seç!',
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
      LEVEL_UP_TITLE: 'SEVİYE ATLADIN!',
      LEVEL_UP_SUB: 'BİR ISPANAK GÜCÜ SEÇ (50 YETENEK)',
      TAP_TO_SELECT: 'SEÇMEK İÇİN DOKUN',
      PICKUP_HP: '+ISPANAK CAN!',
      PICKUP_2X: '2X ÇİFT ATIŞ!',
      PICKUP_3X: '3X YELPAZE ATIŞI!',
      PICKUP_4X: '4X YOĞUN ATEŞ!',
      PICKUP_6X: '6X SÜPER YAYLIM!',
      PICKUP_WINGMAN: 'YARDIMCI UÇAK!',
      PICKUP_SHIELD: 'ENERJİ KALKANI!',
      PICKUP_BOMB: 'SÜPER ISPANAK BOMBASI!',
      MAX_POWER: 'MAKSİMUM GÜÇ +500!',
      CRIT_HIT: 'KRİTİK!',
      HEADSHOT_TXT: 'İNFAZ!',
      DODGE_TXT: 'SIYRILDI!',
      WEAPON_EVOLVE: 'SİLAH EVRİMİ!',
      AD_NOT_READY: 'REKLAM YÜKLENEMEDİ!'
    },
    EN: {
      SCORE: 'SCORE',
      XP_LABEL: 'LV',
      STAGE: 'STAGE',
      TAP_TO_START: 'TOUCH & DRAG ANYWHERE TO FLY',
      SUBTITLE: 'VERTICAL ARCADE SPACE & AIR SHMUP',
      CONTROL_HINT: 'Place your finger anywhere on screen and drag relatively.\nLevel up to choose from 50 Archero-style spinach skills!',
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
      LEVEL_UP_TITLE: 'LEVEL UP!',
      LEVEL_UP_SUB: 'CHOOSE A SPINACH SKILL (50 PERKS)',
      TAP_TO_SELECT: 'TAP CARD TO EQUIP',
      PICKUP_HP: '+SPINACH REPAIR!',
      PICKUP_2X: '2X TWIN FIRE!',
      PICKUP_3X: '3X SPREAD SHOT!',
      PICKUP_4X: '4X QUAD STREAM!',
      PICKUP_6X: '6X MAX BARRAGE!',
      PICKUP_WINGMAN: 'WINGMAN DRONE!',
      PICKUP_SHIELD: 'ENERGY SHIELD!',
      PICKUP_BOMB: 'SUPER SPINACH BLAST!',
      MAX_POWER: 'MAX POWER +500!',
      CRIT_HIT: 'CRIT!',
      HEADSHOT_TXT: 'EXECUTE!',
      DODGE_TXT: 'DODGE!',
      WEAPON_EVOLVE: 'WEAPON UPGRADE!',
      AD_NOT_READY: 'AD NOT READY!'
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
