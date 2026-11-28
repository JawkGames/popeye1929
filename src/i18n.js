// 17 Dilli Çoklu Dil Desteği (TR, EN, ES, HI, PT, FIL, ID, AF, RU, KO, MS, IT, DE, EL, FR, AR, UR)
window.I18N = {
  ORDER: ['TR', 'EN', 'ES', 'HI', 'PT', 'FIL', 'ID', 'AF', 'RU', 'KO', 'MS', 'IT', 'DE', 'EL', 'FR', 'AR', 'UR'],
  lang: (function () {
    try {
      const saved = localStorage.getItem('popeye1929_lang');
      if (saved) return saved;
    } catch (e) {}
    return (window.GAME_CONFIG && window.GAME_CONFIG.DEFAULT_LANG) || 'TR';
  })(),

  strings: {
    TR: {
      XP_LABEL: 'SV',
      STAGE: 'BÖLÜM',
      SUBTITLE: 'DİKEY ARCADE HAVA & UZAY SAVAŞI',
      CONTROL_HINT: 'Parmağını ekranın herhangi bir yerine koy ve sürükle.\nSeviye atladıkça 50 çeşit ıspanak yeteneğinden birini seç!',
      START_BTN: 'SAVAŞA BAŞLA',
      PAUSED: 'OYUN DURAKLATILDI',
      RESUME_BTN: 'DEVAM ET',
      RESTART_BTN: 'YENİDEN BAŞLA',
      GAME_OVER: 'GEMİ DÜŞTÜ!',
      REACHED_LEVEL: 'ULAŞILAN SEVİYE',
      REVIVE_AD_BTN: 'REKLAMLA CANLAN',
      WARNING_BOSS: 'UYARI! KABASAKAL DRETNOTU YAKLAŞIYOR!',
      BOSS_NAME: 'KABASAKAL DEMİR DRETNOTU',
      STAGE_CLEAR: 'BÖLÜM TAMAMLANDI!',
      LEVEL_UP_TITLE: 'SEVİYE ATLADIN!',
      LEVEL_UP_SUB: 'BİR ISPANAK GÜCÜ SEÇ (50 YETENEK)',
      TAP_TO_SELECT: 'SEÇMEK İÇİN KARTA DOKUN',
      PICKUP_BOMB: 'SÜPER ISPANAK BOMBASI!',
      CRIT_HIT: 'KRİTİK!',
      HEADSHOT_TXT: 'İNFAZ!',
      DODGE_TXT: 'SIYRILDI!',
      WEAPON_EVOLVE: 'SİLAH EVRİMİ!',
      AD_NOT_READY: 'REKLAM HAZIR DEĞİL!'
    },
    EN: {
      XP_LABEL: 'LV',
      STAGE: 'STAGE',
      SUBTITLE: 'VERTICAL ARCADE SPACE & AIR SHMUP',
      CONTROL_HINT: 'Place your finger anywhere on screen and drag.\nLevel up to choose from 50 Archero-style spinach skills!',
      START_BTN: 'LAUNCH FIGHTER',
      PAUSED: 'GAME PAUSED',
      RESUME_BTN: 'RESUME',
      RESTART_BTN: 'RESTART',
      GAME_OVER: 'FIGHTER DOWN!',
      REACHED_LEVEL: 'REACHED LEVEL',
      REVIVE_AD_BTN: 'WATCH AD · REVIVE',
      WARNING_BOSS: 'WARNING! BLUTO DREADNOUGHT APPROACHING!',
      BOSS_NAME: 'IRON DREADNOUGHT FORTRESS',
      STAGE_CLEAR: 'STAGE CLEAR!',
      LEVEL_UP_TITLE: 'LEVEL UP!',
      LEVEL_UP_SUB: 'CHOOSE A SPINACH SKILL (50 PERKS)',
      TAP_TO_SELECT: 'TAP CARD TO EQUIP',
      PICKUP_BOMB: 'SUPER SPINACH BLAST!',
      CRIT_HIT: 'CRIT!',
      HEADSHOT_TXT: 'EXECUTE!',
      DODGE_TXT: 'DODGE!',
      WEAPON_EVOLVE: 'WEAPON UPGRADE!',
      AD_NOT_READY: 'AD NOT READY!'
    },
    ES: {
      XP_LABEL: 'NV', STAGE: 'FASE', SUBTITLE: 'COMBATE AÉREO Y ESPACIAL ARCADE',
      START_BTN: 'JUGAR', PAUSED: 'JUEGO EN PAUSA', RESUME_BTN: 'CONTINUAR', RESTART_BTN: 'REINICIAR',
      GAME_OVER: '¡NAVE CAÍDA!', REACHED_LEVEL: 'NIVEL ALCANZADO', REVIVE_AD_BTN: 'VER VÍDEO · REVIVIR',
      WARNING_BOSS: '¡ALERTA! ¡ACORAZADO ENEMIGO!', BOSS_NAME: 'ACORAZADO DE HIERRO',
      STAGE_CLEAR: '¡FASE SUPERADA!', LEVEL_UP_TITLE: '¡SUBISTE DE NIVEL!', LEVEL_UP_SUB: 'ELIGE UN PODER DE ESPINACA',
      TAP_TO_SELECT: 'TOCA UNA CARTA', CRIT_HIT: '¡CRÍTICO!', HEADSHOT_TXT: '¡EJECUTADO!', DODGE_TXT: '¡ESQUIVADO!',
      WEAPON_EVOLVE: '¡ARMA MEJORADA!', AD_NOT_READY: '¡SIN ANUNCIO AHORA!'
    },
    HI: {
      XP_LABEL: 'LV', STAGE: 'स्टेज', SUBTITLE: 'आर्केड स्पेस और एयर बैटल',
      START_BTN: 'शुरू करें', PAUSED: 'गेम रुका है', RESUME_BTN: 'जारी रखें', RESTART_BTN: 'फिर से शुरू',
      GAME_OVER: 'विमान गिरा!', REACHED_LEVEL: 'पहुँचा लेवल', REVIVE_AD_BTN: 'वीडियो देखें · जीवित हों',
      WARNING_BOSS: 'चेतावनी! बॉस आ रहा है!', BOSS_NAME: 'आयरन ड्रेडनॉट बॉस',
      STAGE_CLEAR: 'स्टेज पूरा!', LEVEL_UP_TITLE: 'लेवल अप!', LEVEL_UP_SUB: 'एक पालक शक्ति चुनें',
      TAP_TO_SELECT: 'चुनने के लिए टैप करें', CRIT_HIT: 'क्रिटिकल!', HEADSHOT_TXT: 'खत्म!', DODGE_TXT: 'बच गए!',
      WEAPON_EVOLVE: 'हथियार अपग्रेड!', AD_NOT_READY: 'विज्ञापन तैयार नहीं!'
    },
    PT: {
      XP_LABEL: 'NV', STAGE: 'FASE', SUBTITLE: 'COMBATE AÉREO E ESPACIAL ARCADE',
      START_BTN: 'JOGAR', PAUSED: 'JOGO PAUSADO', RESUME_BTN: 'CONTINUAR', RESTART_BTN: 'RECOMEÇAR',
      GAME_OVER: 'NAVE ABATIDA!', REACHED_LEVEL: 'NÍVEL ALCANÇADO', REVIVE_AD_BTN: 'VER VÍDEO · REVIVER',
      WARNING_BOSS: 'AVISO! COURAÇADO APROXIMANDO!', BOSS_NAME: 'FORTALEZA DE FERRO',
      STAGE_CLEAR: 'FASE CONCLUÍDA!', LEVEL_UP_TITLE: 'SUBIU DE NÍVEL!', LEVEL_UP_SUB: 'ESCOLHA UM PODER DE ESPINAFRE',
      TAP_TO_SELECT: 'TOQUE PARA ESCOLHER', CRIT_HIT: 'CRÍTICO!', HEADSHOT_TXT: 'EXECUTADO!', DODGE_TXT: 'ESQUIVOU!',
      WEAPON_EVOLVE: 'ARMA EVOLUÍDA!', AD_NOT_READY: 'SEM ANÚNCIO AGORA!'
    },
    FIL: {
      XP_LABEL: 'LV', STAGE: 'YUGTO', SUBTITLE: 'ARCADE LABANAN SA KALAWAKAN',
      START_BTN: 'SIMULAN', PAUSED: 'NAKA-PAUSE', RESUME_BTN: 'ITULOY', RESTART_BTN: 'ULITIN',
      GAME_OVER: 'BAGSAK ANG EROPLANO!', REACHED_LEVEL: 'NAABOT NA LEVEL', REVIVE_AD_BTN: 'MANOOD · MABUHAY MULI',
      WARNING_BOSS: 'BABALA! PARATING ANG BOSS!', BOSS_NAME: 'BAKAL NA DREADNOUGHT',
      STAGE_CLEAR: 'TAPOS ANG YUGTO!', LEVEL_UP_TITLE: 'LEVEL UP!', LEVEL_UP_SUB: 'PUMILI NG LAKAS NG SPINACH',
      TAP_TO_SELECT: 'I-TAP UPANG PUMILI', CRIT_HIT: 'CRIT!', HEADSHOT_TXT: 'PATAY!', DODGE_TXT: 'ILAG!',
      WEAPON_EVOLVE: 'BAGONG SANDATA!', AD_NOT_READY: 'WALANG AD NGAYON!'
    },
    ID: {
      XP_LABEL: 'LV', STAGE: 'BABAK', SUBTITLE: 'PERTEMPURAN UDARA & ANTARIKSA',
      START_BTN: 'MULAI', PAUSED: 'PERMAINAN DIJEDA', RESUME_BTN: 'LANJUTKAN', RESTART_BTN: 'MULAI ULANG',
      GAME_OVER: 'PESAWAT JATUH!', REACHED_LEVEL: 'LEVEL TERCAPAI', REVIVE_AD_BTN: 'TONTON VIDEO · HIDUP LAGI',
      WARNING_BOSS: 'PERINGATAN! BOS MENDEKAT!', BOSS_NAME: 'BENTENG BESI DREADNOUGHT',
      STAGE_CLEAR: 'BABAK SELESAI!', LEVEL_UP_TITLE: 'NAIK LEVEL!', LEVEL_UP_SUB: 'PILIH KEKUATAN BAYAM',
      TAP_TO_SELECT: 'KETUK KARTU', CRIT_HIT: 'KRITIS!', HEADSHOT_TXT: 'EKSEKUSI!', DODGE_TXT: 'MENGHINDAR!',
      WEAPON_EVOLVE: 'SENJATA NAIK!', AD_NOT_READY: 'IKLAN BELUM SIAP!'
    },
    AF: {
      XP_LABEL: 'VL', STAGE: 'FASE', SUBTITLE: 'ARKADE RUIMTE & LUGGEVEG',
      START_BTN: 'BEGIN', PAUSED: 'SPEL GEPOUSEER', RESUME_BTN: 'GAAN VOORT', RESTART_BTN: 'HERBEGIN',
      GAME_OVER: 'VLIEGTUIG AF!', REACHED_LEVEL: 'VLAK BEREIK', REVIVE_AD_BTN: 'KYK VIDEO · HERLEEF',
      WARNING_BOSS: 'WAARSKUWING! BAAS KOM!', BOSS_NAME: 'YSTER SLAGSKIP',
      STAGE_CLEAR: 'FASE VOLTOOI!', LEVEL_UP_TITLE: 'VLAK OP!', LEVEL_UP_SUB: 'KIES SPINASIE KRAG',
      TAP_TO_SELECT: 'TIK OM TE KIES', CRIT_HIT: 'KRITIES!', HEADSHOT_TXT: 'UITGEVOER!', DODGE_TXT: 'ONTWYK!',
      WEAPON_EVOLVE: 'WAPEN OPGRADEER!', AD_NOT_READY: 'GEEN ADVERTENSIE!'
    },
    RU: {
      XP_LABEL: 'УР', STAGE: 'ЭТАП', SUBTITLE: 'АРКАДНЫЙ КОСМИЧЕСКИЙ БОЙ',
      START_BTN: 'ИГРАТЬ', PAUSED: 'ПАУЗА', RESUME_BTN: 'ПРОДОЛЖИТЬ', RESTART_BTN: 'ЗАНОВО',
      GAME_OVER: 'КОРАБЛЬ СБИТ!', REACHED_LEVEL: 'ДОСТИГНУТ УРОВЕНЬ', REVIVE_AD_BTN: 'ВИДЕО · ВОЗРОДИТЬСЯ',
      WARNING_BOSS: 'ВНИМАНИЕ! БОСС ПРИБЛИЖАЕТСЯ!', BOSS_NAME: 'ЖЕЛЕЗНЫЙ ДРЕДНОУТ',
      STAGE_CLEAR: 'ЭТАП ПРОЙДЕН!', LEVEL_UP_TITLE: 'НОВЫЙ УРОВЕНЬ!', LEVEL_UP_SUB: 'ВЫБЕРИТЕ СИЛУ ШПИНАТА',
      TAP_TO_SELECT: 'НАЖМИТЕ НА КАРТУ', CRIT_HIT: 'КРИТ!', HEADSHOT_TXT: 'КАЗНЬ!', DODGE_TXT: 'УКЛОН!',
      WEAPON_EVOLVE: 'ОРУЖИЕ УЛУЧШЕНО!', AD_NOT_READY: 'РЕКЛАМА НЕ ГОТОВА!'
    },
    KO: {
      XP_LABEL: 'LV', STAGE: '스테이지', SUBTITLE: '아케이드 우주 항공 슈팅',
      START_BTN: '출격 시작', PAUSED: '일시 정지', RESUME_BTN: '계속하기', RESTART_BTN: '다시 시작',
      GAME_OVER: '전투기 격추!', REACHED_LEVEL: '도달 레벨', REVIVE_AD_BTN: '광고 보고 부활',
      WARNING_BOSS: '경고! 거대 보스 접근 중!', BOSS_NAME: '강철 드레드노트 요새',
      STAGE_CLEAR: '스테이지 클리어!', LEVEL_UP_TITLE: '레벨 업!', LEVEL_UP_SUB: '시금치 스킬을 선택하세요',
      TAP_TO_SELECT: '카드를 탭하여 선택', CRIT_HIT: '치명타!', HEADSHOT_TXT: '처형!', DODGE_TXT: '회피!',
      WEAPON_EVOLVE: '무기 진화!', AD_NOT_READY: '광고 준비 중!'
    },
    MS: {
      XP_LABEL: 'THP', STAGE: 'PERINGKAT', SUBTITLE: 'PERTEMPURAN ANGKASA ARKED',
      START_BTN: 'MULA', PAUSED: 'PERMAINAN DIHENTIKAN', RESUME_BTN: 'SAMBUNG', RESTART_BTN: 'MULA SEMULA',
      GAME_OVER: 'JET TUMPAS!', REACHED_LEVEL: 'TAHAP DICAPAI', REVIVE_AD_BTN: 'TONTON VIDEO · HIDUP',
      WARNING_BOSS: 'AMARAN! BOS MENGHAMPIRI!', BOSS_NAME: 'KUBU BESI DREADNOUGHT',
      STAGE_CLEAR: 'PERINGKAT SELESAI!', LEVEL_UP_TITLE: 'NAIK TAHAP!', LEVEL_UP_SUB: 'PILIH KUASA BAYAM',
      TAP_TO_SELECT: 'KETIK KAD', CRIT_HIT: 'KRITIKAL!', HEADSHOT_TXT: 'TUMPAS!', DODGE_TXT: 'ELAK!',
      WEAPON_EVOLVE: 'SENJATA NAIK TARAF!', AD_NOT_READY: 'TIADA IKLAN!'
    },
    IT: {
      XP_LABEL: 'LV', STAGE: 'FASE', SUBTITLE: 'BATTAGLIA AEREA E SPAZIALE ARCADE',
      START_BTN: 'GIOCA', PAUSED: 'GIOCO IN PAUSA', RESUME_BTN: 'RIPRENDI', RESTART_BTN: 'RICOMINCIA',
      GAME_OVER: 'AEREO ABBATTUTO!', REACHED_LEVEL: 'LIVELLO RAGGIUNTO', REVIVE_AD_BTN: 'VIDEO · RINASCI',
      WARNING_BOSS: 'ALLARME! CORAZZATA IN ARRIVO!', BOSS_NAME: 'FORTEZZA CORAZZATA',
      STAGE_CLEAR: 'FASE COMPLETATA!', LEVEL_UP_TITLE: 'LIVELLO SU!', LEVEL_UP_SUB: 'SCEGLI UN POTERE SPINACI',
      TAP_TO_SELECT: 'TOCCA UNA CARTA', CRIT_HIT: 'CRITICO!', HEADSHOT_TXT: 'ESECUZIONE!', DODGE_TXT: 'SCHIVATO!',
      WEAPON_EVOLVE: 'ARMA POTENZIATA!', AD_NOT_READY: 'VIDEO NON PRONTO!'
    },
    DE: {
      XP_LABEL: 'ST', STAGE: 'STUFE', SUBTITLE: 'ARKADE-LUFT- & WELTRAUMSCHLACHT',
      START_BTN: 'STARTEN', PAUSED: 'PAUSE', RESUME_BTN: 'WEITER', RESTART_BTN: 'NEUSTART',
      GAME_OVER: 'JET ABGESCHOSSEN!', REACHED_LEVEL: 'ERREICHTES LEVEL', REVIVE_AD_BTN: 'VIDEO · WIEDERBELEBEN',
      WARNING_BOSS: 'WARNUNG! SCHLACHTSCHIFF NAHT!', BOSS_NAME: 'EISEN-DREADNOUGHT',
      STAGE_CLEAR: 'STUFE GESCHAFFT!', LEVEL_UP_TITLE: 'LEVEL AUFSTIEG!', LEVEL_UP_SUB: 'WÄHLE EINE SPINAT-KRAFT',
      TAP_TO_SELECT: 'KARTE ANTIPPEN', CRIT_HIT: 'KRITISCH!', HEADSHOT_TXT: 'VOLLSTRECKT!', DODGE_TXT: 'AUSGEWICHEN!',
      WEAPON_EVOLVE: 'WAFFEN-UPGRADE!', AD_NOT_READY: 'KEINE WERBUNG!'
    },
    EL: {
      XP_LABEL: 'ΕΠ', STAGE: 'ΣΤΑΔΙΟ', SUBTITLE: 'ΑΕΡΟΠΟΡΙΚΗ & ΔΙΑΣΤΗΜΙΚΗ ΜΑΧΗ',
      START_BTN: 'ΕΝΑΡΞΗ', PAUSED: 'ΠΑΥΣΗ', RESUME_BTN: 'ΣΥΝΕΧΕΙΑ', RESTART_BTN: 'ΕΠΑΝΕΚΚΙΝΗΣΗ',
      GAME_OVER: 'ΚΑΤΑΡΡΙΨΗ!', REACHED_LEVEL: 'ΕΠΙΠΕΔΟ', REVIVE_AD_BTN: 'ΒΙΝΤΕΟ · ΑΝΑΒΙΩΣΗ',
      WARNING_BOSS: 'ΠΡΟΣΟΧΗ! ΕΡΧΕΤΑΙ ΑΦΕΝΤΙΚΟ!', BOSS_NAME: 'ΣΙΔΕΡΕΝΙΟ ΘΩΡΗΚΤΟ',
      STAGE_CLEAR: 'ΣΤΑΔΙΟ ΟΛΟΚΛΗΡΩΘΗΚΕ!', LEVEL_UP_TITLE: 'ΝΕΟ ΕΠΙΠΕΔΟ!', LEVEL_UP_SUB: 'ΕΠΙΛΕΞΕ ΔΥΝΑΜΗ ΣΠΑΝΑΚΙΟΥ',
      TAP_TO_SELECT: 'ΠΑΤΗΣΕ ΚΑΡΤΑ', CRIT_HIT: 'ΚΡΙΤΙΚΟ!', HEADSHOT_TXT: 'ΕΚΤΕΛΕΣΗ!', DODGE_TXT: 'ΑΠΟΦΥΓΗ!',
      WEAPON_EVOLVE: 'ΑΝΑΒΑΘΜΙΣΗ ΟΠΛΟΥ!', AD_NOT_READY: 'ΜΗ ΔΙΑΘΕΣΙΜΟ!'
    },
    FR: {
      XP_LABEL: 'NV', STAGE: 'ÉTAPE', SUBTITLE: 'COMBAT AÉRIEN & SPATIAL ARCADE',
      START_BTN: 'JOUER', PAUSED: 'JEU EN PAUSE', RESUME_BTN: 'REPRENDRE', RESTART_BTN: 'RECOMMENCER',
      GAME_OVER: 'AVION ABATTU !', REACHED_LEVEL: 'NIVEAU ATTEINT', REVIVE_AD_BTN: 'VIDÉO · REVIVRE',
      WARNING_BOSS: 'ALERTE ! CUIRASSÉ EN APPROCHE !', BOSS_NAME: 'FORTERESSE DREADNOUGHT',
      STAGE_CLEAR: 'ÉTAPE TERMINÉE !', LEVEL_UP_TITLE: 'NIVEAU SUPÉRIEUR !', LEVEL_UP_SUB: 'CHOISIS UN POUVOIR ÉPINARD',
      TAP_TO_SELECT: 'TOUCHE UNE CARTE', CRIT_HIT: 'CRITIQUE !', HEADSHOT_TXT: 'EXÉCUTÉ !', DODGE_TXT: 'ESQUIVÉ !',
      WEAPON_EVOLVE: 'ARME AMÉLIORÉE !', AD_NOT_READY: 'PUB NON PRÊTE !'
    },
    AR: {
      XP_LABEL: 'مستوى', STAGE: 'مرحلة', SUBTITLE: 'معركة الفضاء والطيران الأركيد',
      START_BTN: 'ابدأ المعركة', PAUSED: 'اللعبة متوقفة', RESUME_BTN: 'متابعة', RESTART_BTN: 'إعادة اللعب',
      GAME_OVER: 'سقطت الطائرة!', REACHED_LEVEL: 'المستوى', REVIVE_AD_BTN: 'شاهد إعلان · إنعاش',
      WARNING_BOSS: 'تحذير! الزعيم يقترب!', BOSS_NAME: 'المدرعة الحديدية',
      STAGE_CLEAR: 'اكتملت المرحلة!', LEVEL_UP_TITLE: 'ارتقاء المستوى!', LEVEL_UP_SUB: 'اختر قوة السبانخ',
      TAP_TO_SELECT: 'اضغط للاختيار', CRIT_HIT: 'ضربة حرجة!', HEADSHOT_TXT: 'إعدام!', DODGE_TXT: 'مراوغة!',
      WEAPON_EVOLVE: 'تطوير السلاح!', AD_NOT_READY: 'الإعلان غير جاهز!'
    },
    UR: {
      XP_LABEL: 'لیول', STAGE: 'مرحلہ', SUBTITLE: 'آرکیڈ خلائی اور فضائی جنگ',
      START_BTN: 'جنگ شروع', PAUSED: 'گیم رکا ہوا ہے', RESUME_BTN: 'جاری رکھیں', RESTART_BTN: 'دوبارہ شروع',
      GAME_OVER: 'طیارہ تباہ!', REACHED_LEVEL: 'لیول', REVIVE_AD_BTN: 'ویڈیو دیکھیں · دوبارہ زندہ',
      WARNING_BOSS: 'خبردار! باس آ رہا ہے!', BOSS_NAME: 'آئرن ڈریڈناٹ قلعہ',
      STAGE_CLEAR: 'مرحلہ مکمل!', LEVEL_UP_TITLE: 'لیول اپ!', LEVEL_UP_SUB: 'پالک کی طاقت منتخب کریں',
      TAP_TO_SELECT: 'منتخب کرنے کے لیے دبائیں', CRIT_HIT: 'کریٹیکل!', HEADSHOT_TXT: 'خاتمہ!', DODGE_TXT: 'بچاؤ!',
      WEAPON_EVOLVE: 'ہتھیار اپ گریڈ!', AD_NOT_READY: 'اشتہار تیار نہیں!'
    }
  },

  t(key) {
    const dict = this.strings[this.lang] || this.strings.EN;
    if (dict && dict[key] !== undefined) return dict[key];
    return (this.strings.EN && this.strings.EN[key]) || (this.strings.TR && this.strings.TR[key]) || key;
  },

  toggleLang() {
    const idx = this.ORDER.indexOf(this.lang);
    this.lang = this.ORDER[(idx + 1) % this.ORDER.length];
    try {
      localStorage.setItem('popeye1929_lang', this.lang);
    } catch (e) {}
    return this.lang;
  }
};
