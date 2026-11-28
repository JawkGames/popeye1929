// Dişli Çerçeveli Yeni Can & Seviye (XP) Bar Sistemi, Klasik Üst/Ana Sayfa Butonları ve Yenilenmiş Ölüm Ekranı
window.UIManager = class UIManager {
  constructor(game) {
    this.game = game;
    this.isNativeAndroid = Boolean(
      window.Capacitor &&
      typeof window.Capacitor.isNativePlatform === 'function' &&
      window.Capacitor.isNativePlatform()
    );

    // Sağ üst klasik buton alanları (ui_button sprite'ı ile çizilir)
    this.btnPause = { x: 500, y: 38, w: 46, h: 46 };
    this.btnLang  = { x: 446, y: 38, w: 46, h: 46 };
    this.btnMute  = { x: 446, y: 92, w: 46, h: 46 };
    this.btnFull  = { x: 500, y: 92, w: 46, h: 46 };

    // Modal butonları
    this.btnPrimary   = { x: 270, y: 540, w: 296, h: 72 };
    this.btnSecondary = { x: 270, y: 632, w: 296, h: 68 };
    // Menüdeki "Gizlilik Seçenekleri" butonu (yalnızca reklam izni gereken bölgelerde görünür)
    this.btnPrivacy   = { x: 104, y: 930, w: 184, h: 36 };

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
    this.btnPrimary.y = 540 + this.midOff;
    this.btnSecondary.y = 632 + this.midOff;
    this.btnPrivacy.y = window.GAME_CONFIG.HEIGHT - 30;
    for (let i = 0; i < this.skillCards.length; i++) {
      this.skillCards[i].y = 495 + this.midOff;
    }
  }

  hitRect(px, py, b) {
    return (
      px >= b.x - b.w * 0.5 &&
      px <= b.x + b.w * 0.5 &&
      py >= b.y - b.h * 0.5 &&
      py <= b.y + b.h * 0.5
    );
  }

  handlePointerDown(px, py) {
    // 1) Seviye Atlama (3'lü Ispanak Kutusu Seçimi) AÇIKKEN yalnızca kartlara dokunulabilir (üst butonlarla karışmaz)
    if (this.game.state === 'LEVELUP') {
      for (let i = 0; i < this.skillCards.length; i++) {
        if (this.hitRect(px, py, this.skillCards[i])) {
          this.game.selectLevelUpSkill(i);
          return true;
        }
      }
      return true;
    }

    // 2) Dil Değiştirme Butonu (TR / EN)
    if (this.hitRect(px, py, this.btnLang)) {
      window.I18N.toggleLang();
      return true;
    }

    // 3) Ses Açma/Kapatma Butonu
    if (this.hitRect(px, py, this.btnMute)) {
      if (window.AudioManager) window.AudioManager.toggleMute();
      return true;
    }

    // 4) Tam Ekran Butonu (Sadece Web sürümünde görünür ve çalışır, Android AAB'de gizli)
    if (!this.isNativeAndroid && this.hitRect(px, py, this.btnFull)) {
      this.toggleFullscreen();
      return true;
    }

    // 5) Duraklatma (Pause) Butonu
    if (this.hitRect(px, py, this.btnPause)) {
      if (this.game.state === 'PLAYING' || this.game.state === 'PAUSED') {
        this.game.togglePause();
        return true;
      }
    }

    // 6) Menü / Pause / Game Over Modal Butonları
    if (this.game.state === 'MENU') {
      if (this.privacyVisible() && this.hitRect(px, py, this.btnPrivacy)) {
        window.Ads.showPrivacyOptions();
        return true;
      }
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
              this.game.addFloatText(window.I18N.t('AD_NOT_READY'), window.GAME_CONFIG.WIDTH * 0.5, this.btnPrimary.y - 48, '#ff6b5b', 18);
            }
          }).catch(() => { this.adBusy = false; });
        }
        return true;
      }
      if (this.hitRect(px, py, this.btnSecondary)) {
        if (!this.adBusy) {
          // Geçiş reklamı hazırsa önce o gösterilir; reklam kapanınca yeni oyun başlar
          this.adBusy = true;
          const restart = () => {
            this.adBusy = false;
            if (this.game.state === 'GAMEOVER') this.game.startGame();
          };
          window.Ads.showInterstitial().then(restart, restart);
        }
        return true;
      }
    }

    return false;
  }

  privacyVisible() {
    return Boolean(this.isNativeAndroid && window.Ads && window.Ads.privacyOptionsRequired);
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

  drawTextOutlined(ctx, text, x, y, size, fill, align = 'left', strokeWidth = 4, useBodyFont = false) {
    ctx.save();
    if (useBodyFont) {
      ctx.font = `800 ${size}px 'Nunito', 'Segoe UI', Arial, sans-serif`;
    } else {
      const displaySize = Math.round(size * 1.16);
      ctx.font = `400 ${displaySize}px 'Bangers', "Arial Black", Impact, sans-serif`;
    }
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

  drawTextFitted(ctx, text, x, y, maxSize, maxWidth, fill, strokeWidth = 4, useBodyFont = false) {
    let sz = maxSize;
    ctx.save();
    while (sz > 10) {
      if (useBodyFont) {
        ctx.font = `800 ${sz}px 'Nunito', 'Segoe UI', Arial, sans-serif`;
      } else {
        ctx.font = `400 ${Math.round(sz * 1.16)}px 'Bangers', "Arial Black", Impact, sans-serif`;
      }
      if (ctx.measureText(text).width <= maxWidth) break;
      sz -= 1;
    }
    ctx.restore();
    this.drawTextOutlined(ctx, text, x, y, sz, fill, 'center', strokeWidth, useBodyFont);
  }

  drawWrappedText(ctx, text, cx, startY, maxWidth, lineHeight, size, fill, isTitle = false) {
    const words = text.split(' ');
    let line = '';
    let y = startY;
    ctx.save();
    ctx.font = isTitle
      ? `400 ${Math.round(size * 1.24)}px 'Bangers', "Arial Black", Impact, sans-serif`
      : `800 ${size}px 'Nunito', 'Segoe UI', Arial, sans-serif`;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        this.drawTextOutlined(ctx, line.trim(), cx, y, isTitle ? size * 1.07 : size, fill, 'center', isTitle ? 3.5 : 2.8, !isTitle);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line.trim()) {
      this.drawTextOutlined(ctx, line.trim(), cx, y, isTitle ? size * 1.07 : size, fill, 'center', isTitle ? 3.5 : 2.8, !isTitle);
    }
    ctx.restore();
  }

  // Klasik ui_button çizimi (Üst butonlar ve Ana Sayfa için)
  drawSpriteButton(ctx, rect, label, textColor = '#ffffff', fontSize = 18) {
    const drawn = window.Atlas.draw(ctx, 'ui_button', rect.x, rect.y, rect.w, rect.h);
    if (!drawn) {
      this.drawSlantedBar(
        ctx,
        rect.x - rect.w * 0.5,
        rect.y - rect.h * 0.5,
        rect.w,
        rect.h,
        6,
        'rgba(18, 46, 82, 0.94)',
        'rgba(38, 96, 158, 0.85)',
        1,
        '#8fd2ff'
      );
    }
    if (label) {
      this.drawTextFitted(ctx, label, rect.x, rect.y, fontSize, rect.w - 18, textColor, 4);
    }
  }

  // Ölüm / Duraklatma ekranı için ikonlu buton çizimi
  drawIconActionButton(ctx, rect, btnFrame, iconFrame, label, textColor = '#ffffff', fontSize = 18) {
    const drawn = window.Atlas.draw(ctx, btnFrame || 'ui_button', rect.x, rect.y, rect.w, rect.h * 1.45);
    if (!drawn) {
      window.Atlas.draw(ctx, 'ui_button', rect.x, rect.y, rect.w, rect.h);
    }
    if (iconFrame) {
      const iconX = rect.x - rect.w * 0.33;
      window.Atlas.draw(ctx, iconFrame, iconX, rect.y, 42, 42);
      if (label) {
        this.drawTextFitted(ctx, label, rect.x + 18, rect.y, fontSize, rect.w * 0.58, textColor, 4.5);
      }
    } else if (label) {
      this.drawTextFitted(ctx, label, rect.x, rect.y, fontSize, rect.w - 22, textColor, 4.5);
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

    const hasNewHud = window.Atlas.draw(ctx, 'hud_bar_empty', hcx, hcy, hw, hh);
    if (hasNewHud) {
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
      this.drawSlantedBar(ctx, 74, 24, 165, 22, 7, 'rgba(13, 32, 54, 0.88)', '#e82c2c', hpRatio, '#b5d4ef');
      this.drawSlantedBar(ctx, 70, 54, 148, 20, 5, 'rgba(10, 32, 46, 0.92)', '#00d2ff', xpRatio, '#6bf5d2');
    }

    // BÖLÜM 1 & Aktif Silah Rozeti
    this.drawTextOutlined(
      ctx,
      `${window.I18N.t('STAGE')} ${wd.getTotalStage()}`,
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
    // 2) SAĞ ÜST KLASİK BUTONLAR (ui_button)
    // =========================================================================
    this.drawSpriteButton(ctx, this.btnPause, '||', '#eaf4ff', 17);
    this.drawSpriteButton(ctx, this.btnLang, window.I18N.lang, '#ffe066', 14);

    // 3 Kademeli Ses Butonu: 0 = Tümü Açık, 1 = Müzik Kapalı (Sağ Çapraz Kırmızı Çizgi /), 2 = Tümü Kapalı (Kırmızı Çarpı X)
    const sMode = (window.AudioManager && window.AudioManager.soundMode) || 0;
    this.drawSpriteButton(ctx, this.btnMute, '🔊', sMode === 0 ? '#6dff5c' : (sMode === 1 ? '#ffe066' : '#ff6b5b'), 16);
    if (sMode >= 1) {
      const mx = this.btnMute.x;
      const my = this.btnMute.y;
      const r = 13;
      ctx.save();
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#ff2b2b';
      ctx.lineWidth = 4.2;
      // 1. Kademe (Müzik Kapalı): Sağ çapraz kırmızı çizgi (/)
      ctx.beginPath();
      ctx.moveTo(mx - r, my + r);
      ctx.lineTo(mx + r, my - r);
      // 2. Kademe (Tüm Sesler Kapalı): Sol çapraz kırmızı çizgi (\) eklenip kırmızı çarpı (X) olur
      if (sMode >= 2) {
        ctx.moveTo(mx - r, my - r);
        ctx.lineTo(mx + r, my + r);
      }
      ctx.stroke();
      ctx.restore();
    }

    if (!this.isNativeAndroid) {
      window.Atlas.draw(ctx, 'ui_button', this.btnFull.x, this.btnFull.y, this.btnFull.w, this.btnFull.h);
      ctx.save();
      ctx.strokeStyle = '#d8ecff';
      ctx.lineWidth = 2.4;
      const fx = this.btnFull.x;
      const fy = this.btnFull.y;
      const s = 9;
      ctx.beginPath();
      ctx.moveTo(fx - s, fy - s + 5); ctx.lineTo(fx - s, fy - s); ctx.lineTo(fx - s + 5, fy - s);
      ctx.moveTo(fx + s - 5, fy - s); ctx.lineTo(fx + s, fy - s); ctx.lineTo(fx + s, fy - s + 5);
      ctx.moveTo(fx - s, fy + s - 5); ctx.lineTo(fx - s, fy + s); ctx.lineTo(fx - s + 5, fy + s);
      ctx.moveTo(fx + s - 5, fy + s); ctx.lineTo(fx + s, fy + s); ctx.lineTo(fx + s, fy + s - 5);
      ctx.stroke();
      ctx.restore();
    }

    // =========================================================================
    // 3) BOSS CAN BARI VE "WARNING" UYARI EKRANI
    // =========================================================================
    if (wd.bossWarningTimer > 0) {
      const pulse = 0.55 + Math.sin(wd.bossWarningTimer * 14) * 0.45;
      ctx.save();
      ctx.fillStyle = `rgba(190, 18, 28, ${0.75 * pulse})`;
      ctx.translate(0, this.midOff);
      ctx.fillRect(0, 390, window.GAME_CONFIG.WIDTH, 96);
      ctx.fillStyle = '#ffe047';
      ctx.fillRect(0, 390, window.GAME_CONFIG.WIDTH, 6);
      ctx.fillRect(0, 480, window.GAME_CONFIG.WIDTH, 6);
      this.drawTextFitted(
        ctx,
        window.I18N.t('WARNING_BOSS'),
        window.GAME_CONFIG.WIDTH * 0.5,
        438,
        20,
        500,
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

    const headerY = 278 + this.midOff;
    this.drawTextFitted(
      ctx,
      `${window.I18N.t('LEVEL_UP_TITLE')} (${window.I18N.t('XP_LABEL')} ${this.game.level})`,
      W * 0.5,
      headerY + 12,
      26,
      500,
      '#ffe047',
      6
    );
    this.drawTextFitted(
      ctx,
      window.I18N.t('LEVEL_UP_SUB'),
      W * 0.5,
      headerY + 44,
      14,
      500,
      '#68e4ff',
      4
    );

    for (let i = 0; i < 3; i++) {
      const sk = choices[i];
      if (!sk) continue;
      const card = this.skillCards[i];
      const info = isTr ? sk.tr : sk.en;
      const curLvl = (this.game.player.skills && this.game.player.skills[sk.id]) || 0;
      const maxLvl = sk.max || 1;

      window.Atlas.draw(ctx, 'ui_skill_card', card.x, card.y, card.w, card.h);
      this.drawTextOutlined(ctx, info.tag, card.x, card.y - 114, 10, sk.color || '#ffe047', 'center', 3);

      // Tekil Ispanak Konservesi (İçinden direkt o özelliğin gücü çıkan tek görsel, yanında ikinci görsel yok)
      const canY = card.y - 44;
      window.Atlas.draw(ctx, sk.can || 'can_heal', card.x, canY, 102, 102);

      const perkLabel = maxLvl > 1
        ? `★ ${curLvl + 1} / ${maxLvl} ★`
        : (isTr ? '★ ÖZEL GÜÇ ★' : '★ UNIQUE PERK ★');
      this.drawTextOutlined(ctx, perkLabel, card.x, card.y + 18, 10.5, '#ffe047', 'center', 3);
      this.drawWrappedText(ctx, info.name, card.x, card.y + 42, card.w - 20, 16, 12, '#ffffff', true);
      this.drawWrappedText(ctx, info.desc, card.x, card.y + 78, card.w - 22, 14, 10.5, '#bfe3ff', false);
    }

    this.drawTextFitted(
      ctx,
      window.I18N.t('TAP_TO_SELECT'),
      W * 0.5,
      675 + this.midOff,
      14,
      490,
      '#6dff5c',
      4
    );

    ctx.restore();
  }

  // Ana Sayfa (Eski Klasik Görünüm ve Buton)
  drawMenuOverlay(ctx) {
    const W = window.GAME_CONFIG.WIDTH;
    const H = window.GAME_CONFIG.HEIGHT;
    ctx.save();
    ctx.fillStyle = 'rgba(4, 12, 24, 0.72)';
    ctx.fillRect(0, 0, W, H);
    ctx.save();
    ctx.translate(0, this.midOff);

    window.Atlas.draw(ctx, 'boss_dreadnought', W * 0.5, 210, 210, 175);
    window.Atlas.draw(ctx, 'emblem_victory', W * 0.5 + 145, 345, 70, 70, { rotation: 0.14 });

    this.drawTextOutlined(ctx, 'POPEYE 1929', W * 0.5, 345, 36, '#ffe047', 'center', 7);
    this.drawTextFitted(ctx, window.I18N.t('SUBTITLE'), W * 0.5, 386, 15, 480, '#68e4ff', 4);

    const lines = window.I18N.t('CONTROL_HINT').split('\n');
    for (let i = 0; i < lines.length; i++) {
      this.drawTextFitted(ctx, lines[i], W * 0.5, 438 + i * 24, 13, 490, '#dbeeff', 3.5);
    }

    ctx.restore();
    this.drawSpriteButton(ctx, this.btnPrimary, window.I18N.t('START_BTN'), '#ffe047', 21);
    if (this.privacyVisible()) {
      this.drawSpriteButton(ctx, this.btnPrivacy, window.I18N.t('PRIVACY_BTN'), '#dbeeff', 12);
    }

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

  // Duraklatma Ekranı (Çerçevesiz Klasik Arka Plan)
  drawPauseOverlay(ctx) {
    const W = window.GAME_CONFIG.WIDTH;
    const H = window.GAME_CONFIG.HEIGHT;
    ctx.save();
    ctx.fillStyle = 'rgba(4, 12, 24, 0.78)';
    ctx.fillRect(0, 0, W, H);
    ctx.save();
    ctx.translate(0, this.midOff);

    window.Atlas.draw(ctx, 'emblem_victory', W * 0.5, 320, 118, 118);
    this.drawTextFitted(ctx, window.I18N.t('PAUSED'), W * 0.5, 430, 30, 460, '#ffe047', 6);
    ctx.restore();

    this.drawSpriteButton(ctx, this.btnPrimary, window.I18N.t('RESUME_BTN'), '#6dff5c', 20);
    this.drawSpriteButton(ctx, this.btnSecondary, window.I18N.t('RESTART_BTN'), '#ffffff', 18);

    this.drawTextOutlined(ctx, window.GAME_CONFIG.VERSION, W - 14, H - 16, 12, '#8fb8de', 'right', 3);
    ctx.restore();
  }

  // Ölüm (Game Over) Ekranı: Çerçevesiz Klasik Koyu Arka Plan + Kırılmış Uçak/Şapka/Çapa Rozeti + Yeni Reklam İkonlu Butonlar
  drawGameOverOverlay(ctx) {
    const W = window.GAME_CONFIG.WIDTH;
    const H = window.GAME_CONFIG.HEIGHT;
    ctx.save();
    ctx.fillStyle = 'rgba(14, 6, 14, 0.82)';
    ctx.fillRect(0, 0, W, H);
    ctx.save();
    ctx.translate(0, this.midOff);

    // Kırılmış Uçak, Denizci Şapkası ve Demir Çapa Rozeti
    window.Atlas.draw(ctx, 'emblem_gameover', W * 0.5, 300, 156, 156);
    this.drawTextFitted(ctx, window.I18N.t('GAME_OVER'), W * 0.5, 405, 32, 460, '#ff5c4d', 6);
    this.drawTextFitted(
      ctx,
      `${window.I18N.t('XP_LABEL')} ${this.game.level}  ·  ${window.I18N.t('STAGE')} ${this.game.waveDirector.getTotalStage()}`,
      W * 0.5,
      455,
      22,
      460,
      '#ffe047',
      5
    );
    ctx.restore();

    // Yeni Reklam İkonlu Canlanma Butonu ve Yeniden Başla Butonu
    this.drawIconActionButton(ctx, this.btnPrimary, 'btn_green', 'icon_video_ad', window.I18N.t('REVIVE_AD_BTN'), '#ffffff', 18);
    this.drawIconActionButton(ctx, this.btnSecondary, 'btn_blue', 'icon_restart', window.I18N.t('RESTART_BTN'), '#ffffff', 18);
    ctx.restore();
  }
};
