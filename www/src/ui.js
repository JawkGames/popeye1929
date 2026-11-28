// Dişli Çerçeveli Yeni Can & Seviye (XP) Bar Sistemi, 17 Dilli Arayüz, Özel İkonlu Butonlar ve 3'lü Ispanak Seçim Ekranı
window.UIManager = class UIManager {
  constructor(game) {
    this.game = game;
    this.isNativeAndroid = Boolean(
      window.Capacitor &&
      typeof window.Capacitor.isNativePlatform === 'function' &&
      window.Capacitor.isNativePlatform()
    );

    // Sağ üst özel ikonlu buton alanları
    this.btnPause = { x: 500, y: 38, w: 50, h: 50 };
    this.btnLang  = { x: 444, y: 38, w: 50, h: 50 };
    this.btnMute  = { x: 444, y: 94, w: 50, h: 50 };
    this.btnFull  = { x: 500, y: 94, w: 50, h: 50 };

    // Modal aksiyon butonları (Geniş, ikonlu ve yazı taşmayan yapı)
    this.btnPrimary   = { x: 270, y: 548, w: 312, h: 84 };
    this.btnSecondary = { x: 270, y: 642, w: 312, h: 78 };

    // 3'lü Ispanak Yetenek Kartı Alanları (Seviye Atlama Ekranı)
    this.skillCards = [
      { x: 96,  y: 495, w: 162, h: 292 },
      { x: 270, y: 495, w: 162, h: 292 },
      { x: 444, y: 495, w: 162, h: 292 }
    ];

    this.layout();
  }

  layout() {
    this.midOff = Math.round((window.GAME_CONFIG.HEIGHT - window.GAME_CONFIG.BASE_HEIGHT) * 0.5);
    this.btnPrimary.y = 548 + this.midOff;
    this.btnSecondary.y = 642 + this.midOff;
    for (let i = 0; i < this.skillCards.length; i++) {
      this.skillCards[i].y = 495 + this.midOff;
    }
  }

  hitRect(px, py, b) {
    return (
      px >= b.x - b.w * 0.5 &&
      px <= b.x + b.w * 0.5 &&
      py >= b.y - b.h * 0.5 &&
      py >= b.y + b.h * 0.5
    );
  }

  handlePointerDown(px, py) {
    // 1) Dil Değiştirme Butonu (17 Dil: TR, EN, ES, HI, PT, FIL, ID, AF, RU, KO, MS, IT, DE, EL, FR, AR, UR)
    if (this.hitRect(px, py, this.btnLang)) {
      window.I18N.toggleLang();
      return true;
    }

    // 1b) Ses Açma/Kapatma Butonu
    if (this.hitRect(px, py, this.btnMute)) {
      if (window.AudioManager) window.AudioManager.toggleMute();
      return true;
    }

    // 2) Tam Ekran Butonu (Sadece Web sürümünde görünür ve çalışır, Android AAB'de gizli)
    if (!this.isNativeAndroid && this.hitRect(px, py, this.btnFull)) {
      this.toggleFullscreen();
      return true;
    }

    // 3) Seviye Atlama (3'lü Ispanak Kutusu Seçimi)
    if (this.game.state === 'LEVELUP') {
      for (let i = 0; i < this.skillCards.length; i++) {
        if (this.hitRect(px, py, this.skillCards[i])) {
          this.game.selectLevelUpSkill(i);
          return true;
        }
      }
      return true;
    }

    // 4) Duraklatma (Pause) Butonu
    if (this.hitRect(px, py, this.btnPause)) {
      if (this.game.state === 'PLAYING' || this.game.state === 'PAUSED') {
        this.game.togglePause();
        return true;
      }
    }

    // 5) Menü / Pause / Game Over Modal Butonları
    if (this.game.state === 'MENU') {
      if (this.hitRect(px, py, this.btnPrimary)) {
        this.game.startGame();
        return true;
      }
    } else if (this.game.state === 'PAUSED') {
      if (this.hitRect(px, py, this.btnPrimary)) {
        this.game.togglePause();
        return true;
      }
      if (this.hitRect(px, py, this.btnSecondary)) {
        this.game.startGame();
        return true;
      }
    } else if (this.game.state === 'GAMEOVER') {
      if (this.hitRect(px, py, this.btnPrimary)) {
        if (!this.adBusy) {
          this.adBusy = true;
          window.Ads.showRewarded().then((ok) => {
            this.adBusy = false;
            if (ok && this.game.state === 'GAMEOVER') {
              this.game.reviveWithAd();
            } else if (!ok) {
              this.game.addFloatText(window.I18N.t('AD_NOT_READY'), window.GAME_CONFIG.WIDTH * 0.5, this.btnPrimary.y - 52, '#ff6b5b', 18);
            }
          });
        }
        return true;
      }
      if (this.hitRect(px, py, this.btnSecondary)) {
        window.Ads.showInterstitial();
        this.game.startGame();
        return true;
      }
    }

    return false;
  }

  toggleFullscreen() {
    const doc = document;
    const elem = doc.documentElement;
    if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
      const req = elem.requestFullscreen || elem.webkitRequestFullscreen;
      if (req) {
        req.call(elem).then(() => {
          if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('portrait').catch(() => {});
          }
        }).catch(() => {});
      }
    } else {
      const exit = doc.exitFullscreen || doc.webkitExitFullscreen;
      if (exit) exit.call(doc).catch(() => {});
    }
  }

  formatNumber(n) {
    return Math.floor(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  drawSlantedBar(ctx, x, y, w, h, slant, bgColor, fillColor, fillRatio, borderColor) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + slant, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w - slant, y + h);
    ctx.lineTo(x, y + h);
    ctx.closePath();
    ctx.fillStyle = bgColor;
    ctx.fill();

    if (fillRatio > 0) {
      const fw = Math.max(0, Math.min(1, fillRatio)) * w;
      ctx.save();
      ctx.clip();
      ctx.fillStyle = fillColor;
      ctx.fillRect(x, y, fw, h);
      ctx.fillStyle = 'rgba(255,255,255,0.28)';
      ctx.fillRect(x, y, fw, h * 0.42);
      ctx.restore();
    }

    ctx.lineWidth = 2.2;
    ctx.strokeStyle = borderColor || '#c8dcf0';
    ctx.stroke();
    ctx.restore();
  }

  drawTextOutlined(ctx, text, x, y, size, fill, align = 'left', strokeWidth = 4) {
    ctx.save();
    ctx.font = `900 ${size}px "Arial Black", Impact, sans-serif`;
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = '#07111e';
    ctx.strokeText(text, x, y);
    ctx.fillStyle = fill;
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  // Buton içine taşmadan otomatik küçülen yazı çizimi
  drawTextFitted(ctx, text, x, y, maxSize, maxWidth, fill, strokeWidth = 4) {
    let sz = maxSize;
    ctx.save();
    while (sz > 10) {
      ctx.font = `900 ${sz}px "Arial Black", Impact, sans-serif`;
      if (ctx.measureText(text).width <= maxWidth) break;
      sz -= 1;
    }
    ctx.restore();
    this.drawTextOutlined(ctx, text, x, y, sz, fill, 'center', strokeWidth);
  }

  drawWrappedText(ctx, text, cx, startY, maxWidth, lineHeight, size, fill) {
    const words = text.split(' ');
    let line = '';
    let y = startY;
    ctx.save();
    ctx.font = `800 ${size}px Arial, Helvetica, sans-serif`;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        this.drawTextOutlined(ctx, line.trim(), cx, y, size, fill, 'center', 3);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line.trim()) {
      this.drawTextOutlined(ctx, line.trim(), cx, y, size, fill, 'center', 3);
    }
    ctx.restore();
  }

  // İkonlu ve Geniş Arcade Buton Çizimi (Yazı asla taşmaz)
  drawActionButton(ctx, rect, btnFrame, iconFrame, label, textColor = '#ffffff', fontSize = 18) {
    const drawn = window.Atlas.draw(ctx, btnFrame || 'btn_blue', rect.x, rect.y, rect.w, rect.h * 1.45);
    if (!drawn) {
      this.drawSlantedBar(
        ctx,
        rect.x - rect.w * 0.5,
        rect.y - rect.h * 0.5,
        rect.w,
        rect.h,
        8,
        'rgba(18, 46, 82, 0.94)',
        btnFrame === 'btn_green' ? 'rgba(28, 152, 84, 0.9)' : 'rgba(38, 96, 158, 0.85)',
        1,
        '#ffe066'
      );
    }

    if (iconFrame) {
      const iconX = rect.x - rect.w * 0.34;
      window.Atlas.draw(ctx, iconFrame, iconX, rect.y, 44, 44);
      if (label) {
        this.drawTextFitted(ctx, label, rect.x + 20, rect.y, fontSize, rect.w * 0.58, textColor, 4.5);
      }
    } else if (label) {
      this.drawTextFitted(ctx, label, rect.x, rect.y, fontSize, rect.w * 0.80, textColor, 4.5);
    }
  }

  draw(ctx) {
    const p = this.game.player;
    const wd = this.game.waveDirector;

    // =========================================================================
    // 1) SOL ÜST DİŞLİ ÇERÇEVELİ POPEYE CAN & SEVİYE (XP) BARI (Skorsuz)
    // =========================================================================
    const hx = 6;
    const hy = 8;
    const hw = 286;
    const hh = 107;
    const hcx = hx + hw * 0.5;
    const hcy = hy + hh * 0.5;

    const hpRatio = Math.max(0, Math.min(1, p.hp / Math.max(1, p.maxHp)));
    const xpRatio = Math.max(0, Math.min(1, this.game.xp / Math.max(1, this.game.xpToNext)));

    // Önce boş metalik HUD barını çiz
    const hasNewHud = window.Atlas.draw(ctx, 'hud_bar_empty', hcx, hcy, hw, hh);
    if (hasNewHud) {
      // Üst Kırmızı Can Barı (hpRatio oranında soldan sağa kırpılarak dolu bar çizilir)
      if (hpRatio > 0) {
        const hpStartX = hx + hw * 0.380;
        const hpMaxW = hw * (0.935 - 0.380);
        ctx.save();
        ctx.beginPath();
        ctx.rect(hpStartX, hy + hh * 0.28, hpMaxW * hpRatio, hh * 0.30);
        ctx.clip();
        window.Atlas.draw(ctx, 'hud_bar_full', hcx, hcy, hw, hh);
        ctx.restore();
      }

      // Alt Mavi XP / Seviye Barı (xpRatio oranında soldan sağa kırpılarak dolu bar çizilir)
      if (xpRatio > 0) {
        const xpStartX = hx + hw * 0.370;
        const xpMaxW = hw * (0.785 - 0.370);
        ctx.save();
        ctx.beginPath();
        ctx.rect(xpStartX, hy + hh * 0.58, xpMaxW * xpRatio, hh * 0.25);
        ctx.clip();
        window.Atlas.draw(ctx, 'hud_bar_full', hcx, hcy, hw, hh);
        ctx.restore();
      }

      // Alt Mavi Bar Üzerinde Seviye (SV 2 / LV 2) ve Yüzde Bilgisi
      this.drawTextOutlined(
        ctx,
        `${window.I18N.t('XP_LABEL')} ${this.game.level}`,
        hx + hw * 0.41,
        hy + hh * 0.70,
        11.5,
        '#ffe066',
        'left',
        3.5
      );
      this.drawTextOutlined(
        ctx,
        `${Math.floor(xpRatio * 100)}%`,
        hx + hw * 0.74,
        hy + hh * 0.70,
        10.5,
        '#ffffff',
        'right',
        3
      );
    } else {
      // Görsel inerken anlık yedek bar
      this.drawSlantedBar(ctx, 74, 24, 165, 22, 7, 'rgba(13, 32, 54, 0.88)', '#e82c2c', hpRatio, '#b5d4ef');
      this.drawSlantedBar(ctx, 70, 54, 148, 20, 5, 'rgba(10, 32, 46, 0.92)', '#00d2ff', xpRatio, '#6bf5d2');
    }

    // BÖLÜM 1 & Aktif Silah Rozeti
    this.drawTextOutlined(
      ctx,
      `${window.I18N.t('STAGE')} ${wd.stage}`,
      18,
      122,
      14,
      '#eaf4ff',
      'left',
      4
    );

    const weaponBadge = `${p.weaponLevel}X` + (p.wingmen.length > 0 ? ` +${p.wingmen.length}W` : '');
    this.drawTextOutlined(ctx, weaponBadge, 114, 122, 13, '#57e2ff', 'left', 3.5);

    // =========================================================================
    // 2) SAĞ ÜST ÖZEL İKONLU BUTONLAR (Dil Küresi, Duraklat, Ses, Tam Ekran)
    // =========================================================================
    window.Atlas.draw(ctx, 'icon_pause', this.btnPause.x, this.btnPause.y, this.btnPause.w, this.btnPause.h);

    window.Atlas.draw(ctx, 'icon_lang', this.btnLang.x, this.btnLang.y, this.btnLang.w, this.btnLang.h);
    this.drawTextOutlined(ctx, window.I18N.lang, this.btnLang.x, this.btnLang.y + 13, 10.5, '#ffe047', 'center', 3.5);

    const isMuted = Boolean(window.AudioManager && window.AudioManager.muted);
    window.Atlas.draw(
      ctx,
      isMuted ? 'icon_sound_off' : 'icon_sound_on',
      this.btnMute.x,
      this.btnMute.y,
      this.btnMute.w,
      this.btnMute.h
    );

    if (!this.isNativeAndroid) {
      window.Atlas.draw(ctx, 'icon_fullscreen', this.btnFull.x, this.btnFull.y, this.btnFull.w, this.btnFull.h);
    }

    // =========================================================================
    // 3) BOSS CAN BARI VE "WARNING" UYARI EKRANI
    // =========================================================================
    if (wd.bossWarningTimer > 0) {
      const pulse = 0.55 + Math.sin(wd.bossWarningTimer * 14) * 0.45;
      ctx.save();
      ctx.fillStyle = `rgba(190, 18, 28, ${0.78 * pulse})`;
      ctx.translate(0, this.midOff);
      ctx.fillRect(0, 382, window.GAME_CONFIG.WIDTH, 108);
      ctx.fillStyle = '#ffe047';
      ctx.fillRect(0, 382, window.GAME_CONFIG.WIDTH, 5);
      ctx.fillRect(0, 485, window.GAME_CONFIG.WIDTH, 5);
      window.Atlas.draw(ctx, 'emblem_boss_warn', 58, 436, 72, 72);
      window.Atlas.draw(ctx, 'emblem_boss_warn', window.GAME_CONFIG.WIDTH - 58, 436, 72, 72);
      this.drawTextFitted(
        ctx,
        window.I18N.t('WARNING_BOSS'),
        window.GAME_CONFIG.WIDTH * 0.5,
        436,
        18,
        360,
        '#ffffff',
        5
      );
      ctx.restore();
    }

    if (wd.bossActive && !wd.bossActive.dying) {
      const b = wd.bossActive;
      const bRatio = Math.max(0, b.hp / b.maxHp);
      const bx = 135;
      const by = 140;
      const bw = 270;
      this.drawTextOutlined(ctx, window.I18N.t('BOSS_NAME'), 270, by - 11, 12, '#ff6b5b', 'center', 3.5);
      this.drawSlantedBar(ctx, bx, by, bw, 16, 6, 'rgba(25, 10, 16, 0.92)', '#e82c2c', bRatio, '#ffb8b0');
    }

    // =========================================================================
    // 4) EKRAN MODALLARI (MENU, LEVELUP 3'LÜ ISPANAK SEÇİMİ, PAUSED, GAMEOVER)
    // =========================================================================
    if (this.game.state === 'MENU') {
      this.drawMenuOverlay(ctx);
    } else if (this.game.state === 'LEVELUP') {
      this.drawLevelUpOverlay(ctx);
    } else if (this.game.state === 'PAUSED') {
      this.drawPauseOverlay(ctx);
    } else if (this.game.state === 'GAMEOVER') {
      this.drawGameOverOverlay(ctx);
    }
  }

  // =========================================================================
  // ARCHERO TARZI 3'LÜ ISPANAK KUTUSU YETENEK SEÇİM EKRANI
  // =========================================================================
  drawLevelUpOverlay(ctx) {
    const W = window.GAME_CONFIG.WIDTH;
    const H = window.GAME_CONFIG.HEIGHT;
    const choices = this.game.levelUpChoices || [];
    const isTr = window.I18N.lang === 'TR';

    ctx.save();
    ctx.fillStyle = 'rgba(4, 12, 26, 0.84)';
    ctx.fillRect(0, 0, W, H);

    const headerY = 235 + this.midOff;
    window.Atlas.draw(ctx, 'badge_levelup', W * 0.5, headerY - 38, 120, 72);
    this.drawTextFitted(
      ctx,
      `${window.I18N.t('LEVEL_UP_TITLE')} (${window.I18N.t('XP_LABEL')} ${this.game.level})`,
      W * 0.5,
      headerY + 12,
      25,
      490,
      '#ffe047',
      6
    );
    this.drawTextFitted(
      ctx,
      window.I18N.t('LEVEL_UP_SUB'),
      W * 0.5,
      headerY + 46,
      14,
      490,
      '#68e4ff',
      4
    );

    for (let i = 0; i < 3; i++) {
      const sk = choices[i];
      if (!sk) continue;
      const card = this.skillCards[i];
      const info = isTr ? sk.tr : sk.en;

      window.Atlas.draw(ctx, 'ui_skill_card', card.x, card.y, card.w, card.h);
      this.drawTextOutlined(ctx, info.tag, card.x, card.y - 114, 10, sk.color || '#ffe047', 'center', 3);

      const canY = card.y - 42;
      window.Atlas.draw(ctx, sk.can || 'hud_portrait', card.x, canY, 92, 96);
      if (sk.badge && sk.badge !== sk.can) {
        window.Atlas.draw(ctx, sk.badge, card.x + 22, canY + 18, 44, 44);
      }

      this.drawTextOutlined(ctx, isTr ? '★ ÖZEL GÜÇ ★' : '★ UNIQUE PERK ★', card.x, card.y + 18, 10.5, '#ffe047', 'center', 3);
      this.drawWrappedText(ctx, info.name, card.x, card.y + 42, card.w - 22, 15, 11.5, '#ffffff');
      this.drawWrappedText(ctx, info.desc, card.x, card.y + 78, card.w - 24, 14, 10, '#bfe3ff');
    }

    this.drawTextFitted(
      ctx,
      window.I18N.t('TAP_TO_SELECT'),
      W * 0.5,
      675 + this.midOff,
      14,
      480,
      '#6dff5c',
      4
    );

    ctx.restore();
  }

  drawMenuOverlay(ctx) {
    const W = window.GAME_CONFIG.WIDTH;
    const H = window.GAME_CONFIG.HEIGHT;
    ctx.save();
    ctx.fillStyle = 'rgba(4, 12, 24, 0.74)';
    ctx.fillRect(0, 0, W, H);
    ctx.save();
    ctx.translate(0, this.midOff);

    window.Atlas.draw(ctx, 'boss_dreadnought', W * 0.5, 210, 210, 175);
    window.Atlas.draw(ctx, 'emblem_victory', W * 0.5 - 140, 345, 72, 72, { rotation: -0.14 });
    window.Atlas.draw(ctx, 'emblem_shield_heart', W * 0.5 + 140, 345, 72, 72, { rotation: 0.14 });

    this.drawTextOutlined(ctx, 'POPEYE 1929', W * 0.5, 345, 36, '#ffe047', 'center', 7);
    this.drawTextFitted(ctx, window.I18N.t('SUBTITLE'), W * 0.5, 388, 15, 460, '#68e4ff', 4);

    const lines = window.I18N.t('CONTROL_HINT').split('\n');
    for (let i = 0; i < lines.length; i++) {
      this.drawTextFitted(ctx, lines[i], W * 0.5, 438 + i * 24, 13, 480, '#dbeeff', 3.5);
    }

    ctx.restore();
    this.drawActionButton(ctx, this.btnPrimary, 'btn_gold', 'icon_play', window.I18N.t('START_BTN'), '#ffffff', 20);

    this.drawTextOutlined(
      ctx,
      window.GAME_CONFIG.VERSION,
      W - 14,
      H - 16,
      12,
      '#8fb8de',
      'right',
      3
    );
    ctx.restore();
  }

  drawPauseOverlay(ctx) {
    const W = window.GAME_CONFIG.WIDTH;
    const H = window.GAME_CONFIG.HEIGHT;
    ctx.save();
    ctx.fillStyle = 'rgba(4, 12, 24, 0.80)';
    ctx.fillRect(0, 0, W, H);

    // Dişli Köşeli Metalik Duraklatma Paneli
    window.Atlas.draw(ctx, 'panel_modal', W * 0.5, 480 + this.midOff, 470, 520);

    ctx.save();
    ctx.translate(0, this.midOff);
    window.Atlas.draw(ctx, 'emblem_victory', W * 0.5, 320, 130, 130);
    this.drawTextFitted(ctx, window.I18N.t('PAUSED'), W * 0.5, 430, 28, 370, '#ffe047', 6);
    this.drawTextFitted(
      ctx,
      `${window.I18N.t('XP_LABEL')} ${this.game.level}  ·  ${window.I18N.t('STAGE')} ${this.game.waveDirector.stage}`,
      W * 0.5,
      472,
      18,
      360,
      '#68e4ff',
      4
    );
    ctx.restore();

    this.drawActionButton(ctx, this.btnPrimary, 'btn_green', 'icon_play', window.I18N.t('RESUME_BTN'), '#ffffff', 19);
    this.drawActionButton(ctx, this.btnSecondary, 'btn_blue', 'icon_restart', window.I18N.t('RESTART_BTN'), '#ffffff', 18);

    this.drawTextOutlined(ctx, window.GAME_CONFIG.VERSION, W - 14, H - 16, 12, '#8fb8de', 'right', 3);
    ctx.restore();
  }

  drawGameOverOverlay(ctx) {
    const W = window.GAME_CONFIG.WIDTH;
    const H = window.GAME_CONFIG.HEIGHT;
    ctx.save();
    ctx.fillStyle = 'rgba(10, 6, 16, 0.84)';
    ctx.fillRect(0, 0, W, H);

    // Dişli Köşeli Metalik Game Over Paneli
    window.Atlas.draw(ctx, 'panel_modal', W * 0.5, 480 + this.midOff, 476, 540);

    ctx.save();
    ctx.translate(0, this.midOff);

    // Özel Gemi Düştü Rozeti (Hasarlı Savaş Uçağı, Denizci Şapkası ve Demir Çapa)
    window.Atlas.draw(ctx, 'emblem_gameover', W * 0.5, 308, 152, 152);
    this.drawTextFitted(ctx, window.I18N.t('GAME_OVER'), W * 0.5, 412, 30, 370, '#ff5c4d', 6);
    this.drawTextFitted(
      ctx,
      `${window.I18N.t('XP_LABEL')} ${this.game.level}  ·  ${window.I18N.t('STAGE')} ${this.game.waveDirector.stage}`,
      W * 0.5,
      462,
      21,
      370,
      '#ffe047',
      5
    );
    ctx.restore();

    // Yeşil Ödüllü Reklamla Canlan Butonu (Solunda Altın Klaket + Yeşil Kalp Reklam İkonu, Taşmayan Yazı)
    this.drawActionButton(ctx, this.btnPrimary, 'btn_green', 'icon_video_ad', window.I18N.t('REVIVE_AD_BTN'), '#ffffff', 18);
    // Mavi Yeniden Başla Butonu (Solunda Döner Yeniden Başlatma Oku)
    this.drawActionButton(ctx, this.btnSecondary, 'btn_blue', 'icon_restart', window.I18N.t('RESTART_BTN'), '#ffffff', 18);
    ctx.restore();
  }
};
